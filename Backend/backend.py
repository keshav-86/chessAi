import os
import pickle
import numpy as np
import chess
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Determine base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "my_chess_model_2_75.keras")
PKL_PATH = os.path.join(BASE_DIR, "move_to_int.pkl")

# Load model and move dictionary safely
model = None
move_to_int = {}
int_to_move = {}

try:
    from tensorflow.keras.models import load_model
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print("✓ TensorFlow Model loaded successfully from:", MODEL_PATH)
    else:
        print("⚠ Model file not found at:", MODEL_PATH)
except Exception as e:
    print("⚠ Error loading TensorFlow model:", e)

try:
    if os.path.exists(PKL_PATH):
        with open(PKL_PATH, "rb") as f:
            move_to_int = pickle.load(f)
        int_to_move = {v: k for k, v in move_to_int.items()}
        print(f"✓ Move mapping loaded successfully: {len(move_to_int)} moves")
    else:
        print("⚠ Move mapping file not found at:", PKL_PATH)
except Exception as e:
    print("⚠ Error loading move mapping:", e)

# MongoDB optional setup
mongo_db = None
try:
    from pymongo import MongoClient
    mongo_client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=1000)
    mongo_client.server_info()  # trigger exception if not connected
    mongo_db = mongo_client["chess_bot_db"]
    print("✓ Connected to MongoDB database: chess_bot_db")
except Exception as e:
    print("ℹ MongoDB not detected locally (falling back to client-side localStorage):", e)


def Board_To_Matrix(board):
    """
    Convert python-chess Board object into (8, 8, 12) binary matrix representation
    6 piece types x 2 colors = 12 channels.
    """
    matrix = np.zeros((8, 8, 12), dtype=int)
    pieces = {
        chess.PAWN: 0, chess.KNIGHT: 1, chess.BISHOP: 2,
        chess.ROOK: 3, chess.QUEEN: 4, chess.KING: 5
    }
    for square, piece in board.piece_map().items():
        r = 7 - chess.square_rank(square)
        c = chess.square_file(square)
        offset = 6 if piece.color == chess.BLACK else 0
        matrix[r][c][pieces[piece.piece_type] + offset] = 1
    return matrix


def calculate_material_balance(board):
    piece_values = {
        chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3,
        chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0
    }
    white_mat = sum(len(board.pieces(pt, chess.WHITE)) * val for pt, val in piece_values.items())
    black_mat = sum(len(board.pieces(pt, chess.BLACK)) * val for pt, val in piece_values.items())
    return white_mat, black_mat


@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "mappings_count": len(move_to_int),
        "mongo_available": mongo_db is not None
    })


@app.route('/suggest', methods=['POST'])
@app.route('/api/suggest', methods=['POST'])
def suggest():
    try:
        data = request.get_json() or {}
        fen = data.get('fen')

        if not fen:
            return jsonify({"error": "Missing 'fen' parameter", "suggestions": [], "white": 50, "black": 50}), 400

        board = chess.Board(fen)

        if board.is_game_over():
            return jsonify({"suggestions": [], "white": 50, "black": 50})

        legal_moves = list(board.legal_moves)
        if not legal_moves:
            return jsonify({"suggestions": [], "white": 50, "black": 50})

        # Model Inference
        suggestions = []
        top_score = 0.5

        if model is not None and int_to_move:
            x = Board_To_Matrix(board)
            x = np.expand_dims(x, axis=0)

            preds = model.predict(x, verbose=0)[0]  # shape (1828,)

            # Get top predictions across all indices
            top_indices = np.argsort(preds)[::-1][:100]

            seen_moves = set()
            raw_suggestions = []

            for idx in top_indices:
                if idx in int_to_move:
                    uci = int_to_move[idx]
                    try:
                        move = chess.Move.from_uci(uci)
                        if move in legal_moves and uci not in seen_moves:
                            score = float(preds[idx])
                            san = board.san(move)
                            raw_suggestions.append({
                                "uci": uci,
                                "san": san,
                                "score": round(score, 4),
                                "raw_score": score
                            })
                            seen_moves.add(uci)
                    except Exception:
                        continue

                if len(raw_suggestions) >= 5:
                    break

            # Fallback if model predictions didn't produce enough legal moves
            if not raw_suggestions:
                for move in legal_moves[:5]:
                    uci = move.uci()
                    san = board.san(move)
                    raw_suggestions.append({
                        "uci": uci,
                        "san": san,
                        "score": 0.20,
                        "raw_score": 0.20
                    })

            max_score = max((m["raw_score"] for m in raw_suggestions), default=1.0)
            if max_score <= 0:
                max_score = 1.0

            for m in raw_suggestions:
                percent = int(round((m["raw_score"] / max_score) * 100))
                percent = min(100, max(10, percent))
                suggestions.append({
                    "uci": m["uci"],
                    "san": m["san"],
                    "score": m["score"],
                    "percent": percent
                })

            top_score = raw_suggestions[0]["raw_score"] if raw_suggestions else 0.5

        else:
            # Fallback when model is loading/unavailable
            for move in legal_moves[:5]:
                uci = move.uci()
                san = board.san(move)
                suggestions.append({
                    "uci": uci,
                    "san": san,
                    "score": 0.5,
                    "percent": 100
                })

        # Evaluation Calculation
        w_mat, b_mat = calculate_material_balance(board)
        mat_diff = w_mat - b_mat

        # Combine material difference and ML confidence
        if board.turn == chess.WHITE:
            base_white = 50 + (mat_diff * 4) + int(top_score * 20)
        else:
            base_white = 50 + (mat_diff * 4) - int(top_score * 20)

        white_eval = min(98, max(2, base_white))
        black_eval = 100 - white_eval

        return jsonify({
            "suggestions": suggestions,
            "white": white_eval,
            "black": black_eval
        })

    except Exception as e:
        print("Error in /suggest endpoint:", e)
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "suggestions": [],
            "white": 50,
            "black": 50
        }), 500


# MongoDB persistence endpoints (optional, with fallback)
@app.route('/api/games', methods=['GET', 'POST'])
def handle_games():
    if request.method == 'POST':
        game_data = request.get_json() or {}
        if mongo_db is not None:
            try:
                res = mongo_db.games.insert_one(game_data)
                return jsonify({"status": "saved", "id": str(res.inserted_id)})
            except Exception as e:
                return jsonify({"status": "error", "message": str(e)}), 500
        return jsonify({"status": "fallback_local", "message": "MongoDB not available; saved to localStorage"})

    else:
        if mongo_db is not None:
            try:
                games = list(mongo_db.games.find({}, {"_id": 0}).limit(50))
                return jsonify({"games": games})
            except Exception as e:
                return jsonify({"games": [], "error": str(e)})
        return jsonify({"games": [], "status": "fallback_local"})


if __name__ == '__main__':
    print("\n" + "=" * 55)
    print("  ♔ AI Chess Bot Flask Backend Server Running")
    print("  API Endpoint: http://127.0.0.1:8000/suggest")
    print("  Health Check: http://127.0.0.1:8000/health")
    print("=" * 55 + "\n")
    app.run(host='0.0.0.0', port=8000, debug=False)

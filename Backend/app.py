from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/health")
def health():
    return jsonify({"status": "healthy"})

app.run(host="0.0.0.0", port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load your TensorFlow model and mappings
MODEL_PATH = 'F:/Chess_Bot/models/my_chess_model_2_75.keras'
MOVE_MAPPING_PATH = 'F:/Chess_Bot/models/move_to_int.pkl'

print("Loading TensorFlow model and move mappings...")
try:
    # Load Keras model
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✓ Model loaded successfully!")
    print(f"Model input shape: {model.input_shape}")
    print(f"Model output shape: {model.output_shape}")
    
    # Load move to int mapping
    with open(MOVE_MAPPING_PATH, 'rb') as f:
        move_to_int = pickle.load(f)
    int_to_move = {v: k for k, v in move_to_int.items()}
    print(f"✓ Move mappings loaded: {len(move_to_int)} moves")
    
except Exception as e:
    print(f"✗ Error loading model: {e}")
    import traceback
    traceback.print_exc()
    model = None
    move_to_int = None
    int_to_move = None

def encode_board(board):
    """
    Convert chess board to model input format
    Adjust based on your model's expected input
    """
    piece_map = {
        'P': 1, 'N': 2, 'B': 3, 'R': 4, 'Q': 5, 'K': 6,
        'p': -1, 'n': -2, 'b': -3, 'r': -4, 'q': -5, 'k': -6,
        None: 0
    }
    
    numeric_board = np.zeros((8, 8), dtype=np.float32)
    for i in range(8):
        for j in range(8):
            piece = board[i][j]
            numeric_board[i][j] = piece_map.get(piece, 0)
    
    # Reshape based on your model - adjust if needed
    return numeric_board.reshape(1, 8, 8, 1)

@app.route('/api/suggest', methods=['POST'])
def suggest_moves():
    """
    Main endpoint for getting move suggestions
    """
    try:
        if model is None or int_to_move is None:
            return jsonify({
                'error': 'Model not loaded',
                'suggestions': [],
                'status': 'error'
            }), 500
        
        data = request.json
        board = data['board']
        turn = data['turn']
        history = data.get('history', [])
        
        print(f"\n--- New Request ---")
        print(f"Turn: {turn}")
        
        # Encode board for model
        model_input = encode_board(board)
        
        # Get predictions from model
        predictions = model.predict(model_input, verbose=0)[0]
        
        # Get top predicted move indices
        top_k = 20
        top_indices = np.argsort(predictions)[-top_k:][::-1]
        
        # Convert indices to chess moves
        move_scores = []
        
        for idx in top_indices:
            if idx in int_to_move:
                move_str = int_to_move[idx]
                
                # Parse move string (e.g., "e2e4")
                if len(move_str) >= 4:
                    from_pos = move_str[:2]
                    to_pos = move_str[2:4] if '-' not in move_str else move_str[3:5]
                    
                    # Validate positions
                    if (from_pos[0] in 'abcdefgh' and from_pos[1] in '12345678' and
                        to_pos[0] in 'abcdefgh' and to_pos[1] in '12345678'):
                        
                        score = float(predictions[idx])
                        
                        move_scores.append({
                            'from': from_pos,
                            'to': to_pos,
                            'move': f'{from_pos} → {to_pos}',
                            'score': score,
                            'description': f'AI Confidence: {score*100:.1f}%'
                        })
        
        # Sort by score and get top 5
        move_scores.sort(key=lambda x: x['score'], reverse=True)
        top_moves = move_scores[:5]
        
        print(f"Generated {len(top_moves)} suggestions")
        for move in top_moves:
            print(f"  {move['move']} - Score: {move['score']:.3f}")
        
        return jsonify({
            'suggestions': top_moves,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'error': str(e),
            'suggestions': [],
            'status': 'error'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'mappings_loaded': int_to_move is not None,
        'model_path': MODEL_PATH
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🤖 ChessBot Backend Server")
    print("="*50)
    print(f"Server URL: http://localhost:5000")
    print(f"Health Check: http://localhost:5000/api/health")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
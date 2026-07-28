import React from 'react';
import { Cpu, Database, ShieldCheck, Code2, Network, Terminal, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px 60px',
      minHeight: 'calc(100vh - 120px)'
    }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid var(--border-glass-light)'
      }}>
        <span className="badge-ai" style={{ marginBottom: '12px' }}>FINAL YEAR ENGINEERING PROJECT</span>
        <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '10px' }}>
          AI-Powered Chess Move Recommendation System
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '800px', lineHeight: 1.6 }}>
          An engineering platform combining a Convolutional Neural Network (CNN) trained on high-level chess datasets with a decoupled React 19 frontend interface.
        </p>
      </div>

      {/* System Architecture Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* ML Engine Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <Cpu size={24} color="#ffffff" />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px' }}>
            Machine Learning Engine
          </h3>
          <ul style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.8, paddingLeft: '18px' }}>
            <li><strong>Framework</strong>: TensorFlow 2.x & Keras</li>
            <li><strong>Input Representation</strong>: 8x8x12 Binary Matrix (6 piece types x 2 colors)</li>
            <li><strong>Output Logits</strong>: 1,828 Encoded UCI Move Probabilities</li>
            <li><strong>Model Storage</strong>: <code>my_chess_model_2_75.keras</code> & <code>move_to_int.pkl</code></li>
          </ul>
        </div>

        {/* REST API Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-emerald), #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <Terminal size={24} color="#ffffff" />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px' }}>
            Flask REST Backend
          </h3>
          <ul style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.8, paddingLeft: '18px' }}>
            <li><strong>Endpoint</strong>: <code>POST http://127.0.0.1:8000/suggest</code></li>
            <li><strong>Payload</strong>: Board FEN string</li>
            <li><strong>Legal Filtering</strong>: <code>python-chess</code> legal move verification</li>
            <li><strong>CORS Enabled</strong>: Cross-Origin Resource Sharing for Vite client</li>
          </ul>
        </div>

        {/* Frontend Architecture Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-amber), #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <Code2 size={24} color="#ffffff" />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px' }}>
            React 19 Presentation Client
          </h3>
          <ul style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.8, paddingLeft: '18px' }}>
            <li><strong>UI Framework</strong>: React 19, Vite, React Router DOM</li>
            <li><strong>Rule Engine</strong>: <code>chess.js</code> for board state & move history</li>
            <li><strong>Board Component</strong>: <code>react-chessboard</code> with custom overlays</li>
            <li><strong>HTTP Layer</strong>: Axios with graceful offline status handling</li>
          </ul>
        </div>
      </div>

      {/* Engineering Design Principles */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '16px' }}>
          Engineering Principles & Key Features
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>Decoupled Microservice Architecture</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Clean API boundary between frontend UI presentation and Flask ML inference server.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>No Minimax / No Heuristic Engines</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Move quality predictions stem 100% from trained neural network pattern recognition.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>Human Player Control</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Both White and Black are controlled by human players; the model acts purely as an assistant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

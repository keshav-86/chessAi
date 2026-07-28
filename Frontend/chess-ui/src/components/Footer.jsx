import React from 'react';
import { Cpu, Database, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(5, 8, 15, 0.9)',
      padding: '40px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '6px' }}>AI Chess Bot Platform</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            TensorFlow/Keras Convolutional Neural Network Engine • Flask REST API • React 19 Frontend
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="badge-ai" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderColor: 'var(--border-glass)' }}>
            <Cpu size={14} /> TensorFlow 2.x
          </div>
          <div className="badge-ai" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderColor: 'var(--border-glass)' }}>
            <Database size={14} /> MongoDB Ready
          </div>
          <div className="badge-ai" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderColor: 'var(--border-glass)' }}>
            <ShieldCheck size={14} /> Chess.js Legal Engine
          </div>
        </div>

        <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          Built for Academic & SaaS Excellence © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

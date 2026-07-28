import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, Play, Info, Wifi, WifiOff } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function Navbar() {
  const { isBackendOnline } = useGame();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Project Logo & Title */}
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-blue)'
          }}>
            <Brain size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              CHESS<span style={{ color: 'var(--accent-blue)' }}>.AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              ML RECOMMENDATION SYSTEM
            </span>
          </div>
        </NavLink>

        {/* Presentation Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease'
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/game"
            style={({ isActive }) => ({
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            })}
          >
            <Play size={16} /> Play Arena
          </NavLink>

          <NavLink
            to="/about"
            style={({ isActive }) => ({
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            })}
          >
            <Info size={16} /> About
          </NavLink>
        </nav>

        {/* Backend Status Pill */}
        <div style={{
          padding: '6px 14px',
          borderRadius: '20px',
          background: isBackendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: isBackendOnline ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: isBackendOnline ? '#34d399' : '#fb7185'
        }}>
          {isBackendOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isBackendOnline ? 'Flask Backend Online' : 'Backend Standby'}</span>
        </div>
      </div>
    </header>
  );
}

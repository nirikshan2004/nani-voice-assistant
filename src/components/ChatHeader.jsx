import React from 'react';
import { VolumeX, Trash2, Cpu, Radio, ShieldCheck } from 'lucide-react';

export default function ChatHeader({
  status, // 'idle' | 'listening' | 'speaking'
  isSpeaking,
  onStopSpeaking,
  onClearChat,
  messageCount
}) {
  return (
    <header className="chat-header">
      {/* Top Cyber Telemetry Line */}
      <div className="telemetry-bar">
        <div className="telemetry-item">
          <span className="telemetry-tag">// SYS.NODE</span>
          <span className="telemetry-val">NANI_CORE_v3.8</span>
        </div>
        <div className="telemetry-divider">|</div>
        <div className="telemetry-item">
          <span className="telemetry-tag">PROTOCOL</span>
          <span className="telemetry-val">HUMAN_NEXT.AI</span>
        </div>
        <div className="telemetry-divider">|</div>
        <div className="telemetry-item">
          <span className="telemetry-tag">LATENCY</span>
          <span className="telemetry-val text-green">14ms</span>
        </div>
      </div>

      <div className="main-header-row">
        {/* Holographic Gyroscope / Core Icon */}
        <div className="hologram-brand-box">
          <div className="gyro-ring gyro-ring-1" />
          <div className="gyro-ring gyro-ring-2" />
          <div className="gyro-core" />
          <div className="brand-text-block">
            <h1 className="brand-title">
              <span className="brand-cerulean">NANI</span>
              <span className="brand-rose"> ASSISTANT</span>
            </h1>
            <p className="brand-tagline">
              WHERE CREATIVITY MEETS INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Status Pill & Controls */}
        <div className="header-controls">
          <div className={`cyber-status-badge status-${status}`}>
            <span className="status-ping-ring" />
            <span className="status-dot" />
            <span className="status-label">
              {status === 'listening' ? 'MIC RECORDING' : status === 'speaking' ? 'SYNTHESIZING' : 'CORE ONLINE'}
            </span>
          </div>

          {isSpeaking && (
            <button
              className="cyber-icon-btn btn-speaking"
              onClick={onStopSpeaking}
              title="Halt Speech Synthesis"
            >
              <VolumeX size={16} />
              <span className="btn-label">STOP AUDIO</span>
            </button>
          )}

          {messageCount > 0 && (
            <button
              className="cyber-icon-btn"
              onClick={onClearChat}
              title="Purge Console Stream"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .chat-header {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--hud-border);
          background: rgba(10, 12, 20, 0.65);
          position: relative;
        }

        .telemetry-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 24px;
          background: rgba(0, 0, 0, 0.45);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }

        .telemetry-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .telemetry-tag {
          color: var(--cerulean-bright);
          opacity: 0.8;
        }

        .telemetry-val {
          color: var(--text-dim);
          font-weight: 500;
        }

        .telemetry-val.text-green {
          color: #00f5a0;
          text-shadow: 0 0 8px rgba(0, 245, 160, 0.5);
        }

        .telemetry-divider {
          opacity: 0.2;
        }

        .main-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
        }

        .hologram-brand-box {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }

        /* Animated Gyroscope Core */
        .gyro-ring {
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          pointer-events: none;
        }

        .gyro-ring-1 {
          border-top-color: var(--cerulean-neon);
          border-bottom-color: var(--cerulean-neon);
          animation: spinRing1 4s linear infinite;
        }

        .gyro-ring-2 {
          border-left-color: var(--rose-neon);
          border-right-color: var(--rose-neon);
          animation: spinRing2 5s linear infinite reverse;
        }

        .gyro-core {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff 0%, var(--cerulean) 50%, transparent 80%);
          box-shadow: 0 0 16px var(--cerulean-neon);
          animation: pulseCore 2.5s ease-in-out infinite alternate;
        }

        @keyframes spinRing1 {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1); }
        }

        @keyframes spinRing2 {
          from { transform: rotate(0deg) scale(1.15); }
          to { transform: rotate(360deg) scale(1.15); }
        }

        @keyframes pulseCore {
          0% { transform: scale(0.65); opacity: 0.7; }
          100% { transform: scale(0.95); opacity: 1; }
        }

        .brand-text-block {
          padding-left: 10px;
        }

        .brand-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          line-height: 1.1;
        }

        .brand-cerulean {
          color: var(--cerulean-neon);
          text-shadow: 0 0 14px var(--cerulean-glow);
        }

        .brand-rose {
          color: var(--rose-bright);
          text-shadow: 0 0 14px var(--rose-glow);
        }

        .brand-tagline {
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: var(--text-dim);
          margin-top: 3px;
        }

        /* Controls & Status */
        .header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cyber-status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: var(--radius-pill);
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          position: relative;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          z-index: 2;
        }

        .status-ping-ring {
          position: absolute;
          left: 14px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          opacity: 0.75;
          animation: pingAnimation 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Status: Idle */
        .cyber-status-badge.status-idle {
          border-color: rgba(0, 229, 255, 0.3);
          color: var(--cerulean-bright);
        }
        .cyber-status-badge.status-idle .status-dot {
          background: #00f5a0;
          box-shadow: 0 0 10px #00f5a0;
        }
        .cyber-status-badge.status-idle .status-ping-ring {
          border: 2px solid #00f5a0;
        }

        /* Status: Listening */
        .cyber-status-badge.status-listening {
          background: var(--rose-glow-subtle);
          border-color: var(--rose);
          color: var(--rose-bright);
        }
        .cyber-status-badge.status-listening .status-dot {
          background: var(--rose);
          box-shadow: 0 0 14px var(--rose-glow);
        }
        .cyber-status-badge.status-listening .status-ping-ring {
          border: 2px solid var(--rose);
        }

        /* Status: Speaking */
        .cyber-status-badge.status-speaking {
          background: var(--cerulean-glow-subtle);
          border-color: var(--cerulean-neon);
          color: var(--cerulean-neon);
        }
        .cyber-status-badge.status-speaking .status-dot {
          background: var(--cerulean-neon);
          box-shadow: 0 0 14px var(--cerulean-glow);
        }
        .cyber-status-badge.status-speaking .status-ping-ring {
          border: 2px solid var(--cerulean-neon);
        }

        @keyframes pingAnimation {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        .cyber-icon-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-dim);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cyber-icon-btn:hover {
          background: rgba(0, 229, 255, 0.12);
          border-color: var(--cerulean-neon);
          color: #fff;
          box-shadow: 0 0 12px var(--cerulean-glow);
        }

        .cyber-icon-btn.btn-speaking {
          background: var(--rose-glow-subtle);
          border-color: var(--rose);
          color: var(--rose-bright);
          box-shadow: 0 0 14px var(--rose-glow);
        }
      `}</style>
    </header>
  );
}

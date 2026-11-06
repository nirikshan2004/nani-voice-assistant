import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Square, Zap, Command } from 'lucide-react';

export default function ChatInput({
  onSendMessage,
  isListening,
  onToggleListening,
  isSpeaking,
  onStopSpeaking,
  onReadLastBotReply,
  hasBotReplies,
  disabled
}) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-deck-wrapper">
      {/* Dynamic Voice Waveform HUD when Mic is ACTIVE */}
      {isListening && (
        <div className="voice-spectrum-hud">
          <div className="spectrum-badge">
            <span className="live-dot" />
            <span>VOICE SENSING STREAM ACTIVE</span>
          </div>

          <div className="spectrum-bars">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="spectrum-bar"
                style={{
                  animationDelay: `${(i % 5) * 0.12}s`,
                  height: `${Math.sin(i) * 10 + 16}px`
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="spectrum-stop-btn"
            onClick={onToggleListening}
          >
            TERMINATE STREAM ✕
          </button>
        </div>
      )}

      <form className="input-command-bar" onSubmit={handleSubmit}>
        {/* Audio Quick Actions */}
        <div className="deck-aux-cluster">
          {hasBotReplies && (
            <button
              type="button"
              className="deck-icon-btn"
              onClick={onReadLastBotReply}
              title="Vocalize Last Response"
              disabled={disabled}
            >
              <Volume2 size={18} />
            </button>
          )}

          {isSpeaking && (
            <button
              type="button"
              className="deck-icon-btn btn-danger-pulse"
              onClick={onStopSpeaking}
              title="Stop Speech Output"
            >
              <Square size={16} fill="currentColor" />
            </button>
          )}
        </div>

        {/* Command Input Field */}
        <div className="input-field-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder={
              isListening
                ? "🎙️ Audio stream active... speak your prompt"
                : "Type your query or command (Press Enter)..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <div className="input-shortcut-hint">
            <Command size={11} />
            <span>ENTER</span>
          </div>
        </div>

        {/* Futuristic Mic Toggle */}
        <button
          type="button"
          className={`deck-mic-button ${isListening ? 'listening-pulse' : ''}`}
          onClick={onToggleListening}
          title={isListening ? "Cancel Voice Input" : "Activate Voice Microphone"}
          disabled={disabled}
        >
          {isListening ? (
            <MicOff size={20} className="mic-svg" />
          ) : (
            <Mic size={20} className="mic-svg" />
          )}
        </button>

        {/* Futuristic Send Button */}
        <button
          type="submit"
          className="deck-send-button"
          disabled={!text.trim() || disabled}
          title="Transmit Prompt"
        >
          <Send size={18} />
        </button>
      </form>

      <style>{`
        .input-deck-wrapper {
          padding: 16px 28px 20px 28px;
          border-top: 1px solid var(--hud-border);
          background: rgba(8, 10, 16, 0.7);
          position: relative;
        }

        /* Voice Spectrum HUD */
        .voice-spectrum-hud {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          margin-bottom: 14px;
          background: rgba(255, 45, 149, 0.12);
          border: 1px solid var(--rose-neon);
          border-radius: var(--radius-card);
          box-shadow: 0 0 25px var(--rose-glow-subtle);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .spectrum-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--rose-bright);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--rose-neon);
          box-shadow: 0 0 10px var(--rose-glow);
          animation: livePulse 1s infinite alternate;
        }

        @keyframes livePulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 1; }
        }

        .spectrum-bars {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 24px;
        }

        .spectrum-bar {
          width: 3px;
          background: linear-gradient(to top, var(--cerulean-neon), var(--rose-neon));
          border-radius: 2px;
          animation: waveScale 0.8s ease-in-out infinite alternate;
        }

        @keyframes waveScale {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1.4); }
        }

        .spectrum-stop-btn {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--rose-bright);
          color: var(--rose-bright);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .spectrum-stop-btn:hover {
          background: var(--rose-neon);
          color: #fff;
          box-shadow: 0 0 14px var(--rose-glow);
        }

        /* Command Bar */
        .input-command-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(16, 20, 32, 0.7);
          border: 1px solid rgba(0, 229, 255, 0.2);
          border-radius: var(--radius-pill);
          padding: 6px 8px 6px 16px;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
          transition: all 0.25s ease;
        }

        .input-command-bar:focus-within {
          border-color: var(--cerulean-neon);
          background: rgba(20, 26, 42, 0.9);
          box-shadow: 0 0 25px var(--cerulean-glow), inset 0 2px 10px rgba(0, 0, 0, 0.6);
        }

        .deck-aux-cluster {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .deck-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .deck-icon-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        .deck-icon-btn.btn-danger-pulse {
          color: var(--rose-bright);
          animation: dangerPulse 1s infinite alternate;
        }

        @keyframes dangerPulse {
          0% { transform: scale(0.9); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 8px var(--rose-glow)); }
        }

        .input-field-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .command-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-family: var(--font-main);
          font-size: 0.96rem;
          padding: 8px 0;
        }

        .command-input::placeholder {
          color: var(--text-muted);
        }

        .input-shortcut-hint {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 3px 7px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--text-muted);
          user-select: none;
        }

        /* Mic Button */
        .deck-mic-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .deck-mic-button:hover {
          background: rgba(0, 229, 255, 0.15);
          border-color: var(--cerulean-bright);
          color: #fff;
          box-shadow: 0 0 15px var(--cerulean-glow);
          transform: scale(1.05);
        }

        .deck-mic-button.listening-pulse {
          background: var(--rose-neon);
          border-color: #fff;
          color: #fff;
          box-shadow: 0 0 30px var(--rose-glow);
          animation: micPulseWave 1.2s infinite;
        }

        @keyframes micPulseWave {
          0% { transform: scale(1); box-shadow: 0 0 15px var(--rose-glow); }
          50% { transform: scale(1.12); box-shadow: 0 0 35px var(--rose-glow); }
          100% { transform: scale(1); box-shadow: 0 0 15px var(--rose-glow); }
        }

        /* Send Button */
        .deck-send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cerulean-bright), var(--cerulean));
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          box-shadow: 0 0 18px var(--cerulean-glow);
        }

        .deck-send-button:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--cerulean-neon), var(--cerulean-bright));
          transform: scale(1.06);
          box-shadow: 0 0 25px var(--cerulean-glow);
        }

        .deck-send-button:disabled {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          box-shadow: none;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

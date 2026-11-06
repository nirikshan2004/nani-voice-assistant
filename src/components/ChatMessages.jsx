import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Copy, Check, Sparkles, Image as ImageIcon, Terminal, Compass, Lightbulb, BookOpen } from 'lucide-react';

export default function ChatMessages({
  messages,
  isLoading,
  onSpeakText,
  onSelectPrompt
}) {
  const feedEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const starterProtocols = [
    {
      category: 'NEURAL COMPUTE',
      title: 'Explain quantum computing simply',
      desc: 'Decode qubits & quantum superposition with easy real-world analogies',
      icon: Terminal
    },
    {
      category: 'COSMOS SPECTRA',
      title: 'Show me high-res photos of galaxies',
      desc: 'Retrieve deep space imagery and cosmic visual captures from Pexels',
      icon: Compass
    },
    {
      category: 'CYBER NARRATIVE',
      title: 'Write a futuristic cyberpunk story',
      desc: 'Generate a neon-soaked story about human-AI consciousness',
      icon: BookOpen
    },
    {
      category: 'SYNTHETIC IDEATION',
      title: 'Give me 3 creative tech startup ideas',
      desc: 'Brainstorm next-gen AI, biometric, or robotics business ventures',
      icon: Lightbulb
    }
  ];

  return (
    <div className="messages-feed">
      {/* Empty State */}
      {messages.length === 0 && (
        <div className="futuristic-welcome">
          <div className="hologram-orb-container">
            <div className="orb-ambient-glow" />
            <div className="orb-ring ring-cyan" />
            <div className="orb-ring ring-rose" />
            <div className="orb-core-pulse">
              <Sparkles size={28} className="orb-center-icon" />
            </div>
          </div>

          <div className="welcome-tag-badge">
            <span className="blink-led" />
            <span>REAL-TIME STREAMING ACTIVE</span>
          </div>

          <h2 className="welcome-title">
            Human <span className="gradient-text">Next</span>
          </h2>
          <p className="welcome-subtitle">
            Speak into the microphone or command below. Discover deep insights, explore visuals, and generate creative intelligence.
          </p>

          <div className="protocols-grid">
            {starterProtocols.map((protocol, idx) => {
              const IconComp = protocol.icon;
              return (
                <button
                  key={idx}
                  className="protocol-card"
                  onClick={() => onSelectPrompt(protocol.title)}
                >
                  <div className="protocol-card-glow" />
                  <div className="protocol-header">
                    <span className="protocol-category">{protocol.category}</span>
                    <IconComp size={16} className="protocol-icon" />
                  </div>
                  <h3 className="protocol-title">{protocol.title}</h3>
                  <p className="protocol-desc">{protocol.desc}</p>
                  <div className="protocol-footer">
                    <span>EXECUTE PROTOCOL</span>
                    <span className="protocol-arrow">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages Stream */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-row ${msg.sender === 'user' ? 'row-user' : 'row-bot'}`}
        >
          <div className="bubble-wrapper">
            <div className="sender-indicator">
              <span className={`sender-name ${msg.isStreaming ? 'text-rose' : ''}`}>
                {msg.sender === 'user'
                  ? '// USER_INPUT'
                  : msg.isStreaming
                  ? '// NANI_STREAMING...'
                  : '// NANI_RESPONSE'}
              </span>
            </div>

            <div className={`chat-bubble bubble-${msg.sender}`}>
              {/* If streaming and empty, show initial wave */}
              {msg.isStreaming && !msg.text ? (
                <div className="synth-wave-bars">
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                  <span className="synth-text">Thinking...</span>
                </div>
              ) : (
                <div className="bubble-content">
                  {msg.text}
                  {msg.isStreaming && <span className="stream-cursor">▌</span>}
                </div>
              )}

              {/* Bot Images Deck */}
              {msg.images && msg.images.length > 0 && (
                <div className="image-gallery-deck">
                  <div className="deck-label">
                    <ImageIcon size={14} />
                    <span>VISUAL SPECTRA CAPTURES ({msg.images.length})</span>
                  </div>
                  <div className="image-grid">
                    {msg.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="image-card"
                        onClick={() => setSelectedImage(imgUrl)}
                        title="Expand Image"
                      >
                        <img src={imgUrl} alt="Visual capture" loading="lazy" />
                        <div className="image-hover-hud">
                          <span className="hover-badge">EXPAND VIEW ⤢</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Per-message Actions (Once streamed) */}
            {msg.sender === 'bot' && !msg.isStreaming && msg.text && (
              <div className="bot-actions-row">
                <button
                  className="bot-act-btn"
                  onClick={() => onSpeakText(msg.text)}
                  title="Synthesize Voice"
                >
                  <Volume2 size={13} />
                  <span>READ ALOUD</span>
                </button>
                <button
                  className="bot-act-btn"
                  onClick={() => handleCopy(msg.id, msg.text)}
                  title="Copy to Clipboard"
                >
                  {copiedId === msg.id ? <Check size={13} color="#00f5a0" /> : <Copy size={13} />}
                  <span>{copiedId === msg.id ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      <div ref={feedEndRef} />

      {/* Lightbox Preview Modal */}
      {selectedImage && (
        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-hud-bar">
              <span>// IMAGE_VIEWER :: 1080P_HD</span>
              <button className="lightbox-close-btn" onClick={() => setSelectedImage(null)}>
                ✕ CLOSE
              </button>
            </div>
            <img src={selectedImage} alt="Expanded visual capture" />
          </div>
        </div>
      )}

      <style>{`
        .messages-feed {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .stream-cursor {
          display: inline-block;
          margin-left: 2px;
          color: var(--rose-neon);
          text-shadow: 0 0 10px var(--rose-glow);
          animation: cursorBlink 0.7s infinite alternate;
          font-weight: bold;
        }

        @keyframes cursorBlink {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }

        .futuristic-welcome {
          margin: auto;
          max-width: 820px;
          width: 100%;
          text-align: center;
          padding: 30px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hologram-orb-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orb-ambient-glow {
          position: absolute;
          inset: -15px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--cerulean-glow) 0%, var(--rose-glow) 50%, transparent 70%);
          filter: blur(20px);
          animation: orbAmbientPulse 4s infinite alternate;
        }

        .orb-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px dashed transparent;
        }

        .ring-cyan {
          border-top-color: var(--cerulean-neon);
          border-bottom-color: var(--cerulean-neon);
          animation: ringSpin 6s linear infinite;
        }

        .ring-rose {
          inset: 8px;
          border-left-color: var(--rose-neon);
          border-right-color: var(--rose-neon);
          animation: ringSpin 4s linear infinite reverse;
        }

        .orb-core-pulse {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.3), rgba(255, 45, 149, 0.3));
          border: 1px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px var(--cerulean-glow), inset 0 0 15px var(--rose-glow);
          animation: corePulse 2s ease-in-out infinite alternate;
        }

        .orb-center-icon {
          color: #fff;
          filter: drop-shadow(0 0 6px #fff);
        }

        @keyframes ringSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes corePulse {
          0% { transform: scale(0.92); box-shadow: 0 0 15px var(--cerulean-glow); }
          100% { transform: scale(1.08); box-shadow: 0 0 35px var(--rose-glow); }
        }

        @keyframes orbAmbientPulse {
          0% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 0.85; transform: scale(1.15); }
        }

        .welcome-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: var(--radius-pill);
          background: rgba(0, 229, 255, 0.08);
          border: 1px solid rgba(0, 229, 255, 0.25);
          color: var(--cerulean-neon);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          margin-bottom: 14px;
        }

        .blink-led {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00f5a0;
          box-shadow: 0 0 8px #00f5a0;
          animation: blink 1.2s infinite;
        }

        @keyframes blink {
          50% { opacity: 0.3; }
        }

        .welcome-title {
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 12px;
          color: #fff;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--cerulean-neon), var(--rose-neon));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
        }

        .welcome-subtitle {
          color: var(--text-dim);
          font-size: 1rem;
          max-width: 620px;
          line-height: 1.6;
          margin-bottom: 34px;
        }

        .protocols-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .protocols-grid {
            grid-template-columns: 1fr;
          }
        }

        .protocol-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 18px 20px;
          background: rgba(18, 22, 34, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-card);
          cursor: pointer;
          text-align: left;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .protocol-card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 10% 10%, rgba(0, 229, 255, 0.15), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .protocol-card:hover {
          background: rgba(22, 28, 46, 0.85);
          border-color: var(--cerulean-bright);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px -10px var(--cerulean-glow);
        }

        .protocol-card:hover .protocol-card-glow {
          opacity: 1;
        }

        .protocol-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .protocol-category {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--cerulean-bright);
        }

        .protocol-icon {
          color: var(--rose-bright);
          transition: transform 0.25s ease;
        }

        .protocol-card:hover .protocol-icon {
          transform: scale(1.15) rotate(5deg);
        }

        .protocol-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .protocol-desc {
          font-size: 0.8rem;
          color: var(--text-dim);
          line-height: 1.45;
          margin-bottom: 12px;
        }

        .protocol-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 8px;
          margin-top: auto;
        }

        .protocol-card:hover .protocol-footer {
          color: var(--cerulean-neon);
        }

        .protocol-arrow {
          font-weight: bold;
          font-size: 0.85rem;
          transition: transform 0.2s ease;
        }

        .protocol-card:hover .protocol-arrow {
          transform: translateX(4px);
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .row-user {
          justify-content: flex-end;
        }

        .row-bot {
          justify-content: flex-start;
        }

        .bubble-wrapper {
          max-width: 84%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sender-indicator {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          padding: 0 4px;
        }

        .sender-indicator .text-rose {
          color: var(--rose-bright);
          animation: pulseText 1s infinite alternate;
        }

        @keyframes pulseText {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .chat-bubble {
          padding: 16px 22px;
          border-radius: var(--radius-card);
          font-size: 0.95rem;
          line-height: 1.65;
          word-break: break-word;
          white-space: pre-wrap;
          position: relative;
        }

        .bubble-user {
          background: linear-gradient(135deg, var(--cerulean-bright) 0%, var(--cerulean) 100%);
          color: #ffffff;
          border-bottom-right-radius: 4px;
          font-weight: 500;
          box-shadow: 0 8px 30px -6px var(--cerulean-glow);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .bubble-bot {
          background: rgba(14, 17, 26, 0.88);
          color: #f0f3f8;
          border: 1px solid rgba(255, 45, 149, 0.35);
          border-left: 3px solid var(--rose-neon);
          border-bottom-left-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          box-shadow: 0 10px 35px -8px rgba(0, 0, 0, 0.7),
                      0 0 25px -10px var(--rose-glow-subtle);
        }

        .image-gallery-deck {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .deck-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--cerulean-bright);
          margin-bottom: 10px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .image-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 16/10;
          cursor: pointer;
          border: 1px solid rgba(0, 229, 255, 0.2);
          background: #000;
          transition: all 0.25s ease;
        }

        .image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .image-hover-hud {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }

        .hover-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
          background: var(--cerulean);
          padding: 4px 10px;
          border-radius: 6px;
          box-shadow: 0 0 12px var(--cerulean-glow);
        }

        .image-card:hover {
          border-color: var(--cerulean-neon);
          box-shadow: 0 0 20px var(--cerulean-glow);
        }

        .image-card:hover img {
          transform: scale(1.08);
        }

        .image-card:hover .image-hover-hud {
          opacity: 1;
        }

        .bot-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 4px;
        }

        .bot-act-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: var(--text-dim);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bot-act-btn:hover {
          color: #fff;
          background: rgba(0, 229, 255, 0.1);
          border-color: var(--cerulean-bright);
        }

        .synth-wave-bars {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 18px;
        }

        .synth-wave-bars .bar {
          width: 3px;
          height: 100%;
          background: var(--rose-neon);
          border-radius: 2px;
          animation: waveBar 1.2s ease-in-out infinite alternate;
        }

        .synth-wave-bars .bar:nth-child(1) { animation-delay: 0.1s; }
        .synth-wave-bars .bar:nth-child(2) { animation-delay: 0.3s; }
        .synth-wave-bars .bar:nth-child(3) { animation-delay: 0.5s; }
        .synth-wave-bars .bar:nth-child(4) { animation-delay: 0.2s; }

        @keyframes waveBar {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1); }
        }

        .synth-text {
          font-size: 0.82rem;
          color: var(--rose-bright);
          letter-spacing: 0.04em;
          margin-left: 6px;
        }

        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(4, 5, 8, 0.92);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .lightbox-panel {
          position: relative;
          max-width: 90vw;
          max-height: 88vh;
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 1px solid var(--cerulean-neon);
          box-shadow: 0 0 60px var(--cerulean-glow);
          background: #000;
        }

        .lightbox-hud-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: rgba(14, 18, 30, 0.95);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--cerulean-bright);
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lightbox-close-btn {
          background: transparent;
          border: none;
          color: var(--rose-bright);
          font-family: var(--font-mono);
          font-weight: bold;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .lightbox-panel img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          display: block;
        }
      `}</style>
    </div>
  );
}

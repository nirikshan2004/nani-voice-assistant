import React from 'react';
import SpaceBackground from './components/SpaceBackground';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import useVoiceAssistant from './hooks/useVoiceAssistant';
import './styles/theme.css';

export default function App() {
  const {
    messages,
    isLoading,
    isListening,
    isSpeaking,
    hasBotReplies,
    sendMessage,
    toggleListening,
    speakText,
    stopSpeaking,
    readLastBotReply,
    clearChat
  } = useVoiceAssistant();

  const getStatus = () => {
    if (isListening) return 'listening';
    if (isSpeaking) return 'speaking';
    return 'idle';
  };

  return (
    <div className="app-viewport">
      {/* 60fps Starfield and Glowing Cosmic Ambient Orbs */}
      <SpaceBackground />

      {/* Main Glassmorphic Chat Console */}
      <main className="chat-console">
        <ChatHeader
          status={getStatus()}
          isSpeaking={isSpeaking}
          onStopSpeaking={stopSpeaking}
          onClearChat={clearChat}
          messageCount={messages.length}
        />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onSpeakText={speakText}
          onSelectPrompt={(prompt) => sendMessage(prompt)}
        />

        <ChatInput
          onSendMessage={sendMessage}
          isListening={isListening}
          onToggleListening={toggleListening}
          isSpeaking={isSpeaking}
          onStopSpeaking={stopSpeaking}
          onReadLastBotReply={readLastBotReply}
          hasBotReplies={hasBotReplies}
          disabled={isLoading}
        />
      </main>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Consolidated Hook for Voice Recognition, Speech Synthesis, and Real-Time Streaming Chat
 */
export default function useVoiceAssistant() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastBotReply, setLastBotReply] = useState('');

  const recognitionRef = useRef(null);
  const isManuallyStoppedRef = useRef(false);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // ----------------------------------------------------
  // 1. SPEECH SYNTHESIS (TTS)
  // ----------------------------------------------------
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakText = useCallback((text) => {
    if (!synthRef.current || !text) return;
    stopSpeaking();

    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/[*_#`~>]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [stopSpeaking]);

  const readLastBotReply = useCallback(() => {
    if (lastBotReply) {
      speakText(lastBotReply);
    }
  }, [lastBotReply, speakText]);

  // ----------------------------------------------------
  // 2. REAL-TIME STREAMING CHAT
  // ----------------------------------------------------
  const sendMessage = useCallback(async (userText) => {
    if (!userText || !userText.trim()) return;

    const query = userText.trim();
    const userMsgId = Date.now();
    const botMsgId = Date.now() + 1;

    // 1. Add user message + empty bot bubble immediately
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: query, images: [] },
      { id: botMsgId, sender: 'bot', text: '', images: [], isStreaming: true }
    ]);
    setIsLoading(true);

    let accumulatedText = '';
    let accumulatedImages = [];

    try {
      const response = await fetch('/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          try {
            const payload = JSON.parse(trimmed.slice(5).trim());

            if (payload.text) {
              accumulatedText += payload.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId ? { ...msg, text: accumulatedText } : msg
                )
              );
            }

            if (payload.images && Array.isArray(payload.images)) {
              accumulatedImages = payload.images;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId ? { ...msg, images: accumulatedImages } : msg
                )
              );
            }

            if (payload.done) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
                )
              );
            }
          } catch (e) {
            // Ignore parse chunk anomalies
          }
        }
      }

      setLastBotReply(accumulatedText);
    } catch (err) {
      console.warn('Streaming fallback:', err);
      // Fallback to standard /chat endpoint if stream failed
      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query })
        });
        const data = await res.json();
        const reply = data.response || 'No reply received.';
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, text: reply, images: data.images || [], isStreaming: false }
              : msg
          )
        );
        setLastBotReply(reply);
      } catch (fallbackErr) {
        const errorText = `Unable to connect: ${fallbackErr.message}`;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, text: errorText, isStreaming: false }
              : msg
          )
        );
        setLastBotReply(errorText);
      }
    } finally {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  }, []);

  // ----------------------------------------------------
  // 3. SPEECH RECOGNITION (STT)
  // ----------------------------------------------------
  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }

    stopSpeaking();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      isManuallyStoppedRef.current = false;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      const lower = transcript.toLowerCase();

      if (lower === 'stop' || lower === 'stop listening' || lower === 'cancel') {
        stopSpeaking();
        stopListening();
        return;
      }

      if (lower === 'read' || lower === 'read reply' || lower === 'read that') {
        readLastBotReply();
        return;
      }

      sendMessage(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  }, [sendMessage, stopSpeaking, stopListening, readLastBotReply]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setLastBotReply('');
    stopSpeaking();
  }, [stopSpeaking]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    isListening,
    isSpeaking,
    hasBotReplies: !!lastBotReply,
    sendMessage,
    startListening,
    stopListening,
    toggleListening,
    speakText,
    stopSpeaking,
    readLastBotReply,
    clearChat
  };
}

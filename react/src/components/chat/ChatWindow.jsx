import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Trash2, 
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './ChatWindow.css';

const QUICK_PROMPTS = [
  'Upcoming workshops & hackathons',
  'How do I register for an event?',
  'Who are the ITC club officers?',
  'Where and when does ITC meet?',
];

const CHAT_STORAGE_KEY = 'itc_chat_messages';

export const ChatWindow = ({ isFloating = false, onClose }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Retrieve initial messages from sessionStorage so page refresh does not lose the chat
  const [messages, setMessages] = useState(() => {
    if (typeof sessionStorage !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse chat messages from sessionStorage:', e);
      }
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Hello ${user ? user.name : 'there'}! 👋 I am **ITC Assist**, your official Information Technology Club AI guide. Ask me anything about our upcoming workshops, hackathons, registration policies, or club divisions!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorState, setErrorState] = useState(null); // { message, lastPrompt }

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync messages into sessionStorage whenever they change
  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && messages && messages.length > 0) {
      try {
        sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn('Failed to save chat to sessionStorage:', e);
      }
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isStreaming]);

  // Focus input when mounted
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (textToSend) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isStreaming) return;

    setErrorState(null);
    setInput('');

    // Append user message
    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const streamGenerator = api.streamChat(prompt);

      const botMessageId = `bot-${Date.now()}`;
      let botContent = '';
      let isFirstChunk = true;

      for await (const chunk of streamGenerator) {
        if (isFirstChunk) {
          setIsTyping(false);
          setIsStreaming(true);
          isFirstChunk = false;

          // Add assistant message placeholder
          setMessages((prev) => [
            ...prev,
            {
              id: botMessageId,
              role: 'assistant',
              content: chunk,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          botContent = chunk;
        } else {
          botContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, content: botContent } : msg
            )
          );
        }
      }

      setIsStreaming(false);
    } catch (err) {
      setIsTyping(false);
      setIsStreaming(false);
      setErrorState({
        message: err.message || 'Failed to receive response from ITC AI assistant.',
        lastPrompt: prompt,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    const reset = [
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat cleared! How can I assist you with ITC activities today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(reset);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(reset));
    }
    setErrorState(null);
  };

  const renderMessageContent = (text) => {
    return text.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx} className="chat-line-block">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <div
      className={`chat-container ${isFloating ? 'chat-floating-mode' : 'chat-full-mode'}`}
      role="region"
      aria-label="ITC AI Chat Assistant"
    >
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar-assistant" aria-hidden="true">
            <Bot size={20} />
          </div>
          <div>
            <div className="chat-title">
              <span>{t('chat.title', 'ITC Assist')}</span>
              <span className="chat-status-dot" title="Online" aria-label="Status: Online" />
            </div>
            <div className="chat-subtitle">{t('chat.subtitle', 'Club Knowledge & Event Assistant')}</div>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            type="button"
            onClick={handleClearHistory}
            className="chat-header-btn"
            title={t('chat.clear', 'Clear Chat History')}
            aria-label={t('chat.clear', 'Clear chat messages')}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="chat-header-btn chat-close-btn"
              aria-label="Close Chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Message List */}
      <div 
        className="chat-messages-list" 
        role="log" 
        aria-live="polite" 
        aria-label="Chat message history"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`chat-message-row ${isUser ? 'chat-row-user' : 'chat-row-bot'}`}
            >
              {!isUser && (
                <div className="chat-message-avatar" aria-hidden="true">
                  <Bot size={16} />
                </div>
              )}

              <div className="chat-bubble-wrap">
                <div className={`chat-bubble ${isUser ? 'bubble-user' : 'bubble-bot'}`}>
                  {renderMessageContent(msg.content)}
                </div>
                <div className="chat-timestamp">{msg.timestamp}</div>
              </div>

              {isUser && (
                <div className="chat-message-avatar avatar-user" aria-hidden="true">
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="chat-message-row chat-row-bot" aria-live="polite">
            <div className="chat-message-avatar" aria-hidden="true">
              <Bot size={16} />
            </div>
            <div className="chat-bubble bubble-bot typing-indicator-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="sr-only">{t('chat.thinking', 'ITC Assist is thinking...')}</span>
            </div>
          </div>
        )}

        {/* Error Alert with Try Again */}
        {errorState && (
          <div className="chat-error-alert" role="alert">
            <div className="chat-error-content">
              <AlertCircle size={18} className="text-red" aria-hidden="true" />
              <span>{errorState.message}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSendMessage(errorState.lastPrompt)}
              className="btn btn-sm btn-outline-red chat-error-retry"
              aria-label="Try again to resend your message"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>{t('common.tryAgain', '« Try again »')}</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="chat-quick-chips" aria-label="Suggested questions">
        {QUICK_PROMPTS.map((promptText, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(promptText)}
            disabled={isStreaming || isTyping}
            className="chat-chip"
          >
            <Sparkles size={12} className="chip-icon" aria-hidden="true" />
            <span>{promptText}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        className="chat-input-area"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <label htmlFor="chat-textarea-input" className="sr-only">
          {t('chat.placeholder', 'Type your message to ITC Assist')}
        </label>
        <textarea
          id="chat-textarea-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder', 'Ask ITC Assist (press Enter to send)...')}
          rows={1}
          className="chat-input-field"
          disabled={isStreaming}
          aria-label="Chat input message"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="btn btn-primary chat-send-btn"
          aria-label="Send message to AI assistant"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

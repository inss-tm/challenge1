import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Sparkles, Maximize2 } from 'lucide-react';
import ChatWindow from './ChatWindow.jsx';
import './ChatWidget.css';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // If already on the full chat page, don't show the duplicate floating widget
  if (location.pathname === '/chat') {
    return null;
  }

  return (
    <div className="chat-widget-root">
      {/* Floating Popup Window */}
      {isOpen && (
        <div className="chat-widget-popup fade-in" role="dialog" aria-modal="true" aria-label="ITC Assistant">
          <ChatWindow isFloating={true} onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`chat-widget-fab ${isOpen ? 'fab-open' : ''}`}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close ITC AI Assistant' : 'Open ITC AI Assistant chat'}
      >
        {isOpen ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <>
            <MessageSquare size={24} aria-hidden="true" />
            <span className="fab-ai-sparkle" aria-hidden="true">
              <Sparkles size={13} />
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;

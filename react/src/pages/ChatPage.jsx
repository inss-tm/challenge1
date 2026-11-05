import React from 'react';
import { Bot, Sparkles, BookOpen, Shield, Code, Calendar } from 'lucide-react';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import './ChatPage.css';

export const ChatPage = () => {
  return (
    <div className="chat-page-root">
      <div className="container chat-page-container">
        {/* Sidebar with Club Knowledge Guides */}
        <aside className="chat-page-sidebar" aria-label="ITC Assistant Information">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <div className="sidebar-badge" aria-hidden="true">
                <Sparkles size={16} />
              </div>
              <h2 className="sidebar-title">About ITC Assist</h2>
            </div>
            <p className="sidebar-desc">
              ITC Assist is powered by our club knowledge base. It knows every upcoming event, 
              workshop agenda, registration process, and division heads.
            </p>

            <div className="sidebar-topic-list">
              <h3 className="sidebar-topic-heading">Suggested Topics:</h3>

              <div className="sidebar-topic-item">
                <Calendar size={16} className="text-red" aria-hidden="true" />
                <div>
                  <strong>Upcoming Schedule</strong>
                  <p>Ask: "What workshops are scheduled this month?"</p>
                </div>
              </div>

              <div className="sidebar-topic-item">
                <Code size={16} className="text-red" aria-hidden="true" />
                <div>
                  <strong>Annual Hackathon</strong>
                  <p>Ask: "How do I form a hackathon team?"</p>
                </div>
              </div>

              <div className="sidebar-topic-item">
                <BookOpen size={16} className="text-red" aria-hidden="true" />
                <div>
                  <strong>Workshop Software</strong>
                  <p>Ask: "What do I need to install for the AI workshop?"</p>
                </div>
              </div>

              <div className="sidebar-topic-item">
                <Shield size={16} className="text-red" aria-hidden="true" />
                <div>
                  <strong>Club Leadership</strong>
                  <p>Ask: "Who is the club president and security lead?"</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Canvas */}
        <main className="chat-page-main">
          <ChatWindow isFloating={false} />
        </main>
      </div>
    </div>
  );
};

export default ChatPage;

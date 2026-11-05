import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.js';
import { CLUB_INFO } from '../services/mockData.js';
import { useAuth } from '../context/AuthContext.jsx';
import EventCard from '../components/events/EventCard.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import './Home.css';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [registeringId, setRegisteringId] = useState(null);

  // TanStack Query for featured upcoming events (60s cache)
  const {
    data: eventsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events', 'Upcoming'],
    queryFn: () => api.getEvents({ status: 'Upcoming' }),
    staleTime: 60_000,
  });

  const featuredEvents = (eventsResponse?.data || []).slice(0, 3);

  const handleQuickRegister = async (eventId, isCurrentlyRegistered) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegisteringId(eventId);
    try {
      if (isCurrentlyRegistered) {
        await api.unregisterEvent(eventId);
      } else {
        await api.registerEvent(eventId);
      }
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
    } catch (err) {
      alert(err.message || 'Action failed. Please try again.');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="home-root">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-tag">{t('home.badge', 'ITC 2026 SEASON')}</span>
              <span className="hero-badge-text"> Information Technology Club</span>
            </div>

            <h1 id="hero-title" className="hero-title">
              {t('home.heroTitle', 'Browse events, register for workshops, and chat with our AI assistant')}
            </h1>

            <p className="hero-subtitle">
              {t('home.heroSubtitle', ' Build real-world projects, participate in hackathons, and accelerate your tech career.')}
            </p>

            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary btn-lg">
                <Calendar size={18} aria-hidden="true" />
                <span>{t('home.exploreEvents', 'Explore Events')}</span>
              </Link>
              <Link to="/chat" className="btn btn-secondary btn-lg">
                <Sparkles size={18} className="text-red" aria-hidden="true" />
                <span>{t('home.askAI', 'Ask AI Assistant')}</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-code-card">
              <div className="code-card-header">
                <span className="code-dot dot-red" />
                <span className="code-dot dot-yellow" />
                <span className="code-dot dot-green" />
                <span className="code-card-title">itc-core.ts</span>
              </div>
              <div className="code-card-body">
                <p><span className="c-keyword">const</span> <span className="c-var">itcClub</span> = &#123;</p>
                <p className="c-indent"><span className="c-prop">identity</span>: <span className="c-string">"#D63326"</span>,</p>
                <p className="c-indent"><span className="c-prop">mission</span>: <span className="c-string">"Build the Future"</span>,</p>
                <p className="c-indent"><span className="c-prop">activeMembers</span>: <span className="c-num">{CLUB_INFO.activeMembers}</span>,</p>
                <p className="c-indent"><span className="c-prop">aiCompanion</span>: <span className="c-bool">true</span></p>
                <p>&#125;;</p>
                <p className="c-comment">// Join ITC and deploy your potential</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Section */}
      <section className="featured-section" aria-labelledby="featured-events-title">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="badge badge-red">{t('home.badge', "WHAT'S HAPPENING")}</span>
              <h2 id="featured-events-title" className="section-title">
                {t('home.featuredTitle', 'Upcoming Featured Events')}
              </h2>
            </div>
            <Link to="/events" className="btn btn-outline section-more-btn">
              <span>{t('home.exploreEvents', 'View All Events')}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* 3 Data States */}
          {loading && (
            <LoadingSkeleton type="card" count={3} />
          )}

          {!loading && error && (
            <ErrorState
              title={t('common.error', 'Unable to load upcoming events')}
              message={error.message || 'Error loading events'}
              onRetry={() => refetch()}
            />
          )}

          {!loading && !error && featuredEvents.length === 0 && (
            <EmptyState
              title={t('events.noEvents', 'No upcoming events scheduled right now')}
              message="Check back soon or ask our AI assistant for the next schedule."
              actionLabel="Refresh List"
              onAction={() => refetch()}
            />
          )}

          {!loading && !error && featuredEvents.length > 0 && (
            <div className="featured-grid">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onQuickRegister={handleQuickRegister}
                  registeringId={registeringId}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Assistant Showcase Spotlight */}
      <section className="ai-spotlight-section" aria-labelledby="ai-spotlight-title">
        <div className="container">
          <div className="ai-spotlight-card">
            <div className="ai-spotlight-text">
              <div className="ai-spotlight-tag">
                <Sparkles size={16} aria-hidden="true" />
                <span>INTELLIGENT CLUB COMPANION</span>
              </div>
              <h2 id="ai-spotlight-title" className="ai-spotlight-title">
                Meet <span className="text-red">ITC Assist</span>
              </h2>
              <p className="ai-spotlight-desc">
                Our custom AI assistant is trained on everything ITC: from upcoming workshop 
                dates and hackathon team formations to officer contacts and room locations.
                Stream answers word-by-word with instant club answers.
              </p>
              <div className="ai-features-list">
                <div className="ai-feature-item">
                  <CheckCircle2 size={18} className="text-red" aria-hidden="true" />
                  <span>Real-time event queries and registration assistance</span>
                </div>
                <div className="ai-feature-item">
                  <CheckCircle2 size={18} className="text-red" aria-hidden="true" />
                  <span>Workshop prerequisites, software requirements and setup guides</span>
                </div>
                <div className="ai-feature-item">
                  <CheckCircle2 size={18} className="text-red" aria-hidden="true" />
                  <span>Accessible everywhere via full page or floating widget</span>
                </div>
              </div>
              <div className="ai-spotlight-actions">
                <Link to="/chat" className="btn btn-primary btn-lg">
                  <MessageSquare size={18} aria-hidden="true" />
                  <span>{t('home.askAI', 'Chat With ITC Assist')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;

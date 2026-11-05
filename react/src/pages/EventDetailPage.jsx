import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  Share2, 
  AlertCircle,
  Video, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import './EventDetailPage.css';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isRegistering, setIsRegistering] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // TanStack Query with 60s staleTime
  const {
    data: eventData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.getEventById(id),
    staleTime: 60_000,
  });

  const event = eventData?.data || null;

  const handleRegistrationToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    if (!event) return;

    setIsRegistering(true);
    setFeedbackMessage(null);

    try {
      if (event.isUserRegistered) {
        await api.unregisterEvent(id);
        setFeedbackMessage({
          type: 'info',
          text: 'Your registration has been cancelled. Your seat has been released.'
        });
      } else {
        await api.registerEvent(id);
        setFeedbackMessage({
          type: 'success',
          text: `Success! You are confirmed for ${event.title}. Access your digital pass under "My Registrations".`
        });
      }
      // Invalidate events and current event cache so data stays consistent
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || 'ITC Event',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event URL copied to clipboard!');
    }
  };

  return (
    <div className="event-detail-root">
      <div className="container">
        {/* Back Link */}
        <div className="detail-top-nav">
          <Link to="/events" className="btn btn-outline btn-sm back-btn">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{t('eventDetail.back', 'Back to Events')}</span>
          </Link>
        </div>

        {/* 1. Loading State */}
        {isLoading && (
          <div className="detail-loading-wrapper" aria-busy="true">
            <LoadingSkeleton type="detail" />
          </div>
        )}

        {/* 2. Error State */}
        {!isLoading && error && (
          <div className="detail-error-wrapper">
            <ErrorState
              title={t('common.error', 'Unable to load event details')}
              message={error.message || 'The requested event could not be found.'}
              onRetry={() => refetch()}
              retryLabel="« Try again »"
            />
          </div>
        )}

        {/* 3. Not Found State */}
        {!isLoading && !error && !event && (
          <EmptyState
            title="Event Not Found"
            message="The event you are looking for does not exist or may have been retired."
            actionLabel="Return to events catalog"
            onAction={() => navigate('/events')}
          />
        )}

        {/* Successful Event View */}
        {!isLoading && !error && event && (
          <article className="event-detail-content fade-in">
            {/* Header Hero Banner with lazy-loaded image */}
            <div className="detail-hero">
              <img
                src={event.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200'}
                alt={`Banner image for ${event.title}`}
                className="detail-hero-img"
                loading="lazy"
                decoding="async"
              />
              <div className="detail-hero-overlay" />
              <div className="detail-hero-content">
                <div className="detail-badges-row">
                  <span className={`badge ${event.category === 'Hackathon' ? 'badge-red' : 'badge-dark'}`}>
                    {event.category}
                  </span>
                  <span className="badge badge-gray">
                    {event.status}
                  </span>
                  {event.isOnline && (
                    <span className="badge badge-green">
                      <Video size={12} aria-hidden="true" /> Online Stream
                    </span>
                  )}
                </div>
                <h1 className="detail-hero-title">{event.title}</h1>
              </div>
            </div>

            {/* Feedback Alert if user just toggled registration */}
            {feedbackMessage && (
              <div
                className={`feedback-alert feedback-${feedbackMessage.type}`}
                role="alert"
                aria-live="polite"
              >
                {feedbackMessage.type === 'success' && <CheckCircle size={18} aria-hidden="true" />}
                {feedbackMessage.type === 'error' && <AlertCircle size={18} aria-hidden="true" />}
                <span>{feedbackMessage.text}</span>
              </div>
            )}

            {/* 2-Column Layout */}
            <div className="detail-grid">
              {/* Left Column */}
              <div className="detail-main-col">
                <div className="detail-quick-meta">
                  <div className="quick-meta-box">
                    <Calendar size={20} className="text-red" aria-hidden="true" />
                    <div>
                      <span className="quick-meta-label">{t('eventDetail.dateTime', 'Date')}</span>
                      <span className="quick-meta-val">{event.date}</span>
                    </div>
                  </div>

                  <div className="quick-meta-box">
                    <Clock size={20} className="text-red" aria-hidden="true" />
                    <div>
                      <span className="quick-meta-label">Time</span>
                      <span className="quick-meta-val">{event.time}</span>
                    </div>
                  </div>

                  <div className="quick-meta-box">
                    <MapPin size={20} className="text-red" aria-hidden="true" />
                    <div>
                      <span className="quick-meta-label">{t('eventDetail.location', 'Location')}</span>
                      <span className="quick-meta-val">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <section className="detail-section" aria-labelledby="about-event-heading">
                  <h2 id="about-event-heading" className="detail-section-title">
                    About this Event
                  </h2>
                  <p className="detail-description">{event.description}</p>
                </section>

                {/* Detailed Agenda */}
                {event.detailedAgenda && event.detailedAgenda.length > 0 && (
                  <section className="detail-section" aria-labelledby="agenda-heading">
                    <h2 id="agenda-heading" className="detail-section-title">
                      {t('eventDetail.agenda', 'Schedule & Agenda')}
                    </h2>
                    <ul className="detail-agenda-list" role="list">
                      {event.detailedAgenda.map((step, idx) => (
                        <li key={idx} className="agenda-item">
                          <span className="agenda-dot" aria-hidden="true" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Prerequisites */}
                {event.prerequisites && (
                  <section className="detail-section" aria-labelledby="prereq-heading">
                    <h2 id="prereq-heading" className="detail-section-title">
                      {t('eventDetail.prerequisites', 'Prerequisites & Preparation')}
                    </h2>
                    <div className="prereq-card">
                      <BookOpen size={20} className="text-red" aria-hidden="true" />
                      <p>{event.prerequisites}</p>
                    </div>
                  </section>
                )}

                {/* Speaker Card with lazy-loaded avatar */}
                {event.speaker && (
                  <section className="detail-section" aria-labelledby="speaker-heading">
                    <h2 id="speaker-heading" className="detail-section-title">
                      {t('eventDetail.speaker', 'Featured Speaker / Organizer')}
                    </h2>
                    <div className="speaker-card">
                      <img
                        src={event.speaker.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={`Photo of ${event.speaker.name}`}
                        className="speaker-avatar"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <h3 className="speaker-name">{event.speaker.name}</h3>
                        <p className="speaker-role">{event.speaker.role}</p>
                        <p className="speaker-org">Information Technology Club Mentor</p>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column: Registration Card */}
              <aside className="detail-sidebar" aria-label="Registration Options">
                <div className="reg-sticky-card">
                  <div className="reg-card-header">
                    <span className="reg-card-price">100% Free</span>
                    <span className="reg-card-sub">for ITC members</span>
                  </div>

                  {/* Spots Left */}
                  <div className="reg-capacity-block">
                    <div className="reg-capacity-row">
                      <span className="reg-capacity-count">
                        <Users size={16} aria-hidden="true" />
                        {event.registeredCount} / {event.capacity} Registered
                      </span>
                      <span className="reg-capacity-spots">
                        {Math.max(0, event.capacity - event.registeredCount)} seats remaining
                      </span>
                    </div>
                    <div 
                      className="capacity-progress-bar"
                      role="progressbar"
                      aria-valuenow={event.registeredCount}
                      aria-valuemin="0"
                      aria-valuemax={event.capacity}
                    >
                      <div
                        className="capacity-fill"
                        style={{ width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="button"
                    onClick={handleRegistrationToggle}
                    disabled={isRegistering || (!event.isUserRegistered && event.registeredCount >= event.capacity)}
                    className={`btn btn-lg ${event.isUserRegistered ? 'btn-outline-red' : 'btn-primary'} reg-action-btn`}
                  >
                    {isRegistering ? (
                      'Processing...'
                    ) : event.isUserRegistered ? (
                      <>
                        <CheckCircle size={18} aria-hidden="true" />
                        <span>Registered (Click to Cancel)</span>
                      </>
                    ) : event.registeredCount >= event.capacity ? (
                      'Event Full'
                    ) : (
                      t('eventDetail.registerNow', 'Register for Event')
                    )}
                  </button>

                  {!isAuthenticated && (
                    <p className="reg-login-hint">
                      Requires free member login. <Link to="/login" className="text-red">Sign in</Link>
                    </p>
                  )}

                  {/* Share button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn btn-outline btn-sm share-btn"
                    aria-label="Share this event"
                  >
                    <Share2 size={15} aria-hidden="true" />
                    <span>{t('eventDetail.share', 'Share Event Link')}</span>
                  </button>

                  {/* AI Quick Query */}
                  <div className="reg-ai-box">
                    <Sparkles size={16} className="text-red" aria-hidden="true" />
                    <span>
                      Have questions about this session? Ask <Link to="/chat" className="text-red font-bold">ITC Assist</Link>
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Ticket,
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import './MyEventsPage.css';

export const MyEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState(null);

  const {
    data: regResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userRegistrations'],
    queryFn: () => api.getUserRegistrations(),
    staleTime: 60_000,
  });

  const registeredEvents = regResponse?.data || [];

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm('Are you sure you want to release your seat for this event?')) {
      return;
    }

    setCancellingId(eventId);
    try {
      await api.unregisterEvent(eventId);
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    } catch (err) {
      alert(err.message || 'Failed to cancel registration.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="my-events-page-root">
      {/* Member Header */}
      <section className="my-events-banner" aria-labelledby="member-dashboard-heading">
        <div className="container">
          <div className="member-banner-inner">
            <div className="member-profile-badge">
              <div className="member-big-avatar" aria-hidden="true">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <span className="badge badge-red">VERIFIED MEMBER</span>
                <h1 id="member-dashboard-heading" className="member-name-heading">
                  {user?.name}'s Event Passes
                </h1>
                <p className="member-meta-text">
                  Member ID: <strong>{user?.studentId || 'ITC-8821'}</strong> • Email: {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registrations View */}
      <div className="container my-events-container">
        {/* 1. Loading State */}
        {loading && (
          <div className="my-events-data-view" aria-busy="true">
            <LoadingSkeleton type="card" count={2} />
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="my-events-data-view">
            <ErrorState
              title={t('common.error', 'Unable to retrieve your registrations')}
              message={error.message || 'Please check your connection and try again.'}
              onRetry={() => refetch()}
              retryLabel="« Try again »"
            />
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && registeredEvents.length === 0 && (
          <div className="my-events-data-view">
            <EmptyState
              title="You haven't registered for any events yet"
              message="Explore our workshop catalog and claim your seat before registration closes."
              actionLabel="Discover Upcoming Events"
              onAction={() => navigate('/events')}
            />
          </div>
        )}

        {/* Successful Passes Grid */}
        {!loading && !error && registeredEvents.length > 0 && (
          <div className="passes-grid" role="region" aria-label="Your registered event passes">
            {registeredEvents.map((event) => (
              <div key={event.id} className="pass-card fade-in">
                <div className="pass-card-left">
                  <div className="pass-status-row">
                    <span className="pass-status-pill">
                      <CheckCircle size={14} aria-hidden="true" />
                      <span>Confirmed Seat</span>
                    </span>
                    <span className="pass-category-pill">{event.category}</span>
                  </div>

                  <h2 className="pass-title">{event.title}</h2>

                  <div className="pass-info-grid">
                    <div className="pass-info-item">
                      <Calendar size={15} className="text-red" aria-hidden="true" />
                      <span>{event.date}</span>
                    </div>
                    <div className="pass-info-item">
                      <Clock size={15} className="text-red" aria-hidden="true" />
                      <span>{event.time}</span>
                    </div>
                    <div className="pass-info-item">
                      <MapPin size={15} className="text-red" aria-hidden="true" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="pass-actions-row">
                    <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">
                      <span>View Details</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCancelRegistration(event.id)}
                      disabled={cancellingId === event.id}
                      className="btn btn-outline-red btn-sm"
                      aria-label={`Cancel registration for ${event.title}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>{cancellingId === event.id ? 'Cancelling...' : 'Cancel Seat'}</span>
                    </button>
                  </div>
                </div>

                <div className="pass-card-right">
                  <div className="pass-qr-box">
                    <QrCode size={70} className="pass-qr-icon" aria-hidden="true" />
                    <span className="pass-qr-label">PASS #{event.id.toUpperCase()}</span>
                  </div>
                  <div className="pass-member-meta">
                    <span className="pass-attendee-name">{user?.name}</span>
                    <span className="pass-attendee-type">General Admission</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;

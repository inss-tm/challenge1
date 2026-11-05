import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import EventCard from '../components/events/EventCard.jsx';
import EventFilters from '../components/events/EventFilters.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import './EventsPage.css';

export const EventsPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [registeringId, setRegisteringId] = useState(null);

  // TanStack Query with 60s staleTime (instant back-navigation, cached data)
  const { 
    data: eventsResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['events', selectedCategory, selectedStatus, searchQuery],
    queryFn: () =>
      api.getEvents({
        category: selectedCategory,
        status: selectedStatus,
        search: searchQuery,
      }),
    staleTime: 60_000, // fresh for 60 s: no refetch, instant UI
  });

  const events = eventsResponse?.data || [];

  // Handle Quick Register / Unregister and invalidate cache
  const handleQuickRegister = async (eventId, isCurrentlyRegistered) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/events' } } });
      return;
    }

    setRegisteringId(eventId);
    try {
      if (isCurrentlyRegistered) {
        await api.unregisterEvent(eventId);
      } else {
        await api.registerEvent(eventId);
      }
      // Invalidate events cache to refresh data across all pages
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
    } catch (err) {
      alert(err.message || 'Registration action failed. Please try again.');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  return (
    <div className="events-page-root">
      {/* Header Banner */}
      <section className="events-hero-banner" aria-labelledby="events-page-heading">
        <div className="container">
          <div className="events-hero-inner">
            <span className="badge badge-red">{t('events.badge', 'ITC SCHEDULE 2026')}</span>
            <h1 id="events-page-heading" className="events-heading">
              {t('events.title', 'Browse Club Events & Workshops')}
            </h1>
            <p className="events-subheading">
              {t('events.subtitle', 'Discover cutting-edge developer workshops, 32-hour hackathons, and exclusive tech talks. Free for all registered ITC members.')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Events Content Area */}
      <div className="container events-main-container">
        {/* Filter & Search Bar */}
        <EventFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          totalResults={events.length}
        />

        {/* 3 State Rendering */}

        {/* 1. Loading State */}
        {isLoading && (
          <div className="events-data-view" aria-busy="true">
            <LoadingSkeleton type="card" count={6} />
          </div>
        )}

        {/* 2. Error State with required « Try again » button */}
        {!isLoading && error && (
          <div className="events-data-view">
            <ErrorState
              title={t('common.error', 'Unable to load club events')}
              message={error.message || 'Failed to load events from the ITC server.'}
              onRetry={() => refetch()}
              retryLabel="« Try again »"
            />
          </div>
        )}

        {/* 3. Empty State */}
        {!isLoading && !error && events.length === 0 && (
          <div className="events-data-view">
            <EmptyState
              title={t('events.noEvents', 'No events match your criteria')}
              message={`We couldn't find any events matching category "${selectedCategory}" and search "${searchQuery}".`}
              actionLabel={t('events.resetFilters', 'Reset all filters')}
              onAction={handleResetFilters}
            />
          </div>
        )}

        {/* Successful Data List */}
        {!isLoading && !error && events.length > 0 && (
          <div 
            className="events-grid" 
            role="region" 
            aria-label="List of events"
          >
            {events.map((event) => (
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
    </div>
  );
};

export default EventsPage;

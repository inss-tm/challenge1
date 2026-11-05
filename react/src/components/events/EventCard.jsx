import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Video 
} from 'lucide-react';
import './EventCard.css';

export const EventCard = ({ event, onQuickRegister, registeringId }) => {
  const isFull = event.registeredCount >= event.capacity;
  const isRegistered = event.isUserRegistered;
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);

  // Format date nicely
  const eventDate = new Date(event.date);
  const formattedDate = !isNaN(eventDate)
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : event.date;

  return (
    <article className="event-card fade-in" aria-labelledby={`event-title-${event.id}`}>
      {/* Card Header Image / Badge */}
      <div className="event-card-media">
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600'} 
          alt={`Banner for ${event.title}`}
          className="event-card-img"
          loading="lazy"
        />
        <div className="event-card-badges">
          <span className={`badge ${event.category === 'Hackathon' ? 'badge-red' : 'badge-dark'}`}>
            {event.category}
          </span>
          {event.isOnline && (
            <span className="badge badge-gray badge-inline-icon">
              <Video size={12} aria-hidden="true" />
              <span>Online</span>
            </span>
          )}
        </div>
        {isRegistered && (
          <div className="registered-ribbon" aria-label="You are registered for this event">
            <CheckCircle size={14} aria-hidden="true" />
            <span>Registered</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="event-card-body">
        {/* Meta Row: Date & Time */}
        <div className="event-meta-row">
          <div className="event-meta-item">
            <Calendar size={14} className="event-meta-icon" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
          <div className="event-meta-item">
            <Clock size={14} className="event-meta-icon" aria-hidden="true" />
            <span>{event.time ? event.time.split(' ')[0] : '14:00'}</span>
          </div>
        </div>

        {/* Title */}
        <h3 id={`event-title-${event.id}`} className="event-card-title">
          <Link to={`/events/${event.id}`} className="event-title-link">
            {event.title}
          </Link>
        </h3>

        {/* Location */}
        <div className="event-location-row">
          <MapPin size={14} className="event-meta-icon" aria-hidden="true" />
          <span className="event-location-text">{event.location}</span>
        </div>

        {/* Short description */}
        <p className="event-card-desc">
          {event.description.length > 115 
            ? `${event.description.substring(0, 115)}...` 
            : event.description}
        </p>

        {/* Capacity / Seats Tracker */}
        <div className="event-capacity-tracker">
          <div className="capacity-labels">
            <span className="capacity-registered">
              <Users size={13} aria-hidden="true" />
              {event.registeredCount} / {event.capacity} attending
            </span>
            <span className={`capacity-spots ${spotsLeft <= 5 ? 'spots-low' : ''}`}>
              {isFull ? 'Sold Out' : `${spotsLeft} seats left`}
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

        {/* Card Footer Actions */}
        <div className="event-card-actions">
          <Link 
            to={`/events/${event.id}`} 
            className="btn btn-outline btn-sm event-details-btn"
            aria-label={`View full details for ${event.title}`}
          >
            <span>Details</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>

          {onQuickRegister && (
            <button
              type="button"
              onClick={() => onQuickRegister(event.id, isRegistered)}
              disabled={registeringId === event.id || (!isRegistered && isFull)}
              className={`btn btn-sm ${isRegistered ? 'btn-outline-red' : 'btn-primary'} event-reg-btn`}
              aria-label={isRegistered ? `Cancel registration for ${event.title}` : `Register for ${event.title}`}
            >
              {registeringId === event.id ? (
                'Updating...'
              ) : isRegistered ? (
                'Cancel Spot'
              ) : isFull ? (
                'Waitlist'
              ) : (
                'Register Now'
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;

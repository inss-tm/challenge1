import React from 'react';
import { CalendarX, Search, Sparkles } from 'lucide-react';
import './EmptyState.css';

export const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'No events found',
  message = 'There are no events matching your current filters. Try adjusting your search query or selecting a different category.',
  actionLabel = 'Reset Filters',
  onAction,
}) => {
  return (
    <div className="empty-state-card" role="status">
      <div className="empty-icon-wrap" aria-hidden="true">
        <Icon size={36} className="empty-icon" />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{message}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn-outline empty-action-btn"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

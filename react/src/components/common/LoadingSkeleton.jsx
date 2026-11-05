import React from 'react';
import './LoadingSkeleton.css';

/**
 * LoadingSkeleton:
 * Accessible skeleton screen component mimicking event cards, detail layouts, or lists
 */
export const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  return (
    <div
      className={`skeleton-grid skeleton-${type}`}
      role="status"
      aria-label="Loading content..."
      aria-busy="true"
    >
      <span className="sr-only">Loading content, please wait...</span>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card" aria-hidden="true">
          {type === 'card' && (
            <>
              <div className="skeleton-box skeleton-image" />
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-tag" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-meta" />
                <div className="skeleton-line skeleton-text" />
                <div className="skeleton-line skeleton-btn" />
              </div>
            </>
          )}

          {type === 'detail' && (
            <div className="skeleton-detail-layout">
              <div className="skeleton-box skeleton-banner" />
              <div className="skeleton-line skeleton-title-lg" />
              <div className="skeleton-line skeleton-meta" />
              <div className="skeleton-line skeleton-text-full" />
              <div className="skeleton-line skeleton-text-full" />
              <div className="skeleton-line skeleton-text-half" />
            </div>
          )}

          {type === 'list' && (
            <div className="skeleton-list-row">
              <div className="skeleton-avatar" />
              <div className="skeleton-list-text">
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-meta" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import './ErrorState.css';

export const ErrorState = ({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while communicating with the ITC API. Please check your network or try again.',
  onRetry,
  retryLabel = '« Try again »'
}) => {
  return (
    <div className="error-state-card" role="alert" aria-live="assertive">
      <div className="error-icon-wrap" aria-hidden="true">
        <AlertCircle size={36} className="error-icon" />
      </div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-primary error-retry-btn"
          aria-label="Retry loading data"
        >
          <RotateCcw size={16} aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;

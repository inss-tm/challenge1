import React, { useState } from 'react';
import { Bug, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { toggleSimulatedFailure, isSimulatedFailure, API_BASE_URL } from '../../services/api.js';
import './DevTools.css';

export const DevTools = () => {
  const [open, setOpen] = useState(false);
  const [isFailing, setIsFailing] = useState(isSimulatedFailure());

  const handleToggleFailure = () => {
    const next = toggleSimulatedFailure();
    setIsFailing(next);
  };

  return (
    <div className="devtools-container">
      {open ? (
        <div className="devtools-panel fade-in" role="complementary" aria-label="Dev State Tester">
          <div className="devtools-header">
            <span className="devtools-title">API & State Testing Helper</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="devtools-close"
              aria-label="Close Testing Panel"
            >
              ✕
            </button>
          </div>
          <div className="devtools-body">
            <div className="devtools-row">
              <span className="devtools-label">API Base URL:</span>
              <code className="devtools-code">{API_BASE_URL}</code>
            </div>

            <div className="devtools-row">
              <span className="devtools-label">Simulate API Error:</span>
              <button
                type="button"
                onClick={handleToggleFailure}
                className={`btn btn-sm ${isFailing ? 'btn-primary' : 'btn-outline'}`}
                title="Toggles simulated network error to test the Error State and « Try again » button"
              >
                {isFailing ? <AlertTriangle size={14} /> : null}
                <span>{isFailing ? 'Failure Mode: ON' : 'Failure Mode: OFF'}</span>
              </button>
            </div>
            <p className="devtools-hint">
              Turn "Failure Mode ON" and refresh any page or click « Try again » to test error recovery!
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`devtools-badge ${isFailing ? 'badge-failing' : ''}`}
          title="Open API & State Testing Helper"
          aria-label="Open API State Testing Helper"
        >
          <Bug size={14} aria-hidden="true" />
          <span>Test 3-States</span>
        </button>
      )}
    </div>
  );
};

export default DevTools;

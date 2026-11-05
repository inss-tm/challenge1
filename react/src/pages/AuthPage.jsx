import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, Lock, Mail, User, Hash, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPage.css';

export const AuthPage = ({ initialMode = 'login' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, login, register, logout } = useAuth();

  // Determine current mode from path or prop
  const pathMode = location.pathname === '/register' ? 'register' : (location.pathname === '/login' ? 'login' : initialMode);
  const [mode, setMode] = useState(pathMode);

  const from = location.state?.from?.pathname || '/events';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    agreeTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync mode with route changes (e.g. clicking Join in header switches directly to register)
  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('register');
      setFieldErrors({});
      setFormSubmitError(null);
    } else if (location.pathname === '/login') {
      setMode('login');
      setFieldErrors({});
      setFormSubmitError(null);
    }
  }, [location.pathname]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = 'Email address is required.';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters long.';
    if (mode === 'register') {
      if (!formData.fullName.trim()) errors.fullName = 'Full name is required.';
      if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords do not match.';
      if (!formData.agreeTerms) errors.agreeTerms = 'You must accept the ITC member code of conduct.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await register({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          studentId: formData.studentId.trim(),
        });
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setFormSubmitError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFieldErrors({});
    setFormSubmitError(null);
    navigate(newMode === 'register' ? '/register' : '/login', { replace: true });
  };

  // If user is already logged in and visits login/register, give them options
  if (user) {
    return (
      <div className="auth-page-root">
        <div className="container auth-container">
          <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
            <div className="auth-brand-badge" aria-hidden="true" style={{ margin: '0 auto 1rem' }}>ITC</div>
            <h1 className="auth-title">Already Signed In</h1>
            <p className="auth-subtitle">
              You are currently authenticated as <strong>{user.name}</strong> ({user.email}).
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/events" className="btn btn-primary">
                Browse Events
              </Link>
              <Link to="/my-events" className="btn btn-outline">
                My Registrations
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setMode(pathMode);
                }}
                className="btn btn-outline-red"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-root">
      <div className="container auth-container">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <div className="auth-brand-badge" aria-hidden="true">ITC</div>
            <h1 className="auth-title">
              {mode === 'login'
                ? t('auth.signInTitle', 'Sign In to ITC Portal')
                : t('auth.joinTitle', 'Create Member Account')}
            </h1>
            <p className="auth-subtitle">
              {mode === 'login'
                ? t('auth.signInSubtitle', 'Welcome back! Enter your member credentials to access event passes and AI tools.')
                : t('auth.joinSubtitle', 'Join 850+ tech students for free workshops, hackathons, and mentorship.')}
            </p>

            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`}
                onClick={() => switchMode('login')}
              >
                <LogIn size={16} aria-hidden="true" />
                <span>{t('auth.loginBtn', 'Sign In')}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                className={`auth-tab ${mode === 'register' ? 'auth-tab-active' : ''}`}
                onClick={() => switchMode('register')}
              >
                <UserPlus size={16} aria-hidden="true" />
                <span>{t('nav.join', 'Join ITC')}</span>
              </button>
            </div>
          </div>

          {formSubmitError && (
            <div className="form-alert-error" role="alert" aria-live="assertive">
              <AlertCircle size={18} className="text-red" aria-hidden="true" />
              <span>{formSubmitError}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="reg-fullname" className="form-label">
                  <span>{t('auth.nameLabel', 'Full Name')}<span className="required-star">*</span></span>
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" aria-hidden="true" />
                  <input
                    id="reg-fullname"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. Jordan Reed"
                    className={`form-input input-pad-left ${fieldErrors.fullName ? 'has-error' : ''}`}
                    autoComplete="name"
                  />
                </div>
                {fieldErrors.fullName && (
                  <div className="form-error" role="alert">
                    <AlertCircle size={14} aria-hidden="true" />
                    <span>{fieldErrors.fullName}</span>
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email" className="form-label">
                <span>{t('auth.emailLabel', 'Email Address')}<span className="required-star">*</span></span>
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="student@university.edu"
                  className={`form-input input-pad-left ${fieldErrors.email ? 'has-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="reg-studentid" className="form-label">
                  <span>Student ID / Major (Optional)</span>
                </label>
                <div className="input-with-icon">
                  <Hash size={18} className="input-icon" aria-hidden="true" />
                  <input
                    id="reg-studentid"
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    placeholder="e.g. CS-2026 or ITC-8891"
                    className="form-input input-pad-left"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <div className="form-label">
                <span>{t('auth.passwordLabel', 'Password')}<span className="required-star">*</span></span>
                <span className="form-hint">Min. 8 characters</span>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" aria-hidden="true" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  className={`form-input input-pad-left input-pad-right ${fieldErrors.password ? 'has-error' : ''}`}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="reg-confirm-password" className="form-label">
                  <span>Confirm Password<span className="required-star">*</span></span>
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" aria-hidden="true" />
                  <input
                    id="reg-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`form-input input-pad-left ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
                    autoComplete="new-password"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <div className="form-error" role="alert">
                    <AlertCircle size={14} aria-hidden="true" />
                    <span>{fieldErrors.confirmPassword}</span>
                  </div>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div className="form-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span>I agree to the ITC Club Code of Conduct and member guidelines.</span>
                </label>
                {fieldErrors.agreeTerms && (
                  <div className="form-error" role="alert">
                    <AlertCircle size={14} aria-hidden="true" />
                    <span>{fieldErrors.agreeTerms}</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg auth-submit-btn"
            >
              {isSubmitting ? 'Authenticating...' : mode === 'login' ? (
                <><LogIn size={18} aria-hidden="true" /><span>{t('auth.loginBtn', 'Sign In')}</span></>
              ) : (
                <><UserPlus size={18} aria-hidden="true" /><span>{t('auth.registerBtn', 'Create Account')}</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

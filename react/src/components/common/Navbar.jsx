import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import { 
  Menu, 
  X, 
  Calendar, 
  Home as HomeIcon, 
  MessageSquare, 
  LogOut, 
  LogIn, 
  Ticket
} from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header" role="banner">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu} aria-label="ITC Home">
          <div className="brand-badge" aria-hidden="true">ITC</div>
          <div className="brand-text">
            <span className="brand-name">ITC PORTAL</span>
            <span className="brand-sub">Information Technology Club</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" role="navigation" aria-label="Main Navigation">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            end
          >
            <HomeIcon size={17} aria-hidden="true" />
            <span>{t('nav.home', 'Home')}</span>
          </NavLink>

          <NavLink 
            to="/events" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <Calendar size={17} aria-hidden="true" />
            <span>{t('nav.events', 'Events')}</span>
          </NavLink>

          <NavLink 
            to="/chat" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <MessageSquare size={17} aria-hidden="true" />
            <span>{t('nav.chat', 'AI Assistant')}</span>
            <span className="nav-ai-badge" aria-label="AI powered">AI</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink 
              to="/my-events" 
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <Ticket size={17} aria-hidden="true" />
              <span>{t('nav.myEvents', 'My Registrations')}</span>
            </NavLink>
          )}
        </nav>

        {/* Actions: Language Selector + Auth */}
        <div className="navbar-actions">
          <LanguageSelector />

          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-info" title={`Logged in as ${user.email}`}>
                <div className="user-avatar" aria-hidden="true">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div className="user-details">
                  <span className="user-greeting">{t('nav.welcome', 'Welcome')},</span>
                  <span className="user-name">{user.name}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline-red btn-sm btn-logout"
                aria-label="Log out of your account"
              >
                <LogOut size={15} aria-hidden="true" />
                <span className="btn-logout-text">{t('nav.logout', 'Log Out')}</span>
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={15} aria-hidden="true" />
                <span>{t('nav.signIn', 'Sign In')}</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>{t('nav.join', 'Join ITC')}</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div 
        id="mobile-navigation" 
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-nav-inner">
          {isAuthenticated && (
            <div className="mobile-user-card">
              <div className="user-avatar" aria-hidden="true">
                {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <div className="user-greeting">{t('nav.welcome', 'Signed in as')}</div>
                <div className="user-name">{user.name}</div>
                <div className="mobile-user-email">{user.email}</div>
              </div>
            </div>
          )}

          <nav className="mobile-nav-links" role="navigation" aria-label="Mobile Navigation">
            <Link to="/" className="mobile-nav-item" onClick={closeMenu}>
              <HomeIcon size={18} aria-hidden="true" />
              <span>{t('nav.home', 'Home')}</span>
            </Link>
            <Link to="/events" className="mobile-nav-item" onClick={closeMenu}>
              <Calendar size={18} aria-hidden="true" />
              <span>{t('nav.events', 'Browse Events')}</span>
            </Link>
            <Link to="/chat" className="mobile-nav-item" onClick={closeMenu}>
              <MessageSquare size={18} aria-hidden="true" />
              <span>{t('nav.chat', 'ITC AI Assistant')}</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-events" className="mobile-nav-item" onClick={closeMenu}>
                  <Ticket size={18} aria-hidden="true" />
                  <span>{t('nav.myEvents', 'My Registrations')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mobile-nav-item mobile-logout-item"
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>{t('nav.logout', 'Log Out')} ({user.name})</span>
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
                  <LogIn size={16} aria-hidden="true" />
                  <span>{t('nav.signIn', 'Sign In')}</span>
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  <span>{t('nav.join', 'Register')}</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

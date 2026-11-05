import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Heart,
  Globe
} from 'lucide-react';
import { CLUB_INFO } from '../../services/mockData.js';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-root" role="contentinfo">
      <div className="container footer-container">
        {/* Brand & Description */}
        <div className="footer-col footer-brand-col">
          <div className="footer-brand">
            <span className="footer-badge" aria-hidden="true">IT Community</span>
            <span className="footer-brand-title">Information Technology Club</span>
          </div>
          <p className="footer-tagline">{CLUB_INFO.tagline}</p>
          <div className="footer-meta-item">
            <MapPin size={16} className="footer-meta-icon" aria-hidden="true" />
            <span> Saad Dahleb Blida pav 1</span>
          </div>
          <div className="footer-meta-item">
            
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links" role="list">
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/events">Events & Workshops</Link></li>
            <li><Link to="/chat">AI Club Assistant</Link></li>
            <li><Link to="/login">Member Portal</Link></li>
            <li><Link to="/register">Join the Club</Link></li>
          </ul>
        </div>

        {/* Focus Divisions */}
        <div className="footer-col">
          <h4 className="footer-heading">Club Departments</h4>
          <ul className="footer-links" role="list">
            {CLUB_INFO.divisions.map((div, i) => (
              <li key={i}>
                <span className="footer-static-item">{div}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Leadership & Social */}
        <div className="footer-col">
          <h4 className="footer-heading">Connect With Us</h4>
          <p className="footer-contact-text">
            Have questions or want to partner with ITC for hackathons and sponsorships?
          </p>
          <div className="footer-socials">
            {/* GitHub SVG */}
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn" 
              aria-label="ITC on GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            {/* LinkedIn SVG */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn" 
              aria-label="ITC on LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* Twitter / X SVG */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn" 
              aria-label="ITC on Twitter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>

            <a 
              href="mailto:contact@itc-club.org" 
              className="social-btn" 
              aria-label="Email ITC Executive Board"
            >
              <Mail size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="footer-ai-hint">
            <Sparkles size={14} className="text-red" aria-hidden="true" />
            <span>Need instant help? Ask our <Link to="/chat" className="footer-ai-link">AI Assistant</Link></span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Information Technology Club (ITC). All rights reserved.</p>
          <p className="footer-built-with">
            Built with React & Pure CSS • Empowered by ITC Red <span className="footer-red-dot" aria-hidden="true">●</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FolderOpen, Home, Sparkles, User, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user, openModal } = useApp();

  return (
    <nav className="hf-mobile-bottom-nav" aria-label="Mobile quick actions">
      <Link to="/" className={`hf-mob-tab ${location.pathname === '/' ? 'is-active' : ''}`}>
        <Home size={19} />
        <span>Home</span>
      </Link>

      <Link
        to="/community"
        className={`hf-mob-tab ${location.pathname.startsWith('/community') ? 'is-active' : ''}`}
      >
        <Users size={19} />
        <span>Community</span>
      </Link>

      <Link to="/generate" className="hf-mob-create-btn" aria-label="Create with Higgsfield">
        <Sparkles size={20} fill="currentColor" />
      </Link>

      <Link
        to="/ai/image?tab=library"
        className={`hf-mob-tab ${location.pathname.startsWith('/ai/') ? 'is-active' : ''}`}
      >
        <FolderOpen size={19} />
        <span>Library</span>
      </Link>

      <button
        type="button"
        className="hf-mob-tab"
        onClick={() => openModal({ type: 'auth', mode: user ? 'profile' : 'login' })}
      >
        <User size={19} />
        <span>{user ? user.credits : 'Profile'}</span>
      </button>
    </nav>
  );
}

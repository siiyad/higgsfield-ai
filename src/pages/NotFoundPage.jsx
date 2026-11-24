import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Search, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotFoundPage({ attemptedPath }) {
  const { openModal } = useApp();

  return (
    <main className="hf-container hf-subpage" style={{ display: 'grid', placeItems: 'center', minHeight: '64vh' }}>
      <section
        className="hf-studio-panel"
        style={{ maxWidth: 640, width: '100%', textAlign: 'center', alignItems: 'center', padding: 36 }}
      >
        <span className="hf-page-badge">404 &bull; ROUTE NOT FOUND</span>
        <h1 className="hf-page-title" style={{ marginTop: 4 }}>
          Studio Page Not Found
        </h1>
        <p className="hf-page-desc" style={{ maxWidth: 480 }}>
          We couldn&rsquo;t find a studio, model, or creator channel at{' '}
          <code style={{ color: '#d1fe17' }}>{attemptedPath || window.location.pathname}</code>.
        </p>

        <div className="hf-section-actions" style={{ justifyContent: 'center', marginTop: 8 }}>
          <Link to="/" className="hf-cta-lime">
            <ArrowLeft size={14} />
            <span>Back to Explore</span>
          </Link>
          <button
            type="button"
            className="hf-cta-dark"
            onClick={() => openModal({ type: 'search' })}
          >
            <Search size={14} />
            <span>Search Models &amp; Studios</span>
          </button>
          <Link to="/generate" className="hf-cta-dark">
            <Sparkles size={14} />
            <span>Cinema Studio 4.0</span>
          </Link>
          <Link to="/community" className="hf-cta-dark">
            <Compass size={14} />
            <span>Community Gallery</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

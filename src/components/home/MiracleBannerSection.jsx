import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MiracleBannerSection() {
  const { openModal, waitlistJoined } = useApp();

  return (
    <section className="hf-container">
      <div className="hf-miracle-banner" aria-labelledby="home-miracle-title">
        <div className="hf-miracle-glow" aria-hidden="true">
          <img src="https://static.higgsfield.ai/miracle/glow-outer.svg" alt="" width="1600" height="460" />
          <img src="https://static.higgsfield.ai/miracle/glow-inner.svg" alt="" width="1100" height="320" />
          <img src="https://static.higgsfield.ai/miracle/glow-core.svg" alt="" width="680" height="310" />
        </div>

        <div className="hf-miracle-inner">
          <div className="hf-miracle-wordmark" id="home-miracle-title">
            <img
              src="https://static.higgsfield.ai/miracle/higgsfield.svg"
              alt="Higgsfield"
              className="hf-miracle-brand"
            />
            <img
              src="https://static.higgsfield.ai/miracle/miracle-upd.svg"
              alt="Miracle"
              className="hf-miracle-title"
            />
          </div>

          <p className="hf-miracle-sub">New level proprietary editing technology</p>

          <div className="hf-miracle-actions">
            <Link to="/mcp" className="hf-cta-white">
              Connect Higgsfield MCP
            </Link>
            <button
              type="button"
              className="hf-cta-dark"
              onClick={() => openModal({ type: 'waitlist' })}
            >
              {waitlistJoined ? (
                <>
                  <Check size={14} color="#d1fe17" />
                  <span>Waitlist Joined</span>
                </>
              ) : (
                'Join the waitlist'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

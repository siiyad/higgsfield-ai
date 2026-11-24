import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Maximize2 } from 'lucide-react';
import { FABLE_USE_CASES } from '../../data/showcase';
import { FABLE_BLOG_SLUGS } from '../../data/catalog';
import { useApp } from '../../context/AppContext';

function FableUseCaseCard({ item }) {
  const { openModal } = useApp();
  const videoRef = useRef(null);
  const blogSlug = FABLE_BLOG_SLUGS[item.id] || 'build-a-browser-mmo-with-claude-fable-5-2';
  const blogUrl = `/@higgsfield.studio/blogs/${blogSlug}`;

  return (
    <article
      className="hf-fable-card"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      <img src={item.poster} alt={item.title} loading="lazy" />
      <video
        ref={videoRef}
        src={item.video}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="none"
      />
      <div className="hf-fable-card__scrim" />

      <Link
        to={blogUrl}
        className="hf-card-hitarea"
        aria-label={item.title}
      />

      <button
        type="button"
        className="hf-project-quick-btn"
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 5 }}
        onClick={() => openModal({ type: 'inspector', item })}
        title="Quick preview video & prompt"
        aria-label={`Quick preview ${item.title}`}
      >
        <Maximize2 size={12} />
      </button>

      <div className="hf-fable-card__meta">
        <h3 className="hf-fable-card__title">{item.title}</h3>
        <div className="hf-fable-tags">
          {item.tags.map((tag) => (
            <span key={tag} className="hf-fable-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function FableBannerSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="hf-container">
      <div className="hf-fable-stage">
        <div className="hf-fable-glow" aria-hidden="true">
          <img
            src="https://static.higgsfield.ai/mcp/home-fable-banner-20261110/fable-fdf96.svg"
            alt=""
            width="920"
            height="280"
          />
        </div>

        <div className="hf-fable-header">
          <h2 className="hf-fable-lockup">
            <span>CLAUDE</span>
            <svg className="hf-claude-star" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2V22M3.34 7L20.66 17M20.66 7L3.34 17M2 12H22M6.2 4.6L17.8 19.4M17.8 4.6L6.2 19.4"
                stroke="#d97757"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            <span>FABLE 5.2</span>
          </h2>
          <p className="hf-fable-sub">WITH HIGGSFIELD MCP</p>

          <div className="hf-fable-ctas">
            <Link to="/mcp" className="hf-cta-lime">
              Connect Higgsfield MCP
            </Link>
            <Link to="/mcp?tab=claude#workflows" className="hf-cta-dark">
              Explore use cases
            </Link>
          </div>
        </div>

        <div className={`hf-fable-grid-wrap ${expanded ? '' : 'is-collapsed'}`}>
          <div className="hf-fable-grid">
            {FABLE_USE_CASES.map((item) => (
              <FableUseCaseCard key={item.id} item={item} />
            ))}
          </div>

          {!expanded && (
            <div className="hf-fable-see-all-overlay">
              <button
                type="button"
                className="hf-fable-see-all-btn"
                onClick={() => setExpanded(true)}
              >
                <span>See all</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        {expanded && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <button
              type="button"
              className="hf-fable-see-all-btn"
              onClick={() => setExpanded(false)}
            >
              Show fewer
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

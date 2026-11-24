import React, { useRef, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import { SHORTS_PRESETS } from '../../data/showcase';
import { useApp } from '../../context/AppContext';
import SectionHeader from '../common/SectionHeader';
import FloatingCtaPill from '../common/FloatingCtaPill';

function ShortsCard({ item }) {
  const { openModal, likedIds, toggleLike } = useApp();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [previewRefMode, setPreviewRefMode] = useState(false);
  const isLiked = likedIds.includes(item.id);

  const displayedImg = previewRefMode && item.refPoster ? item.refPoster : item.poster;

  return (
    <article
      className="hf-shorts-card"
      onMouseEnter={() => {
        setHovering(true);
        if (!previewRefMode) videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovering(false);
        videoRef.current?.pause();
      }}
    >
      <img
        src={displayedImg}
        alt={item.title}
        className="hf-shorts-poster"
        loading="lazy"
        decoding="async"
      />
      <video
        ref={videoRef}
        src={hovering && !previewRefMode ? item.video : undefined}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="none"
        style={{ opacity: hovering && !previewRefMode ? 1 : 0 }}
      />
      <div className="hf-shorts-scrim" />

      <button
        type="button"
        className="hf-card-hitarea"
        onClick={() => openModal({ type: 'inspector', item })}
        aria-label={`View ${item.title}`}
      />

      {previewRefMode && (
        <span
          style={{
            position: 'absolute',
            top: 9,
            left: 9,
            zIndex: 4,
            padding: '3px 7px',
            borderRadius: 6,
            background: '#d1fe17',
            color: '#101214',
            fontSize: 10,
            fontWeight: 800,
            pointerEvents: 'none',
          }}
        >
          INPUT REF
        </span>
      )}

      <div className="hf-shorts-footer">
        <div className="hf-shorts-stats">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Eye size={13} />
            {item.views}
          </span>
          <button
            type="button"
            className={`hf-shorts-stat-btn ${isLiked ? 'is-liked' : ''}`}
            onClick={() => toggleLike(item.id)}
            aria-label={`Like ${item.title}`}
          >
            <Heart size={13} fill={isLiked ? '#ff4477' : 'none'} />
            <span>{item.likes}</span>
          </button>
        </div>

        {item.refPoster && (
          <button
            type="button"
            className="hf-shorts-pip"
            style={{
              borderColor: previewRefMode ? '#d1fe17' : 'rgba(255,255,255,0.65)',
            }}
            onClick={() => setPreviewRefMode((prev) => !prev)}
            title={previewRefMode ? 'Show generated video' : 'Preview reference image'}
            aria-label={`Preview ${item.title}`}
          >
            <img src={previewRefMode ? item.poster : item.refPoster} alt="" loading="lazy" />
          </button>
        )}
      </div>
    </article>
  );
}

export default function ShortsStudioSection() {
  return (
    <section className="hf-container hf-section" aria-label="Higgsfield Shorts Studio">
      <SectionHeader
        title="Higgsfield Shorts Studio"
        subtitle="Make new viral shorts or recreate the ones already trending, with your character, voice, and style."
        to="/shorts-studio"
      />

      <div className="hf-gallery-clip" style={{ maxHeight: 860 }}>
        <div className="hf-shorts-grid">
          {SHORTS_PRESETS.map((preset) => (
            <ShortsCard key={preset.id} item={preset} />
          ))}
        </div>
        <FloatingCtaPill label="View all presets" to="/shorts-studio" />
      </div>
    </section>
  );
}

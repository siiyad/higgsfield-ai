import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MediaCard({ item, className = '', onClick }) {
  const { openModal } = useApp();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageSrc = item.poster || item.img;
  const videoSrc = item.video;

  const handleMouseEnter = () => {
    setHovering(true);
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(item);
      return;
    }
    openModal({ type: 'inspector', item });
  };

  return (
    <article
      className={`hf-media-card ${hovering && videoSrc ? 'is-playing' : ''} ${className}`}
      style={{ aspectRatio: item.aspect || '16/9' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={item.title || `${item.model} preview`}
    >
      <div className={`hf-media-card__media ${!loaded ? 'hf-skeleton' : ''}`}>
        <img
          src={imageSrc}
          alt={item.title || item.prompt || item.model}
          loading="lazy"
          decoding="async"
          className="hf-media-card__img"
          onLoad={() => setLoaded(true)}
        />
        {videoSrc && (
          <video
            ref={videoRef}
            src={hovering ? videoSrc : undefined}
            poster={imageSrc}
            muted
            loop
            playsInline
            preload="none"
            className="hf-media-card__video"
          />
        )}
        <div className="hf-media-card__hover-bar">
          <span className="hf-media-card__prompt-snippet">
            {item.title || item.prompt || item.model}
          </span>
          {videoSrc && <Play size={12} color="#d1fe17" fill="#d1fe17" />}
        </div>
      </div>
    </article>
  );
}

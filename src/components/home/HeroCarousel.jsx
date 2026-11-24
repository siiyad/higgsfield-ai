import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_CARDS } from '../../data/showcase';

function HeroSlide({ card }) {
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  const handleEnter = () => {
    setHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <Link
      to={card.to}
      className="hf-hero-slide"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="hf-hero-card-media">
        <img
          src={card.img}
          alt={card.title}
          loading="eager"
          decoding="async"
        />
        {card.video && (
          <video
            ref={videoRef}
            src={hovering ? card.video : undefined}
            poster={card.img}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </div>
      <div>
        <h2 className="hf-hero-slide__title">{card.title}</h2>
        <p className="hf-hero-slide__sub">{card.subtitle}</p>
      </div>
    </Link>
  );
}

export default function HeroCarousel() {
  const trackRef = useRef(null);

  const scrollTrack = (direction) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction * 482,
      behavior: 'smooth',
    });
  };

  return (
    <section className="hf-container hf-hero-section" aria-label="Featured releases carousel">
      <div className="hf-hero-viewport">
        <button
          type="button"
          className="hf-carousel-arrow hf-carousel-arrow--prev"
          onClick={() => scrollTrack(-1)}
          aria-label="Previous hero slide"
        >
          <ChevronLeft size={18} />
        </button>

        <div ref={trackRef} className="hf-hero-track no-scrollbar">
          {HERO_CARDS.map((card) => (
            <HeroSlide key={card.id} card={card} />
          ))}
        </div>

        <button
          type="button"
          className="hf-carousel-arrow hf-carousel-arrow--next"
          onClick={() => scrollTrack(1)}
          aria-label="Next hero slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

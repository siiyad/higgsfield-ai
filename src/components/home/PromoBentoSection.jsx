import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { BENTO_QUICK_CARDS, PROMO_BANNER } from '../../data/showcase';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';

function ClaudeMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2V22M3.34 7L20.66 17M20.66 7L3.34 17M2 12H22M6.2 4.6L17.8 19.4M17.8 4.6L6.2 19.4"
        stroke="#d97757"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PromoBentoSection() {
  const { openModal } = useApp();

  return (
    <section className="hf-container hf-promo-bento" aria-label="Discount and quick launch shortcuts">
      <div className="hf-promo-card">
        <video
          className="hf-promo-card__bg"
          src={PROMO_BANNER.video}
          poster={PROMO_BANNER.poster}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hf-promo-card__scrim" />

        <div className="hf-promo-card__content">
          <h2 className="hf-promo-card__title">
            {PROMO_BANNER.headlineTop}
            <span>{PROMO_BANNER.headlineAccent}</span>
          </h2>
          <ul className="hf-promo-perks">
            {PROMO_BANNER.perks.map((perk) => (
              <li key={perk}>
                <Check size={14} color="#d1fe17" style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="hf-promo-card__cta"
          onClick={() => openModal({ type: 'auth', mode: 'discount' })}
        >
          <span className="hf-hide-mobile">{PROMO_BANNER.ctaText}</span>
          <span className="hf-mobile-only">{PROMO_BANNER.mobileCtaText}</span>
        </button>
      </div>

      <div className="hf-bento-grid">
        {BENTO_QUICK_CARDS.map((card) => (
          <Link key={card.id} to={card.to} className="hf-bento-item">
            <div className="hf-bento-item__top">
              <div className="hf-bento-icon">
                {card.iconUrl ? (
                  <img src={card.iconUrl} alt="" />
                ) : card.iconType === 'claude' ? (
                  <ClaudeMark size={19} />
                ) : card.iconType === 'sparkle' ? (
                  <Sparkles size={17} color="#e5e7eb" />
                ) : (
                  <BrandLogo size={17} />
                )}
              </div>
              {card.badge && <span className="hf-bento-new">{card.badge}</span>}
            </div>
            <div>
              <h3 className="hf-bento-item__title">{card.title}</h3>
              <p className="hf-bento-item__desc">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

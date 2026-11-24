import React from 'react';
import { Link } from 'react-router-dom';

export default function ContestBannerSection() {
  return (
    <section className="hf-container">
      <div className="hf-contest-banner" aria-labelledby="contest-banner-heading">
        <div className="hf-contest-left">
          <h2 id="contest-banner-heading" className="sr-only" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
            $1,000,000 Community Contest
          </h2>
          <div className="hf-contest-prize-row">
            <img
              src="https://static.higgsfield.ai/community-contest/banner-laurel-20261111a.webp"
              alt=""
              className="hf-contest-laurel"
            />
            <span className="hf-contest-amount">$1 000 000</span>
            <img
              src="https://static.higgsfield.ai/community-contest/banner-laurel-20261111a.webp"
              alt=""
              className="hf-contest-laurel hf-contest-laurel--right"
            />
          </div>

          <p className="hf-contest-copy">
            A new contest is coming soon&mdash;find out
            <br />
            how to win $1,000,000
          </p>

          <Link to="/contests/community-contest" className="hf-cta-white">
            See details
          </Link>
        </div>

        <div className="hf-contest-right" aria-hidden="true">
          <img
            src="https://static.higgsfield.ai/community-contest/hero-bg-20261109-poster.webp"
            alt=""
            className="hf-contest-bg-burst"
          />
          <div className="hf-contest-wordmark-stack">
            <img
              src="https://static.higgsfield.ai/community-contest/hero-wordmark-x-chrome-20261111a.webp"
              alt=""
              className="hf-contest-wordmark-x"
            />
            <img
              src="https://static.higgsfield.ai/community-contest/hero-wordmark-words-chrome-20261111a.webp"
              alt=""
              className="hf-contest-wordmark-words"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

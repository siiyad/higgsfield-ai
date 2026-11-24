import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURE_PILLS } from '../../data/navigation';

export default function ExploreMoreFeaturesSection() {
  return (
    <section className="hf-container hf-features-band" aria-label="Explore more AI features">
      <h2 className="hf-features-heading">EXPLORE MORE AI FEATURES</h2>
      <div className="hf-feature-pills">
        {FEATURE_PILLS.map((pill) => (
          <Link key={pill.label} to={pill.to} className="hf-feature-pill">
            {pill.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

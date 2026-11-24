import React from 'react';
import { SOUL_CINEMA_ITEMS } from '../../data/showcase';
import SectionHeader from '../common/SectionHeader';
import MediaCard from '../common/MediaCard';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function SoulCinemaSection() {
  return (
    <section className="hf-container hf-section" aria-label="Higgsfield Soul Cinema">
      <SectionHeader
        title="Higgsfield Soul Cinema"
        subtitle="Explore Higgsfield Community gallery for stunning Higgsfield Soul Cinema creations."
        to="/generate?mode=soul-cinema"
      />

      <div className="hf-gallery-clip" style={{ maxHeight: 740 }}>
        <div className="hf-projects-grid">
          {SOUL_CINEMA_ITEMS.map((item) => (
            <MediaCard key={item.id} item={{ ...item, aspect: '16/9' }} />
          ))}
        </div>
        <FloatingCtaPill label="View all of Higgsfield Soul Cinema" to="/generate?mode=soul-cinema" />
      </div>
    </section>
  );
}

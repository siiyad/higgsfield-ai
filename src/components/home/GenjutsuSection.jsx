import React from 'react';
import { Link } from 'react-router-dom';
import { GENJUTSU_ITEMS } from '../../data/showcase';
import SectionHeader from '../common/SectionHeader';
import MasonryGrid from '../common/MasonryGrid';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function GenjutsuSection() {
  return (
    <section className="hf-container hf-section" aria-label="Higgsfield Genjutsu by Community">
      <SectionHeader
        title="Higgsfield Genjutsu by Community"
        subtitle="Take the motion and recast it with your characters, locations, and products, or swap specific elements while keeping the rest untouched."
        to="/ai/video?model=genjutsu"
        actions={
          <>
            <Link to="/ai/video?model=genjutsu" className="hf-cta-lime">
              Start generating
            </Link>
            <Link to="/ai/video?model=genjutsu&tab=guide" className="hf-cta-white">
              Learn more
            </Link>
          </>
        }
      />

      <div className="hf-gallery-clip hf-gallery-clip--masonry">
        <MasonryGrid items={GENJUTSU_ITEMS} desktopCols={6} />
        <FloatingCtaPill label="View all presets" to="/higgsfield-genjutsu-presets" />
      </div>
    </section>
  );
}

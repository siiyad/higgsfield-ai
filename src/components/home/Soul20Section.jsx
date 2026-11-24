import React from 'react';
import { SOUL_20_ITEMS } from '../../data/showcase';
import SectionHeader from '../common/SectionHeader';
import MasonryGrid from '../common/MasonryGrid';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function Soul20Section() {
  return (
    <section className="hf-container hf-section" aria-label="Higgsfield Soul 2.0">
      <SectionHeader
        title="Higgsfield Soul 2.0"
        subtitle="Explore Higgsfield Community gallery for stunning Higgsfield Soul 2.0 creations."
        to="/ai/image?model=soul_2_0"
      />

      <div className="hf-gallery-clip hf-gallery-clip--masonry">
        <MasonryGrid items={SOUL_20_ITEMS} desktopCols={4} />
        <FloatingCtaPill label="View all of Higgsfield Soul 2.0" to="/ai/image?model=soul_2_0" />
      </div>
    </section>
  );
}

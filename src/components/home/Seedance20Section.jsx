import React from 'react';
import { SEEDANCE_20_ITEMS } from '../../data/showcase';
import SectionHeader from '../common/SectionHeader';
import MasonryGrid from '../common/MasonryGrid';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function Seedance20Section() {
  return (
    <section className="hf-container hf-section" aria-label="Seedance 2.0 Showcase">
      <SectionHeader
        title="Seedance 2.0"
        subtitle="See what creators are making with Seedance 2.0."
        to="/ai/video?model=seedance_2_0"
      />

      <div className="hf-gallery-clip hf-gallery-clip--masonry">
        <MasonryGrid items={SEEDANCE_20_ITEMS} desktopCols={4} />
        <FloatingCtaPill label="View all of Seedance 2.0" to="/ai/video?model=seedance_2_0" />
      </div>
    </section>
  );
}

import React from 'react';
import { SEEDANCE_25_ITEMS } from '../../data/showcase';
import SectionHeader from '../common/SectionHeader';
import MasonryGrid from '../common/MasonryGrid';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function Seedance25Section() {
  return (
    <section className="hf-container hf-section" aria-label="Seedance 2.5 Showcase">
      <SectionHeader
        title="Seedance 2.5"
        subtitle="Frontier video generation with photoreal faces, physics &amp; multi-shot control."
        to="/ai/video?model=seedance_2_5"
      />

      <div className="hf-gallery-clip hf-gallery-clip--masonry">
        <MasonryGrid items={SEEDANCE_25_ITEMS} desktopCols={4} />
        <FloatingCtaPill label="View all of Seedance 2.5" to="/ai/video?model=seedance_2_5" />
      </div>
    </section>
  );
}

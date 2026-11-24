import React from 'react';
import { MARKETING_ITEMS } from '../../data/showcase';
import SectionHeader from '../common/SectionHeader';
import MasonryGrid from '../common/MasonryGrid';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function MarketingStudioSection() {
  return (
    <section className="hf-container hf-section" aria-label="Marketing Studio Showcase">
      <SectionHeader
        title="Marketing Studio"
        subtitle="See what creators and brands are making with Marketing Studio."
        to="/marketing-studio"
      />

      <div className="hf-gallery-clip hf-gallery-clip--masonry">
        <MasonryGrid items={MARKETING_ITEMS} desktopCols={4} />
        <FloatingCtaPill label="View all of Marketing Studio" to="/marketing-studio" />
      </div>
    </section>
  );
}

import React from 'react';
import { GPT_IMAGE_2_ITEMS } from '../../data/showcase';
import SectionHeader from '../common/SectionHeader';
import MasonryGrid from '../common/MasonryGrid';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function GptImage2Section() {
  return (
    <section className="hf-container hf-section" aria-label="GPT Image 2 Showcase">
      <SectionHeader
        title="GPT Image 2"
        subtitle="See what creators are making with GPT Image 2."
        to="/ai/image?model=gpt_image_2"
      />

      <div className="hf-gallery-clip hf-gallery-clip--masonry">
        <MasonryGrid items={GPT_IMAGE_2_ITEMS} desktopCols={4} />
        <FloatingCtaPill label="View all of GPT Image 2" to="/ai/image?model=gpt_image_2" />
      </div>
    </section>
  );
}

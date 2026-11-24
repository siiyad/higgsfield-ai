import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import PromoBentoSection from '../components/home/PromoBentoSection';
import FableBannerSection from '../components/home/FableBannerSection';
import MiracleBannerSection from '../components/home/MiracleBannerSection';
import ContestBannerSection from '../components/home/ContestBannerSection';
import ShortsStudioSection from '../components/home/ShortsStudioSection';
import GenjutsuSection from '../components/home/GenjutsuSection';
import InsideProjectsSection from '../components/home/InsideProjectsSection';
import Seedance25Section from '../components/home/Seedance25Section';
import GptImage2Section from '../components/home/GptImage2Section';
import CanvasBannerSection from '../components/home/CanvasBannerSection';
import MarketingStudioSection from '../components/home/MarketingStudioSection';
import Seedance20Section from '../components/home/Seedance20Section';
import PhotodumpBannerSection from '../components/home/PhotodumpBannerSection';
import SoulCinemaSection from '../components/home/SoulCinemaSection';
import Soul20Section from '../components/home/Soul20Section';
import ExploreMoreFeaturesSection from '../components/home/ExploreMoreFeaturesSection';

export default function HomePage() {
  return (
    <main>
      <h1 className="sr-only">
        Higgsfield — AI-Native Creative Suite for Video, Image, Audio and MCP
      </h1>
      <HeroCarousel />
      <PromoBentoSection />
      <FableBannerSection />
      <MiracleBannerSection />
      <ContestBannerSection />
      <ShortsStudioSection />
      <GenjutsuSection />
      <InsideProjectsSection />
      <Seedance25Section />
      <GptImage2Section />
      <CanvasBannerSection />
      <MarketingStudioSection />
      <Seedance20Section />
      <PhotodumpBannerSection />
      <SoulCinemaSection />
      <Soul20Section />
      <ExploreMoreFeaturesSection />
    </main>
  );
}

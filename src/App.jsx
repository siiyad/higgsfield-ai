import React, { Component, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import CookieBanner from './components/layout/CookieBanner';
import ModalHost from './components/modals/ModalHost';
import HomePage from './pages/HomePage';

const StudioPage = lazy(() => import('./pages/StudioPage'));
const AudioPage = lazy(() => import('./pages/AudioPage'));
const AgentWorkspacePage = lazy(() => import('./pages/AgentWorkspacePage'));
const InfluencerAndEffectsPage = lazy(() => import('./pages/InfluencerAndEffectsPage'));
const DeveloperApiPage = lazy(() => import('./pages/DeveloperApiPage'));
const CanvasPage = lazy(() => import('./pages/CanvasPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const DetailAndInfoPage = lazy(() => import('./pages/DetailAndInfoPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected workspace error' };
  }

  handleReset = () => {
    try {
      ['hf_user', 'hf_lang', 'hf_likes', 'hf_generations', 'hf_waitlist', 'hf_cookies'].forEach((k) =>
        window.localStorage.removeItem(k)
      );
    } catch {
      /* ignore */
    }
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="hf-container"
          style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}
        >
          <div className="hf-studio-panel" style={{ maxWidth: 520, textAlign: 'center', alignItems: 'center' }}>
            <span className="hf-page-badge">WORKSPACE RECOVERY</span>
            <h1 className="hf-page-title" style={{ fontSize: 28 }}>Something went wrong</h1>
            <p className="hf-page-desc">{this.state.errorMessage}</p>
            <button type="button" className="hf-cta-lime" onClick={this.handleReset}>
              Reset Workspace &amp; Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function LocalizedHome({ lang }) {
  const { setRouteLangOverride } = useApp();
  useEffect(() => {
    setRouteLangOverride(lang || null);
    return () => setRouteLangOverride(null);
  }, [lang, setRouteLangOverride]);
  return <HomePage />;
}

function RouteFallback() {
  return (
    <main className="hf-container hf-subpage" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <div className="hf-chip is-active">Loading creative workspace...</div>
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <ScrollToTop />
          <div className="hf-page-shell">
            <Header />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Primary Landing & Localized Aliases */}
                <Route path="/" element={<HomePage />} />
                <Route path="/es" element={<LocalizedHome lang="es" />} />
                <Route path="/ko" element={<LocalizedHome lang="ko" />} />

                {/* Core Studio & Creation Workspaces */}
                <Route path="/ai/image" element={<StudioPage />} />
                <Route path="/ai/video" element={<StudioPage />} />
                <Route path="/generate" element={<StudioPage />} />
                <Route path="/studio" element={<Navigate to="/generate" replace />} />
                <Route path="/shorts-studio" element={<StudioPage />} />
                <Route path="/photodump" element={<StudioPage />} />
                <Route path="/mangaka" element={<StudioPage />} />

                {/* Audio & Lipsync Studio */}
                <Route path="/audio" element={<AudioPage />} />

                {/* AI Agents, Ads, Content Factory & Playable Workspaces */}
                <Route path="/ads-studio" element={<AgentWorkspacePage />} />
                <Route path="/marketing-studio" element={<AgentWorkspacePage />} />
                <Route path="/content-factory" element={<AgentWorkspacePage />} />
                <Route path="/playable" element={<AgentWorkspacePage />} />
                <Route path="/supercomputer" element={<AgentWorkspacePage />} />
                <Route path="/start/agent" element={<AgentWorkspacePage />} />

                {/* Influencer, Effects, Layers, Upscale & Mini Apps */}
                <Route path="/ai-influencer-studio" element={<InfluencerAndEffectsPage />} />
                <Route path="/character" element={<InfluencerAndEffectsPage />} />
                <Route path="/effects/use" element={<InfluencerAndEffectsPage />} />
                <Route path="/motion" element={<InfluencerAndEffectsPage />} />
                <Route path="/katana" element={<InfluencerAndEffectsPage />} />
                <Route path="/layers" element={<InfluencerAndEffectsPage />} />
                <Route path="/upscale" element={<InfluencerAndEffectsPage />} />
                <Route path="/apps" element={<InfluencerAndEffectsPage />} />

                {/* Canvas Workflow & Developer Platform (MCP, Open API, NLE Plugins) */}
                <Route path="/canvas" element={<CanvasPage />} />
                <Route path="/mcp" element={<DeveloperApiPage />} />
                <Route path="/higgsfield-api" element={<DeveloperApiPage />} />
                <Route path="/plugins/after-effects" element={<DeveloperApiPage />} />

                {/* Pricing & Enterprise */}
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/enterprise" element={<PricingPage />} />

                {/* Dedicated Feature, Editorial & Community Hubs */}
                <Route path="/profile" element={<DetailAndInfoPage />} />
                <Route path="/academy" element={<DetailAndInfoPage />} />
                <Route path="/contests/community-contest" element={<DetailAndInfoPage />} />
                <Route path="/original-series" element={<DetailAndInfoPage />} />
                <Route path="/miracle" element={<DetailAndInfoPage />} />
                <Route path="/blog" element={<DetailAndInfoPage />} />

                {/* Community Sub-hubs, Legal & Help */}
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/contests" element={<CommunityPage />} />
                <Route path="/higgsfield-genjutsu-presets" element={<CommunityPage />} />
                <Route path="/creator-partnership-program" element={<CommunityPage />} />
                <Route path="/creator-hub/help-center" element={<CommunityPage />} />
                <Route path="/about" element={<CommunityPage />} />
                <Route path="/trust" element={<CommunityPage />} />
                <Route path="/contact" element={<CommunityPage />} />
                <Route path="/terms" element={<CommunityPage />} />
                <Route path="/privacy" element={<CommunityPage />} />

                {/* Redirecting Aliases & Legacy SEO Routes */}
                <Route path="/ai-image" element={<Navigate to="/ai/image" replace />} />
                <Route path="/ai-video" element={<Navigate to="/ai/video" replace />} />
                <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
                <Route path="/terms-of-use-agreement" element={<Navigate to="/terms" replace />} />
                <Route path="/cookie-notice" element={<Navigate to="/privacy" replace />} />
                <Route path="/team-plan" element={<Navigate to="/pricing?plan=team" replace />} />
                <Route path="/api-console" element={<Navigate to="/higgsfield-api" replace />} />
                <Route path="/lipsync-studio" element={<Navigate to="/audio?mode=lipsync" replace />} />
                <Route path="/ai-video-editor" element={<Navigate to="/layers" replace />} />
                <Route path="/ai-video-upscaler" element={<Navigate to="/upscale" replace />} />
                <Route path="/ai-influencer" element={<Navigate to="/ai-influencer-studio" replace />} />
                <Route path="/ai-motion-designer" element={<Navigate to="/katana" replace />} />
                <Route path="/image-editing" element={<Navigate to="/layers" replace />} />
                <Route path="/image-to-video-ai" element={<Navigate to="/ai/video" replace />} />
                <Route path="/text-to-video-ai" element={<Navigate to="/ai/video" replace />} />
                <Route path="/cinematic-video-generator" element={<Navigate to="/generate?mode=video&videoModel=cinematic-v4" replace />} />
                <Route path="/claude-ai-video-generator" element={<Navigate to="/mcp?tab=claude" replace />} />
                <Route path="/claude-for-marketing" element={<Navigate to="/marketing-studio" replace />} />
                <Route path="/help-center" element={<Navigate to="/creator-hub/help-center" replace />} />
                <Route path="/gallery/all" element={<Navigate to="/community" replace />} />
                <Route path="/photodump/mobile" element={<Navigate to="/photodump" replace />} />
                <Route path="/start/genjutsu" element={<Navigate to="/ai/video?model=genjutsu" replace />} />
                <Route path="/apps/face-swap" element={<Navigate to="/layers?tool=face-swap" replace />} />
                <Route path="/mixed-media-community" element={<Navigate to="/community?filter=mixed-media" replace />} />
                <Route path="/soul-community" element={<Navigate to="/community?filter=soul" replace />} />
                <Route path="/higgsfield-community" element={<Navigate to="/community" replace />} />
                <Route path="/sora-community" element={<Navigate to="/community" replace />} />
                <Route path="/kling-community" element={<Navigate to="/community" replace />} />
                <Route path="/veo-community" element={<Navigate to="/community" replace />} />
                <Route path="/wan-community" element={<Navigate to="/community" replace />} />
                <Route path="/vidu-community" element={<Navigate to="/community" replace />} />
                <Route path="/hailuo-community" element={<Navigate to="/community" replace />} />
                <Route path="/midjourney-community" element={<Navigate to="/community" replace />} />
                <Route path="/grok-community" element={<Navigate to="/community" replace />} />
                <Route path="/ltx-community" element={<Navigate to="/community" replace />} />
                <Route path="/seedance-community" element={<Navigate to="/community" replace />} />

                {/* Multi-Segment Model Intro Routes */}
                <Route path="/seedance/2.5" element={<DetailAndInfoPage introKey="seedance/2.5" />} />
                <Route path="/seedance/2.0" element={<DetailAndInfoPage introKey="seedance/2.0" />} />
                <Route path="/minimax/h3" element={<DetailAndInfoPage introKey="minimax/h3" />} />

                {/* Creator Profiles, Project Breakdowns, Blog Articles & Single-Segment Intro Pages */}
                <Route path="/:handle/projects/:slug" element={<DetailAndInfoPage kind="project" />} />
                <Route path="/:handle/blogs/:slug" element={<DetailAndInfoPage kind="blog" />} />
                <Route path="/:handle" element={<DetailAndInfoPage />} />

                {/* Final Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>

          <MobileBottomNav />
          <CookieBanner />
          <ModalHost />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

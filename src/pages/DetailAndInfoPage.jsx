import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Cpu,
  Film,
  GraduationCap,
  Heart,
  MessageSquare,
  Play,
  Search,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  ACADEMY_LESSONS,
  BLOG_GUIDES,
  CREATOR_PROFILES,
  FABLE_BLOG_ARTICLES,
  INTRO_LANDING_PAGES,
  PROJECT_SHORTLIST_MAP,
} from '../data/catalog';
import {
  FABLE_USE_CASES,
  GPT_IMAGE_2_ITEMS,
  INSIDE_PROJECTS,
  SEEDANCE_25_ITEMS,
  SHORTS_PRESETS,
  SOUL_20_ITEMS,
  SOUL_CINEMA_ITEMS,
} from '../data/showcase';
import { useApp } from '../context/AppContext';
import MediaCard from '../components/common/MediaCard';
import NotFoundPage from './NotFoundPage';

const ORIGINAL_SERIES = [
  {
    id: 'cully-hill',
    title: 'The Cully Hill Boys',
    genre: 'Psychological Frontier Thriller',
    episodes: '6 Episodes • 4K Anamorphic',
    director: '@aist & Higgsfield Originals',
    img: SOUL_CINEMA_ITEMS[1].img,
    desc: 'Two brothers guarding a coastal listening post uncover anomalous radio echoes from beneath the cliffs.',
  },
  {
    id: 'zephyr',
    title: 'ZEPHYR: Special',
    genre: 'Sci-Fi Kaiju Anthology',
    episodes: 'Feature Special • Seedance 2.5 + Soul Cinema',
    director: '@higgsfield.studio',
    img: SOUL_CINEMA_ITEMS[11].img,
    desc: 'Rain-soaked Tokyo streets tremble as deep-ocean leviathans pass above neon storefronts.',
  },
  {
    id: 'trigger',
    title: 'The Trigger',
    genre: 'Neo-Noir Action Drama',
    episodes: '4-Part Mini Series',
    director: '@buralqy',
    img: INSIDE_PROJECTS[8].img,
    desc: 'A veteran investigator races across overnight rail lines before the midnight evidence lock seals.',
  },
  {
    id: 'kok-boru',
    title: 'Kok Boru',
    genre: 'Historical Steppe Epic',
    episodes: 'Short Feature • ARRI 70mm Preset',
    director: '@aibek_zh',
    img: SOUL_CINEMA_ITEMS[14].img,
    desc: 'Galloping steppe horsemen emerge through mist in an adrenaline-fueled test of endurance and honor.',
  },
  {
    id: 'hell-grind',
    title: 'HELL GRIND',
    genre: 'Cyber Arena Fantasy',
    episodes: 'PILOT EPISODE',
    director: '@solaris_lab',
    img: SOUL_CINEMA_ITEMS[8].img,
    desc: 'Gladiators suspended above ruined brutalist pylons spar under cold searchlights.',
  },
];

const MIRACLE_SWATCHES = [
  { name: 'Sky', hex: '#7dd3fc' },
  { name: 'Cream', hex: '#fef3c7' },
  { name: 'Rust', hex: '#ea580c' },
  { name: 'Olive', hex: '#65a30d' },
  { name: 'Black', hex: '#18181b' },
];

const ACADEMY_FAQS = [
  {
    q: 'Do I need prior filmmaking or coding experience for Higgsfield Academy?',
    a: 'No prior editing or coding experience is required. Each lesson walks through exact prompt recipes, camera rigs, and one-click presets.',
  },
  {
    q: 'Can I publish Academy projects commercially?',
    a: 'Yes! Every paid Plus, Ultra, Team, and Scale subscription includes full commercial licensing for campaigns, clients, and film festivals.',
  },
  {
    q: 'How do Claude Opus 5.5 and Higgsfield MCP work together?',
    a: 'Claude writes your multi-shot script or Blender scene and invokes Seedance 2.5, GPT Image 2.6, or Seed Audio directly inside the same workflow.',
  },
];

export default function DetailAndInfoPage({ kind, introKey }) {
  const params = useParams();
  const location = useLocation();
  const { user, openModal, pushToast, toggleLike, likedIds, savedGenerations, upgradePlan } = useApp();

  const path = location.pathname;

  // Hooks used across branches
  const [followed, setFollowed] = useState(false);
  const [profileTab, setProfileTab] = useState('All works');
  const [projTab, setProjTab] = useState('Assets');
  const [projComments, setProjComments] = useState([
    { author: '@akira_cinema', text: 'The 40mm rain halation on scene 4 looks straight off celluloid.' },
    { author: '@solaris_lab', text: 'Did you drive camera push with Seedance 2.5 R2V or Cinema Studio 4.0?' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [activeLesson, setActiveLesson] = useState(ACADEMY_LESSONS[0]);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeSeries, setActiveSeries] = useState(ORIGINAL_SERIES[0]);
  const [miracleTool, setMiracleTool] = useState('Create');
  const [miracleSwatch, setMiracleSwatch] = useState(MIRACLE_SWATCHES[0]);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCat, setBlogCat] = useState('All');
  const [contestSeconds, setContestSeconds] = useState(1 * 86400 + 11 * 3600 + 14 * 60 + 38);

  useEffect(() => {
    if (path !== '/contests/community-contest') return undefined;
    const id = window.setInterval(() => {
      setContestSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [path]);

  const countdownFormatted = useMemo(() => {
    const d = Math.floor(contestSeconds / 86400);
    const h = Math.floor((contestSeconds % 86400) / 3600);
    const m = Math.floor((contestSeconds % 3600) / 60);
    const s = contestSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${d}D : ${pad(h)}H : ${pad(m)}M : ${pad(s)}S`;
  }, [contestSeconds]);

  // Determine dispatcher mode for /:handle
  const handleParam = params.handle || '';
  const slugParam = params.slug || '';

  useEffect(() => {
    setFollowed(false);
    setProjTab('Assets');
    setNewComment('');
    setProfileTab('All works');
  }, [handleParam, slugParam, path]);

  const resolvedIntroKey =
    introKey ||
    (kind === 'intro' ? handleParam : !handleParam.startsWith('@') && INTRO_LANDING_PAGES[handleParam] ? handleParam : null);

  // Unknown single-segment route renders explicit 404 NotFoundPage instead of silent soft-200
  if (!kind && !introKey && handleParam && !handleParam.startsWith('@') && !INTRO_LANDING_PAGES[handleParam]) {
    return <NotFoundPage attemptedPath={location.pathname} />;
  }

  // 1. INTRO / MODEL LANDING PAGES (/seedance/2.5, /kling-4-0-intro, etc.)
  if (resolvedIntroKey && INTRO_LANDING_PAGES[resolvedIntroKey]) {
    const page = INTRO_LANDING_PAGES[resolvedIntroKey];
    const gallery = resolvedIntroKey.includes('image') || resolvedIntroKey.includes('banana') || resolvedIntroKey.includes('seedream') || resolvedIntroKey.includes('gpt') || resolvedIntroKey.includes('soul') || resolvedIntroKey.includes('ideogram') || resolvedIntroKey.includes('flux')
      ? [...GPT_IMAGE_2_ITEMS.slice(0, 4), ...SOUL_20_ITEMS.slice(0, 4)]
      : [...SEEDANCE_25_ITEMS.slice(0, 4), ...SHORTS_PRESETS.slice(0, 4)];

    return (
      <main className="hf-container hf-subpage">
        <section className="hf-page-hero">
          <div>
            <span className="hf-page-badge">{page.badge}</span>
            <h1 className="hf-page-title">{page.title}</h1>
            <p className="hf-page-desc">{page.subtitle}</p>
          </div>
          <Link to={page.ctaTo} className="hf-cta-lime">
            <Sparkles size={15} />
            <span>{page.ctaLabel}</span>
          </Link>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 14,
            marginBottom: 28,
          }}
        >
          {page.highlights.map((hl) => (
            <article key={hl.title} className="hf-studio-panel">
              <h2 style={{ margin: '0 0 6px', fontSize: 16.5, color: '#d1fe17' }}>{hl.title}</h2>
              <p style={{ margin: 0, fontSize: 13.5, color: '#b4b7bf', lineHeight: 1.5 }}>{hl.desc}</p>
            </article>
          ))}
        </div>

        <h2 className="hf-section-title" style={{ marginBottom: 14 }}>
          Featured Generations &amp; Recipes
        </h2>
        <div className="hf-projects-grid">
          {gallery.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    );
  }

  // 2. CREATOR PROJECT DETAIL PAGE (/:handle/projects/:slug)
  if (kind === 'project') {
    const mapEntry = Object.entries(PROJECT_SHORTLIST_MAP).find(([, v]) => v.slug === slugParam);
    const projectId = mapEntry ? mapEntry[0] : INSIDE_PROJECTS[7].id;
    const projectMeta = mapEntry
      ? mapEntry[1]
      : {
          slug: slugParam,
          creator: handleParam || '@buralqy',
          badgeLabel: 'Higgsfield Picks',
          generations: 184,
          creditsSpent: '14,200',
          sizeGb: '9.8 GB',
          stack: [{ name: 'Seedance 2.5', pct: '62.0%' }, { name: 'Cinema Studio 4.0', pct: '38.0%' }],
        };
    const projectCard = INSIDE_PROJECTS.find((p) => p.id === projectId) || {
      ...INSIDE_PROJECTS[0],
      id: `dyn-${slugParam}`,
      title: slugParam.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      creator: handleParam || '@creator',
    };
    const isLiked = likedIds.includes(projectCard.id);

    return (
      <main className="hf-container hf-subpage">
        <div style={{ marginBottom: 14 }}>
          <Link to="/community" className="hf-chip">&larr; Back to Community Showcase</Link>
        </div>

        <div className="hf-studio-grid">
          <div className="hf-studio-stage">
            <div className="hf-studio-preview">
              <img src={projectCard.img} alt={projectCard.title} style={{ maxHeight: 540 }} />
              <span
                className="hf-project-shortlist-pill hf-project-shortlist-pill--lime"
                style={{ position: 'absolute', left: 16, top: 16 }}
              >
                {projectMeta.badgeLabel}
              </span>
            </div>

            <div className="hf-underline-tabs">
              {['Assets', 'Brief', 'Details', 'Comments'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`hf-underline-tab ${projTab === t ? 'is-active' : ''}`}
                  onClick={() => setProjTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {projTab === 'Assets' && (
              <div className="hf-studio-gallery">
                {SOUL_CINEMA_ITEMS.slice(0, 3).map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {projTab === 'Brief' && (
              <p style={{ margin: 0, fontSize: 14, color: '#b4b7bf', lineHeight: 1.6 }}>
                {projectCard.prompt}
              </p>
            )}

            {projTab === 'Details' && (
              <div className="hf-code-box">
                {`Project: ${projectCard.title}\nDirector: ${projectMeta.creator}\nPipeline: ${projectMeta.stack.map((s) => `${s.name} (${s.pct})`).join(' + ')}\nAspect: 16:9 Cinema / 24fps`}
              </div>
            )}

            {projTab === 'Comments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projComments.map((c, idx) => (
                  <div key={idx} className="hf-studio-panel" style={{ padding: 12 }}>
                    <strong style={{ fontSize: 13, color: '#d1fe17' }}>{c.author}</strong>
                    <span style={{ fontSize: 13.5, color: '#d5d8e0' }}>{c.text}</span>
                  </div>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newComment.trim()) {
                      pushToast('Enter a comment before posting', 'neutral');
                      return;
                    }
                    setProjComments((prev) => [
                      ...prev,
                      { author: user?.handle || '@studio_creator', text: newComment.trim() },
                    ]);
                    setNewComment('');
                    pushToast('Comment added to project breakdown');
                  }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                >
                  <input
                    type="text"
                    className="hf-input"
                    style={{ flex: '1 1 200px', minWidth: 0 }}
                    placeholder="Ask creator about lens, Seedance refs, or prompt..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="hf-cta-lime">
                    <MessageSquare size={14} />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          <aside className="hf-studio-panel">
            <div>
              <span className="hf-nav-badge">{projectCard.model}</span>
              <h1 style={{ margin: '8px 0 6px', fontSize: 24 }}>{projectCard.title}</h1>
              <Link
                to={`/${projectMeta.creator}`}
                style={{ fontSize: 14, color: '#d1fe17', fontWeight: 600 }}
              >
                {projectMeta.creator}
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={isLiked ? 'hf-cta-lime' : 'hf-cta-dark'}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => toggleLike(projectCard.id)}
              >
                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{isLiked ? 'Liked' : `Like (${projectCard.likes})`}</span>
              </button>
              <Link
                to={`/generate?prompt=${encodeURIComponent(projectCard.prompt || '')}`}
                className="hf-cta-lime"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Remix Recipe
              </Link>
            </div>

            <div className="hf-ws-divider" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: 10, borderRadius: 10, background: '#0e1013' }}>
                <div style={{ fontSize: 11, color: '#8f939c' }}>Generations</div>
                <strong style={{ fontSize: 18 }}>{projectMeta.generations}</strong>
              </div>
              <div style={{ padding: 10, borderRadius: 10, background: '#0e1013' }}>
                <div style={{ fontSize: 11, color: '#8f939c' }}>Credits spent</div>
                <strong style={{ fontSize: 18 }}>{projectMeta.creditsSpent}</strong>
              </div>
              <div style={{ padding: 10, borderRadius: 10, background: '#0e1013' }}>
                <div style={{ fontSize: 11, color: '#8f939c' }}>Dataset size</div>
                <strong style={{ fontSize: 18 }}>{projectMeta.sizeGb}</strong>
              </div>
              <div style={{ padding: 10, borderRadius: 10, background: '#0e1013' }}>
                <div style={{ fontSize: 11, color: '#8f939c' }}>Status</div>
                <strong style={{ fontSize: 15, color: '#d1fe17' }}>Verified</strong>
              </div>
            </div>

            <div>
              <div className="hf-form-label" style={{ marginBottom: 8 }}>Model Stack Breakdown</div>
              {projectMeta.stack.map((st) => (
                <div
                  key={st.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: 8,
                    background: '#0e1013',
                    marginBottom: 6,
                    fontSize: 12.5,
                  }}
                >
                  <span>{st.name}</span>
                  <strong style={{ color: '#d1fe17' }}>{st.pct}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    );
  }

  // 3. FABLE / CREATOR BLOG CASE STUDY (/:handle/blogs/:slug)
  if (kind === 'blog') {
    const article = FABLE_BLOG_ARTICLES[slugParam] || {
      title: slugParam.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      date: 'Nov 10, 2026',
      readTime: '6 min',
      views: '3.2K',
      likes: 248,
      comments: 14,
      author: handleParam || '@higgsfield.studio',
      tags: ['MCP', 'Fable 5.2', 'Breakdown'],
      fableId: 'fable-mmo',
      summary: 'Deep dive engineering walkthrough pairing Claude MCP orchestration with Higgsfield generative video and image models.',
      steps: [
        'Connected Claude Desktop to `@higgsfield/mcp-server`.',
        'Generated lookdev frames in GPT Image 2.6 and animated final plates in Seedance 2.5.',
      ],
      mcpPrompt: 'Use Higgsfield MCP to generate cohesive scene assets and render a 1080p showcase film.',
    };
    const fableMedia = FABLE_USE_CASES.find((f) => f.id === article.fableId) || FABLE_USE_CASES[0];

    return (
      <main className="hf-container hf-subpage">
        <article className="hf-article-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <Link to="/blog" className="hf-chip">&larr; Creator Blogs</Link>
            <Link to="/mcp?tab=claude" className="hf-cta-lime" style={{ height: 32, fontSize: 12 }}>
              <Cpu size={13} />
              <span>CONNECT HIGGSFIELD MCP IN CLAUDE</span>
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {article.tags.map((t) => (
              <span key={t} className="hf-nav-badge">{t}</span>
            ))}
          </div>

          <h1 className="hf-page-title">{article.title}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#9ea2ab' }}>
            <Link to={`/${article.author}`} style={{ color: '#d1fe17', fontWeight: 600 }}>{article.author}</Link>
            <span>{article.date}</span>
            <span>{article.readTime} read</span>
            <span>{article.views} views</span>
          </div>

          <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            {fableMedia.video ? (
              <video
                src={fableMedia.video}
                poster={fableMedia.poster}
                controls
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
              />
            ) : (
              <img src={fableMedia.poster} alt={article.title} style={{ width: '100%' }} />
            )}
          </div>

          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: '#d8dae2' }}>{article.summary}</p>

          <div className="hf-studio-panel">
            <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Build Breakdown Steps</h2>
            {article.steps.map((st, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#c4c7d0' }}>
                <strong style={{ color: '#d1fe17' }}>0{idx + 1}.</strong>
                <span>{st}</span>
              </div>
            ))}
          </div>

          <div className="hf-studio-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Exact Prompt Used in Claude MCP</strong>
              <button
                type="button"
                className="hf-cta-dark"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(article.mcpPrompt);
                  } catch {
                    /* ignore */
                  }
                  pushToast('Copied MCP prompt to clipboard');
                }}
              >
                <Copy size={13} />
                <span>Copy prompt</span>
              </button>
            </div>
            <pre className="hf-code-box" style={{ margin: 0 }}>
              <code>{article.mcpPrompt}</code>
            </pre>
          </div>
        </article>
      </main>
    );
  }

  // 4. CREATOR PROFILE (/@handle) OR SIGNED-IN PROFILE (/profile)
  if (kind === 'creator' || handleParam.startsWith('@') || path === '/profile') {
    const isSelf = path === '/profile';
    const profileObj = isSelf
      ? {
          handle: user?.handle || '@studio_creator',
          name: user?.name || 'Studio Creator',
          role: user?.plan || 'Plus Member',
          rating: 480,
          followers: '1.2K',
          worksCount: savedGenerations.length + 12,
        }
      : CREATOR_PROFILES.find((c) => c.handle.toLowerCase() === handleParam.toLowerCase()) || {
          handle: handleParam,
          name: handleParam.replace(/^@/, ''),
          role: 'AI Film Director',
          rating: 196,
          followers: '14.3K',
          worksCount: 36,
        };

    return (
      <main className="hf-container hf-subpage">
        <section className="hf-page-hero">
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d1fe17, #22c55e)',
                color: '#101214',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--hf-font-display)',
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {profileObj.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="hf-page-badge">{profileObj.role}</span>
              <h1 className="hf-page-title" style={{ marginBottom: 4 }}>{profileObj.handle}</h1>
              <p className="hf-page-desc">
                {profileObj.followers} followers &bull; {profileObj.rating} creator rating &bull; {profileObj.worksCount} works published
              </p>
            </div>
          </div>

          <div className="hf-section-actions">
            {isSelf ? (
              <>
                <span className="hf-nav-badge" style={{ padding: '7px 12px', fontSize: 13 }}>
                  Credits: <strong style={{ color: '#d1fe17' }}>{user?.credits ?? 500}</strong>
                </span>
                <button
                  type="button"
                  className="hf-cta-lime"
                  onClick={() => upgradePlan('Ultra Creator (30% OFF)', 3000)}
                >
                  Upgrade Credits (+3,000)
                </button>
              </>
            ) : (
              <button
                type="button"
                className={followed ? 'hf-cta-dark' : 'hf-cta-lime'}
                onClick={() => {
                  setFollowed((f) => !f);
                  pushToast(followed ? `Unfollowed ${profileObj.handle}` : `Following ${profileObj.handle}`);
                }}
              >
                <UserCheck size={14} />
                <span>{followed ? 'Following' : 'Follow'}</span>
              </button>
            )}
          </div>
        </section>

        <div className="hf-underline-tabs" style={{ marginBottom: 20, overflowX: 'auto' }}>
          {['All works', 'Projects', 'Shots', 'Posts', 'Blog', 'Achievements'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`hf-underline-tab ${profileTab === tab ? 'is-active' : ''}`}
              onClick={() => setProfileTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {profileTab === 'Blog' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {Object.entries(FABLE_BLOG_ARTICLES).slice(0, 4).map(([slug, art]) => (
              <Link
                key={slug}
                to={`/@higgsfield.studio/blogs/${slug}`}
                className="hf-studio-panel"
                style={{ justifyContent: 'space-between', textDecoration: 'none' }}
              >
                <div>
                  <span className="hf-nav-badge" style={{ marginBottom: 8 }}>{art.readTime} read</span>
                  <h2 style={{ margin: '0 0 6px', fontSize: 16, color: '#fff' }}>{art.title}</h2>
                  <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>{art.summary}</p>
                </div>
                <span style={{ fontSize: 12, color: '#d1fe17', fontWeight: 600 }}>Read breakdown &rarr;</span>
              </Link>
            ))}
          </div>
        ) : profileTab === 'Achievements' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { title: 'Higgsfield Pick', desc: 'Selected for homepage Director Showcase spotlight' },
              { title: 'Cinema Studio 4.0 Pioneer', desc: 'Published multi-shot ARRI 35mm sequence with continuity lock' },
              { title: 'Top MCP Builder', desc: 'Automated Seedance 2.5 workflow inside Claude Desktop' },
            ].map((badge) => (
              <article key={badge.title} className="hf-studio-panel">
                <Award size={20} color="#d1fe17" />
                <h2 style={{ margin: 0, fontSize: 16 }}>{badge.title}</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>{badge.desc}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="hf-projects-grid">
            {(profileTab === 'Shots'
              ? SHORTS_PRESETS
              : profileTab === 'Posts'
              ? [...GPT_IMAGE_2_ITEMS.slice(0, 4), ...SOUL_20_ITEMS.slice(0, 4)]
              : profileTab === 'Projects'
              ? INSIDE_PROJECTS
              : isSelf && savedGenerations.length > 0
              ? savedGenerations
              : INSIDE_PROJECTS.slice(0, 8)
            ).map((item) => (
              <MediaCard
                key={`${profileTab}-${item.id}`}
                item={{ ...item, aspect: profileTab === 'Shots' ? '9/16' : '16/9' }}
              />
            ))}
          </div>
        )}
      </main>
    );
  }

  // 5. HIGGSFIELD ACADEMY (/academy)
  if (path === '/academy') {
    return (
      <main className="hf-container hf-subpage">
        <section className="hf-page-hero">
          <div>
            <span className="hf-page-badge">
              <GraduationCap size={13} />
              <span>HIGGSFIELD ACADEMY</span>
            </span>
            <h1 className="hf-page-title">MASTER AI FILMMAKING IN 7 LESSONS</h1>
            <p className="hf-page-desc">
              Master AI filmmaking from scratch: prompting, Soul ID character continuity, camera lenses, and Claude MCP pipelines.
            </p>
          </div>
          <Link to="/generate" className="hf-cta-lime">
            <Film size={15} />
            <span>Start Creating with AI</span>
          </Link>
        </section>

        <div className="hf-studio-grid" style={{ marginBottom: 28 }}>
          <aside className="hf-studio-panel">
            <h2 style={{ margin: '0 0 6px', fontSize: 16 }}>Course Curriculum (7 Lessons)</h2>
            {ACADEMY_LESSONS.map((lesson) => (
              <button
                key={lesson.num}
                type="button"
                className={`hf-model-option ${activeLesson.num === lesson.num ? 'is-selected' : ''}`}
                onClick={() => setActiveLesson(lesson)}
              >
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff' }}>{lesson.title}</div>
                  <div style={{ fontSize: 11, color: '#9ea2ab' }}>{lesson.focus} &bull; {lesson.duration}</div>
                </div>
                <Play size={13} color="#d1fe17" />
              </button>
            ))}
          </aside>

          <section className="hf-studio-stage">
            <div className="hf-studio-preview">
              <img src={SOUL_CINEMA_ITEMS[activeLesson.num - 1].img} alt={activeLesson.title} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 24,
                }}
              >
                <span className="hf-page-badge" style={{ width: 'fit-content' }}>
                  LESSON {activeLesson.num} &bull; {activeLesson.duration}
                </span>
                <h2 style={{ margin: '6px 0', fontSize: 22 }}>{activeLesson.title}</h2>
                <p style={{ margin: '0 0 12px', color: '#d4d7df', maxWidth: 620 }}>{activeLesson.desc}</p>
                <Link to="/generate" className="hf-cta-lime" style={{ width: 'fit-content' }}>
                  Practice Lesson in Studio
                </Link>
              </div>
            </div>
          </section>
        </div>

        <section className="hf-studio-panel">
          <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Frequently Asked Questions</h2>
          {ACADEMY_FAQS.map((faq, idx) => (
            <div
              key={faq.q}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={15} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none' }} />
              </button>
              {openFaq === idx && (
                <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#9ea2ab' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </section>
      </main>
    );
  }

  // 6. GLOBAL $1,000,000 COMMUNITY CONTEST (/contests/community-contest)
  if (path === '/contests/community-contest') {
    return (
      <main className="hf-container hf-subpage">
        <section
          className="hf-page-hero"
          style={{
            background:
              'radial-gradient(65% 80% at 80% 10%, rgba(209, 254, 23, 0.2) 0%, transparent 70%), #101216',
          }}
        >
          <div>
            <span className="hf-page-badge">
              <Award size={13} />
              <span>HIGGSFIELD GLOBAL CREATOR GRANT</span>
            </span>
            <h1 className="hf-page-title">$1,000,000 COMMUNITY CONTEST</h1>
            <p className="hf-page-desc">
              Submit original short films, Shorts Studio formats, or Genjutsu motion performances to compete for creator funding and studio residency.
            </p>
            <div style={{ marginTop: 14 }}>
              <div className="hf-countdown-row">
                <Clock size={18} />
                <span>{countdownFormatted}</span>
              </div>
            </div>
          </div>

          <div className="hf-section-actions">
            <Link
              to={user ? '/profile' : '/generate'}
              className="hf-cta-lime"
            >
              {user ? 'Select Entry from Profile' : 'Create Entry in Studio'}
            </Link>
            <Link to="/community?tab=Projects" className="hf-cta-dark">
              Browse Shortlist
            </Link>
          </div>
        </section>

        <div className="hf-timeline-row" style={{ marginBottom: 28 }}>
          {[
            { step: '01 • Submissions Open', date: 'Active Now', active: true },
            { step: '02 • Community Voting', date: 'Top 50 Shortlist', active: false },
            { step: '03 • Jury Screening', date: 'Los Angeles & Tokyo', active: false },
            { step: '04 • $1M Grant Awards', date: 'Winners Announced', active: false },
          ].map((st) => (
            <div key={st.step} className={`hf-timeline-step ${st.active ? 'is-active' : ''}`}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: st.active ? '#d1fe17' : '#ffffff' }}>
                {st.step}
              </div>
              <div style={{ fontSize: 12, color: '#9ea2ab', marginTop: 4 }}>{st.date}</div>
            </div>
          ))}
        </div>

        <h2 className="hf-section-title" style={{ marginBottom: 14 }}>Official Contest Shortlist</h2>
        <div className="hf-projects-grid">
          {INSIDE_PROJECTS.slice(0, 8).map((item) => (
            <MediaCard key={item.id} item={{ ...item, aspect: '16/9' }} />
          ))}
        </div>
      </main>
    );
  }

  // 7. ORIGINAL SERIES (/original-series)
  if (path === '/original-series') {
    return (
      <main className="hf-container hf-subpage">
        <section className="hf-page-hero">
          <div>
            <span className="hf-page-badge">HIGGSFIELD ORIGINALS</span>
            <h1 className="hf-page-title">{activeSeries.title}</h1>
            <p className="hf-page-desc">
              {activeSeries.genre} &bull; {activeSeries.episodes} &bull; Directed by {activeSeries.director}
            </p>
            <p style={{ margin: '10px 0 0', maxWidth: 640, color: '#d4d7e0', fontSize: 14 }}>
              {activeSeries.desc}
            </p>
          </div>
          <Link to="/generate" className="hf-cta-lime">
            <Film size={14} />
            <span>Direct Similar Scene in Cinema 4.0</span>
          </Link>
        </section>

        <div className="hf-studio-preview" style={{ marginBottom: 20 }}>
          <img src={activeSeries.img} alt={activeSeries.title} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
          {ORIGINAL_SERIES.map((series) => (
            <button
              key={series.id}
              type="button"
              onClick={() => setActiveSeries(series)}
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                padding: 0,
                textAlign: 'left',
                border: activeSeries.id === series.id ? '2px solid #d1fe17' : '1px solid rgba(255,255,255,0.08)',
                background: '#14171a',
              }}
            >
              <img src={series.img} alt={series.title} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover' }} />
              <div style={{ padding: 12 }}>
                <strong style={{ fontSize: 14, color: '#ffffff' }}>{series.title}</strong>
                <div style={{ fontSize: 11.5, color: '#8f939c', marginTop: 3 }}>{series.genre}</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // 8. HIGGSFIELD MIRACLE (/miracle)
  if (path === '/miracle') {
    return (
      <main className="hf-container hf-subpage">
        <section className="hf-page-hero">
          <div>
            <span className="hf-page-badge">UPCOMING ENGINE</span>
            <h1 className="hf-page-title">HIGGSFIELD MIRACLE</h1>
            <p className="hf-page-desc">
              Frame-accurate interactive editing for lighting, material textures, geometry, and motion consistency across video shots.
            </p>
          </div>
          <button
            type="button"
            className="hf-cta-lime"
            onClick={() => openModal({ type: 'waitlist' })}
          >
            Join Priority Waitlist
          </button>
        </section>

        <section className="hf-studio-panel" style={{ gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div className="hf-chip-row">
              {['Create', 'Edit', 'Light', 'Motion', 'Texture'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`hf-chip ${miracleTool === mode ? 'is-active' : ''}`}
                  onClick={() => setMiracleTool(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#9ea2ab' }}>Color Grade: {miracleSwatch.name}</span>
              {MIRACLE_SWATCHES.map((sw) => (
                <button
                  key={sw.name}
                  type="button"
                  onClick={() => setMiracleSwatch(sw)}
                  aria-label={sw.name}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: sw.hex,
                    border: miracleSwatch.name === sw.name ? '2px solid #d1fe17' : '1px solid rgba(255,255,255,0.25)',
                  }}
                />
              ))}
            </div>
          </div>

          <div
            className="hf-studio-preview"
            style={{ boxShadow: `inset 0 0 80px ${miracleSwatch.hex}44` }}
          >
            <img
              src={SOUL_CINEMA_ITEMS[3].img}
              alt={`Miracle ${miracleTool} Demo`}
              style={{
                filter:
                  miracleSwatch.name === 'Black'
                    ? 'grayscale(70%) contrast(1.2)'
                    : miracleSwatch.name === 'Rust'
                    ? 'sepia(35%) saturate(1.3)'
                    : miracleSwatch.name === 'Olive'
                    ? 'hue-rotate(38deg) saturate(1.1)'
                    : miracleSwatch.name === 'Cream'
                    ? 'brightness(1.08) sepia(16%)'
                    : 'saturate(1.12) contrast(1.04)',
              }}
            />
            <span className="hf-page-badge" style={{ position: 'absolute', left: 16, top: 16 }}>
              ACTIVE PASS: {miracleTool.toUpperCase()} &bull; {miracleSwatch.name.toUpperCase()} LUT
            </span>
          </div>
        </section>
      </main>
    );
  }

  // 9. CREATOR BLOG DIRECTORY (/blog)
  const fablePosts = Object.entries(FABLE_BLOG_ARTICLES).map(([slug, art]) => ({
    category: 'Fable 5.2',
    readTime: art.readTime,
    date: art.date,
    title: art.title,
    to: `/@higgsfield.studio/blogs/${slug}`,
  }));
  const allPosts = [...fablePosts, ...BLOG_GUIDES].filter((post) => {
    const matchCat = blogCat === 'All' || post.category === blogCat;
    const matchQ = !blogSearch.trim() || post.title.toLowerCase().includes(blogSearch.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <main className="hf-container hf-subpage">
      <section className="hf-page-hero">
        <div>
          <span className="hf-page-badge">
            <BookOpen size={13} />
            <span>CREATOR HUB &amp; ENGINEERING BLOG</span>
          </span>
          <h1 className="hf-page-title">HIGGSFIELD BLOG &amp; GUIDES</h1>
          <p className="hf-page-desc">
            Engineering stories on Claude Fable 5.2 MCP pipelines, AI ecommerce ads, character continuity, and frontier model benchmarks.
          </p>
        </div>

        <div style={{ position: 'relative', width: 'min(320px, 100%)', maxWidth: '100%' }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: 13, color: '#8f939c' }} />
          <input
            type="search"
            className="hf-input"
            style={{ paddingLeft: 32 }}
            placeholder="Search guides & case studies..."
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="hf-chip-row" style={{ marginBottom: 20 }}>
        {['All', 'Fable 5.2', 'Editorials', 'Guides'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`hf-chip ${blogCat === cat ? 'is-active' : ''}`}
            onClick={() => setBlogCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {allPosts.length === 0 ? (
        <div className="hf-studio-panel" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#b4b7bf' }}>
            No articles matched &ldquo;{blogSearch}&rdquo; in {blogCat}.
          </p>
          <button
            type="button"
            className="hf-cta-dark"
            onClick={() => {
              setBlogSearch('');
              setBlogCat('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
          {allPosts.map((post) => (
            <Link
              key={post.to + post.title}
              to={post.to}
              className="hf-studio-panel"
              style={{ justifyContent: 'space-between', textDecoration: 'none' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="hf-nav-badge">{post.category}</span>
                  <span style={{ fontSize: 11.5, color: '#8f939c' }}>{post.readTime}</span>
                </div>
                <h2 style={{ margin: '0 0 8px', fontSize: 17, color: '#ffffff', lineHeight: 1.35 }}>
                  {post.title}
                </h2>
              </div>
              <div style={{ fontSize: 12, color: '#d1fe17', fontWeight: 600 }}>
                Read breakdown &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

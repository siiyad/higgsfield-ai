import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Award, BookOpen, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { CREATOR_PROFILES, PROJECT_SHORTLIST_MAP } from '../data/catalog';
import {
  GENJUTSU_ITEMS,
  GPT_IMAGE_2_ITEMS,
  INSIDE_PROJECTS,
  MARKETING_ITEMS,
  SEEDANCE_25_ITEMS,
  SHORTS_PRESETS,
  SOUL_20_ITEMS,
  SOUL_CINEMA_ITEMS,
} from '../data/showcase';
import MediaCard from '../components/common/MediaCard';
import { useApp } from '../context/AppContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COMMUNITY_TABS = [
  { id: 'Discovery', to: '/community?tab=Discovery' },
  { id: 'Feed', to: '/community?tab=Feed' },
  { id: 'Projects', to: '/community?tab=Projects' },
  { id: 'Shots', to: '/community?tab=Shots' },
  { id: 'Creators', to: '/community?tab=Creators' },
  { id: 'Contests', to: '/contests/community-contest' },
  { id: 'Rooms', to: '/canvas' },
  { id: 'Blogs', to: '/blog' },
  { id: 'Originals', to: '/original-series' },
];

const INFO_PAGES = {
  '/community/contests': {
    badge: 'OPEN CHALLENGES',
    title: 'Creator Contests & Grants',
    desc: 'Weekly aesthetic prompts, brand commercials, and cinema short challenges hosted by the Higgsfield community.',
  },
  '/creator-hub/help-center': {
    badge: 'DOCUMENTATION',
    title: 'Help Center & Creator Hub',
    desc: 'Guides for billing, commercial rights, credit packs, API keys, and prompt syntax.',
  },
  '/creator-partnership-program': {
    badge: 'PARTNERSHIPS',
    title: 'Creator Partnership Program',
    desc: 'Partner with Higgsfield to showcase flagship Seedance 2.5, Soul 2.0, and Cinema Studio 4.0 productions, receive monthly H100 compute grants, and join early beta labs.',
  },
  '/about': {
    badge: 'SAN FRANCISCO, CA',
    title: 'About Higgsfield',
    desc: 'Building the AI-native creative suite empowering directors, designers, and teams worldwide.',
  },
  '/trust': {
    badge: 'SECURITY & SAFETY',
    title: 'Trust, Safety & Security',
    desc: 'SOC-2 controls, content provenance standards, IP protection, and vulnerability disclosure.',
  },
  '/contact': {
    badge: 'GET IN TOUCH',
    title: 'Contact Higgsfield',
    desc: 'Reach creator support, press, creative partnerships, or San Francisco headquarters.',
  },
  '/terms': {
    badge: 'LEGAL',
    title: 'Terms of Service',
    desc: 'Commercial licensing, acceptable use policy, and creator ownership terms (© 2026 Higgsfield, Inc.).',
  },
  '/privacy': {
    badge: 'LEGAL',
    title: 'Privacy Policy',
    desc: 'How Higgsfield handles account telemetry, generated assets, and GDPR/CCPA rights.',
  },
};

function resolveCommunityTab(pathname, tabParam) {
  if (tabParam && ['Discovery', 'Feed', 'Projects', 'Shots', 'Creators'].includes(tabParam)) {
    return tabParam;
  }
  if (pathname.includes('genjutsu')) return 'Feed';
  if (pathname.includes('soul-community')) return 'Shots';
  return 'Discovery';
}

function resolveCommunityFilter(pathname, filterParam) {
  if (filterParam) return filterParam;
  if (pathname.includes('genjutsu')) return 'genjutsu';
  if (pathname.includes('mixed-media')) return 'mixed-media';
  if (pathname.includes('soul-community')) return 'soul';
  return 'all';
}

export default function CommunityPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pushToast } = useApp();

  const tabQuery = searchParams.get('tab');
  const filterQuery = searchParams.get('filter');

  const [activeTab, setActiveTab] = useState(() => resolveCommunityTab(location.pathname, tabQuery));
  const [filter, setFilter] = useState(() => resolveCommunityFilter(location.pathname, filterQuery));
  const [contactEmail, setContactEmail] = useState('');
  const [contactTopic, setContactTopic] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    setActiveTab(resolveCommunityTab(location.pathname, tabQuery));
    setFilter(resolveCommunityFilter(location.pathname, filterQuery));
    setContactSent(false);
    setContactError('');
  }, [location.pathname, tabQuery, filterQuery]);

  const info = INFO_PAGES[location.pathname] || {
    badge: location.pathname.includes('soul-community')
      ? 'SOUL COMMUNITY'
      : location.pathname.includes('mixed-media')
      ? 'MIXED MEDIA'
      : 'COMMUNITY GALLERY',
    title: location.pathname.includes('genjutsu')
      ? 'Higgsfield Genjutsu Presets'
      : location.pathname.includes('soul-community')
      ? 'Soul ID & Photodump Community'
      : location.pathname.includes('mixed-media')
      ? 'Mixed Media Community'
      : 'Higgsfield Community Showcase',
    desc: 'Explore trending films, prompt recipes, verified creator channels, and visual styles shared worldwide.',
  };

  const items = useMemo(() => {
    const sets = {
      all: [
        ...INSIDE_PROJECTS.map((x) => ({ ...x, aspect: '16/9' })),
        ...SEEDANCE_25_ITEMS.slice(0, 6),
        ...GPT_IMAGE_2_ITEMS.slice(0, 6),
        ...SOUL_20_ITEMS.slice(0, 6),
      ],
      genjutsu: GENJUTSU_ITEMS,
      shorts: SHORTS_PRESETS,
      soul: [...SOUL_20_ITEMS, ...SOUL_CINEMA_ITEMS],
      cinema: [...INSIDE_PROJECTS.map((x) => ({ ...x, aspect: '16/9' })), ...SOUL_CINEMA_ITEMS],
      marketing: MARKETING_ITEMS,
      'mixed-media': [...GENJUTSU_ITEMS.slice(0, 6), ...SHORTS_PRESETS.slice(0, 6)],
    };
    const base = sets[filter] || sets.all;
    if (activeTab === 'Feed') {
      const vids = base.filter((x) => Boolean(x.video));
      return vids.length > 0 ? vids : SEEDANCE_25_ITEMS;
    }
    if (activeTab === 'Shots') {
      return [...SHORTS_PRESETS, ...SOUL_20_ITEMS.slice(0, 6)].map((x) => ({ ...x, aspect: '9/16' }));
    }
    return base;
  }, [filter, activeTab]);

  const isLegalOrContact = [
    '/contact',
    '/terms',
    '/privacy',
    '/trust',
    '/about',
    '/creator-hub/help-center',
    '/creator-partnership-program',
  ].includes(location.pathname);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = contactEmail.trim();
    const cleanTopic = contactTopic.trim();
    if (!EMAIL_RE.test(cleanEmail)) {
      setContactError('Please enter a valid email address.');
      return;
    }
    if (cleanTopic.length < 4) {
      setContactError('Please include a brief topic or inquiry message (min 4 characters).');
      return;
    }
    setContactError('');
    setContactSent(true);
    pushToast('Message sent to Higgsfield Support');
  };

  return (
    <main className="hf-container hf-subpage">
      {/* Persistent Community Hub Sub-Nav Bar */}
      {!isLegalOrContact && (
        <nav className="hf-underline-tabs" style={{ marginBottom: 20, overflowX: 'auto' }} aria-label="Community navigation">
          {COMMUNITY_TABS.map((t) => {
            const isTabBtn = ['Discovery', 'Feed', 'Projects', 'Shots', 'Creators'].includes(t.id);
            return isTabBtn ? (
              <button
                key={t.id}
                type="button"
                className={`hf-underline-tab ${activeTab === t.id ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveTab(t.id);
                  setSearchParams({ tab: t.id }, { replace: true });
                }}
              >
                {t.id}
              </button>
            ) : (
              <Link key={t.id} to={t.to} className="hf-underline-tab">
                {t.id}
              </Link>
            );
          })}
        </nav>
      )}

      <section className="hf-page-hero">
        <div>
          <span className="hf-page-badge">
            {location.pathname.includes('contest') ? <Award size={13} /> : isLegalOrContact ? <ShieldCheck size={13} /> : <Users size={13} />}
            <span>{info.badge}</span>
          </span>
          <h1 className="hf-page-title">{info.title}</h1>
          <p className="hf-page-desc">{info.desc}</p>
        </div>

        <div className="hf-section-actions">
          <Link to="/contests/community-contest" className="hf-cta-dark">
            <Award size={14} />
            <span>$1M Global Contest</span>
          </Link>
          <Link to="/generate" className="hf-cta-lime">
            <Sparkles size={14} />
            <span>Create Entry in Studio</span>
          </Link>
        </div>
      </section>

      {isLegalOrContact ? (
        <section className="hf-studio-panel" style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={18} color="#d1fe17" />
            <h2 style={{ margin: 0, fontSize: 18 }}>
              {location.pathname === '/trust' && searchParams.get('tab') === 'security'
                ? 'Responsible Security & Vulnerability Disclosure'
                : location.pathname === '/about' && searchParams.get('tab') === 'careers'
                ? 'Careers & Applied AI Engineering Roles'
                : location.pathname === '/creator-partnership-program'
                ? 'Creator Partnership Application'
                : 'Workspace Information & Support'}
            </h2>
          </div>
          <p style={{ margin: 0, color: '#b4b7bf', lineHeight: 1.6, fontSize: 14 }}>
            {location.pathname === '/trust' && searchParams.get('tab') === 'security'
              ? 'Found a security vulnerability? Submit reproducible details below or email security@higgsfield.ai. Please avoid destructive testing or accessing third-party accounts.'
              : location.pathname === '/about' && searchParams.get('tab') === 'careers'
              ? 'Join our San Francisco & remote engineering teams building Seedance 2.5, Cinema Studio 4.0, and agentic MCP infrastructure.'
              : 'Higgsfield, Inc. operates from 535 Mission St, 14th floor, San Francisco, CA 94105. Creators on paid plans retain full commercial usage rights to outputs generated with Seedance 2.5, GPT Image 2.6, Seedream 5.5, and Soul 2.0.'}
          </p>

          {contactSent ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ color: '#d1fe17', fontWeight: 600 }}>
                Message received from {contactEmail} &mdash; our San Francisco team responds within 24 hours.
              </div>
              <button
                type="button"
                className="hf-cta-dark"
                onClick={() => {
                  setContactSent(false);
                  setContactTopic('');
                }}
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} noValidate>
              {contactError && (
                <div className="hf-form-error" role="alert">
                  {contactError}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                <input
                  type="email"
                  required
                  className="hf-input"
                  placeholder="Your email address"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    if (contactError) setContactError('');
                  }}
                />
                <input
                  type="text"
                  required
                  className="hf-input"
                  placeholder="Topic / feedback message"
                  value={contactTopic}
                  onChange={(e) => {
                    setContactTopic(e.target.value);
                    if (contactError) setContactError('');
                  }}
                />
                <button type="submit" className="hf-cta-lime" style={{ height: 42 }}>
                  Submit Request
                </button>
              </div>
            </form>
          )}
        </section>
      ) : null}

      {/* Creators Leaderboard Directory when Creators tab is active */}
      {activeTab === 'Creators' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {CREATOR_PROFILES.map((c) => (
            <Link
              key={c.handle}
              to={`/${c.handle}`}
              className="hf-studio-panel"
              style={{ textDecoration: 'none', gap: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: 15, color: '#d1fe17' }}>{c.handle}</strong>
                <span className="hf-nav-badge">Rating {c.rating}</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#b4b7bf' }}>{c.role}</div>
              <div style={{ fontSize: 12, color: '#8f939c' }}>
                {c.followers} followers &bull; {c.worksCount} works
              </div>
            </Link>
          ))}
        </div>
      ) : activeTab === 'Projects' ? (
        <div className="hf-projects-grid">
          {INSIDE_PROJECTS.map((proj) => {
            const meta = PROJECT_SHORTLIST_MAP[proj.id] || {
              slug: proj.id,
              creator: proj.creator,
              badgeLabel: 'Higgsfield Selected',
            };
            return (
              <Link
                key={proj.id}
                to={`/${meta.creator}/projects/${meta.slug}`}
                className="hf-studio-panel"
                style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', gap: 0 }}
              >
                <img src={proj.img} alt={proj.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                <div style={{ padding: 14 }}>
                  <span className="hf-nav-badge" style={{ marginBottom: 6 }}>{meta.badgeLabel}</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{proj.title}</div>
                  <div style={{ fontSize: 12, color: '#8f939c', marginTop: 4 }}>{meta.creator} &bull; {proj.likes} likes</div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <>
          <div className="hf-chip-row" style={{ marginBottom: 18 }}>
            {[
              { key: 'all', label: 'Trending Showcase' },
              { key: 'genjutsu', label: 'Genjutsu Motion Swap' },
              { key: 'soul', label: 'Soul ID & Photodump' },
              { key: 'cinema', label: 'Soul Cinema & Films' },
              { key: 'shorts', label: 'Viral Shorts' },
              { key: 'marketing', label: 'Marketing & Ads' },
              { key: 'mixed-media', label: 'Mixed Media' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`hf-chip ${filter === tab.key ? 'is-active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hf-projects-grid">
            {items.map((item) => (
              <MediaCard key={`${activeTab}-${filter}-${item.id}`} item={item} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

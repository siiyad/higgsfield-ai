import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import {
  ACADEMY_LESSONS,
  APPS_CATALOG,
  BLOG_GUIDES,
  CREATOR_PROFILES,
  FABLE_BLOG_ARTICLES,
  INTRO_LANDING_PAGES,
} from '../../data/catalog';
import { FEATURE_PILLS, TOP_NAV_ITEMS } from '../../data/navigation';
import {
  FABLE_USE_CASES,
  GENJUTSU_ITEMS,
  GPT_IMAGE_2_ITEMS,
  INSIDE_PROJECTS,
  MARKETING_ITEMS,
  SEEDANCE_25_ITEMS,
  SHORTS_PRESETS,
  SOUL_20_ITEMS,
  SOUL_CINEMA_ITEMS,
  STUDIO_MODELS,
} from '../../data/showcase';
import { useApp } from '../../context/AppContext';

export default function SearchModal() {
  const { closeModal, openModal, t } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const entries = useMemo(() => {
    const tools = [
      ...TOP_NAV_ITEMS.map((item) => ({
        id: `nav-${item.id}`,
        title: item.label,
        subtitle: `Open ${item.label} workspace`,
        tag: item.badge || 'Workspace',
        to: item.to,
      })),
      ...STUDIO_MODELS.video.map((m) => ({
        id: `vm-${m.id}`,
        title: m.name,
        subtitle: m.desc,
        tag: m.tag,
        to: `/ai/video?model=${m.id}`,
      })),
      ...STUDIO_MODELS.image.map((m) => ({
        id: `im-${m.id}`,
        title: m.name,
        subtitle: m.desc,
        tag: m.tag,
        to: `/ai/image?model=${m.id}`,
      })),
      ...APPS_CATALOG.map((app) => ({
        id: `app-${app.id}`,
        title: app.name,
        subtitle: app.desc,
        tag: app.badge || 'Mini App',
        to: app.toolUrl,
      })),
      ...Object.entries(INTRO_LANDING_PAGES).map(([slug, p]) => ({
        id: `intro-${slug}`,
        title: p.title,
        subtitle: p.subtitle,
        tag: p.badge,
        to: `/${slug}`,
      })),
      ...Object.entries(FABLE_BLOG_ARTICLES).map(([slug, art]) => ({
        id: `blog-${slug}`,
        title: art.title,
        subtitle: art.summary,
        tag: 'Fable 5.2 Blog',
        to: `/@higgsfield.studio/blogs/${slug}`,
      })),
      ...BLOG_GUIDES.map((g, i) => ({
        id: `guide-${i}`,
        title: g.title,
        subtitle: `${g.category} • ${g.readTime}`,
        tag: g.category,
        to: g.to,
      })),
      ...ACADEMY_LESSONS.map((l) => ({
        id: `acad-${l.num}`,
        title: l.title,
        subtitle: l.desc,
        tag: 'Academy',
        to: '/academy',
      })),
      ...CREATOR_PROFILES.map((c) => ({
        id: `cr-${c.handle}`,
        title: `${c.handle} (${c.role})`,
        subtitle: `${c.followers} followers • ${c.worksCount} works`,
        tag: 'Creator',
        to: `/${c.handle}`,
      })),
      ...FEATURE_PILLS.map((p, idx) => ({
        id: `fp-${idx}`,
        title: p.label,
        subtitle: 'Launch creative feature',
        tag: 'Feature',
        to: p.to,
      })),
    ];

    const media = [
      ...FABLE_USE_CASES,
      ...SHORTS_PRESETS,
      ...INSIDE_PROJECTS,
      ...GENJUTSU_ITEMS,
      ...SEEDANCE_25_ITEMS,
      ...GPT_IMAGE_2_ITEMS,
      ...MARKETING_ITEMS,
      ...SOUL_CINEMA_ITEMS,
      ...SOUL_20_ITEMS,
    ].map((item) => ({
      id: `media-${item.id}`,
      title: item.title || item.model,
      subtitle: item.prompt,
      tag: item.model,
      thumb: item.poster || item.img,
      mediaItem: item,
    }));

    return [...tools, ...media];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 14);
    return entries
      .filter(
        (entry) =>
          entry.title?.toLowerCase().includes(q) ||
          entry.subtitle?.toLowerCase().includes(q) ||
          entry.tag?.toLowerCase().includes(q)
      )
      .slice(0, 18);
  }, [entries, query]);

  return (
    <div className="hf-modal-backdrop" onClick={closeModal}>
      <div
        className="hf-modal hf-modal--search"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search Higgsfield"
      >
        <div className="hf-search-input-bar">
          <Search size={18} color="#9fa3ab" />
          <input
            type="text"
            className="hf-search-input"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <span className="hf-search-kbd">ESC</span>
          <button
            type="button"
            className="hf-icon-btn"
            onClick={closeModal}
            aria-label="Close search"
          >
            <X size={15} />
          </button>
        </div>

        <div className="hf-search-results">
          {results.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: '#8f939b', fontSize: 13.5 }}>
              No presets or models matched &ldquo;{query}&rdquo;. Try &ldquo;Seedance&rdquo;,
              &ldquo;Mangaka&rdquo;, &ldquo;Genjutsu&rdquo;, or &ldquo;Canvas&rdquo;.
            </div>
          ) : (
            results.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="hf-search-row"
                onClick={() => {
                  if (entry.mediaItem) {
                    openModal({ type: 'inspector', item: entry.mediaItem });
                  } else {
                    closeModal();
                    navigate(entry.to);
                  }
                }}
              >
                <div className="hf-search-row__left">
                  {entry.thumb && (
                    <img src={entry.thumb} alt="" className="hf-search-row__thumb" />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div className="hf-search-row__title">{entry.title}</div>
                    <div className="hf-search-row__sub">{entry.subtitle}</div>
                  </div>
                </div>
                <span className="hf-search-row__tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {entry.tag}
                  <ArrowUpRight size={12} />
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

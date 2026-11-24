import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Maximize2 } from 'lucide-react';
import { INSIDE_PROJECTS } from '../../data/showcase';
import { PROJECT_SHORTLIST_MAP } from '../../data/catalog';
import { useApp } from '../../context/AppContext';
import SectionHeader from '../common/SectionHeader';
import BrandLogo from '../common/BrandLogo';
import FloatingCtaPill from '../common/FloatingCtaPill';

export default function InsideProjectsSection() {
  const { openModal, likedIds, toggleLike } = useApp();

  return (
    <section className="hf-container hf-section" aria-label="Explore the inside of every project">
      <SectionHeader
        title="Explore the inside of every project"
        subtitle="See all prompts, assets, and how each project was created"
        to="/community"
      />

      <div className="hf-gallery-clip hf-gallery-clip--projects">
        <div className="hf-projects-grid">
          {INSIDE_PROJECTS.map((proj) => {
            const meta = PROJECT_SHORTLIST_MAP[proj.id] || {
              slug: proj.id.replace('proj-', ''),
              creator: proj.creator,
              badgeLabel: 'Higgsfield Selected',
            };
            const projectUrl = `/${meta.creator}/projects/${meta.slug}`;
            const isLiked = likedIds.includes(proj.id);

            return (
              <article key={proj.id} className="hf-project-card">
                <img src={proj.img} alt={proj.title} loading="lazy" decoding="async" />

                <Link
                  to={projectUrl}
                  className="hf-card-hitarea"
                  aria-label={`View ${proj.title}`}
                />

                {proj.badgeColor !== 'none' && (
                  <span
                    className={`hf-project-corner-badge hf-project-corner-badge--${proj.badgeColor}`}
                    style={{ zIndex: 4, pointerEvents: 'none' }}
                    title={meta.badgeLabel}
                    aria-label={meta.badgeLabel}
                  >
                    <BrandLogo size={13} />
                  </span>
                )}

                <div className="hf-project-hover-top">
                  <span className="hf-project-shortlist-pill">{meta.badgeLabel}</span>
                  <button
                    type="button"
                    className="hf-project-quick-btn"
                    onClick={() => openModal({ type: 'inspector', item: proj })}
                    title="Quick inspect prompt"
                    aria-label={`Quick inspect ${proj.title}`}
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>

                <div className="hf-project-card__bottom">
                  <Link
                    to={`/${meta.creator}`}
                    className="hf-project-avatar"
                    style={{ position: 'static' }}
                    title={`View ${meta.creator}`}
                    aria-label={`Creator profile ${meta.creator}`}
                  >
                    {meta.creator.slice(1, 3)}
                  </Link>

                  <button
                    type="button"
                    className={`hf-project-like-pill ${isLiked ? 'is-liked' : ''}`}
                    onClick={() => toggleLike(proj.id)}
                    aria-label={`Like ${proj.title}`}
                  >
                    <Heart size={11} fill={isLiked ? '#ff4477' : 'none'} />
                    <span>{proj.likes}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <FloatingCtaPill label="Explore community" to="/community" />
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CanvasBannerSection() {
  const { t } = useApp();
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = (e) => setIsCompact(e.matches);
    setIsCompact(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <section className="hf-container">
      <Link to="/canvas" className="hf-canvas-banner" aria-label="One Canvas Every Workflow">
        {isCompact && (
          <img
            src="https://static.higgsfield.ai/canvas-banner-mobile.webp"
            alt="Higgsfield Canvas workflow nodes"
            className="hf-canvas-art-mobile"
          />
        )}

        <div className="hf-canvas-banner__copy">
          <span className="hf-canvas-tag">NEW FEATURE</span>
          <h2 className="hf-canvas-title">
            ONE CANVAS.
            <br />
            EVERY WORKFLOW.
          </h2>
          <p className="hf-canvas-sub">
            Moodboard, chain workflows, and share with your team &ndash; all on one canvas
          </p>
          <span className="hf-cta-white">
            <Sparkles size={14} />
            <span>{t('tryCanvas')}</span>
          </span>
        </div>

        {!isCompact && (
          <img
            src="https://static.higgsfield.ai/canvas-banner-desktop-new.webp"
            alt=""
            className="hf-canvas-art-desktop"
          />
        )}
      </Link>
    </section>
  );
}

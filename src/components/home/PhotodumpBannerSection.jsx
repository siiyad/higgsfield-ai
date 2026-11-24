import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function PhotodumpBannerSection() {
  const { t } = useApp();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 900 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <section className="hf-container">
      <Link to="/photodump" className="hf-photodump-banner" aria-label="Try Photodump">
        <div className="hf-photodump-copy">
          <span className="hf-photodump-pill">PHOTODUMP</span>
          <h2 className="hf-photodump-title">
            DIFFERENT SCENES
            <br />
            SAME STAR
          </h2>
          <p className="hf-photodump-sub">Build your character. One click does the rest</p>
          <span className="hf-cta-white">{t('tryPhotodump')}</span>
        </div>

        {isMobile ? (
          <img
            src="https://static.higgsfield.ai/public/photodump/cta-mobile.png"
            alt="Photodump consistent AI character shots"
            className="hf-photodump-img-mobile"
          />
        ) : (
          <img
            src="https://static.higgsfield.ai/public/photodump/cta-desktop.png"
            alt=""
            className="hf-photodump-img-desktop"
          />
        )}
      </Link>
    </section>
  );
}

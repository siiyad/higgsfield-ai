import React from 'react';
import { useApp } from '../../context/AppContext';

export default function CookieBanner() {
  const { cookieConsent, saveCookiePrefs, openModal } = useApp();

  if (cookieConsent?.saved) return null;

  return (
    <aside className="hf-cookie-card" aria-label="Cookie consent notice">
      <h3 className="hf-cookie-card__title">Cookie Notice</h3>
      <p className="hf-cookie-card__body">
        We use cookies to power workspace playback, remember your theme &amp; saved prompts, and
        improve creative suite performance.
      </p>
      <div className="hf-cookie-card__actions">
        <button
          type="button"
          className="hf-cookie-btn-accept"
          onClick={() =>
            saveCookiePrefs({ essential: true, functional: true, analytics: true })
          }
        >
          Accept All
        </button>
        <button
          type="button"
          className="hf-cookie-btn-secondary"
          onClick={() =>
            saveCookiePrefs({ essential: true, functional: false, analytics: false })
          }
        >
          Essential Only
        </button>
        <button
          type="button"
          className="hf-cookie-btn-secondary"
          onClick={() => openModal({ type: 'cookiePrefs' })}
        >
          Manage
        </button>
      </div>
    </aside>
  );
}

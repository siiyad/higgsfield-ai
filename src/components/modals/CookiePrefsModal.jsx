import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CookiePrefsModal() {
  const { cookieConsent, saveCookiePrefs, closeModal } = useApp();
  const [functional, setFunctional] = useState(Boolean(cookieConsent?.functional));
  const [analytics, setAnalytics] = useState(Boolean(cookieConsent?.analytics));

  return (
    <div className="hf-modal-backdrop" onClick={closeModal}>
      <div
        className="hf-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie Preferences"
      >
        <button type="button" className="hf-modal__close" onClick={closeModal} aria-label="Close modal">
          <X size={16} />
        </button>

        <div className="hf-auth-body">
          <div className="hf-page-badge">
            <ShieldCheck size={13} />
            <span>PRIVACY CENTER</span>
          </div>
          <h2 className="hf-auth-title">Cookie Preferences</h2>
          <p className="hf-auth-sub">
            Manage how Higgsfield stores local workspace state and telemetry preferences.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            <div className="hf-cookie-row">
              <div>
                <strong style={{ fontSize: 13.5 }}>Strictly Essential</strong>
                <div style={{ fontSize: 12, color: '#92969f' }}>
                  Required for authentication, session security, and studio routing.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                className="hf-switch is-on"
                disabled
                aria-checked="true"
                aria-label="Essential always on"
              >
                <span className="hf-switch__thumb" />
              </button>
            </div>

            <div className="hf-cookie-row">
              <div>
                <strong style={{ fontSize: 13.5 }}>Functional &amp; Preferences</strong>
                <div style={{ fontSize: 12, color: '#92969f' }}>
                  Remembers your chosen language, liked presets, and prompt history.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                className={`hf-switch ${functional ? 'is-on' : ''}`}
                onClick={() => setFunctional((v) => !v)}
                aria-checked={functional}
                aria-label="Toggle functional cookies"
              >
                <span className="hf-switch__thumb" />
              </button>
            </div>

            <div className="hf-cookie-row">
              <div>
                <strong style={{ fontSize: 13.5 }}>Performance &amp; Model Quality</strong>
                <div style={{ fontSize: 12, color: '#92969f' }}>
                  Helps improve latency and video CDN streaming quality.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                className={`hf-switch ${analytics ? 'is-on' : ''}`}
                onClick={() => setAnalytics((v) => !v)}
                aria-checked={analytics}
                aria-label="Toggle analytics cookies"
              >
                <span className="hf-switch__thumb" />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="hf-btn-lime-block"
            onClick={() => saveCookiePrefs({ essential: true, functional, analytics })}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

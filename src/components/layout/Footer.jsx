import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { FOOTER_COLUMNS, LANGUAGES, SOCIAL_LINKS } from '../../data/navigation';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { language, setLanguage, openModal } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef(null);

  const activeLang = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  useEffect(() => {
    const closeOnClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnClickOutside);
    return () => document.removeEventListener('mousedown', closeOnClickOutside);
  }, []);

  return (
    <footer>
      <div className="hf-footer-shell">
        <div className="hf-footer-inner">
          <div className="hf-footer-top">
            <div className="hf-footer-brand-wrap">
              <h2 className="hf-footer-brand">
                AI-NATIVE
                <br />
                CREATIVE SUITE
              </h2>
            </div>

            {FOOTER_COLUMNS.map((col, colIndex) => (
              <div key={colIndex} className="hf-footer-col">
                {col.groups.map((group) => (
                  <div key={group.title}>
                    <p className="hf-footer-group-title">{group.title}</p>
                    <ul className="hf-footer-links">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link to={link.to} className="hf-footer-link">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="hf-footer-bottom">
            <p className="hf-footer-address">
              535 Mission St, 14th floor, San Francisco, CA, 94105
            </p>
            <div className="hf-footer-socials">
              {SOCIAL_LINKS.map((soc) => (
                <Link key={soc.label} to={soc.internalTo}>
                  {soc.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hf-subfooter">
        <div className="hf-subfooter__inner">
          <p className="hf-subfooter__copy">© 2026 Higgsfield, Inc. All rights reserved.</p>

          <div className="hf-subfooter__legal">
            <div className="hf-lang-menu-wrap" ref={langRef}>
              <button
                type="button"
                className="hf-lang-trigger"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                aria-expanded={langMenuOpen}
              >
                <span>{activeLang.flag}</span>
                <span>{activeLang.label}</span>
                <ChevronDown size={13} />
              </button>

              {langMenuOpen && (
                <div className="hf-dropdown-menu hf-dropdown-menu--up">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`hf-dropdown-item ${language === lang.code ? 'is-selected' : ''}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                    >
                      <span>
                        {lang.flag} {lang.native}
                      </span>
                      {language === lang.code && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/creator-hub/help-center" className="hf-subfooter__link">
              Help center
            </Link>
            <button
              type="button"
              className="hf-subfooter__link"
              onClick={() => openModal({ type: 'cookiePrefs' })}
            >
              Cookie Notice
            </button>
            <Link to="/terms" className="hf-subfooter__link">
              Terms
            </Link>
            <Link to="/privacy" className="hf-subfooter__link">
              Privacy
            </Link>
            <Link to="/trust?tab=security" className="hf-subfooter__link">
              Report a vulnerability
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

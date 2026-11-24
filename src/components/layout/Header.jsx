import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Crown,
  Instagram,
  Languages,
  LogOut,
  Menu,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { HEADER_MEGA_MENUS, LANGUAGES, TOP_NAV_ITEMS } from '../../data/navigation';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { user, logout, language, setLanguage, openModal, t } = useApp();
  const location = useLocation();
  const scrollerRef = useRef(null);
  const langMenuRef = useRef(null);
  const navWrapRef = useRef(null);
  const megaRef = useRef(null);
  const drawerCloseRef = useRef(null);
  const drawerPrevFocusRef = useRef(null);
  const megaTimerRef = useRef(null);
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMegaKey, setOpenMegaKey] = useState(null);
  const [megaLeft, setMegaLeft] = useState(56);
  const [promoDismissed, setPromoDismissed] = useState(false);

  const showPromoStrip =
    !user &&
    !promoDismissed &&
    ['/ai/image', '/ai/video', '/generate', '/mcp', '/shorts-studio', '/effects/use'].some((p) =>
      location.pathname.startsWith(p)
    );

  useEffect(() => {
    setDrawerOpen(false);
    setLangOpen(false);
    setOpenMegaKey(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (
        navWrapRef.current &&
        !navWrapRef.current.contains(event.target) &&
        (!megaRef.current || !megaRef.current.contains(event.target))
      ) {
        setOpenMegaKey(null);
      }
    };
    const onFocusIn = (event) => {
      if (
        openMegaKey &&
        navWrapRef.current &&
        !navWrapRef.current.contains(event.target) &&
        (!megaRef.current || !megaRef.current.contains(event.target))
      ) {
        setOpenMegaKey(null);
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpenMegaKey(null);
        setLangOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('focusin', onFocusIn);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('keydown', onKey);
    };
  }, [openMegaKey]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    drawerPrevFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frameId = window.requestAnimationFrame(() => {
      drawerCloseRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frameId);
      document.body.style.overflow = prevOverflow;
      drawerPrevFocusRef.current?.focus?.();
    };
  }, [drawerOpen]);

  const handleScrollRight = () => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  const handleNavEnter = (item, event) => {
    if (megaTimerRef.current) {
      window.clearTimeout(megaTimerRef.current);
      megaTimerRef.current = null;
    }
    if (!item.megaMenuKey) {
      setOpenMegaKey(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setMegaLeft(Math.max(16, Math.min(rect.left - 12, window.innerWidth - 780)));
    setOpenMegaKey(item.megaMenuKey);
  };

  const handleNavLeave = () => {
    megaTimerRef.current = window.setTimeout(() => {
      setOpenMegaKey(null);
    }, 140);
  };

  const keepMegaOpen = () => {
    if (megaTimerRef.current) {
      window.clearTimeout(megaTimerRef.current);
      megaTimerRef.current = null;
    }
  };

  const isNavItemActive = (item) => {
    if (item.exact) return location.pathname === '/' && !location.search;
    const itemUrl = `${location.pathname}${location.search}`;
    if (itemUrl === item.to) return true;
    const base = item.to.split('?')[0];
    return base !== '/' && !item.to.includes('?') && location.pathname === base;
  };

  const activeMega = openMegaKey ? HEADER_MEGA_MENUS[openMegaKey] : null;

  return (
    <>
      {showPromoStrip && (
        <div className="hf-top-promo" role="region" aria-label="Discount announcement">
          <Tag size={13} />
          <span>Get an additional discount on premium plans after signing up</span>
          <button
            type="button"
            className="hf-top-promo__btn"
            onClick={() => openModal({ type: 'auth', mode: 'discount' })}
          >
            Get your discount
          </button>
          <button
            type="button"
            className="hf-top-promo__close"
            onClick={() => setPromoDismissed(true)}
            aria-label="Close announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <header className="hf-header">
        <div className="hf-header__inner">
          <div className="hf-header__left">
            <Link to="/" className="hf-logo-link" aria-label="Higgsfield Home">
              <span className="hf-logo-tile">
                <BrandLogo size={17} />
              </span>
              <span className="hf-logo-wordmark">Higgsfield</span>
            </Link>

            <nav
              ref={navWrapRef}
              className="hf-nav-wrap"
              aria-label="Primary navigation"
              onMouseLeave={handleNavLeave}
            >
              <div ref={scrollerRef} className="hf-nav-scroller no-scrollbar">
                {TOP_NAV_ITEMS.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <Link
                      to={item.to}
                      className={`hf-nav-item ${isNavItemActive(item) ? 'is-active' : ''}`}
                      onMouseEnter={(e) => handleNavEnter(item, e)}
                      onFocus={(e) => handleNavEnter(item, e)}
                      aria-haspopup={item.megaMenuKey ? 'menu' : undefined}
                      aria-expanded={item.megaMenuKey ? openMegaKey === item.megaMenuKey : undefined}
                    >
                      <span className={item.shimmer ? 'hf-shimmer-text' : undefined}>
                        {item.id === 'explore' ? t('explore') : item.label}
                      </span>
                      {item.megaMenuKey && (
                        <ChevronDown
                          size={11}
                          style={{
                            opacity: openMegaKey === item.megaMenuKey ? 1 : 0.55,
                            transform: openMegaKey === item.megaMenuKey ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.15s ease',
                          }}
                        />
                      )}
                      {item.badge && <span className="hf-nav-badge">{item.badge}</span>}
                    </Link>
                    {idx === 5 && <span className="hf-nav-divider" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
              <button
                type="button"
                className="hf-nav-scroll-btn"
                onClick={handleScrollRight}
                aria-label="Scroll navigation right"
              >
                <ChevronRight size={14} />
              </button>
            </nav>
          </div>

          <div className="hf-header__actions">
            <button
              type="button"
              className="hf-icon-btn hf-hide-mobile"
              onClick={() => openModal({ type: 'search' })}
              aria-label="Search (Ctrl+K)"
              title="Search (Ctrl+K)"
            >
              <Search size={15} />
            </button>

            <div className="hf-lang-menu-wrap hf-hide-mobile" ref={langMenuRef}>
              <button
                type="button"
                className="hf-icon-btn"
                onClick={() => setLangOpen((prev) => !prev)}
                aria-label="Change language"
                aria-expanded={langOpen}
              >
                <Languages size={15} />
              </button>
              {langOpen && (
                <div className="hf-dropdown-menu" role="menu">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`hf-dropdown-item ${language === lang.code ? 'is-selected' : ''}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
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

            <Link to="/enterprise" className="hf-hdr-pill hf-hide-mobile">
              <Building2 size={14} />
              <span>{t('enterprise')}</span>
            </Link>

            <Link to="/pricing" className="hf-hdr-pill hf-hdr-pricing">
              <Crown size={14} color="#f5f5f5" />
              <span>{t('pricing')}</span>
              <span className="hf-discount-ribbon hf-hide-mobile">30% OFF</span>
              <span className="hf-discount-ribbon hf-mobile-only">30% OFF</span>
            </Link>

            <Link
              to="/community"
              className="hf-icon-btn hf-mobile-only"
              aria-label="Higgsfield Community"
            >
              <Instagram size={16} />
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="hf-user-chip hf-hide-mobile" title={user.email}>
                  <Sparkles size={13} color="#d1fe17" />
                  <span className="hf-hide-tablet">{user.name}</span>
                  <span className="hf-user-chip__credits">{user.credits} cr</span>
                </Link>
                <button
                  type="button"
                  className="hf-icon-btn hf-hide-mobile"
                  onClick={logout}
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="hf-btn-login hf-hide-mobile"
                  onClick={() => openModal({ type: 'auth', mode: 'login' })}
                >
                  {t('login')}
                </button>
                <button
                  type="button"
                  className="hf-btn-signup"
                  onClick={() => openModal({ type: 'auth', mode: 'signup' })}
                >
                  {t('signup')}
                </button>
              </>
            )}

            <button
              type="button"
              className="hf-icon-btn hf-mobile-only"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Hover Mega-Menu (Image, Video, Audio, MCP) */}
      {activeMega && (
        <div
          ref={megaRef}
          className={`hf-megamenu ${activeMega.models.length === 0 ? 'hf-megamenu--single' : ''}`}
          style={{ left: activeMega.models.length === 0 ? Math.min(megaLeft, 480) : megaLeft }}
          role="menu"
          aria-label={`${openMegaKey} quick tools and models`}
          onMouseEnter={keepMegaOpen}
          onMouseLeave={handleNavLeave}
        >
          <div>
            <p className="hf-megamenu__heading">
              {openMegaKey === 'mcp' ? 'Generate with Higgsfield in' : `${openMegaKey} Tools`}
            </p>
            <div className="hf-megamenu__list">
              {activeMega.tools.map((entry) => (
                <Link
                  key={entry.label}
                  to={entry.to}
                  className="hf-megamenu__item"
                  onClick={() => setOpenMegaKey(null)}
                >
                  <span className="hf-megamenu__item-top">
                    <span>{entry.label}</span>
                    {entry.badge && <span className="hf-megamenu__badge">{entry.badge}</span>}
                  </span>
                  <span className="hf-megamenu__item-desc">{entry.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {activeMega.models.length > 0 && (
            <div>
              <p className="hf-megamenu__heading">Foundation Models</p>
              <div className="hf-megamenu__list">
                {activeMega.models.map((model) => (
                  <Link
                    key={model.label}
                    to={model.to}
                    className="hf-megamenu__item"
                    onClick={() => setOpenMegaKey(null)}
                  >
                    <span className="hf-megamenu__item-top">
                      <span>{model.label}</span>
                      {model.badge && <span className="hf-megamenu__badge">{model.badge}</span>}
                    </span>
                    <span className="hf-megamenu__item-desc">{model.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {drawerOpen && (
        <div
          className="hf-mobile-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
        >
          <div className="hf-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <span className="hf-logo-tile">
                  <BrandLogo size={16} />
                </span>
                Higgsfield Suite
              </span>
              <button
                ref={drawerCloseRef}
                type="button"
                className="hf-icon-btn"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </div>

            <button
              type="button"
              className="hf-btn-ghost-block"
              onClick={() => {
                setDrawerOpen(false);
                openModal({ type: 'search' });
              }}
            >
              <Search size={15} />
              <span>Search models &amp; studios</span>
            </button>

            <div className="hf-mobile-drawer__grid">
              {TOP_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={`hf-mobile-drawer__link ${isNavItemActive(item) ? 'is-active' : ''}`}
                >
                  <span>{item.id === 'explore' ? t('explore') : item.label}</span>
                  {item.badge && <span className="hf-nav-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
              <Link to="/enterprise" className="hf-btn-ghost-block">
                <Building2 size={15} />
                <span>Enterprise</span>
              </Link>
              {user ? (
                <button type="button" className="hf-btn-ghost-block" onClick={logout}>
                  <LogOut size={15} />
                  <span>Sign out ({user.credits} credits)</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="hf-btn-lime-block"
                  onClick={() => {
                    setDrawerOpen(false);
                    openModal({ type: 'auth', mode: 'signup' });
                  }}
                >
                  Sign up &amp; get extra discount
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

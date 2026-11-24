import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ initialMode = 'signup' }) {
  const { user, loginDemo, logout, closeModal, likedIds, savedGenerations } = useApp();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
    setFormError('');
  }, [initialMode]);

  if (user && mode === 'profile') {
    return (
      <div className="hf-modal-backdrop" onClick={closeModal}>
        <div
          className="hf-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Creator Profile"
        >
          <button type="button" className="hf-modal__close" onClick={closeModal} aria-label="Close modal">
            <X size={16} />
          </button>
          <div className="hf-auth-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span className="hf-logo-tile" style={{ width: 42, height: 42, borderRadius: 11 }}>
                <BrandLogo size={24} />
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 19 }}>{user.name}</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>
                  {user.handle} &bull; {user.plan}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                marginBottom: 18,
              }}
            >
              <div className="hf-bento-item">
                <span style={{ fontSize: 11.5, color: '#8f939b' }}>Credits</span>
                <strong style={{ fontSize: 20, color: '#d1fe17' }}>{user.credits}</strong>
              </div>
              <div className="hf-bento-item">
                <span style={{ fontSize: 11.5, color: '#8f939b' }}>Liked Presets</span>
                <strong style={{ fontSize: 20 }}>{likedIds.length}</strong>
              </div>
              <div className="hf-bento-item">
                <span style={{ fontSize: 11.5, color: '#8f939b' }}>Renders</span>
                <strong style={{ fontSize: 20 }}>{savedGenerations.length}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                className="hf-btn-lime-block"
                onClick={() => {
                  closeModal();
                  navigate('/generate');
                }}
              >
                <Sparkles size={15} />
                <span>Open Creative Studio</span>
              </button>
              <button
                type="button"
                className="hf-btn-ghost-block"
                onClick={() => {
                  logout();
                  closeModal();
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDiscount = mode === 'discount';
  const isLogin = mode === 'login';

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!EMAIL_RE.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (password.trim().length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    setFormError('');
    loginDemo({
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      bonusCredits: isDiscount ? 300 : 100,
      plan: isDiscount ? 'Unlimited Promo (30% OFF)' : 'Creator Starter',
    });
  };

  return (
    <div className="hf-modal-backdrop" onClick={closeModal}>
      <div
        className="hf-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Higgsfield Authentication"
      >
        <button type="button" className="hf-modal__close" onClick={closeModal} aria-label="Close modal">
          <X size={16} />
        </button>

        <div className="hf-auth-body">
          {isDiscount ? (
            <div className="hf-auth-badge">EXTRA 30% OFF + UNLIMITED PROMO ACCESS</div>
          ) : (
            <div className="hf-page-badge">HIGGSFIELD AI WORKSPACE</div>
          )}

          <h2 className="hf-auth-title">
            {isLogin
              ? 'Welcome back'
              : isDiscount
              ? 'Unlock extra discount'
              : 'Create your account'}
          </h2>
          <p className="hf-auth-sub">
            {isLogin
              ? 'Sign in to continue creating with Seedance 2.5, Soul 2.0, and Genjutsu.'
              : 'Get instant credits for Seedance 2.5, GPT Image 2.6, Seedream 5.5 & Claude MCP.'}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {formError && (
              <div className="hf-form-error" role="alert">
                {formError}
              </div>
            )}

            {!isLogin && (
              <div className="hf-form-group">
                <label className="hf-form-label" htmlFor="hf-auth-name">
                  Creator or Studio Name
                </label>
                <input
                  id="hf-auth-name"
                  type="text"
                  className="hf-input"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError('');
                  }}
                />
              </div>
            )}

            <div className="hf-form-group">
              <label className="hf-form-label" htmlFor="hf-auth-email">
                Work or Personal Email
              </label>
              <input
                id="hf-auth-email"
                type="email"
                required
                className="hf-input"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError('');
                }}
              />
            </div>

            <div className="hf-form-group">
              <label className="hf-form-label" htmlFor="hf-auth-pass">
                Password
              </label>
              <input
                id="hf-auth-pass"
                type="password"
                required
                minLength={6}
                className="hf-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError('');
                }}
              />
            </div>

            {!isLogin && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  color: '#a7aab2',
                  marginBottom: 14,
                }}
              >
                <CheckCircle2 size={15} color="#d1fe17" />
                <span>Includes {isDiscount ? '800' : '600'} instant demo credits</span>
              </div>
            )}

            <button type="submit" className="hf-btn-lime-block">
              {isLogin
                ? 'Sign in to workspace'
                : isDiscount
                ? 'Claim 30% discount & enter studio'
                : 'Create free account'}
            </button>
          </form>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              className="hf-btn-ghost-block"
              onClick={() =>
                loginDemo({
                  email: 'demo@higgsfield.ai',
                  name: 'Demo Director',
                  bonusCredits: 500,
                  plan: 'Plus Preview',
                })
              }
            >
              One-click instant Guest Studio session
            </button>

            <p style={{ margin: '4px 0 0', textAlign: 'center', fontSize: 12.5, color: '#9498a1' }}>
              {isLogin ? 'New to Higgsfield? ' : 'Already have an account? '}
              <button
                type="button"
                style={{ color: '#d1fe17', fontWeight: 600 }}
                onClick={() => setMode(isLogin ? 'signup' : 'login')}
              >
                {isLogin ? 'Sign up free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

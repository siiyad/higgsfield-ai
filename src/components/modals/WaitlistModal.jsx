import React, { useState } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistModal() {
  const { closeModal, joinWaitlist, waitlistJoined } = useApp();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Director / VFX Artist');
  const [formError, setFormError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!EMAIL_RE.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setFormError('');
    joinWaitlist({ email: cleanEmail, role });
  };

  const joinedEmail = typeof waitlistJoined === 'object' ? waitlistJoined?.email : null;
  const joinedRole = typeof waitlistJoined === 'object' ? waitlistJoined?.role : null;

  return (
    <div className="hf-modal-backdrop" onClick={closeModal}>
      <div
        className="hf-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Higgsfield Miracle Waitlist"
      >
        <button type="button" className="hf-modal__close" onClick={closeModal} aria-label="Close modal">
          <X size={16} />
        </button>

        <div className="hf-auth-body">
          <div className="hf-page-badge">EARLY ACCESS WAITLIST</div>
          <h2 className="hf-auth-title">Higgsfield Miracle</h2>
          <p className="hf-auth-sub">
            Reserve early access to our proprietary temporal neural video &amp; relighting editor.
          </p>

          {waitlistJoined ? (
            <div
              style={{
                padding: 18,
                borderRadius: 14,
                background: 'rgba(209, 254, 23, 0.1)',
                border: '1px solid rgba(209, 254, 23, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: '#d1fe17',
              }}
            >
              <CheckCircle2 size={22} />
              <div>
                <strong>You are on the priority list.</strong>
                <div style={{ fontSize: 12.5, color: '#d7d9de', marginTop: 2 }}>
                  {joinedEmail
                    ? `We will notify ${joinedEmail}${joinedRole ? ` (${joinedRole})` : ''} as Miracle invites unlock via MCP & web studio.`
                    : 'We will notify you as Miracle invites unlock via MCP & web studio.'}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {formError && (
                <div className="hf-form-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="hf-form-group">
                <label className="hf-form-label" htmlFor="hf-wl-email">
                  Email Address
                </label>
                <input
                  id="hf-wl-email"
                  type="email"
                  required
                  className="hf-input"
                  placeholder="director@studio.io"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError('');
                  }}
                />
              </div>

              <div className="hf-form-group">
                <label className="hf-form-label" htmlFor="hf-wl-role">
                  Primary Workflow
                </label>
                <select
                  id="hf-wl-role"
                  className="hf-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Director / VFX Artist">Director / VFX Artist</option>
                  <option value="Creative Technologist (MCP)">Creative Technologist (MCP)</option>
                  <option value="Brand &amp; Growth Studio">Brand &amp; Growth Studio</option>
                  <option value="Independent Filmmaker">Independent Filmmaker</option>
                </select>
              </div>

              <button type="submit" className="hf-btn-lime-block" style={{ marginTop: 8 }}>
                <Sparkles size={15} />
                <span>Request Early Access</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

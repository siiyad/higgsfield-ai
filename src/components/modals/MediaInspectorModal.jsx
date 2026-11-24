import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Heart, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MediaInspectorModal({ item }) {
  const { likedIds, toggleLike, closeModal, pushToast } = useApp();
  const navigate = useNavigate();

  if (!item) return null;

  const isLiked = likedIds.includes(item.id);
  const mediaPoster = item.poster || item.img;
  const mediaVideo = item.video;
  const promptText =
    item.prompt || 'Cinematic generation created with Higgsfield AI Creative Suite.';

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      pushToast('Prompt copied to clipboard');
    } catch {
      pushToast('Prompt ready in Studio Remix');
    }
  };

  const handleRemix = () => {
    closeModal();
    const params = new URLSearchParams({
      prompt: promptText,
      modelName: item.model || 'Seedance 2.5',
    });
    navigate(`/generate?${params.toString()}`);
  };

  return (
    <div className="hf-modal-backdrop" onClick={closeModal}>
      <div
        className="hf-modal hf-modal--wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.title || item.model}
      >
        <button type="button" className="hf-modal__close" onClick={closeModal} aria-label="Close inspector">
          <X size={16} />
        </button>

        <div className="hf-inspector-grid">
          <div className="hf-inspector-stage">
            {mediaVideo ? (
              <video
                src={mediaVideo}
                poster={mediaPoster}
                controls
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img src={mediaPoster} alt={item.title || item.model} />
            )}
          </div>

          <div className="hf-inspector-meta">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="hf-page-badge" style={{ width: 'fit-content', marginBottom: 0 }}>
                {item.model || 'Higgsfield AI'}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--hf-font-display)',
                  fontSize: 21,
                  textTransform: 'uppercase',
                }}
              >
                {item.title || item.model || 'Community Preset'}
              </h3>

              {item.creator && (
                <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>
                  Created by <strong style={{ color: '#ffffff' }}>{item.creator}</strong>
                </p>
              )}

              <div>
                <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 700, color: '#8c9099', textTransform: 'uppercase' }}>
                  Prompt &amp; Recipe
                </p>
                <div className="hf-inspector-prompt-box">{promptText}</div>
              </div>

              {item.tags && (
                <div className="hf-chip-row">
                  {item.tags.map((tag) => (
                    <span key={tag} className="hf-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <button type="button" className="hf-btn-lime-block" onClick={handleRemix}>
                <Sparkles size={15} />
                <span>Remix in Studio</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button type="button" className="hf-btn-ghost-block" onClick={handleCopyPrompt}>
                  <Copy size={14} />
                  <span>Copy prompt</span>
                </button>
                <button
                  type="button"
                  className="hf-btn-ghost-block"
                  onClick={() => toggleLike(item.id)}
                  style={{
                    color: isLiked ? '#ff4477' : undefined,
                    borderColor: isLiked ? 'rgba(255, 68, 119, 0.45)' : undefined,
                  }}
                >
                  <Heart size={14} fill={isLiked ? '#ff4477' : 'none'} />
                  <span>{isLiked ? 'Liked' : 'Save like'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Play, Plus, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const INITIAL_COMMENTS = [
  { author: 'Mito', text: "Let's create an engaging video for our brand — uploaded the product keyframe!", color: '#22c55e' },
  { author: 'Gloria', text: "That's cool! Let's pipe node 2 into Seedance 2.5 with a soft dolly zoom.", color: '#d1fe17' },
];

const INITIAL_NODES = [
  {
    id: 'node-1',
    step: '01 • Reference Moodboard',
    badge: 'Ready',
    badgeColor: '#22c55e',
    kind: 'image',
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_36Hwty94QweUxs82UEGsxmReIrf%2Fhf_20260218_124914_3497c398-0398-44f7-a5b7-395d6c832886.png&w=640&q=85',
    alt: 'Soul reference frame',
    title: 'Soul ID • Brand Ambassador',
    desc: 'Locked skin tone & pastel lighting style',
    active: true,
    removable: false,
  },
  {
    id: 'node-2',
    step: '02 • Image Generation',
    badge: 'GPT Image 2.6',
    badgeColor: '#d1fe17',
    kind: 'image',
    src: 'https://static.higgsfield.ai/canvas-banner-mobile.webp',
    alt: 'Canvas generated keyframe',
    title: 'Hero Editorial Campaign Keyframe',
    desc: '4K studio beauty frame + bubblegum prop',
    active: true,
    removable: false,
  },
  {
    id: 'node-3',
    step: '03 • Video Generation',
    badge: 'Seedance 2.5',
    badgeColor: '#60a5fa',
    kind: 'video',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_3Cfdr00kbZ1hJCLpPQkaicInqxv/hf_20260422_011129_528f4835-f2b2-4b35-90a0-e4471af95636.mp4',
    poster: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fcdn.higgsfield.ai%2Fuser_3Cfdr00kbZ1hJCLpPQkaicInqxv%2Fhf_20260422_011129_528f4835-f2b2-4b35-90a0-e4471af95636_thumbnail.webp&w=480&q=85',
    alt: 'Seedance 2.5 render preview',
    title: '9:16 + 16:9 Social Reel Render',
    desc: 'Synchronized camera motion & export ready',
    active: true,
    removable: false,
  },
];

const EXTRA_NODE_TEMPLATES = [
  {
    badge: 'Topaz 4K',
    badgeColor: '#d1fe17',
    kind: 'image',
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_2y6tV3s3P1mJ5T3e7fY9kR8cW4b%2Fhf_20260301_relight_after.jpg&w=640&q=85',
    fallbackSrc: 'https://static.higgsfield.ai/canvas-banner-mobile.webp',
    title: '4K Detail Restoration Pass',
    desc: 'Temporal sharpen + skin grain recovery before delivery',
  },
  {
    badge: 'Seed Audio',
    badgeColor: '#22c55e',
    kind: 'image',
    src: 'https://static.higgsfield.ai/public/promotions/seedance-2-5-sale-hero-poster.jpg',
    title: 'Audio Foley & Voiceover Stem',
    desc: 'Synced spatial sound design & 30-language subtitles',
  },
  {
    badge: 'Export Bus',
    badgeColor: '#60a5fa',
    kind: 'image',
    src: 'https://static.higgsfield.ai/canvas-banner-mobile.webp',
    title: 'Multi-Ratio Delivery Matrix',
    desc: 'Auto-crop 9:16 Reels, 1:1 Feed & 16:9 Master packages',
  },
];

export default function CanvasPage() {
  const { pushToast, addGeneration } = useApp();
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [nodes, setNodes] = useState(INITIAL_NODES);

  const handleAddComment = (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      pushToast('Enter a workflow note first', 'neutral');
      return;
    }
    setComments((prev) => [
      ...prev,
      { author: 'You', text: commentText.trim(), color: '#60a5fa' },
    ]);
    setCommentText('');
    pushToast('Comment pinned to Canvas board');
  };

  const handleAddNode = () => {
    if (nodes.length >= 6) {
      pushToast('Canvas board supports up to 6 linked stages per chain', 'neutral');
      return;
    }
    const tpl = EXTRA_NODE_TEMPLATES[(nodes.length - 3) % EXTRA_NODE_TEMPLATES.length];
    const nextNum = String(nodes.length + 1).padStart(2, '0');
    const createdNode = {
      id: `node-${Date.now()}`,
      step: `${nextNum} • ${tpl.badge} Stage`,
      badge: tpl.badge,
      badgeColor: tpl.badgeColor,
      kind: 'image',
      src: tpl.fallbackSrc || tpl.src,
      alt: tpl.title,
      title: tpl.title,
      desc: tpl.desc,
      active: true,
      removable: true,
    };
    setNodes((prev) => [...prev, createdNode]);
    pushToast(`Added ${createdNode.step} node to canvas`);
  };

  const toggleNodeActive = (id) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  const removeNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    pushToast('Removed node from canvas chain');
  };

  const handleRunPipeline = () => {
    const activeNodes = nodes.filter((n) => n.active);
    if (activeNodes.length === 0) {
      pushToast('Enable at least one node stage before running pipeline', 'neutral');
      return;
    }
    const saved = addGeneration({
      id: `canvas-${Date.now()}`,
      title: `Canvas Pipeline (${activeNodes.length} stages)`,
      model: 'Canvas × Seedance 2.5',
      modelName: 'Canvas Workflow',
      prompt: activeNodes.map((n) => n.title).join(' -> '),
      poster: INITIAL_NODES[1].src,
      img: INITIAL_NODES[1].src,
      aspect: '16/9',
      cost: 8,
    });
    if (saved) {
      pushToast(`Executed Canvas pipeline (${activeNodes.length}/${nodes.length} stages synced)`);
    }
  };

  return (
    <main className="hf-container hf-subpage">
      <section className="hf-page-hero">
        <div>
          <span className="hf-page-badge">COLLABORATIVE WORKSPACE</span>
          <h1 className="hf-page-title">One Canvas. Every Workflow.</h1>
          <p className="hf-page-desc">
            Moodboard references, chain Image &rarr; Video nodes seamlessly, and collaborate with
            your creative team in real time.
          </p>
        </div>
        <div className="hf-section-actions">
          <button
            type="button"
            className="hf-cta-lime"
            onClick={handleRunPipeline}
          >
            <Play size={14} fill="currentColor" />
            <span>Run Full Pipeline ({nodes.filter((n) => n.active).length})</span>
          </button>
          <Link to="/generate" className="hf-cta-dark">
            <Sparkles size={14} />
            <span>Open Director Studio</span>
          </Link>
        </div>
      </section>

      <div className="hf-canvas-board">
        <div className="hf-canvas-flow">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="hf-canvas-node"
              style={{ opacity: node.active ? 1 : 0.55 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                <span className="hf-nav-badge">{node.step}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    style={{ fontSize: 11, color: node.active ? node.badgeColor : '#8f939c', fontWeight: 600 }}
                    onClick={() => toggleNodeActive(node.id)}
                  >
                    {node.active ? node.badge : 'Bypassed'}
                  </button>
                  {node.removable && (
                    <button
                      type="button"
                      className="hf-icon-btn"
                      style={{ width: 22, height: 22 }}
                      onClick={() => removeNode(node.id)}
                      aria-label={`Remove ${node.title}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
              {node.kind === 'video' ? (
                <video
                  src={node.src}
                  poster={node.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', aspectRatio: '16/10', borderRadius: 9, objectFit: 'cover' }}
                />
              ) : (
                <img src={node.src} alt={node.alt} />
              )}
              <div style={{ fontSize: 13, fontWeight: 600 }}>{node.title}</div>
              <div style={{ fontSize: 12, color: '#8f939c' }}>{node.desc}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 18,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {comments.map((c, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 12.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: c.color,
                    flexShrink: 0,
                  }}
                />
                <strong>{c.author}:</strong>
                <span style={{ color: '#c4c7ce' }}>{c.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: '1 1 280px', maxWidth: 420 }}>
            <input
              type="text"
              className="hf-input"
              style={{ height: 38, flex: '1 1 160px', minWidth: 0 }}
              placeholder="Leave a canvas note (e.g. @Mito try 50mm lens)..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="hf-cta-lime" style={{ height: 38 }}>
              <MessageSquare size={14} />
              <span>Post</span>
            </button>
            <button
              type="button"
              className="hf-icon-btn"
              style={{ height: 38, width: 38 }}
              onClick={handleAddNode}
              title="Add workflow node"
              aria-label="Add workflow node"
            >
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

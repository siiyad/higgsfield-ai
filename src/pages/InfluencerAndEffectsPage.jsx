import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  Dices,
  FolderClock,
  Layers,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Upload,
  Wand2,
  Zap,
} from 'lucide-react';
import {
  APPS_CATALOG,
  EFFECT_PRESETS,
  INFLUENCER_ATTR_GROUPS,
  INFLUENCER_TYPES,
} from '../data/catalog';
import {
  GENJUTSU_ITEMS,
  GPT_IMAGE_2_ITEMS,
  SEEDANCE_25_ITEMS,
  SHORTS_PRESETS,
  SOUL_20_ITEMS,
} from '../data/showcase';
import { useApp } from '../context/AppContext';
import { validateUploadFile } from '../utils/fileValidation';
import MediaCard from '../components/common/MediaCard';

const LAYER_CARDS = [
  {
    id: 'relight',
    title: 'RELIGHT',
    desc: 'Move key & rim lights in 3D space',
    img: SOUL_20_ITEMS[2].img,
    beforeImg: SOUL_20_ITEMS[6].img,
    afterFilter: 'contrast(1.12) saturate(1.18) brightness(1.06)',
  },
  {
    id: 'inpaint',
    title: 'INPAINT',
    desc: 'Brush objects, tattoos, or logos out seamlessly',
    img: SOUL_20_ITEMS[6].img,
    beforeImg: SOUL_20_ITEMS[5].img,
    afterFilter: 'contrast(1.06) brightness(1.04)',
  },
  {
    id: 'decompose',
    title: 'LAYER DECOMPOSITION',
    desc: 'Split foreground subject, clothing, and sky into PNG alpha layers',
    img: SOUL_20_ITEMS[4].img,
    beforeImg: SOUL_20_ITEMS[7].img,
    afterFilter: 'saturate(1.22) contrast(1.08)',
  },
  {
    id: 'edit-text',
    title: 'EDIT TEXT',
    desc: 'Rewrite signage and poster typography in place',
    img: GPT_IMAGE_2_ITEMS[5].img,
    beforeImg: GPT_IMAGE_2_ITEMS[0].img,
    afterFilter: 'contrast(1.14) saturate(1.12)',
  },
  {
    id: 'effects',
    title: 'EFFECTS',
    desc: 'Drop optical flares, halation, and glass texture passes',
    img: SOUL_20_ITEMS[0].img,
    beforeImg: SOUL_20_ITEMS[3].img,
    afterFilter: 'contrast(1.18) saturate(1.25) brightness(1.05)',
  },
  {
    id: 'upscale',
    title: 'TOPAZ 4K UPSCALE',
    desc: 'Restore micro-detail & crisp grain up to 4K resolution',
    img: SOUL_20_ITEMS[4].img,
    beforeImg: SOUL_20_ITEMS[6].img,
    afterFilter: 'contrast(1.1) brightness(1.03)',
  },
];

const APP_CATEGORIES = [
  'All',
  'Professional',
  'Enhance & Style',
  'Face & Identity',
  'Video Editing',
  'Ads & Products',
  'Games & Characters',
  'Extras',
];

export default function InfluencerAndEffectsPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { pushToast, addGeneration, savedGenerations } = useApp();

  const path = location.pathname;
  const isInfluencer = path === '/ai-influencer-studio' || path === '/character';
  const isEffects = path === '/effects/use' || path === '/motion' || path === '/katana';
  const isLayers = path === '/layers' || path === '/upscale';
  const isApps = path === '/apps';

  // Influencer state
  const [infMode, setInfMode] = useState('create');
  const [motionChoreography, setMotionChoreography] = useState('Runway Walk');
  const [selectedType, setSelectedType] = useState(INFLUENCER_TYPES[0].id);
  const [openGroup, setOpenGroup] = useState('gender');
  const [selectedAttrs, setSelectedAttrs] = useState({
    gender: 'Woman',
    style: 'Editorial Couture',
    hairstyle: 'Wolf Cut',
    hairColor: 'Jet Black',
    age: '18–24 Gen-Z',
  });
  const [infPhotoName, setInfPhotoName] = useState('');

  // Effects / Katana state
  const [selectedEffect, setSelectedEffect] = useState(EFFECT_PRESETS[0]);
  const [effectDrawerOpen, setEffectDrawerOpen] = useState(false);
  const [effectPromptOn, setEffectPromptOn] = useState(true);
  const [effectPrompt, setEffectPrompt] = useState(
    'Slow motion rooftop suspension at dusk with emerald wind trails and sharp 35mm motion blur'
  );
  const [resolution, setResolution] = useState('1080p');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [useFreeGen, setUseFreeGen] = useState(true);
  const [freeGensLeft, setFreeGensLeft] = useState(1);
  const [stageView, setStageView] = useState('how-it-works');
  const [katanaTab, setKatanaTab] = useState('Motion transfer');
  const [uploadedChar, setUploadedChar] = useState('');
  const [uploadedLoc, setUploadedLoc] = useState('');
  const [uploadedProd, setUploadedProd] = useState('');

  // Layers / Upscale state
  const [activeLayerTool, setActiveLayerTool] = useState(
    searchParams.get('tool') || (path === '/upscale' ? 'upscale' : 'relight')
  );
  const [comparePos, setComparePos] = useState(52);
  const [upscaleScale, setUpscaleScale] = useState('4x Ultra 4K');
  const [denoiseLevel, setDenoiseLevel] = useState('Crisp Grain');
  const [uploadedLayerUrl, setUploadedLayerUrl] = useState('');
  const [uploadedLayerName, setUploadedLayerName] = useState('');

  // Apps directory state
  const [appQuery, setAppQuery] = useState('');
  const [appCat, setAppCat] = useState('All');

  const [generating, setGenerating] = useState(false);
  const [localResults, setLocalResults] = useState([]);

  useEffect(() => {
    const qTool = searchParams.get('tool');
    if (qTool) setActiveLayerTool(qTool);
    else if (path === '/upscale') setActiveLayerTool('upscale');
    else if (path === '/layers') setActiveLayerTool('relight');
  }, [path, searchParams]);

  useEffect(() => {
    return () => {
      if (uploadedLayerUrl) URL.revokeObjectURL(uploadedLayerUrl);
    };
  }, [uploadedLayerUrl]);

  const randomizeAttributes = () => {
    const pick = {};
    INFLUENCER_ATTR_GROUPS.forEach((grp) => {
      pick[grp.key] = grp.options[Math.floor(Math.random() * grp.options.length)];
    });
    const randType = INFLUENCER_TYPES[Math.floor(Math.random() * INFLUENCER_TYPES.length)];
    setSelectedType(randType.id);
    setSelectedAttrs(pick);
    pushToast(`Randomized persona: ${randType.label} • ${pick.style}`);
  };

  const handleInfluencerCreate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      const sample = SOUL_20_ITEMS[Math.floor(Math.random() * SOUL_20_ITEMS.length)];
      const attrSummary = Object.values(selectedAttrs).filter(Boolean).slice(0, 5).join(', ');
      const created = {
        id: `inf-${Date.now()}`,
        title: `${selectedType} Persona • ${infMode === 'motion' ? motionChoreography : selectedAttrs.style || 'Editorial'}`,
        model: 'Soul ID 2.0',
        modelName: 'Higgsfield Influencer Studio',
        prompt: `${selectedType} character portrait (${infMode === 'motion' ? motionChoreography : attrSummary})`,
        img: sample.img,
        poster: sample.img,
        aspect: '3/4',
        cost: 8,
      };
      if (addGeneration(created)) {
        setLocalResults((prev) => [created, ...prev]);
      }
      setGenerating(false);
    }, 650);
  };

  const handleEffectGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      const pool = [...GENJUTSU_ITEMS, ...SEEDANCE_25_ITEMS];
      const sample = pool[Math.floor(Math.random() * pool.length)];
      const usedFree = useFreeGen && freeGensLeft > 0;
      const created = {
        id: `fx-${Date.now()}`,
        title: `${selectedEffect.name}${path === '/katana' ? ` (${katanaTab})` : ''} (${resolution})`,
        model: path === '/katana' ? 'Katana Motion' : 'Higgsfield VFX',
        modelName: selectedEffect.name,
        prompt: `${selectedEffect.name} • ${effectPrompt} [${aspectRatio}, ${resolution}]`,
        poster: sample.poster || sample.img,
        video: sample.video,
        aspect: aspectRatio.replace(':', '/'),
        cost: usedFree ? 0 : 12,
      };
      if (addGeneration(created)) {
        if (usedFree) setFreeGensLeft((c) => Math.max(0, c - 1));
        setLocalResults((prev) => [created, ...prev]);
        setStageView('history');
      }
      setGenerating(false);
    }, 700);
  };

  const filteredApps = useMemo(() => {
    const q = appQuery.trim().toLowerCase();
    return APPS_CATALOG.filter((app) => {
      const matchCat = appCat === 'All' || app.category === appCat;
      const matchSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.desc.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [appQuery, appCat]);

  // 1. AI INFLUENCER STUDIO (/ai-influencer-studio, /character)
  if (isInfluencer) {
    return (
      <main className="hf-container hf-subpage">
        <div className="hf-studio-grid">
          <aside className="hf-studio-panel">
            <div className="hf-studio-tabs" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <button
                type="button"
                className={`hf-studio-tab ${infMode === 'create' ? 'is-active' : ''}`}
                onClick={() => setInfMode('create')}
              >
                Create Influencer
              </button>
              <button
                type="button"
                className={`hf-studio-tab ${infMode === 'motion' ? 'is-active' : ''}`}
                onClick={() => setInfMode('motion')}
              >
                Motion
              </button>
            </div>

            {infMode === 'create' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="hf-form-label">Base Persona Type</span>
                  <button
                    type="button"
                    className="hf-chip"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    onClick={randomizeAttributes}
                  >
                    <Dices size={13} color="#d1fe17" />
                    <span>Randomize</span>
                  </button>
                </div>

                <div className="hf-attr-grid-9">
                  {INFLUENCER_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`hf-attr-tile ${selectedType === t.id ? 'is-selected' : ''}`}
                      onClick={() => setSelectedType(t.id)}
                    >
                      <img src={t.img} alt={t.label} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                <label className="hf-upload-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (!file) return;
                      const res = validateUploadFile(file, ['image/']);
                      if (!res.ok) {
                        pushToast(res.error, 'neutral');
                        return;
                      }
                      setInfPhotoName(file.name);
                      pushToast(`Uploaded identity reference: ${file.name}`);
                    }}
                  />
                  <Upload size={16} color="#d1fe17" />
                  <strong style={{ fontSize: 12.5 }}>{infPhotoName || 'Upload photo reference (Optional)'}</strong>
                  <span style={{ fontSize: 11, color: '#8f939c' }}>Drag &amp; drop portrait to lock face geometry</span>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 330, overflowY: 'auto' }}>
                  {INFLUENCER_ATTR_GROUPS.map((grp) => {
                    const isOpen = openGroup === grp.key;
                    return (
                      <div
                        key={grp.key}
                        style={{
                          borderRadius: 10,
                          background: '#0f1114',
                          border: '1px solid rgba(255,255,255,0.07)',
                          padding: '8px 10px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenGroup(isOpen ? '' : grp.key)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: '#ffffff',
                          }}
                        >
                          <span>
                            {grp.label}{' '}
                            <span style={{ color: '#8f939c', fontWeight: 400 }}>
                              ({selectedAttrs[grp.key] || `${grp.count} options`})
                            </span>
                          </span>
                          <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                        </button>

                        {isOpen && (
                          <div className="hf-chip-row" style={{ marginTop: 8 }}>
                            {grp.options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                className={`hf-chip ${selectedAttrs[grp.key] === opt ? 'is-active' : ''}`}
                                style={{ fontSize: 11, padding: '4px 8px' }}
                                onClick={() => setSelectedAttrs((prev) => ({ ...prev, [grp.key]: opt }))}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>
                  Animate your saved Influencer across talking-head hooks, runway walks, or daily vlogs.
                </p>
                <div className="hf-chip-row">
                  {['Runway Walk', 'Talking Podcast Hook', 'Coffee Cafe POV', 'Mirror Fit Check'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`hf-chip ${motionChoreography === m ? 'is-active' : ''}`}
                      onClick={() => {
                        setMotionChoreography(m);
                        pushToast(`Selected motion choreography: ${m}`);
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="hf-btn-lime-block"
              onClick={handleInfluencerCreate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="hf-spin" />
                  <span>Forging Soul ID Influencer...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate Influencer Persona</span>
                </>
              )}
            </button>
          </aside>

          <section className="hf-dot-stage">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <span className="hf-page-badge">AI INFLUENCER STUDIO</span>
                <h1 className="hf-page-title" style={{ margin: '6px 0 4px' }}>
                  BUILD CONSISTENT VIRTUAL TALENT
                </h1>
                <p style={{ margin: 0, fontSize: 13.5, color: '#9ea2ab' }}>
                  Active recipe: <strong style={{ color: '#d1fe17' }}>{selectedType}</strong> &bull;{' '}
                  {Object.values(selectedAttrs).filter(Boolean).slice(0, 4).join(' • ')}
                </p>
              </div>
              <Link to="/photodump" className="hf-cta-dark">
                Open Photodump Matrix
              </Link>
            </div>

            {localResults.length > 0 && (
              <div>
                <h2 style={{ margin: '0 0 10px', fontSize: 15, color: '#d1fe17' }}>Generated Talent</h2>
                <div className="hf-studio-gallery">
                  {localResults.map((item) => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            <div className="hf-studio-gallery">
              {SOUL_20_ITEMS.slice(0, 9).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // 2. VISUAL EFFECTS & KATANA (/effects/use, /motion, /katana)
  if (isEffects) {
    return (
      <main className="hf-container hf-subpage">
        <div className="hf-studio-grid">
          <aside className="hf-studio-panel">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="hf-form-label">Effect Preset</span>
                <button
                  type="button"
                  className="hf-chip is-active"
                  onClick={() => setEffectDrawerOpen((o) => !o)}
                >
                  Change
                </button>
              </div>

              <div className="hf-model-option is-selected" style={{ padding: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={selectedEffect.img}
                    alt={selectedEffect.name}
                    style={{ width: 46, height: 46, borderRadius: 8, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#d1fe17' }}>{selectedEffect.name}</div>
                    <div style={{ fontSize: 11, color: '#9ea2ab' }}>{selectedEffect.desc}</div>
                  </div>
                </div>
              </div>

              {effectDrawerOpen && (
                <div className="hf-model-select-grid" style={{ marginTop: 8 }}>
                  {EFFECT_PRESETS.map((fx) => (
                    <button
                      key={fx.id}
                      type="button"
                      className={`hf-model-option ${selectedEffect.id === fx.id ? 'is-selected' : ''}`}
                      onClick={() => {
                        setSelectedEffect(fx);
                        setEffectDrawerOpen(false);
                      }}
                    >
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{fx.name}</span>
                      <span className="hf-nav-badge">{fx.tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <label className="hf-upload-dropzone" style={{ padding: 10 }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    const res = validateUploadFile(file, ['image/', 'video/']);
                    if (!res.ok) {
                      pushToast(res.error, 'neutral');
                      return;
                    }
                    setUploadedChar(file.name);
                    pushToast(`Attached Character asset: ${file.name}`);
                  }}
                />
                <Plus size={14} />
                <span style={{ fontSize: 11 }}>{uploadedChar || 'Character'}</span>
              </label>
              <label className="hf-upload-dropzone" style={{ padding: 10 }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    const res = validateUploadFile(file, ['image/', 'video/']);
                    if (!res.ok) {
                      pushToast(res.error, 'neutral');
                      return;
                    }
                    setUploadedLoc(file.name);
                    pushToast(`Attached Location asset: ${file.name}`);
                  }}
                />
                <Plus size={14} />
                <span style={{ fontSize: 11 }}>{uploadedLoc || 'Location (Opt)'}</span>
              </label>
            </div>

            <label className="hf-upload-dropzone" style={{ padding: 10 }}>
              <input
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  const res = validateUploadFile(file, ['image/', 'video/']);
                  if (!res.ok) {
                    pushToast(res.error, 'neutral');
                    return;
                  }
                  setUploadedProd(file.name);
                  pushToast(`Attached Product asset: ${file.name}`);
                }}
              />
              <span style={{ fontSize: 11.5 }}>{uploadedProd || '+ Products (Optional)'}</span>
            </label>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="hf-form-label">Prompt</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={effectPromptOn}
                  className={`hf-switch ${effectPromptOn ? 'is-on' : ''}`}
                  onClick={() => setEffectPromptOn((v) => !v)}
                  aria-label="Toggle custom effect prompt"
                >
                  <span className="hf-switch__thumb" />
                </button>
              </div>
              {effectPromptOn && (
                <textarea
                  className="hf-textarea"
                  style={{ minHeight: 74 }}
                  value={effectPrompt}
                  onChange={(e) => setEffectPrompt(e.target.value)}
                />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div className="hf-form-label" style={{ marginBottom: 4 }}>Resolution</div>
                <div className="hf-chip-row">
                  {['720p', '1080p'].map((res) => (
                    <button
                      key={res}
                      type="button"
                      className={`hf-chip ${resolution === res ? 'is-active' : ''}`}
                      onClick={() => setResolution(res)}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="hf-form-label" style={{ marginBottom: 4 }}>Aspect Ratio</div>
                <div className="hf-chip-row">
                  {['9:16', '16:9'].map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      className={`hf-chip ${aspectRatio === ar ? 'is-active' : ''}`}
                      onClick={() => setAspectRatio(ar)}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span>Use free gens ✨ {freeGensLeft}</span>
              <button
                type="button"
                role="switch"
                aria-checked={useFreeGen}
                className={`hf-switch ${useFreeGen ? 'is-on' : ''}`}
                onClick={() => setUseFreeGen((v) => !v)}
                aria-label="Use free generation"
              >
                <span className="hf-switch__thumb" />
              </button>
            </div>

            <Link to="/mcp?tab=chatgpt" className="hf-btn-ghost-block">
              Try in ChatGPT
            </Link>

            <button
              type="button"
              className="hf-btn-lime-block"
              onClick={handleEffectGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="hf-spin" />
                  <span>Rendering VFX pass...</span>
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  <span>Generate {freeGensLeft > 0 && useFreeGen ? `(${freeGensLeft} FREE LEFT)` : '(12 cr)'}</span>
                </>
              )}
            </button>
          </aside>

          <section className="hf-dot-stage">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className={`hf-cta-dark ${stageView === 'history' ? 'is-active' : ''}`}
                  onClick={() => setStageView('history')}
                >
                  <FolderClock size={14} />
                  <span>History ({localResults.length + savedGenerations.length})</span>
                </button>
                <button
                  type="button"
                  className={`hf-cta-dark ${stageView === 'how-it-works' ? 'is-active' : ''}`}
                  onClick={() => setStageView('how-it-works')}
                >
                  <span>How it works</span>
                </button>
              </div>

              {path === '/katana' && (
                <div className="hf-chip-row">
                  {['Motion transfer', 'Style transfer', 'Personalized edits'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`hf-chip ${katanaTab === t ? 'is-active' : ''}`}
                      onClick={() => setKatanaTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {stageView === 'how-it-works' ? (
              <>
                <div style={{ textAlign: 'center', paddingBlock: 10 }}>
                  <span className="hf-page-badge">
                    {path === '/katana' ? `KATANA • ${katanaTab.toUpperCase()}` : 'VFX & MOTION PRESETS'}
                  </span>
                  <h1 className="hf-page-title" style={{ marginTop: 8 }}>
                    {selectedEffect.name} &mdash; {path === '/katana' ? katanaTab.toUpperCase() : 'BLOCKBUSTER CAMERA & FX'}
                  </h1>
                  <p style={{ margin: 0, color: '#9ea2ab', fontSize: 14 }}>
                    {path === '/katana' && katanaTab === 'Style transfer'
                      ? 'Transfer neural film color, painterly textures, and lighting consistency across full video clips.'
                      : path === '/katana' && katanaTab === 'Personalized edits'
                      ? 'Lock character likeness, wardrobe, or branded props frame-by-frame across dynamic sequences.'
                      : 'Drop a character photo or product cutout — choose a physics-driven preset and render in 1080p.'}
                  </p>
                </div>

                <div className="hf-studio-gallery">
                  {(path === '/katana' && katanaTab === 'Style transfer'
                    ? [...EFFECT_PRESETS.slice(3, 6), ...EFFECT_PRESETS.slice(0, 3)]
                    : path === '/katana' && katanaTab === 'Personalized edits'
                    ? [...EFFECT_PRESETS.slice(2, 6), ...EFFECT_PRESETS.slice(0, 2)]
                    : EFFECT_PRESETS.slice(0, 6)
                  ).map((fx) => (
                    <button
                      key={fx.id}
                      type="button"
                      onClick={() => setSelectedEffect(fx)}
                      style={{
                        borderRadius: 14,
                        overflow: 'hidden',
                        border: selectedEffect.id === fx.id ? '2px solid #d1fe17' : '1px solid rgba(255,255,255,0.08)',
                        background: '#16191d',
                        textAlign: 'left',
                        padding: 0,
                      }}
                    >
                      <img src={fx.img} alt={fx.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{fx.name}</div>
                        <div style={{ fontSize: 11, color: '#8f939c' }}>{fx.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="hf-studio-gallery">
                {(localResults.length > 0 ? localResults : SHORTS_PRESETS.slice(0, 6)).map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  // 3. LAYERS & TOPAZ 4K UPSCALE (/layers, /upscale)
  if (isLayers) {
    const activeLayerObj = LAYER_CARDS.find((c) => c.id === activeLayerTool) || LAYER_CARDS[0];
    const beforeImg = uploadedLayerUrl || activeLayerObj.beforeImg;
    const afterImg = uploadedLayerUrl || activeLayerObj.img;
    return (
      <main className="hf-container hf-subpage">
        <section className="hf-page-hero">
          <div>
            <span className="hf-page-badge">
              <Layers size={13} />
              <span>{path === '/upscale' ? 'TOPAZ VIDEO & IMAGE 4K' : 'HIGGSFIELD LAYERS'}</span>
            </span>
            <h1 className="hf-page-title">
              {path === '/upscale' ? 'AI 4K Upscaling & Restoration' : 'Layered Editing & Banana Placement'}
            </h1>
            <p className="hf-page-desc">
              {path === '/upscale'
                ? 'Restore fine skin detail, fabric weave, and clean 60fps temporal stability up to native 4K resolution.'
                : 'Select Relight, Inpaint, Layer Decomposition, Edit Text, or optical FX passes with interactive live masks.'}
            </p>
          </div>
          <label className="hf-cta-lime" style={{ cursor: 'pointer' }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                const res = validateUploadFile(file, ['image/']);
                if (!res.ok) {
                  pushToast(res.error, 'neutral');
                  return;
                }
                const nextUrl = URL.createObjectURL(file);
                setUploadedLayerUrl((prev) => {
                  if (prev) URL.revokeObjectURL(prev);
                  return nextUrl;
                });
                setUploadedLayerName(file.name);
                pushToast(`Loaded into Layers canvas: ${file.name}`);
              }}
            />
            <Upload size={15} />
            <span>{uploadedLayerName ? `Loaded: ${uploadedLayerName}` : '+ Upload Media'}</span>
          </label>
        </section>

        {/* Layer Feature Selector Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 12,
            marginBottom: 24,
          }}
        >
          {LAYER_CARDS.slice(0, 5).map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                setActiveLayerTool(card.id);
                pushToast(`Active Layers tool: ${card.title}`);
              }}
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                border: activeLayerTool === card.id ? '2px solid #d1fe17' : '1px solid rgba(255,255,255,0.08)',
                background: '#14171a',
                textAlign: 'left',
                padding: 0,
              }}
            >
              <img src={card.img} alt={card.title} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover' }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#d1fe17' }}>{card.title}</div>
                <div style={{ fontSize: 11.5, color: '#9ea2ab', marginTop: 3 }}>{card.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Before / After Interactive Slider */}
        <section className="hf-studio-panel" style={{ gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <strong style={{ fontSize: 16 }}>
                Interactive Before / After Inspector ({activeLayerObj.title})
              </strong>
              <div style={{ fontSize: 12, color: '#8f939c' }}>Drag slider to compare original vs enhanced pass</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {['2x HD', '4x Ultra 4K'].map((sc) => (
                <button
                  key={sc}
                  type="button"
                  className={`hf-chip ${upscaleScale === sc ? 'is-active' : ''}`}
                  onClick={() => setUpscaleScale(sc)}
                >
                  {sc}
                </button>
              ))}
              {['Natural Texture', 'Crisp Grain'].map((dn) => (
                <button
                  key={dn}
                  type="button"
                  className={`hf-chip ${denoiseLevel === dn ? 'is-active' : ''}`}
                  onClick={() => setDenoiseLevel(dn)}
                >
                  {dn}
                </button>
              ))}
              <button
                type="button"
                className="hf-cta-lime"
                style={{ height: 34 }}
                onClick={() => {
                  const saved = addGeneration({
                    id: `layer-${Date.now()}`,
                    title: `${activeLayerObj.title} (${upscaleScale})`,
                    model: path === '/upscale' ? 'Topaz 4K Upscale' : 'Higgsfield Layers',
                    modelName: activeLayerObj.title,
                    prompt: `${activeLayerObj.title} pass with ${denoiseLevel} at ${upscaleScale}`,
                    poster: activeLayerObj.img,
                    img: activeLayerObj.img,
                    aspect: '16/9',
                    cost: 8,
                  });
                  if (saved) pushToast(`Saved ${activeLayerObj.title} pass to History`);
                }}
              >
                <Sparkles size={13} />
                <span>Apply &amp; Save Pass (8 cr)</span>
              </button>
            </div>
          </div>

          <div className="hf-compare-wrap" style={{ maxHeight: 440 }}>
            <img src={beforeImg} alt="Before edit" style={{ filter: 'grayscale(35%) brightness(0.84)' }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: `inset(0 ${100 - comparePos}% 0 0)`,
              }}
            >
              <img
                src={afterImg}
                alt="After edit"
                style={{ filter: activeLayerObj.afterFilter }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${comparePos}%`,
                width: 2,
                background: '#d1fe17',
                boxShadow: '0 0 12px rgba(209,254,23,0.8)',
              }}
            />
            <span style={{ position: 'absolute', left: 14, top: 14 }} className="hf-nav-badge">
              BEFORE
            </span>
            <span style={{ position: 'absolute', right: 14, top: 14, color: '#d1fe17' }} className="hf-nav-badge">
              AFTER &bull; {upscaleScale} &bull; {denoiseLevel}
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={95}
            value={comparePos}
            onChange={(e) => setComparePos(Number(e.target.value))}
            aria-label="Comparison split slider"
            className="hf-compare-slider"
          />
        </section>
      </main>
    );
  }

  // 4. MINI APPS DIRECTORY (/apps)
  return (
    <main className="hf-container hf-subpage">
      <section className="hf-page-hero">
        <div>
          <span className="hf-page-badge">
            <Zap size={13} />
            <span>MINI APPS DIRECTORY</span>
          </span>
          <h1 className="hf-page-title">One-Click Creative Mini Apps</h1>
          <p className="hf-page-desc">
            Dedicated single-purpose AI workflows for Face Swap, Angles 2.0, Virality Prediction, Virtual Try-On, and Video Recasting.
          </p>
        </div>

        <div style={{ position: 'relative', width: 'min(340px, 100%)', maxWidth: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: 13, color: '#8f939c' }} />
          <input
            type="search"
            className="hf-input"
            style={{ paddingLeft: 36 }}
            placeholder="Search mini apps..."
            value={appQuery}
            onChange={(e) => setAppQuery(e.target.value)}
          />
        </div>
      </section>

      <div className="hf-chip-row" style={{ marginBottom: 20 }}>
        {APP_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`hf-chip ${appCat === c ? 'is-active' : ''}`}
            onClick={() => setAppCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filteredApps.length === 0 ? (
        <div className="hf-studio-panel" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#b4b7bf' }}>
            No mini apps matched &ldquo;{appQuery}&rdquo; in {appCat}.
          </p>
          <button
            type="button"
            className="hf-cta-dark"
            onClick={() => {
              setAppQuery('');
              setAppCat('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
          }}
        >
          {filteredApps.map((app) => (
            <article key={app.id} className="hf-studio-panel" style={{ justifyContent: 'space-between', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="hf-nav-badge">{app.category}</span>
                  {app.badge && (
                    <span className="hf-bento-new" style={{ padding: '2px 7px' }}>
                      {app.badge}
                    </span>
                  )}
                </div>
                <h2 style={{ margin: '0 0 6px', fontSize: 17, color: '#ffffff' }}>{app.name}</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab', lineHeight: 1.45 }}>{app.desc}</p>
              </div>
              <Link to={app.toolUrl} className="hf-cta-lime" style={{ justifyContent: 'center' }}>
                <span>Try now</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

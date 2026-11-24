import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Camera,
  ChevronRight,
  Film,
  FolderPlus,
  GraduationCap,
  Heart,
  Home,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Loader2,
  Minus,
  Plus,
  Search,
  Sliders,
  Sparkles,
  Upload,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import {
  GENJUTSU_ITEMS,
  GPT_IMAGE_2_ITEMS,
  MARKETING_ITEMS,
  SEEDANCE_20_ITEMS,
  SEEDANCE_25_ITEMS,
  SHORTS_PRESETS,
  SOUL_20_ITEMS,
  SOUL_CINEMA_ITEMS,
  STUDIO_MODELS,
} from '../data/showcase';
import { useApp } from '../context/AppContext';
import { validateUploadFile } from '../utils/fileValidation';
import MediaCard from '../components/common/MediaCard';

const ROUTE_CONFIG = {
  '/ai/video': {
    title: 'AI Video Studio',
    mode: 'video',
    desc: 'Direct motion, camera physics, and cinema lighting across Seedance 2.5, Kling 4.0, Veo 3.1, and Genjutsu.',
  },
  '/ai/image': {
    title: 'AI Image Studio',
    mode: 'image',
    desc: 'Generate 4K campaign photography, editable typography, and vector layouts with GPT Image 2.6, Seedream 5.5, and Soul 2.0.',
  },
  '/generate': {
    title: 'Cinema Studio 4.0',
    mode: 'video',
    desc: 'Unified director workspace with ARRI/RED/IMAX lenses, 50 visual references, and multi-shot project continuity.',
  },
  '/shorts-studio': {
    title: 'Shorts Studio',
    mode: 'video',
    desc: 'Recreate trending vertical 9:16 formats with viral captions, character swap, and rhythmic pacing.',
  },
  '/photodump': {
    title: 'Photodump — Soul ID',
    mode: 'image',
    desc: 'Drop one portrait, cast your character across 20 editorial locations in one click.',
  },
  '/mangaka': {
    title: 'Higgsfield Mangaka',
    mode: 'image',
    desc: 'Author consistent comic pages, halftone screentone manga panels, and vibrant webtoon chapters.',
  },
};

const CAMERAS = ['Static Lock', 'Dolly In', 'Crash Zoom', 'Orbit 360°', 'Crane Reveal', 'Handheld 35mm'];
const RATIOS = ['16:9', '9:16', '3:4', '1:1', '21:9'];
const DURATIONS = ['5s', '10s', '30s'];
const QUALITIES = ['720p', '1080p', '4K'];
const CINEMA_BODIES = ['Auto', 'ARRI Alexa 35', 'RED V-Raptor', 'IMAX 70mm', 'Panavision Panaflex'];
const FILM_SETUPS = ['Auto', 'Kodak Vision3 500T', '35mm Kodak Portra', 'Ilford B&W Noir'];
const COLOR_PALETTES = ['Auto', 'Amber & Teal', 'Cobalt Dusk', 'Silver Bleach', 'Neon Tokyo'];
const LIGHTING_RIGS = ['Auto', 'Chiaroscuro Key', 'Soft Daylight Window', 'Sodium Rain Night', 'Rim Silhouette'];

const MANGA_STYLES = ['B&W manga', 'Color Webtoon', 'Seinen Ink', '90s Cel Anime', 'Noir Graphic Novel'];

export default function StudioPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { savedGenerations, addGeneration, likedIds, pushToast } = useApp();

  const path = location.pathname;
  const isMangaka = path === '/mangaka';
  const isCinema = path === '/generate';
  const isVideoWorkspace = path === '/ai/video' || path === '/shorts-studio';

  const routeMeta = ROUTE_CONFIG[path] || ROUTE_CONFIG['/generate'];
  const requestedMode = searchParams.get('mode');
  const requestedModel = searchParams.get('model') || searchParams.get('videoModel');
  const requestedPrompt = searchParams.get('prompt');
  const requestedTab = searchParams.get('tab');

  const [mode, setMode] = useState(
    requestedMode === 'image' ? 'image' : routeMeta.mode === 'image' ? 'image' : 'video'
  );
  const [selectedModel, setSelectedModel] = useState(
    requestedModel || (mode === 'image' ? 'gpt_image_2' : 'seedance_2_5')
  );
  const [modelPickerOpen, setModelPickerOpen] = useState(false);

  // Shared controls
  const [prompt, setPrompt] = useState(
    requestedPrompt ||
      (isMangaka
        ? 'Rain-drenched Tokyo high school rooftop duel, sharp dynamic speed lines, dramatic cape flutter, detailed screentone ink shadow'
        : 'Anamorphic 40mm tracking shot through neon-drenched Tokyo alleyway at midnight, reflective rain puddles, subtle 35mm film grain')
  );
  const [camera, setCamera] = useState('Dolly In');
  const [ratio, setRatio] = useState(path === '/shorts-studio' ? '9:16' : '16:9');
  const [duration, setDuration] = useState('10s');
  const [quality, setQuality] = useState('1080p');
  const [bitrate, setBitrate] = useState('High');
  const [soundOn, setSoundOn] = useState(true);
  const [batchSize, setBatchSize] = useState(1);
  const [elementsTag, setElementsTag] = useState('@hero_protagonist');
  const [generating, setGenerating] = useState(false);
  const [showAcademyBar, setShowAcademyBar] = useState(true);
  const [gridDensity, setGridDensity] = useState('standard');

  // Video tabs & submodes
  const [videoTab, setVideoTab] = useState('Create Video');
  const [refTab, setRefTab] = useState('References');
  const [activeStageTab, setActiveStageTab] = useState(
    requestedTab === 'library' ? 'history' : 'presets'
  );

  // Cinema Studio 4.0 sidebar & camera pills
  const [cinemaNav, setCinemaNav] = useState('Home');
  const [cinemaSearch, setCinemaSearch] = useState('');
  const [projects, setProjects] = useState(['ZEPHYR Cut v3', 'Cully Hill Lookbook', 'HELL GRIND Test']);
  const [activeProject, setActiveProject] = useState('ZEPHYR Cut v3');
  const [refCount, setRefCount] = useState(2);
  const [uploadedRefs, setUploadedRefs] = useState([]);
  const [mangaUploadName, setMangaUploadName] = useState('');
  const [filmSetup, setFilmSetup] = useState(FILM_SETUPS[0]);
  const [cameraBody, setCameraBody] = useState(CINEMA_BODIES[0]);
  const [colorPalette, setColorPalette] = useState(COLOR_PALETTES[0]);
  const [lightingRig, setLightingRig] = useState(LIGHTING_RIGS[0]);

  // Mangaka controls
  const [mangaInputMode, setMangaInputMode] = useState('Describe');
  const [mangaStyle, setMangaStyle] = useState(MANGA_STYLES[0]);
  const [mangaAdvanced, setMangaAdvanced] = useState(false);
  const [mangaAutoGen, setMangaAutoGen] = useState(true);
  const [selectedMangaLayout, setSelectedMangaLayout] = useState('4-Koma Grid');
  const [mangaExploreTab, setMangaExploreTab] = useState('Templates');

  useEffect(() => {
    const meta = ROUTE_CONFIG[path] || ROUTE_CONFIG['/generate'];
    const nextMode = requestedMode === 'image' ? 'image' : meta.mode === 'image' ? 'image' : 'video';
    setMode(nextMode);
    if (requestedModel) {
      setSelectedModel(requestedModel);
    } else {
      setSelectedModel(nextMode === 'image' ? 'gpt_image_2' : 'seedance_2_5');
    }
    if (requestedPrompt) setPrompt(requestedPrompt);
    setRatio(path === '/shorts-studio' ? '9:16' : '16:9');
    setVideoTab(
      requestedTab === 'edit'
        ? 'Edit Video'
        : requestedTab === 'motion' || requestedTab === 'camera'
        ? 'Motion Control'
        : 'Create Video'
    );
    setActiveStageTab(requestedTab === 'library' ? 'history' : 'presets');
  }, [path, requestedMode, requestedModel, requestedPrompt, requestedTab]);

  useEffect(() => {
    return () => {
      uploadedRefs.forEach((ref) => {
        if (ref.url) URL.revokeObjectURL(ref.url);
      });
    };
  }, [uploadedRefs]);

  const modelChoices = useMemo(() => {
    return mode === 'image' ? STUDIO_MODELS.image : STUDIO_MODELS.video;
  }, [mode]);

  const pool = useMemo(() => {
    if (path === '/shorts-studio') return SHORTS_PRESETS;
    if (path === '/photodump') return SOUL_20_ITEMS;
    if (path === '/mangaka') {
      return [...GPT_IMAGE_2_ITEMS.slice(6, 10), ...SOUL_CINEMA_ITEMS.slice(8, 12)];
    }
    if (cinemaNav === 'Community' && isCinema) {
      return [...SOUL_CINEMA_ITEMS, ...SOUL_20_ITEMS];
    }
    if (selectedModel === 'genjutsu' || selectedModel === 'genjutsu_lite') {
      return selectedModel === 'genjutsu_lite' ? [...GENJUTSU_ITEMS].reverse() : GENJUTSU_ITEMS;
    }
    if (selectedModel === 'gpt_image_2' || selectedModel === 'gpt-image-2-6-sunburst') {
      return GPT_IMAGE_2_ITEMS;
    }
    if (selectedModel === 'soul_2_0') return SOUL_20_ITEMS;
    if (selectedModel === 'soul_cinema') return SOUL_CINEMA_ITEMS;
    if (selectedModel === 'seedance_2_0') return SEEDANCE_20_ITEMS;
    if (selectedModel === 'seedance_2_5') return [...SEEDANCE_25_ITEMS, ...SOUL_CINEMA_ITEMS];

    const list = mode === 'image' ? STUDIO_MODELS.image : STUDIO_MODELS.video;
    const idx = Math.max(
      0,
      list.findIndex((m) => m.id === selectedModel)
    );
    const combined =
      mode === 'image'
        ? [...GPT_IMAGE_2_ITEMS, ...SOUL_20_ITEMS, ...MARKETING_ITEMS]
        : [...SEEDANCE_25_ITEMS, ...SEEDANCE_20_ITEMS, ...SOUL_CINEMA_ITEMS];
    const offset = (idx * 3) % combined.length;
    return [...combined.slice(offset), ...combined.slice(0, offset)];
  }, [path, selectedModel, mode, cinemaNav, isCinema]);

  const [previewItem, setPreviewItem] = useState(pool[0] || SEEDANCE_25_ITEMS[0]);

  useEffect(() => {
    setPreviewItem(pool[0] || SEEDANCE_25_ITEMS[0]);
  }, [pool]);

  const activeModelObj = modelChoices.find((m) => m.id === selectedModel) || modelChoices[0];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      pushToast('Enter a prompt first to render', 'neutral');
      return;
    }
    setGenerating(true);
    window.setTimeout(() => {
      const stamp = Date.now();
      const unitCost = mode === 'video' ? 10 : 4;
      const baseTitle = isMangaka
        ? `${mangaStyle} Panel Page`
        : isCinema
        ? `${activeProject} • ${cameraBody === 'Auto' ? 'ARRI Alexa 35' : cameraBody}`
        : `${activeModelObj.name} Render`;

      const items = Array.from({ length: batchSize }, (_, idx) => {
        const pick = pool[idx % Math.max(1, pool.length)] || SEEDANCE_25_ITEMS[0];
        return {
          id: `gen-${stamp}-${idx}`,
          title: batchSize > 1 ? `${baseTitle} (Take #${idx + 1})` : baseTitle,
          model: activeModelObj.name,
          modelName: activeModelObj.name,
          prompt: `${prompt} [${isMangaka ? `${mangaStyle}, ${selectedMangaLayout}` : `${camera}, ${ratio}, ${duration}, ${quality}`}]`,
          poster: pick.poster || pick.img,
          img: pick.img || pick.poster,
          video: mode === 'image' || isMangaka ? undefined : pick.video,
          aspect: ratio.replace(':', '/'),
          cost: unitCost,
        };
      });

      const saved = addGeneration(items);
      if (saved) {
        setPreviewItem(items[0]);
        setActiveStageTab('history');
      }
      setGenerating(false);
    }, 650);
  };

  const libraryItems = useMemo(() => {
    const allKnown = [
      ...SHORTS_PRESETS,
      ...SEEDANCE_25_ITEMS,
      ...GPT_IMAGE_2_ITEMS,
      ...MARKETING_ITEMS,
      ...SOUL_20_ITEMS,
      ...SOUL_CINEMA_ITEMS,
    ];
    const liked = allKnown.filter((i) => likedIds.includes(i.id));
    return [...savedGenerations, ...liked];
  }, [savedGenerations, likedIds]);

  const cycleOption = (current, list, setter, label) => {
    const idx = list.indexOf(current);
    const next = list[(idx + 1) % list.length];
    setter(next);
    pushToast(`${label}: ${next}`);
  };

  // MANGAKA STUDIO (/mangaka)
  if (isMangaka) {
    return (
      <main className="hf-container hf-subpage">
        {showAcademyBar && (
          <div className="hf-academy-pill-bar">
            <GraduationCap size={15} color="#d1fe17" />
            <span>Don&rsquo;t know where to start?</span>
            <Link to="/academy" style={{ color: '#d1fe17', fontWeight: 700 }}>
              Go to the Academy &rarr;
            </Link>
            <button type="button" onClick={() => setShowAcademyBar(false)} aria-label="Dismiss tip">
              <X size={13} />
            </button>
          </div>
        )}

        <div className="hf-studio-grid">
          <aside className="hf-studio-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="hf-page-badge" style={{ marginBottom: 0 }}>HIGGSFIELD MANGAKA</span>
              <span style={{ fontSize: 11, color: '#8f939c' }}>Comic &amp; Webtoon</span>
            </div>

            <div className="hf-studio-tabs" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {['Describe', 'Upload'].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`hf-studio-tab ${mangaInputMode === m ? 'is-active' : ''}`}
                  onClick={() => setMangaInputMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            {mangaInputMode === 'Upload' && (
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
                    setMangaUploadName(file.name);
                    pushToast(`Loaded sketch/storyboard: ${file.name}`);
                  }}
                />
                <Upload size={16} color="#d1fe17" />
                <strong style={{ fontSize: 12.5 }}>{mangaUploadName || 'Upload character sheet or script'}</strong>
                <span style={{ fontSize: 11, color: '#8f939c' }}>Lock face, outfit &amp; speech bubbles</span>
              </label>
            )}

            <div>
              <label className="hf-form-label" htmlFor="hf-manga-idea" style={{ display: 'block', marginBottom: 6 }}>
                Write your manga idea
              </label>
              <textarea
                id="hf-manga-idea"
                className="hf-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe plot beats, dialogue bubbles, and action panels..."
              />
            </div>

            <div>
              <p className="hf-form-label" style={{ margin: '0 0 7px' }}>Style</p>
              <div className="hf-chip-row">
                {MANGA_STYLES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`hf-chip ${mangaStyle === st ? 'is-active' : ''}`}
                    onClick={() => setMangaStyle(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
              <span>Auto generate panels &amp; bubbles</span>
              <button
                type="button"
                role="switch"
                aria-checked={mangaAutoGen}
                className={`hf-switch ${mangaAutoGen ? 'is-on' : ''}`}
                onClick={() => setMangaAutoGen((v) => !v)}
                aria-label="Toggle auto generate"
              >
                <span className="hf-switch__thumb" />
              </button>
            </div>

            <button
              type="button"
              className="hf-ws-nav-item"
              style={{ background: '#0d0f11', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => setMangaAdvanced((v) => !v)}
            >
              <span>Advanced layout &amp; screentone</span>
              <ChevronRight size={14} style={{ transform: mangaAdvanced ? 'rotate(90deg)' : 'none' }} />
            </button>

            {mangaAdvanced && (
              <div className="hf-chip-row">
                {['4-Koma Grid', 'Dynamic Diagonal Cuts', 'Right-to-Left JP', 'Vertical Scroll Webtoon'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`hf-chip ${selectedMangaLayout === l ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedMangaLayout(l);
                      pushToast(`Layout selected: ${l}`);
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="hf-btn-lime-block"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? <Loader2 size={15} className="hf-spin" /> : <Wand2 size={15} />}
              <span>{generating ? 'Inking Chapter...' : `Create (${mangaStyle})`}</span>
            </button>
          </aside>

          <section className="hf-dot-stage">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <h1 className="hf-page-title" style={{ margin: '0 0 4px', fontSize: 24 }}>READ &amp; EXPLORE</h1>
                <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>
                  Multi-panel issues with persistent characters &amp; editable speech balloons
                </p>
              </div>
              <div className="hf-seg-control">
                {['My comics', 'Templates', 'By community'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`hf-seg-btn ${mangaExploreTab === tab ? 'is-active' : ''}`}
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={() => setMangaExploreTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="hf-studio-gallery">
              {(mangaExploreTab === 'My comics' && savedGenerations.length > 0 ? savedGenerations : pool).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // MAIN WORKSPACE BODY (used standalone on /ai/image, /ai/video, /shorts-studio, /photodump OR inside Cinema 4.0 shell on /generate)
  const studioContent = (
    <>
      {showAcademyBar && (
        <div className="hf-academy-pill-bar">
          <GraduationCap size={15} color="#d1fe17" />
          <span>Don&rsquo;t know where to start? Go to the Academy &mdash; learn camera grammar &amp; prompts in minutes.</span>
          <Link to="/academy" style={{ color: '#d1fe17', fontWeight: 700 }}>
            Open Academy &rarr;
          </Link>
          <button type="button" onClick={() => setShowAcademyBar(false)} aria-label="Dismiss Academy bar">
            <X size={13} />
          </button>
        </div>
      )}

      {isCinema && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            marginBottom: 18,
          }}
        >
          {[
            { title: 'ZEPHYR Special', tag: 'Original Film', img: SOUL_CINEMA_ITEMS[11].img },
            { title: 'The Cully Hill Boys', tag: 'Original Series', img: SOUL_CINEMA_ITEMS[1].img },
            { title: 'HELL GRIND', tag: 'Cinema Showcase', img: SOUL_CINEMA_ITEMS[8].img },
          ].map((film) => (
            <Link
              key={film.title}
              to="/original-series"
              style={{
                position: 'relative',
                borderRadius: 14,
                overflow: 'hidden',
                aspectRatio: '16/9',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
              }}
            >
              <img src={film.img} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.86) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 12,
                }}
              >
                <span className="hf-nav-badge" style={{ width: 'fit-content', marginBottom: 4 }}>{film.tag}</span>
                <strong style={{ color: '#ffffff', fontSize: 15 }}>{film.title}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="hf-studio-grid">
        <aside className="hf-studio-panel">
          {isVideoWorkspace && (
            <div className="hf-underline-tabs" role="tablist">
              {['Create Video', 'Edit Video', 'Motion Control'].map((vtab) => (
                <button
                  key={vtab}
                  type="button"
                  className={`hf-underline-tab ${videoTab === vtab ? 'is-active' : ''}`}
                  onClick={() => setVideoTab(vtab)}
                >
                  {vtab}
                </button>
              ))}
            </div>
          )}

          {/* Mode Tabs */}
          <div className="hf-studio-tabs" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button
              type="button"
              className={`hf-studio-tab ${mode === 'video' ? 'is-active' : ''}`}
              onClick={() => {
                setMode('video');
                setSelectedModel(STUDIO_MODELS.video[0].id);
              }}
            >
              Video ({STUDIO_MODELS.video.length})
            </button>
            <button
              type="button"
              className={`hf-studio-tab ${mode === 'image' ? 'is-active' : ''}`}
              onClick={() => {
                setMode('image');
                setSelectedModel(STUDIO_MODELS.image[0].id);
              }}
            >
              Image ({STUDIO_MODELS.image.length})
            </button>
          </div>

          {/* Active Model Dropdown Card */}
          <div>
            <button
              type="button"
              className="hf-model-option is-selected"
              style={{ width: '100%' }}
              onClick={() => setModelPickerOpen((o) => !o)}
            >
              <div>
                <div style={{ fontSize: 10.5, color: '#9ea2ab' }}>ACTIVE ENGINE &bull; {activeModelObj.tag}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#d1fe17' }}>{activeModelObj.name}</div>
                <div style={{ fontSize: 11, color: '#8f939c' }}>{activeModelObj.desc}</div>
              </div>
              <span className="hf-chip is-active" style={{ padding: '4px 8px', fontSize: 11 }}>Change</span>
            </button>

            {modelPickerOpen && (
              <div className="hf-model-select-grid" style={{ marginTop: 8, maxHeight: 260, overflowY: 'auto' }}>
                {modelChoices.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className={`hf-model-option ${selectedModel === model.id ? 'is-selected' : ''}`}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setModelPickerOpen(false);
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{model.name}</div>
                      <div style={{ fontSize: 11, color: '#8f939c' }}>{model.desc}</div>
                    </div>
                    <span className="hf-nav-badge" style={{ color: '#d1fe17' }}>{model.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* References / Extend switcher on Video */}
          {isVideoWorkspace && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div className="hf-seg-control" style={{ width: '100%' }}>
                {['References', 'Extend Video'].map((rTab) => (
                  <button
                    key={rTab}
                    type="button"
                    style={{ flex: 1 }}
                    className={`hf-seg-btn ${refTab === rTab ? 'is-active' : ''}`}
                    onClick={() => setRefTab(rTab)}
                  >
                    {rTab}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload / @ Element Tag */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <label className="hf-upload-dropzone" style={{ flex: 1, padding: '10px 8px' }}>
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
                    const url = URL.createObjectURL(file);
                    setUploadedRefs((prev) => [{ name: file.name, url }, ...prev.slice(0, 7)]);
                    setRefCount((c) => Math.min(50, c + 1));
                    pushToast(`Attached reference frame: ${file.name}`);
                  }}
                />
                <span style={{ fontSize: 11.5 }}>+ Add frame / ref ({refCount}/50)</span>
              </label>
              <button
                type="button"
                className="hf-chip"
                onClick={() => {
                  const tags = ['@hero_protagonist', '@neon_street_ref', '@luxury_watch_prop'];
                  const nextTag = tags[(tags.indexOf(elementsTag) + 1) % tags.length];
                  setElementsTag(nextTag);
                  setPrompt((p) => (p.includes(elementsTag) ? p : `${p} ${elementsTag}`.trim()));
                  pushToast(`Inserted ${elementsTag} reference tag`);
                }}
              >
                @ Elements
              </button>
            </div>
            {uploadedRefs.length > 0 && (
              <div className="hf-chip-row">
                {uploadedRefs.map((ref) => (
                  <button
                    key={ref.name}
                    type="button"
                    className="hf-chip is-active"
                    style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    onClick={() => {
                      URL.revokeObjectURL(ref.url);
                      setUploadedRefs((prev) => prev.filter((item) => item.name !== ref.name));
                      setRefCount((c) => Math.max(0, c - 1));
                    }}
                    title="Remove reference"
                  >
                    <span>{ref.name}</span>
                    <X size={11} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Director Prompt */}
          <div>
            <label className="hf-form-label" htmlFor="hf-studio-prompt" style={{ display: 'block', marginBottom: 6 }}>
              {mode === 'image' ? 'Image Prompt' : `Director Prompt (${videoTab})`}
            </label>
            <textarea
              id="hf-studio-prompt"
              className="hf-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe scene, lens, lighting, camera move..."
            />
          </div>

          {/* Camera Rig Chips */}
          <div>
            <p className="hf-form-label" style={{ margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sliders size={13} />
              <span>Camera Rig</span>
            </p>
            <div className="hf-chip-row">
              {CAMERAS.map((cam) => (
                <button
                  key={cam}
                  type="button"
                  className={`hf-chip ${camera === cam ? 'is-active' : ''}`}
                  onClick={() => setCamera(cam)}
                >
                  {cam}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio, Duration, Quality & Bitrate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <p className="hf-form-label" style={{ margin: '0 0 5px' }}>Aspect Ratio</p>
              <div className="hf-chip-row">
                {RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`hf-chip ${ratio === r ? 'is-active' : ''}`}
                    onClick={() => setRatio(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {mode === 'video' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <p className="hf-form-label" style={{ margin: '0 0 5px' }}>Duration</p>
                  <div className="hf-chip-row">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`hf-chip ${duration === d ? 'is-active' : ''}`}
                        onClick={() => setDuration(d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="hf-form-label" style={{ margin: '0 0 5px' }}>Quality &amp; Bitrate</p>
                  <div className="hf-chip-row">
                    {QUALITIES.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className={`hf-chip ${quality === q ? 'is-active' : ''}`}
                        onClick={() => setQuality(q)}
                      >
                        {q}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="hf-chip"
                      onClick={() => setBitrate((b) => (b === 'High' ? 'Standard' : 'High'))}
                    >
                      {bitrate}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span>Sound {soundOn ? 'On' : 'Off'} &bull; Batch {batchSize}/4</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="hf-batch-stepper">
                  <button
                    type="button"
                    aria-label="Decrease batch size"
                    onClick={() => setBatchSize((b) => Math.max(1, b - 1))}
                  >
                    <Minus size={12} />
                  </button>
                  <span>{batchSize}/4</span>
                  <button
                    type="button"
                    aria-label="Increase batch size"
                    onClick={() => setBatchSize((b) => Math.min(4, b + 1))}
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundOn}
                  className={`hf-switch ${soundOn ? 'is-on' : ''}`}
                  onClick={() => setSoundOn((s) => !s)}
                  aria-label="Toggle generated sound"
                >
                  <span className="hf-switch__thumb" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="hf-btn-lime-block"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 size={16} className="hf-spin" />
                <span>Rendering on H100 cluster...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>Generate ({(mode === 'video' ? 10 : 4) * batchSize} credits)</span>
              </>
            )}
          </button>
        </aside>

        <section className="hf-studio-stage">
          {/* Cinema Studio 4.0 Multi-Reference Bar */}
          <div className="hf-composer-top-pills">
            <button
              type="button"
              className="hf-composer-ref-pill is-active"
              onClick={() => {
                setRefCount((c) => Math.min(50, c + 1));
                pushToast('Added visual continuity reference slot');
              }}
            >
              <span>References</span>
              <strong>{refCount}/50 slots</strong>
            </button>
            <button
              type="button"
              className="hf-composer-ref-pill"
              onClick={() => cycleOption(filmSetup, FILM_SETUPS, setFilmSetup, 'Film setup')}
            >
              <span>Film setup</span>
              <strong>{filmSetup}</strong>
            </button>
            <button
              type="button"
              className="hf-composer-ref-pill"
              onClick={() => cycleOption(cameraBody, CINEMA_BODIES, setCameraBody, 'Camera Body')}
            >
              <span>Camera Body</span>
              <strong>{cameraBody}</strong>
            </button>
            <button
              type="button"
              className="hf-composer-ref-pill"
              onClick={() => cycleOption(colorPalette, COLOR_PALETTES, setColorPalette, 'Color palette')}
            >
              <span>Color palette</span>
              <strong>{colorPalette}</strong>
            </button>
            <button
              type="button"
              className="hf-composer-ref-pill"
              onClick={() => cycleOption(lightingRig, LIGHTING_RIGS, setLightingRig, 'Lighting')}
            >
              <span>Lighting</span>
              <strong>{lightingRig}</strong>
            </button>
          </div>

          <div className="hf-studio-preview">
            {previewItem?.video ? (
              <video
                key={previewItem.video}
                src={previewItem.video}
                poster={previewItem.poster || previewItem.img}
                controls
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={previewItem?.poster || previewItem?.img}
                alt={previewItem?.title || 'Preview frame'}
              />
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 12,
              background: '#0f1114',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ minWidth: 0, flex: '1 1 260px' }}>
              <strong style={{ fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {mode === 'image' ? <ImageIcon size={14} color="#d1fe17" /> : <Film size={14} color="#d1fe17" />}
                <span>{previewItem?.title || previewItem?.model}</span>
              </strong>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#9ea2ab' }}>{previewItem?.prompt}</p>
            </div>
            <button
              type="button"
              className="hf-cta-lime"
              onClick={() => setPrompt(previewItem?.prompt || prompt)}
            >
              <Sparkles size={14} />
              <span>Use recipe</span>
            </button>
          </div>

          {/* Stage Switcher + Grid Density Toggle */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className={`hf-cta-dark ${activeStageTab === 'presets' ? 'is-active' : ''}`}
                  onClick={() => setActiveStageTab('presets')}
                >
                  <span>Presets ({pool.length})</span>
                </button>
                <button
                  type="button"
                  className={`hf-cta-dark ${activeStageTab === 'history' ? 'is-active' : ''}`}
                  onClick={() => setActiveStageTab('history')}
                >
                  <span>History &amp; Likes ({libraryItems.length})</span>
                </button>
              </div>

              <button
                type="button"
                className="hf-chip"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => setGridDensity((d) => (d === 'compact' ? 'standard' : 'compact'))}
              >
                <LayoutGrid size={13} />
                <span>View: {gridDensity === 'compact' ? '4-col Dense' : '3-col Standard'}</span>
              </button>
            </div>

            {isCinema && cinemaNav === 'My elements' && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(209, 254, 23, 0.08)',
                  border: '1px solid rgba(209, 254, 23, 0.25)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  fontSize: 12.5,
                }}
              >
                <span>
                  <strong style={{ color: '#d1fe17' }}>Elements Shelf ({uploadedRefs.length + 1} pinned):</strong>{' '}
                  {elementsTag}
                  {uploadedRefs.length > 0 ? `, ${uploadedRefs.map((r) => r.name).join(', ')}` : ''}
                </span>
                <button
                  type="button"
                  className="hf-chip is-active"
                  onClick={() => setPrompt((p) => (p.includes(elementsTag) ? p : `${p} ${elementsTag}`))}
                >
                  Insert {elementsTag}
                </button>
              </div>
            )}

            <div
              className={`hf-studio-gallery ${gridDensity === 'compact' ? 'hf-studio-gallery--dense' : ''}`}
            >
              {(activeStageTab === 'history' ? libraryItems : pool).slice(0, 12).map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onClick={(selected) => {
                    setPreviewItem(selected);
                    if (selected.prompt) setPrompt(selected.prompt);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );

  if (isCinema) {
    return (
      <main className="hf-container hf-subpage">
        <h1 className="sr-only">Cinema Studio 4.0 — AI Director Workspace</h1>
        <div className="hf-ws-shell">
          <aside className="hf-ws-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Camera size={15} color="#d1fe17" />
                <span>Cinema Studio 4.0</span>
              </strong>
              <button
                type="button"
                className="hf-icon-btn"
                onClick={() => {
                  const next = `Project #${projects.length + 1}`;
                  setProjects((p) => [next, ...p]);
                  setActiveProject(next);
                  pushToast(`Created ${next}`);
                }}
                aria-label="New project"
              >
                <FolderPlus size={14} />
              </button>
            </div>

            {[
              { id: 'Home', icon: Home },
              { id: 'My elements', icon: Layers },
              { id: 'My favorites', icon: Heart },
              { id: 'Community', icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`hf-ws-nav-item ${cinemaNav === item.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setCinemaNav(item.id);
                    if (item.id === 'My favorites') setActiveStageTab('history');
                    else setActiveStageTab('presets');
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <Icon size={14} />
                    <span>{item.id}</span>
                  </span>
                </button>
              );
            })}

            <div className="hf-ws-divider" />
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 10, top: 11, color: '#8f939c' }} />
              <input
                type="search"
                className="hf-input"
                style={{ height: 34, paddingLeft: 28, fontSize: 12 }}
                placeholder="Search projects"
                value={cinemaSearch}
                onChange={(e) => setCinemaSearch(e.target.value)}
              />
            </div>

            {projects
              .filter((p) => p.toLowerCase().includes(cinemaSearch.toLowerCase()))
              .map((proj) => (
                <button
                  key={proj}
                  type="button"
                  className={`hf-ws-nav-item ${activeProject === proj ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveProject(proj);
                    pushToast(`Opened project: ${proj}`);
                  }}
                >
                  <span>{proj}</span>
                </button>
              ))}
          </aside>

          <div>{studioContent}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="hf-container hf-subpage">
      <section className="hf-page-hero">
        <div>
          <span className="hf-page-badge">{activeModelObj.name}</span>
          <h1 className="hf-page-title">{routeMeta.title}</h1>
          <p className="hf-page-desc">{routeMeta.desc}</p>
        </div>
        <div className="hf-section-actions">
          <Link to="/academy" className="hf-cta-dark">
            <BookOpen size={14} />
            <span>Academy Guides</span>
          </Link>
          <Link to="/generate" className="hf-cta-lime">
            <Camera size={14} />
            <span>Open Cinema Studio 4.0</span>
          </Link>
        </div>
      </section>
      {studioContent}
    </main>
  );
}

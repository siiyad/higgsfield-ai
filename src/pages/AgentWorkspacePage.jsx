import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowUp,
  Bot,
  Briefcase,
  Cpu,
  FolderPlus,
  Gamepad2,
  Home,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Mic,
  Minus,
  Plus,
  Search,
  Sparkles,
  Tag,
  UserCheck,
  Video,
  Zap,
} from 'lucide-react';
import { FACELESS_STYLES, GAME_GENRES } from '../data/catalog';
import { FABLE_USE_CASES, MARKETING_ITEMS, SHORTS_PRESETS } from '../data/showcase';
import { useApp } from '../context/AppContext';
import { validateUploadFile } from '../utils/fileValidation';
import MediaCard from '../components/common/MediaCard';

function getDefaultPrompt(pathname) {
  if (pathname === '/ads-studio') return 'a 30s drama where a tired founder discovers our espresso machine';
  if (pathname === '/content-factory') return 'What if cars could fly over Neo-Tokyo in heavy rain';
  if (pathname === '/playable') return 'A ninja cat jumping across glowing bamboo rooftops collecting gold tokens';
  return 'Turn my podcast highlight clip into 9:16 dynamic social shorts';
}

export default function AgentWorkspacePage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { pushToast, addGeneration } = useApp();

  const path = location.pathname;
  const isAds = path === '/ads-studio';
  const isMkt = path === '/marketing-studio';
  const isCF = path === '/content-factory';
  const isPlay = path === '/playable';
  const isSuper = path === '/supercomputer' || path === '/start/agent';

  const [prompt, setPrompt] = useState(() => getDefaultPrompt(path));
  const [mcpMode, setMcpMode] = useState('claude');
  const [askBefore, setAskBefore] = useState(true);
  const [memoryOn, setMemoryOn] = useState(true);
  const [durationPill, setDurationPill] = useState('30 sec');
  const [episodes, setEpisodes] = useState('1 episode');
  const [batchSize, setBatchSize] = useState(1);
  const [gameGenre, setGameGenre] = useState('All');
  const [dimension, setDimension] = useState('3D');
  const [mktCat, setMktCat] = useState('All');
  const [mktShot, setMktShot] = useState('Closeup');
  const [mktRatio, setMktRatio] = useState('3:4');
  const [mediaFilter, setMediaFilter] = useState('All');
  const [superCat, setSuperCat] = useState('All');
  const [sideNav, setSideNav] = useState('Home');
  const [refTags, setRefTags] = useState([]);
  const [uploadedRefName, setUploadedRefName] = useState('');
  const [chats, setChats] = useState([
    'Product Launch Campaign v2',
    '30s TikTok Hook Pack',
  ]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setPrompt(getDefaultPrompt(path));
    setResults([]);
    setMediaFilter('All');
    setMktCat('All');
    setSuperCat('All');
    setSideNav('Home');
    setGameGenre('All');
    setRefTags([]);
    setUploadedRefName('');
  }, [path]);

  const showcaseItems = useMemo(() => {
    let base = isPlay
      ? FABLE_USE_CASES
      : isCF
      ? SHORTS_PRESETS
      : isMkt || isAds
      ? MARKETING_ITEMS
      : [...FABLE_USE_CASES.slice(0, 4), ...MARKETING_ITEMS.slice(0, 4), ...SHORTS_PRESETS.slice(0, 4)];

    if (isPlay && gameGenre !== 'All') {
      const idx = Math.max(0, GAME_GENRES.indexOf(gameGenre));
      const rotated = [...FABLE_USE_CASES.slice(idx % FABLE_USE_CASES.length), ...FABLE_USE_CASES.slice(0, idx % FABLE_USE_CASES.length)];
      base = rotated.slice(0, 4);
    }

    if ((isMkt || isAds) && mktCat !== 'All') {
      const catList = ['Product shot', 'Motion', 'UGC', 'TikTok', 'Ads', 'Posters', 'Marketplace'];
      const idx = Math.max(0, catList.indexOf(mktCat));
      const rotated = [...MARKETING_ITEMS.slice(idx % MARKETING_ITEMS.length), ...MARKETING_ITEMS.slice(0, idx % MARKETING_ITEMS.length)];
      base = rotated.slice(0, 6);
    }

    if (isSuper && superCat !== 'All') {
      const catList = ['Marketing', 'Explainer videos', 'Apps', 'Games', 'Free Mode'];
      const idx = Math.max(0, catList.indexOf(superCat));
      const pool = [...FABLE_USE_CASES, ...MARKETING_ITEMS, ...SHORTS_PRESETS];
      const offset = (idx * 2) % pool.length;
      base = [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, 6);
    }

    if (sideNav === 'Brands' || sideNav === 'Products' || sideNav === 'Avatars') {
      const offset = sideNav === 'Brands' ? 1 : sideNav === 'Products' ? 2 : 3;
      base = [...base.slice(offset % base.length), ...base.slice(0, offset % base.length)];
    }

    if (mediaFilter === 'Images') {
      const imgs = base.filter((i) => !i.video);
      return imgs.length > 0 ? imgs : base.map((i) => ({ ...i, video: undefined }));
    }
    if (mediaFilter === 'Videos') {
      const vids = base.filter((i) => Boolean(i.video));
      return vids.length > 0 ? vids : FABLE_USE_CASES.filter((i) => Boolean(i.video));
    }
    return base;
  }, [isPlay, isCF, isMkt, isAds, isSuper, gameGenre, mktCat, superCat, sideNav, mediaFilter]);

  const handleRun = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      pushToast('Enter a prompt or script first', 'neutral');
      return;
    }
    const stamp = Date.now();
    const count = isMkt ? batchSize : 1;
    const baseTitle = isAds
      ? 'Ads Studio'
      : isPlay
      ? `Playable Game (${dimension})`
      : isCF
      ? `Content Factory (${durationPill})`
      : isMkt
      ? `Marketing (${mktShot})`
      : 'Supercomputer Build';

    const items = Array.from({ length: count }, (_, idx) => {
      const sample = showcaseItems[idx % Math.max(1, showcaseItems.length)] || FABLE_USE_CASES[0];
      return {
        id: `ws-${stamp}-${idx}`,
        title: count > 1 ? `${baseTitle} #${idx + 1}` : baseTitle,
        model: isCF || isPlay ? (mcpMode === 'claude' ? 'Claude × Fable 5.2' : 'Seedance 2.5') : searchParams.get('model') || 'Supercomputer Auto',
        modelName: mcpMode === 'claude' ? 'Claude × Fable 5.2' : 'Seedance 2.5',
        prompt: `${prompt}${refTags.length ? ` [${refTags.join(', ')}]` : ''}`,
        poster: sample.poster || sample.img,
        img: sample.img || sample.poster,
        video: sample.video,
        aspect: isMkt ? mktRatio.replace(':', '/') : isCF ? '9/16' : '16/9',
        cost: 10,
      };
    });

    const saved = addGeneration(items);
    if (saved) {
      setResults((prev) => [...items, ...prev]);
      setChats((prev) => [prompt.slice(0, 34), ...prev.filter((c) => c !== prompt.slice(0, 34)).slice(0, 6)]);
    }
  };

  // Layout A: Content Factory & Playable centered Claude MCP Hero Composer
  if (isCF || isPlay) {
    return (
      <main className="hf-container hf-subpage">
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
          <span className="hf-underline-tab is-active">
            {isPlay ? 'Explore Playables' : 'Explore'}
          </span>
          <Link to="/generate?tab=library" className="hf-underline-tab">
            {isPlay ? 'My playables' : 'My generations'}
          </Link>
        </div>

        <section
          className="hf-page-hero"
          style={{
            flexDirection: 'column',
            textAlign: 'center',
            paddingBlock: 44,
            background:
              'radial-gradient(60% 70% at 50% 0%, rgba(217, 119, 87, 0.16) 0%, transparent 70%), #111316',
          }}
        >
          <div className="hf-seg-control">
            <button
              type="button"
              className={`hf-seg-btn ${mcpMode === 'claude' ? 'is-active' : ''}`}
              onClick={() => setMcpMode('claude')}
            >
              ✺ Generate in Claude
            </button>
            <button
              type="button"
              className={`hf-seg-btn ${mcpMode === 'here' ? 'is-active' : ''}`}
              onClick={() => setMcpMode('here')}
            >
              Generate here
            </button>
          </div>

          <h1 className="hf-page-title" style={{ maxWidth: 820 }}>
            {isPlay
              ? 'CREATE GAMES THAT BRING PLAYERS IN INSIDE CLAUDE WITH HIGGSFIELD MCP'
              : 'GENERATE VIRAL FACELESS SHORT VIDEOS INSIDE CLAUDE WITH HIGGSFIELD MCP'}
          </h1>
          <p className="hf-page-desc">
            {isPlay
              ? 'Describe your game mechanic, upload character sprites, and launch a playable WebGL experience.'
              : 'Turn any "What If" prompt into narrated episodes with automated captions and sound.'}
          </p>

          <form
            onSubmit={handleRun}
            style={{
              width: 'min(760px, 100%)',
              padding: 12,
              borderRadius: 18,
              background: '#17191d',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <label
              className="hf-upload-dropzone"
              style={{ width: 82, height: 82, padding: 8, flexShrink: 0 }}
            >
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
                  setUploadedRefName(file.name);
                  pushToast(`Reference added: ${file.name}`);
                }}
              />
              <Plus size={16} />
              <span style={{ fontSize: 10 }}>{uploadedRefName ? 'Ref set' : 'Add ref'}</span>
            </label>

            <div style={{ flex: '1 1 260px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="text"
                className="hf-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isPlay ? 'Make a game about...' : 'Make a video about...'}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {isCF ? (
                  <>
                    <button
                      type="button"
                      className="hf-chip is-active"
                      onClick={() => setDurationPill((d) => (d === '30 sec' ? '60 sec' : '30 sec'))}
                    >
                      {durationPill}
                    </button>
                    <button
                      type="button"
                      className="hf-chip"
                      onClick={() => setEpisodes((ep) => (ep === '1 episode' ? '3 episodes' : '1 episode'))}
                    >
                      {episodes}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="hf-chip is-active"
                      onClick={() => setDimension((d) => (d === '3D' ? '2D Pixel' : '3D'))}
                    >
                      {dimension}
                    </button>
                    <button
                      type="button"
                      className="hf-chip"
                      onClick={() => {
                        const list = ['All', ...GAME_GENRES];
                        const next = list[(list.indexOf(gameGenre) + 1) % list.length];
                        setGameGenre(next);
                        pushToast(`Game genre: ${next}`);
                      }}
                    >
                      Genre: {gameGenre}
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="hf-cta-lime"
              style={{
                height: 76,
                paddingInline: 20,
                background: mcpMode === 'claude' ? '#d97757' : '#d1fe17',
                color: '#101214',
                fontWeight: 800,
              }}
            >
              {mcpMode === 'claude' ? 'GENERATE IN CLAUDE' : 'GENERATE HERE'}
            </button>
          </form>

          <Link to="/mcp?tab=claude" className="hf-cta-dark">
            <Cpu size={14} />
            <span>Connect Higgsfield MCP to generate</span>
          </Link>
        </section>

        {/* Visual Style / Genre Selector Strip */}
        <section style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: 18, margin: '0 0 12px', textAlign: 'center' }}>
            {isCF ? 'Pick a trending faceless aesthetic to start from' : 'Browse Playable Game Genres'}
          </h2>
          <div className="hf-chip-row" style={{ justifyContent: 'center' }}>
            {(isCF ? FACELESS_STYLES : GAME_GENRES).map((tag) => (
              <button
                key={tag}
                type="button"
                className={`hf-chip ${(isPlay ? gameGenre === tag : prompt.includes(tag)) ? 'is-active' : ''}`}
                onClick={() => {
                  if (isPlay) setGameGenre(tag);
                  else {
                    setPrompt(`${tag} style: ${prompt.replace(/^[^:]+:\s*/, '')}`);
                    pushToast(`Applied aesthetic: ${tag}`);
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {results.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 className="hf-section-title" style={{ marginBottom: 12 }}>
              Your Recent Builds
            </h2>
            <div className="hf-projects-grid">
              {results.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <div className="hf-projects-grid">
          {showcaseItems.map((item) => (
            <MediaCard key={item.id} item={{ ...item, aspect: isCF ? '9/16' : '16/9' }} />
          ))}
        </div>
      </main>
    );
  }

  // Layout B: Left Sidebar Agent Workspace (/supercomputer, /ads-studio, /marketing-studio)
  return (
    <main className="hf-container hf-subpage">
      <div className="hf-ws-shell">
        <aside className="hf-ws-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 4 }}>
            <strong style={{ fontSize: 15, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Sparkles size={15} color="#d1fe17" />
              <span>{isAds ? 'Ads Studio' : isMkt ? 'Marketing Studio' : 'Supercomputer'}</span>
            </strong>
            <button
              type="button"
              className="hf-icon-btn"
              onClick={() => {
                setResults([]);
                pushToast('Started a fresh session thread');
              }}
              aria-label="New chat or session"
            >
              <FolderPlus size={14} />
            </button>
          </div>

          {[
            { id: 'Home', icon: Home },
            { id: 'All media', icon: Layers },
            ...(isAds
              ? [
                  { id: 'Brands', icon: Tag },
                  { id: 'Products', icon: Briefcase },
                  { id: 'Avatars', icon: UserCheck },
                ]
              : [
                  { id: 'Skills', icon: Zap },
                  { id: 'Connectors', icon: Cpu },
                ]),
          ].map((nav) => {
            const Icon = nav.icon;
            return (
              <button
                key={nav.id}
                type="button"
                className={`hf-ws-nav-item ${sideNav === nav.id ? 'is-active' : ''}`}
                onClick={() => setSideNav(nav.id)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} />
                  <span>{nav.id}</span>
                </span>
              </button>
            );
          })}

          <div className="hf-ws-divider" />
          <div style={{ fontSize: 11, fontWeight: 700, color: '#787d87', paddingInline: 8 }}>
            RECENT CHATS &amp; PROJECTS
          </div>
          {chats.map((c, idx) => (
            <button
              key={idx}
              type="button"
              className="hf-ws-nav-item"
              onClick={() => setPrompt(c)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
                <MessageSquare size={12} style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c}
                </span>
              </span>
            </button>
          ))}

          {isSuper && (
            <div style={{ marginTop: 6, padding: 10, borderRadius: 12, background: '#181b20', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <span>Agent Memory</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={memoryOn}
                  className={`hf-switch ${memoryOn ? 'is-on' : ''}`}
                  onClick={() => setMemoryOn((m) => !m)}
                  aria-label="Toggle memory"
                >
                  <span className="hf-switch__thumb" />
                </button>
              </div>
            </div>
          )}
        </aside>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="hf-dot-stage" style={{ alignItems: 'center', textAlign: 'center', paddingBlock: 32 }}>
            <span className="hf-page-badge">
              {isAds ? 'ADS STUDIO DIRECTOR' : isMkt ? 'PRODUCT CONTENT ENGINE' : 'FABLE 5.2 AGENT ENGINE'}
              {sideNav !== 'Home' ? ` • ${sideNav.toUpperCase()}` : ''}
            </span>
            <h1 className="hf-page-title" style={{ maxWidth: 740, margin: 0 }}>
              {isAds
                ? 'PASTE YOUR SCRIPT, PICK A STYLE, WE HANDLE THE REST'
                : isMkt
                ? 'TURN ANY PRODUCT INTO READY TO POST CONTENT'
                : 'WHAT ARE WE CREATING TODAY?'}
            </h1>

            <form
              onSubmit={handleRun}
              style={{
                width: 'min(760px, 100%)',
                padding: 14,
                borderRadius: 18,
                background: '#17191d',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <textarea
                className="hf-textarea"
                style={{ minHeight: 74, border: 'none', background: 'transparent', padding: 4 }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe campaign, product link, script, or agent instruction..."
              />

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {isMkt ? (
                    <>
                      <button
                        type="button"
                        className="hf-chip is-active"
                        onClick={() => {
                          const shots = ['Closeup', 'Full Shot', 'Flatlay', 'Macro'];
                          const next = shots[(shots.indexOf(mktShot) + 1) % shots.length];
                          setMktShot(next);
                          pushToast(`Framing: ${next}`);
                        }}
                      >
                        {mktShot}
                      </button>
                      <button
                        type="button"
                        className="hf-chip"
                        onClick={() => {
                          const ratios = ['3:4', '9:16', '1:1', '16:9'];
                          const next = ratios[(ratios.indexOf(mktRatio) + 1) % ratios.length];
                          setMktRatio(next);
                          pushToast(`Aspect ratio: ${next}`);
                        }}
                      >
                        {mktRatio}
                      </button>
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
                    </>
                  ) : (
                    <>
                      <label className="hf-chip" style={{ cursor: 'pointer' }}>
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
                            setUploadedRefName(file.name);
                            pushToast(`Attached reference: ${file.name}`);
                          }}
                        />
                        {uploadedRefName ? `Ref: ${uploadedRefName}` : '+ Add refs'}
                      </label>
                      {['Style', 'Product', 'Avatar'].map((tag) => {
                        const active = refTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            className={`hf-chip ${active ? 'is-active' : ''}`}
                            onClick={() =>
                              setRefTags((prev) =>
                                prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
                              )
                            }
                          >
                            {tag}
                          </button>
                        );
                      })}
                      {isSuper && <span className="hf-chip is-active">Auto (Free Mode)</span>}
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isSuper && (
                    <button
                      type="button"
                      className={`hf-chip ${askBefore ? 'is-active' : ''}`}
                      onClick={() => setAskBefore((a) => !a)}
                    >
                      {askBefore ? 'Ask before generating' : 'Auto execute'}
                    </button>
                  )}
                  <button
                    type="button"
                    className="hf-icon-btn"
                    onClick={() => pushToast('Voice dictation ready')}
                    aria-label="Voice input"
                  >
                    <Mic size={14} />
                  </button>
                  <button type="submit" className="hf-cta-lime" style={{ height: 34 }}>
                    <ArrowUp size={15} />
                    <span>Run</span>
                  </button>
                </div>
              </div>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              <Link to="/mcp?tab=claude" className="hf-cta-dark">
                <Bot size={14} />
                <span>Generate viral campaigns in Claude</span>
              </Link>
              <Link to="/higgsfield-api" className="hf-cta-dark">
                <Cpu size={14} />
                <span>Automate via API</span>
              </Link>
            </div>
          </div>

          {/* Filter Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
            <div className="hf-chip-row">
              {(isMkt
                ? ['All', 'Product shot', 'Motion', 'UGC', 'TikTok', 'Ads', 'Posters', 'Marketplace']
                : ['All', 'Marketing', 'Explainer videos', 'Apps', 'Games', 'Free Mode']
              ).map((chip) => {
                const active = isMkt ? mktCat === chip : superCat === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    className={`hf-chip ${active ? 'is-active' : ''}`}
                    onClick={() => (isMkt ? setMktCat(chip) : setSuperCat(chip))}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            <div className="hf-seg-control">
              {['All', 'Images', 'Videos'].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`hf-seg-btn ${mediaFilter === m ? 'is-active' : ''}`}
                  style={{ padding: '5px 11px', fontSize: 12 }}
                  onClick={() => setMediaFilter(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {results.length > 0 && (
            <div className="hf-projects-grid">
              {results.map((r) => (
                <MediaCard key={r.id} item={r} />
              ))}
            </div>
          )}

          <div className="hf-projects-grid">
            {showcaseItems.map((item) => (
              <MediaCard key={item.id} item={{ ...item, aspect: isMkt ? '3/4' : '16/9' }} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

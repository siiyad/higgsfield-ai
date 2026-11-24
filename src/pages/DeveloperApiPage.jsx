import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Check,
  Copy,
  Cpu,
  Download,
  KeyRound,
  Layers,
  Search,
  Sparkles,
  Terminal,
} from 'lucide-react';
import {
  FABLE_BLOG_SLUGS,
  MCP_FILTER_CATEGORIES,
  MCP_ONE_CLICK_PRESETS,
} from '../data/catalog';
import { FABLE_USE_CASES, SOUL_20_ITEMS, STUDIO_MODELS } from '../data/showcase';
import { useApp } from '../context/AppContext';

const CLIENT_TABS = ['ChatGPT', 'Claude', 'Claude Code', 'Telegram', 'CLI', 'Other'];

const CLIENT_CONFIGS = {
  ChatGPT: {
    steps: 'Open ChatGPT -> Settings -> Connectors -> Paste Higgsfield MCP endpoint -> Authorize workspace.',
    code: `{
  "connector_url": "https://mcp.higgsfield.ai/sse",
  "oauth": "higgsfield-chatgpt-fable-5.2",
  "models": ["seedance_2_5", "gpt_image_2_6", "seedream_5_5", "soul_2_0"]
}`,
  },
  Claude: {
    steps: 'Open Claude Desktop -> Settings -> Developer -> Edit Config -> Save & restart Claude.',
    code: `{
  "mcpServers": {
    "higgsfield": {
      "command": "npx",
      "args": ["-y", "@higgsfield/mcp-server@latest"],
      "env": { "HIGGSFIELD_API_KEY": "hf_demo_your_workspace_key" }
    }
  }
}`,
  },
  'Claude Code': {
    steps: 'Run one CLI command inside your project root to register Higgsfield MCP inside Claude Code.',
    code: `claude mcp add higgsfield --transport stdio -- npx -y @higgsfield/mcp-server@latest`,
  },
  Telegram: {
    steps: 'Open @HiggsfieldBot on Telegram, paste `/connect hf_demo_your_workspace_key`, and prompt directly in chat.',
    code: `/connect hf_demo_your_workspace_key
/generate seedance_2_5 "Anamorphic rain chase, 35mm"`,
  },
  CLI: {
    steps: 'Install globally via npm and dispatch asynchronous video or image renders from shell.',
    code: `npm i -g @higgsfield/cli
higgsfield auth login
higgsfield generate --model seedance_2_5 --duration 10s --prompt "Neon rooftop portrait"`,
  },
  Other: {
    steps: 'Compatible with Cursor, Windsurf, Cline, and any standard stdio/SSE MCP host.',
    code: `{
  "transport": "sse",
  "endpoint": "https://mcp.higgsfield.ai/v1/sse",
  "headers": { "Authorization": "Bearer hf_demo_your_workspace_key" }
}`,
  },
};

const API_SDK_TABS = ['API', 'Claude Code', 'Codex', 'Cursor', 'MCP', 'TypeScript', 'Python', 'cURL'];

const API_SNIPPETS = {
  API: `POST https://platform.higgsfield.ai/v1/generations
Authorization: Bearer $HIGGSFIELD_API_KEY
Content-Type: application/json

{
  "model": "seedance_2_5",
  "prompt": "Slow dolly push through rain-slick Tokyo alley",
  "duration": 10,
  "resolution": "1080p"
}`,
  'Claude Code': `claude mcp add higgsfield-api -- npx -y @higgsfield/api-mcp`,
  Codex: `codex --mcp "higgsfield=https://platform.higgsfield.ai/mcp"`,
  Cursor: `// .cursor/mcp.json
{ "mcpServers": { "higgsfield-api": { "url": "https://platform.higgsfield.ai/mcp" } } }`,
  MCP: `npx @higgsfield/mcp-server --api-key $HIGGSFIELD_API_KEY`,
  TypeScript: `import { Higgsfield } from '@higgsfield/sdk';
const hf = new Higgsfield({ apiKey: process.env.HIGGSFIELD_API_KEY });
const job = await hf.video.generate({ model: 'seedance_2_5', prompt: 'Anamorphic street chase', duration: '10s' });`,
  Python: `from higgsfield import HiggsfieldClient
client = HiggsfieldClient(api_key="hf_demo_your_workspace_key")
res = client.generate(model="seedance_2_5", prompt="Studio luxury bottle macro rotation", duration=10)`,
  cURL: `curl -X POST https://platform.higgsfield.ai/v1/generations \\
  -H "Authorization: Bearer $HIGGSFIELD_API_KEY" \\
  -d '{"model":"seedance_2_5","prompt":"Golden hour desert dunes"}'`,
};

const NLE_HOSTS = ['After Effects', 'Premiere Pro', 'Photoshop', 'DaVinci Resolve', 'Figma', 'Blender'];

const MCP_TAB_MAP = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  'claude-code': 'Claude Code',
  telegram: 'Telegram',
  cli: 'CLI',
  other: 'Other',
};

function mapTabParam(tabValue) {
  if (!tabValue) return 'Claude';
  return MCP_TAB_MAP[String(tabValue).toLowerCase()] || 'Claude';
}

function generateDemoApiKey() {
  const bytes = new Uint8Array(12);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  }
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `hf_demo_${hex}`;
}

export default function DeveloperApiPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pushToast } = useApp();

  const path = location.pathname;
  const isApi = path === '/higgsfield-api' || path === '/api-console';
  const isPlugin = path === '/plugins/after-effects';

  // MCP state
  const tabQuery = searchParams.get('tab');
  const [clientTab, setClientTab] = useState(() => mapTabParam(tabQuery));
  const [howToOpen, setHowToOpen] = useState(true);
  const [mcpCat, setMcpCat] = useState('Popular');
  const [presetQuery, setPresetQuery] = useState('');

  useEffect(() => {
    setClientTab(mapTabParam(tabQuery));
  }, [tabQuery]);

  // API state
  const [sdkTab, setSdkTab] = useState('TypeScript');
  const [selectedBundle, setSelectedBundle] = useState(['seedance_2_5', 'gpt-image-2-6-sunburst', 'seedream_5_5']);
  const [apiKeyVal, setApiKeyVal] = useState('hf_demo_9f4e2a8cb81e7f902d');

  // Plugin state
  const [nleHost, setNleHost] = useState('After Effects');
  const [osChoice, setOsChoice] = useState('MacOS');
  const [compareSplit, setCompareSplit] = useState(55);

  const [copiedId, setCopiedId] = useState('');

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* fallback */
    }
    setCopiedId(label);
    pushToast(`Copied ${label}`);
    window.setTimeout(() => setCopiedId(''), 1800);
  };

  const filteredPresets = useMemo(() => {
    const q = presetQuery.trim().toLowerCase();
    return MCP_ONE_CLICK_PRESETS.filter((p) => {
      const catMatch = mcpCat === 'Popular' || p.category === mcpCat;
      const qMatch =
        !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
  }, [mcpCat, presetQuery]);

  // 1. OPEN HIGGSFIELD API (/higgsfield-api)
  if (isApi) {
    const bundleChoices = [
      ...STUDIO_MODELS.video.slice(0, 4),
      ...STUDIO_MODELS.image.slice(0, 4),
    ];

    const toggleBundleModel = (id) => {
      setSelectedBundle((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 3) return [...prev.slice(1), id];
        return [...prev, id];
      });
    };

    const discountPct = selectedBundle.length === 3 ? 75 : selectedBundle.length === 2 ? 45 : selectedBundle.length === 1 ? 15 : 0;

    return (
      <main className="hf-container hf-subpage">
        <div
          style={{
            marginBottom: 18,
            padding: '8px 14px',
            borderRadius: 10,
            background: 'linear-gradient(90deg, rgba(209,254,23,0.16), rgba(34,197,94,0.16))',
            border: '1px solid rgba(209,254,23,0.3)',
            textAlign: 'center',
            fontSize: 12.5,
            fontWeight: 700,
            color: '#d1fe17',
          }}
        >
          15% OFF ALL SALE MODELS &bull; CHOOSE 3 MODELS FOR UP TO 75% OFF &bull; +$15 API STARTER BALANCE
        </div>

        <section className="hf-page-hero">
          <div>
            <span className="hf-page-badge">
              <KeyRound size={13} />
              <span>OPEN HIGGSFIELD API</span>
            </span>
            <h1 className="hf-page-title">CONNECT ONCE. BUILD ANYTHING.</h1>
            <p className="hf-page-desc">
              Unified inference gateway for Seedance 2.5, GPT Image 2.6, Seedream 5.5, Kling 4.0, and Soul 2.0 with webhooks and agent tool definitions.
            </p>
          </div>
          <button
            type="button"
            className="hf-cta-lime"
            onClick={() => {
              const nextKey = generateDemoApiKey();
              setApiKeyVal(nextKey);
              copyText(nextKey, 'new sandbox demo key');
            }}
          >
            <Sparkles size={15} />
            <span>Generate Sandbox Key</span>
          </button>
        </section>

        {/* SDK Quickstart Switcher */}
        <section className="hf-studio-panel" style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div className="hf-chip-row">
              {API_SDK_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`hf-chip ${sdkTab === tab ? 'is-active' : ''}`}
                  onClick={() => setSdkTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <code style={{ fontSize: 11.5, color: '#9ea2ab' }}>Demo Key: {apiKeyVal}</code>
              <button
                type="button"
                className="hf-cta-dark"
                onClick={() => copyText(API_SNIPPETS[sdkTab], `${sdkTab} snippet`)}
              >
                {copiedId === `${sdkTab} snippet` ? <Check size={13} /> : <Copy size={13} />}
                <span>Copy code</span>
              </button>
            </div>
          </div>

          <pre className="hf-code-box" style={{ margin: 0 }}>
            <code>{API_SNIPPETS[sdkTab]}</code>
          </pre>
        </section>

        {/* Interactive 3-Model Bundle Configurator */}
        <section className="hf-studio-panel" style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 19 }}>
                Choose any 3 models for discounts of up to 75%
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>
                Selected ({selectedBundle.length}/3):{' '}
                <strong style={{ color: '#d1fe17' }}>{discountPct}% Volume Bundle Discount</strong>
              </p>
            </div>
            <button
              type="button"
              className="hf-cta-lime"
              onClick={() => pushToast(`Activated ${discountPct}% API bundle for ${selectedBundle.length} models`)}
            >
              Lock {discountPct}% Bundle Rate
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {bundleChoices.map((m) => {
              const active = selectedBundle.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`hf-model-option ${active ? 'is-selected' : ''}`}
                  onClick={() => toggleBundleModel(m.id)}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#8f939c' }}>{m.desc}</div>
                  </div>
                  <span className="hf-nav-badge" style={{ color: active ? '#d1fe17' : undefined }}>
                    {active ? 'Selected' : m.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Starter Agent Pipelines */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {[
            { name: 'Content factory', desc: 'Script -> Eleven V3 audio -> Seedance 2.5 -> Captions webhook pipeline.' },
            { name: 'Fashion photoshoots', desc: 'Soul 2.0 + Seedream 5.5 multi-angle e-commerce lookbook batch API.' },
            { name: 'Cinematic pipeline', desc: 'Claude storyboard planner -> Cinema Studio 4.0 -> Topaz 4K upscaler.' },
          ].map((tpl) => (
            <article key={tpl.name} className="hf-studio-panel" style={{ justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{tpl.name}</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#9ea2ab' }}>{tpl.desc}</p>
              </div>
              <button
                type="button"
                className="hf-cta-dark"
                onClick={() => copyText(`Build a Higgsfield ${tpl.name} pipeline: ${tpl.desc}`, `${tpl.name} prompt`)}
              >
                <Copy size={13} />
                <span>Copy for agent</span>
              </button>
            </article>
          ))}
        </section>
      </main>
    );
  }

  // 2. CREATIVE PLUGINS (/plugins/after-effects)
  if (isPlugin) {
    return (
      <main className="hf-container hf-subpage">
        <section className="hf-page-hero">
          <div>
            <span className="hf-page-badge">
              <Layers size={13} />
              <span>HIGGSFIELD NLE BRIDGE</span>
            </span>
            <h1 className="hf-page-title">HIGGSFIELD IN {nleHost.toUpperCase()}</h1>
            <p className="hf-page-desc">
              Generate keyframes, remove backgrounds cleanly, upscale plates to 4K, and sync Seedance 2.5 renders straight into timeline layers.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <div className="hf-seg-control">
              {['MacOS', 'Windows'].map((os) => (
                <button
                  key={os}
                  type="button"
                  className={`hf-seg-btn ${osChoice === os ? 'is-active' : ''}`}
                  onClick={() => setOsChoice(os)}
                >
                  {os}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="hf-cta-lime"
              onClick={() => pushToast(`Downloading Higgsfield ${nleHost} plugin for ${osChoice} (.zxp)`)}
            >
              <Download size={14} />
              <span>Download Plugin ({osChoice})</span>
            </button>
          </div>
        </section>

        <div className="hf-chip-row" style={{ marginBottom: 18 }}>
          {NLE_HOSTS.map((host) => (
            <button
              key={host}
              type="button"
              className={`hf-chip ${nleHost === host ? 'is-active' : ''}`}
              onClick={() => setNleHost(host)}
            >
              {host}
            </button>
          ))}
        </div>

        <section className="hf-studio-panel" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <strong>Universal Bridge Endpoint</strong>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <code className="hf-nav-badge" style={{ padding: '6px 10px' }}>https://bridge.higgsfield.ai/mcp</code>
              <button
                type="button"
                className="hf-cta-dark"
                onClick={() => copyText('https://bridge.higgsfield.ai/mcp', 'Bridge URL')}
              >
                <Copy size={13} />
                <span>Copy URL</span>
              </button>
            </div>
          </div>

          <div className="hf-compare-wrap" style={{ maxHeight: 400 }}>
            <img src={SOUL_20_ITEMS[6].img} alt="Original plate" style={{ filter: 'brightness(0.8)' }} />
            <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - compareSplit}% 0 0)` }}>
              <img src={SOUL_20_ITEMS[2].img} alt="Enhanced matte" />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${compareSplit}%`,
                width: 2,
                background: '#d1fe17',
              }}
            />
            <span style={{ position: 'absolute', left: 14, top: 14 }} className="hf-nav-badge">RAW TIMELINE PLATE</span>
            <span style={{ position: 'absolute', right: 14, top: 14, color: '#d1fe17' }} className="hf-nav-badge">
              ROTO + 4K UPSCALE
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            value={compareSplit}
            onChange={(e) => setCompareSplit(Number(e.target.value))}
            aria-label="Plugin before after comparison"
            className="hf-compare-slider"
          />
        </section>
      </main>
    );
  }

  // 3. HIGGSFIELD MCP WORKSPACE (/mcp)
  return (
    <main className="hf-container hf-subpage">
      <section className="hf-page-hero">
        <div>
          <span className="hf-page-badge">
            <Cpu size={13} />
            <span>HIGGSFIELD MCP</span>
          </span>
          <h1 className="hf-page-title">CONNECT HIGGSFIELD TO ANY AI CLIENT</h1>
          <p className="hf-page-desc">
            Run Seedance 2.5, GPT Image 2.6, Seedream 5.5, and Fable 5.2 directly from ChatGPT, Claude, Claude Code, Telegram, or CLI.
          </p>
        </div>

        <Link to="/higgsfield-api" className="hf-cta-lime">
          <KeyRound size={14} />
          <span>Get Open API Key</span>
        </Link>
      </section>

      <section className="hf-studio-panel" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div className="hf-chip-row">
            {CLIENT_TABS.map((client) => {
              const slug = Object.entries(MCP_TAB_MAP).find(([, label]) => label === client)?.[0] || 'claude';
              return (
                <button
                  key={client}
                  type="button"
                  className={`hf-chip ${clientTab === client ? 'is-active' : ''}`}
                  onClick={() => {
                    setClientTab(client);
                    setSearchParams(slug === 'claude' ? {} : { tab: slug }, { replace: true });
                  }}
                >
                  {client}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="hf-cta-dark"
            onClick={() => setHowToOpen((v) => !v)}
          >
            <Terminal size={14} />
            <span>{howToOpen ? 'Hide instructions' : 'How to connect?'}</span>
          </button>
        </div>

        {howToOpen && (
          <p style={{ margin: 0, fontSize: 13, color: '#b4b7bf' }}>
            {CLIENT_CONFIGS[clientTab].steps}
          </p>
        )}

        <pre className="hf-code-box" style={{ margin: 0 }}>
          <code>{CLIENT_CONFIGS[clientTab].code}</code>
        </pre>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#8f939c' }}>Works with unlimited new-user Claude MCP promo</span>
          <button
            type="button"
            className="hf-cta-white"
            onClick={() => copyText(CLIENT_CONFIGS[clientTab].code, `${clientTab} config`)}
          >
            {copiedId === `${clientTab} config` ? <Check size={14} /> : <Copy size={14} />}
            <span>Copy Config</span>
          </button>
        </div>
      </section>

      {/* Preset Library & Categories */}
      <section id="workflows" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <h2 className="hf-section-title" style={{ margin: 0 }}>One-Click MCP Presets</h2>
          <div style={{ position: 'relative', width: 'min(260px, 100%)', maxWidth: '100%' }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: 12, color: '#8f939c' }} />
            <input
              type="search"
              className="hf-input"
              style={{ paddingLeft: 32, height: 38 }}
              placeholder="Search presets..."
              value={presetQuery}
              onChange={(e) => setPresetQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="hf-chip-row" style={{ marginBottom: 16 }}>
          {MCP_FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`hf-chip ${mcpCat === cat ? 'is-active' : ''}`}
              onClick={() => setMcpCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredPresets.length === 0 ? (
          <div className="hf-studio-panel" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#b4b7bf' }}>
              No MCP presets matched &ldquo;{presetQuery}&rdquo; in {mcpCat}.
            </p>
            <button
              type="button"
              className="hf-cta-dark"
              onClick={() => {
                setPresetQuery('');
                setMcpCat('Popular');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {filteredPresets.map((preset) => (
              <article key={preset.id} className="hf-studio-panel" style={{ justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className="hf-nav-badge">{preset.category}</span>
                    <span style={{ fontSize: 11, color: '#d97757', fontWeight: 700 }}>{preset.client}</span>
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 15.5 }}>{preset.title}</h3>
                  <p style={{ margin: 0, fontSize: 12.5, color: '#9ea2ab' }}>{preset.desc}</p>
                </div>
                <button
                  type="button"
                  className="hf-cta-lime"
                  style={{ justifyContent: 'center' }}
                  onClick={() => copyText(preset.prompt, preset.title)}
                >
                  <Copy size={13} />
                  <span>Copy MCP Prompt</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Fable 5.2 Blog Case Study Links */}
      <section>
        <div className="hf-section-head">
          <div className="hf-section-title-group">
            <h2 className="hf-section-title">Featured Fable 5.2 &times; MCP Builds</h2>
            <p className="hf-section-sub">Click any build to read the full technical breakdown &amp; prompt recipe</p>
          </div>
        </div>
        <div className="hf-fable-grid">
          {FABLE_USE_CASES.map((item) => {
            const slug = FABLE_BLOG_SLUGS[item.id];
            return (
              <Link
                key={item.id}
                to={`/@higgsfield.studio/blogs/${slug}`}
                className="hf-fable-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <img src={item.poster} alt={item.title} />
                <div className="hf-fable-card__scrim" />
                <div className="hf-fable-card__meta">
                  <h3 className="hf-fable-card__title">{item.title}</h3>
                  <div className="hf-fable-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="hf-fable-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

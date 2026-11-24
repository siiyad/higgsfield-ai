import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AudioWaveform,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Filter,
  FolderClock,
  HelpCircle,
  Loader2,
  Mic,
  Minus,
  Music,
  Play,
  Plus,
  Sliders,
  Sparkles,
  Upload,
  Volume2,
} from 'lucide-react';
import { AUDIO_MODELS, VOICE_PRESETS } from '../data/catalog';
import { useApp } from '../context/AppContext';
import { validateUploadFile } from '../utils/fileValidation';

export default function AudioPage() {
  const [searchParams] = useSearchParams();
  const { pushToast, addGeneration } = useApp();

  const initialTab =
    searchParams.get('tab') === 'voice-change' || searchParams.get('mode') === 'lipsync'
      ? 'voice-change'
      : searchParams.get('tab') === 'translate'
      ? 'translate'
      : 'tts';

  const [tab, setTab] = useState(initialTab);
  const [scriptText, setScriptText] = useState(
    'In a world where every frame can be reimagined in seconds, direct the cut, tune the lighting, and bring characters to life with @clara.'
  );
  const [voiceDetails, setVoiceDetails] = useState(
    'Calm cinema director with subtle British articulation and warm studio presence'
  );
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || 'seed_audio_1_0');
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PRESETS[0].id);
  const [batchSize, setBatchSize] = useState(1);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [stability, setStability] = useState(72);
  const [similarity, setSimilarity] = useState(84);
  const [stageView, setStageView] = useState('how-it-works');
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [audioTracks, setAudioTracks] = useState([
    {
      id: 'aud-demo-1',
      title: 'Clara Cinema Intro (Seed Audio 1.0)',
      duration: '0:14',
      modelName: 'Seed Audio 1.0',
      voice: 'Clara (British Film)',
      script: 'Welcome to Higgsfield Cinema Studio 4.0 — every take stays locked across scenes.',
      language: 'English (UK)',
    },
  ]);
  const [playingId, setPlayingId] = useState(null);
  const [filterTone, setFilterTone] = useState('All');

  useEffect(() => {
    const qTab = searchParams.get('tab');
    const qMode = searchParams.get('mode');
    if (qTab === 'translate') setTab('translate');
    else if (qTab === 'voice-change' || qMode === 'lipsync') setTab('voice-change');
    else if (qTab === 'tts') setTab('tts');
    if (searchParams.get('model')) setSelectedModel(searchParams.get('model'));
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const activeModel = AUDIO_MODELS.find((m) => m.id === selectedModel) || AUDIO_MODELS[0];
  const activeVoice = VOICE_PRESETS.find((v) => v.id === selectedVoice) || VOICE_PRESETS[0];

  const handleGenerate = () => {
    if (!scriptText.trim()) {
      pushToast('Write your dialogue script first', 'neutral');
      return;
    }
    setGenerating(true);
    window.setTimeout(() => {
      const words = scriptText.trim().split(/\s+/).filter(Boolean).length;
      const secs = Math.max(4, Math.min(58, Math.round(words * 0.45)));
      const durationStr = `0:${String(secs).padStart(2, '0')}`;
      const stamp = Date.now();
      const actionLabel = tab === 'tts' ? 'TTS' : tab === 'translate' ? 'Dub' : 'Voice Swap';

      const newTracks = Array.from({ length: batchSize }, (_, idx) => ({
        id: `aud-${stamp}-${idx}`,
        title: `${activeVoice.name} • ${actionLabel}${batchSize > 1 ? ` #${idx + 1}` : ''}`,
        duration: durationStr,
        modelName: activeModel.name,
        voice: activeVoice.name,
        script: scriptText,
        language: tab === 'translate' ? 'Japanese / Spanish Multi-Dub' : 'English',
      }));

      const saved = addGeneration(
        newTracks.map((tr) => ({
          id: tr.id,
          title: tr.title,
          model: activeModel.name,
          modelName: activeModel.name,
          prompt: scriptText,
          poster: 'https://static.higgsfield.ai/public/promotions/seedance-2-5-sale-hero-poster.jpg',
          cost: 6,
        }))
      );

      if (saved) {
        setAudioTracks((prev) => [...newTracks, ...prev]);
        setStageView('history');
      }
      setGenerating(false);
    }, 650);
  };

  const handlePreviewSpeech = (track) => {
    const isStopping = playingId === track.id;
    setPlayingId(isStopping ? null : track.id);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!isStopping) {
        const utter = new SpeechSynthesisUtterance(track.script.slice(0, 140));
        utter.rate = 0.96;
        utter.onend = () => setPlayingId(null);
        utter.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utter);
      }
    } else if (!isStopping) {
      pushToast(`Previewing "${track.title}" (Web Speech playback unavailable in this browser)`, 'neutral');
      setPlayingId(null);
    }
  };

  return (
    <main className="hf-container hf-subpage">
      <div className="hf-studio-grid">
        {/* Left Control Column */}
        <aside className="hf-studio-panel">
          <div className="hf-underline-tabs" role="tablist" aria-label="Audio Studio Mode">
            {[
              { id: 'tts', label: 'Text to Speech' },
              { id: 'voice-change', label: 'Voice Change' },
              { id: 'translate', label: 'Translate' },
            ].map((tItem) => (
              <button
                key={tItem.id}
                type="button"
                role="tab"
                aria-selected={tab === tItem.id}
                className={`hf-underline-tab ${tab === tItem.id ? 'is-active' : ''}`}
                onClick={() => setTab(tItem.id)}
              >
                {tItem.label}
              </button>
            ))}
          </div>

          {/* Upload Media Zone */}
          <label className="hf-upload-dropzone">
            <input
              type="file"
              accept="audio/*,video/*,image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                const res = validateUploadFile(file, ['audio/', 'video/', 'image/']);
                if (!res.ok) {
                  pushToast(res.error, 'neutral');
                  return;
                }
                setUploadedFileName(file.name);
                pushToast(`Attached reference media: ${file.name}`);
              }}
            />
            <div style={{ display: 'flex', gap: 6, color: '#a8acb5' }}>
              <AudioWaveform size={16} />
              <Music size={16} />
              <Upload size={16} />
            </div>
            <strong style={{ fontSize: 13, color: '#ffffff' }}>
              {uploadedFileName || 'Upload media'}
            </strong>
            <span style={{ fontSize: 11.5, color: '#8f939c' }}>
              Optional • Up to 3 Voices/Audios or Image
            </span>
          </label>

          {/* Script Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="hf-form-label" htmlFor="hf-audio-script">
                {tab === 'translate' ? 'Source / Target Script' : 'Script'}
              </label>
              <span style={{ fontSize: 11, color: '#7e828c' }}>Type @ to reference attachments</span>
            </div>
            <textarea
              id="hf-audio-script"
              className="hf-textarea"
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Write exactly what the voice will read out loud..."
            />
          </div>

          {/* Model Picker */}
          <div>
            <button
              type="button"
              className="hf-model-option"
              style={{ width: '100%' }}
              onClick={() => setModelPickerOpen((prev) => !prev)}
            >
              <div>
                <div style={{ fontSize: 11, color: '#8f939c' }}>Model</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#d1fe17', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AudioWaveform size={14} />
                  <span>{activeModel.name}</span>
                </div>
              </div>
              <ChevronRight size={16} style={{ transform: modelPickerOpen ? 'rotate(90deg)' : 'none' }} />
            </button>

            {modelPickerOpen && (
              <div className="hf-model-select-grid" style={{ marginTop: 8 }}>
                {AUDIO_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`hf-model-option ${selectedModel === m.id ? 'is-selected' : ''}`}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setModelPickerOpen(false);
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#8f939c' }}>{m.desc}</div>
                    </div>
                    <span className="hf-nav-badge">{m.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Batch Size */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="hf-form-label">Batch size</span>
            <div className="hf-batch-stepper">
              <button
                type="button"
                aria-label="Decrease batch size"
                onClick={() => setBatchSize((b) => Math.max(1, b - 1))}
              >
                <Minus size={13} />
              </button>
              <span>{batchSize}/4</span>
              <button
                type="button"
                aria-label="Increase batch size"
                onClick={() => setBatchSize((b) => Math.min(4, b + 1))}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Voice Details */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="hf-form-label" htmlFor="hf-voice-details">
                Voice details (Optional)
              </label>
              <span style={{ fontSize: 11, color: '#7e828c' }}>{voiceDetails.length}/500</span>
            </div>
            <textarea
              id="hf-voice-details"
              className="hf-textarea"
              style={{ minHeight: 74 }}
              maxLength={500}
              value={voiceDetails}
              onChange={(e) => setVoiceDetails(e.target.value)}
              placeholder="e.g. Young female voice with british accent, soft and loud. Excited, giggling"
            />
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              type="button"
              className="hf-ws-nav-item"
              style={{ background: '#0d0f11', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => setAdvancedOpen((prev) => !prev)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Sliders size={14} />
                <span>Advanced settings</span>
              </span>
              <ChevronDown size={14} style={{ transform: advancedOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {advancedOpen && (
              <div style={{ padding: '12px 6px 2px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ fontSize: 12, color: '#b4b7bf' }}>
                  Stability: {stability}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stability}
                    onChange={(e) => setStability(Number(e.target.value))}
                    className="hf-compare-slider"
                  />
                </label>
                <label style={{ fontSize: 12, color: '#b4b7bf' }}>
                  Similarity boost: {similarity}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={similarity}
                    onChange={(e) => setSimilarity(Number(e.target.value))}
                    className="hf-compare-slider"
                  />
                </label>
              </div>
            )}
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
                <span>Synthesizing audio...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate ({batchSize * 6} cr)</span>
              </>
            )}
          </button>
        </aside>

        {/* Right Stage */}
        <section className="hf-dot-stage">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`hf-cta-dark ${stageView === 'history' ? 'is-active' : ''}`}
                onClick={() => setStageView('history')}
              >
                <FolderClock size={14} />
                <span>History ({audioTracks.length})</span>
              </button>
              <button
                type="button"
                className={`hf-cta-dark ${stageView === 'how-it-works' ? 'is-active' : ''}`}
                onClick={() => setStageView('how-it-works')}
              >
                <BookOpen size={14} />
                <span>How it works</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={14} color="#8f939c" />
              {['All', 'Cinema', 'UGC & Shorts'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`hf-chip ${filterTone === f ? 'is-active' : ''}`}
                  onClick={() => setFilterTone(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {stageView === 'how-it-works' ? (
            <>
              <div style={{ textAlign: 'center', paddingBlock: 12 }}>
                <h1 className="hf-page-title" style={{ marginBottom: 6 }}>
                  {tab === 'tts'
                    ? 'TURN TEXT INTO SPEECH'
                    : tab === 'voice-change'
                    ? 'SWAP VOICES & LIPSYNC IN ANY VIDEO'
                    : 'TRANSLATE DIALOGUE IN 30+ LANGUAGES'}
                </h1>
                <p style={{ margin: 0, color: '#9ea2ab', fontSize: 14 }}>
                  Lifelike speech from any script &mdash; ready for your projects
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <div className="hf-studio-panel" style={{ background: '#181b1f' }}>
                  <h2 style={{ margin: 0, fontSize: 17 }}>Pick or clone a voice</h2>
                  <p style={{ margin: 0, fontSize: 12.5, color: '#9ea2ab' }}>
                    Choose a preset, clone your own, or pick a model
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {VOICE_PRESETS.filter(
                      (v) => filterTone === 'All' || v.tone === filterTone || v.tone === 'Custom'
                    ).map((voice) => (
                      <button
                        key={voice.id}
                        type="button"
                        className={`hf-model-option ${selectedVoice === voice.id ? 'is-selected' : ''}`}
                        onClick={() => {
                          setSelectedVoice(voice.id);
                          pushToast(`Selected voice: ${voice.name}`);
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{voice.name}</div>
                          <div style={{ fontSize: 11, color: '#8f939c' }}>{voice.accent}</div>
                        </div>
                        <span className="hf-nav-badge">{voice.tone}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hf-studio-panel" style={{ background: '#181b1f', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 17 }}>Write, describe and generate</h2>
                    <p style={{ margin: '6px 0 12px', fontSize: 12.5, color: '#9ea2ab' }}>
                      Type your script, describe pacing &amp; emotion with inline tags like{' '}
                      <code>[whisper]</code> or <code>[excited]</code>, and click Generate.
                    </p>
                    <div className="hf-code-box" style={{ fontSize: 12 }}>
                      {`[warm, close-mic] "${scriptText.slice(0, 110)}..."\nVoice: ${activeVoice.name} • Model: ${activeModel.name}`}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="hf-btn-ghost-block"
                    onClick={() => handlePreviewSpeech(audioTracks[0])}
                  >
                    <Volume2 size={15} color="#d1fe17" />
                    <span>Preview Active Voice Synthesis</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Generated Audio &amp; Lipsync Renders</h2>
              {audioTracks.map((tr) => (
                <div
                  key={tr.id}
                  className="hf-model-option"
                  style={{ padding: 14, borderRadius: 12, background: '#17191d' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: 14, color: '#ffffff', display: 'block' }}>{tr.title}</strong>
                    <span style={{ fontSize: 12, color: '#9ea2ab' }}>
                      {tr.language} &bull; {tr.duration} &bull; &ldquo;{tr.script.slice(0, 88)}...&rdquo;
                    </span>
                  </div>
                  <button
                    type="button"
                    className="hf-cta-lime"
                    style={{ height: 34, flexShrink: 0 }}
                    onClick={() => handlePreviewSpeech(tr)}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>{playingId === tr.id ? 'Stop' : 'Play'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="hf-cta-dark"
              onClick={() => pushToast('Higgsfield Audio supports WAV, MP3, and video stems up to 60s')}
            >
              <HelpCircle size={14} />
              <span>Need help?</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

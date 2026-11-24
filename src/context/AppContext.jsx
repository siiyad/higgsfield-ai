import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

const INITIAL_CREDITS = 500;
const GUEST_INITIAL_CREDITS = 120;
const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'pt'];
const DEFAULT_COOKIES = { essential: true, functional: true, analytics: true, saved: false };
const DEFAULT_LIKES = ['shorts-1', 'shorts-3', 'proj-detour'];

const UI_STRINGS = {
  en: {
    explore: 'Explore',
    pricing: 'Pricing',
    enterprise: 'Enterprise',
    login: 'Login',
    signup: 'Sign up',
    searchPlaceholder: 'Search models, presets, studios, prompts...',
    startGenerating: 'Start generating',
    learnMore: 'Learn more',
    tryCanvas: 'Try Canvas',
    tryPhotodump: 'Try Photodump',
  },
  es: {
    explore: 'Explorar',
    pricing: 'Precios',
    enterprise: 'Empresas',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    searchPlaceholder: 'Buscar modelos, preajustes, estudios...',
    startGenerating: 'Empezar a generar',
    learnMore: 'Saber más',
    tryCanvas: 'Probar Canvas',
    tryPhotodump: 'Probar Photodump',
  },
  fr: {
    explore: 'Explorer',
    pricing: 'Tarifs',
    enterprise: 'Entreprise',
    login: 'Connexion',
    signup: "S'inscrire",
    searchPlaceholder: 'Rechercher des modèles, studios, prompts...',
    startGenerating: 'Commencer à générer',
    learnMore: 'En savoir plus',
    tryCanvas: 'Essayer Canvas',
    tryPhotodump: 'Essayer Photodump',
  },
  de: {
    explore: 'Entdecken',
    pricing: 'Preise',
    enterprise: 'Unternehmen',
    login: 'Anmelden',
    signup: 'Registrieren',
    searchPlaceholder: 'Modelle, Presets, Studios suchen...',
    startGenerating: 'Generieren starten',
    learnMore: 'Mehr erfahren',
    tryCanvas: 'Canvas testen',
    tryPhotodump: 'Photodump testen',
  },
  ja: {
    explore: '探索',
    pricing: '料金',
    enterprise: '法人向け',
    login: 'ログイン',
    signup: '新規登録',
    searchPlaceholder: 'モデル、プリセット、プロンプトを検索...',
    startGenerating: '生成を始める',
    learnMore: '詳しく見る',
    tryCanvas: 'Canvasを試す',
    tryPhotodump: 'Photodumpを試す',
  },
  ko: {
    explore: '탐색',
    pricing: '요금제',
    enterprise: '엔터프라이즈',
    login: '로그인',
    signup: '가입하기',
    searchPlaceholder: '모델, 프리셋, 프롬프트 검색...',
    startGenerating: '생성 시작하기',
    learnMore: '더 알아보기',
    tryCanvas: 'Canvas 체험하기',
    tryPhotodump: 'Photodump 체험하기',
  },
  zh: {
    explore: '探索',
    pricing: '定价',
    enterprise: '企业版',
    login: '登录',
    signup: '注册',
    searchPlaceholder: '搜索模型、预设、工作室与提示词...',
    startGenerating: '开始生成',
    learnMore: '了解更多',
    tryCanvas: '试用 Canvas',
    tryPhotodump: '试用 Photodump',
  },
  pt: {
    explore: 'Explorar',
    pricing: 'Preços',
    enterprise: 'Empresas',
    login: 'Entrar',
    signup: 'Criar conta',
    searchPlaceholder: 'Buscar modelos, predefinições, estúdios...',
    startGenerating: 'Começar a gerar',
    learnMore: 'Saiba mais',
    tryCanvas: 'Testar Canvas',
    tryPhotodump: 'Testar Photodump',
  },
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readStorage(key, fallback, validator) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      window.localStorage.removeItem(key);
      return fallback;
    }
    return parsed;
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore inaccessible storage */
    }
    return fallback;
  }
}

export function validateUserRecord(value) {
  if (value === null) return true;
  return (
    isPlainObject(value) &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.credits === 'number' &&
    Number.isFinite(value.credits)
  );
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readStorage('hf_user', null, validateUserRecord));
  const [language, setLanguageState] = useState(() =>
    readStorage('hf_lang', 'en', (v) => typeof v === 'string' && SUPPORTED_LANGS.includes(v))
  );
  const [routeLangOverride, setRouteLangOverride] = useState(null);
  const [likedIds, setLikedIds] = useState(() =>
    readStorage(
      'hf_likes',
      DEFAULT_LIKES,
      (v) => Array.isArray(v) && v.every((id) => typeof id === 'string')
    )
  );
  const [savedGenerations, setSavedGenerations] = useState(() => {
    const list = readStorage('hf_generations', [], (v) => Array.isArray(v));
    return list.filter((item) => isPlainObject(item) && typeof item.id === 'string');
  });
  const [waitlistJoined, setWaitlistJoined] = useState(() =>
    readStorage(
      'hf_waitlist',
      false,
      (v) =>
        v === false ||
        typeof v === 'string' ||
        (isPlainObject(v) && typeof v.email === 'string')
    )
  );
  const [cookieConsent, setCookieConsent] = useState(() => {
    const raw = readStorage('hf_cookies', DEFAULT_COOKIES, isPlainObject);
    return {
      essential: true,
      functional: Boolean(raw.functional ?? true),
      analytics: Boolean(raw.analytics ?? true),
      saved: Boolean(raw.saved ?? false),
    };
  });
  const [activeModal, setActiveModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  const activeLanguage = routeLangOverride || language;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = activeLanguage;
    }
  }, [activeLanguage]);

  const setLanguage = useCallback((nextLang) => {
    if (!SUPPORTED_LANGS.includes(nextLang)) return;
    setRouteLangOverride(null);
    setLanguageState(nextLang);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('hf_user', JSON.stringify(user));
    } catch {
      /* ignore quota errors */
    }
  }, [user]);

  useEffect(() => {
    try {
      window.localStorage.setItem('hf_lang', JSON.stringify(language));
    } catch {
      /* ignore */
    }
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem('hf_likes', JSON.stringify(likedIds));
    } catch {
      /* ignore */
    }
  }, [likedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem('hf_generations', JSON.stringify(savedGenerations));
    } catch {
      /* ignore */
    }
  }, [savedGenerations]);

  useEffect(() => {
    try {
      window.localStorage.setItem('hf_waitlist', JSON.stringify(waitlistJoined));
    } catch {
      /* ignore */
    }
  }, [waitlistJoined]);

  useEffect(() => {
    try {
      window.localStorage.setItem('hf_cookies', JSON.stringify(cookieConsent));
    } catch {
      /* ignore */
    }
  }, [cookieConsent]);

  const pushToast = useCallback((message, tone = 'lime') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3400);
  }, []);

  const loginDemo = useCallback(
    ({ email = 'creator@higgsfield.ai', name = 'Studio Creator', bonusCredits = 0, plan = 'Plus (30% OFF)' }) => {
      const cleanName = name.trim() || email.split('@')[0] || 'Creator';
      const handle = `@${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'creator'}`;
      setUser({
        name: cleanName,
        email: email.trim(),
        handle,
        plan,
        credits: INITIAL_CREDITS + bonusCredits,
        joinedAt: new Date().toISOString(),
      });
      setActiveModal(null);
      pushToast(`Signed in as ${cleanName} (${INITIAL_CREDITS + bonusCredits} credits active)`);
    },
    [pushToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    pushToast('Signed out of workspace', 'neutral');
  }, [pushToast]);

  const upgradePlan = useCallback(
    (planName, creditsAdd = 1000) => {
      setUser((prev) => ({
        name: prev?.name || 'Studio Creator',
        email: prev?.email || 'creator@higgsfield.ai',
        handle: prev?.handle || '@studio_creator',
        plan: planName,
        credits: (prev?.credits ?? INITIAL_CREDITS) + creditsAdd,
        joinedAt: prev?.joinedAt || new Date().toISOString(),
      }));
      pushToast(`${planName} plan activated — +${creditsAdd} credits added`);
    },
    [pushToast]
  );

  const availableCredits = user?.credits ?? GUEST_INITIAL_CREDITS;

  const spendCredits = useCallback((cost = 5) => {
    setUser((prev) => {
      const currentCredits = prev?.credits ?? GUEST_INITIAL_CREDITS;
      if (!prev) {
        return {
          name: 'Guest Creator',
          email: 'guest@higgsfield.ai',
          handle: '@guest_creator',
          plan: 'Trial',
          credits: Math.max(0, currentCredits - cost),
          joinedAt: new Date().toISOString(),
        };
      }
      return { ...prev, credits: Math.max(0, prev.credits - cost) };
    });
  }, []);

  const toggleLike = useCallback(
    (id) => {
      setLikedIds((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const exists = safePrev.includes(id);
        pushToast(exists ? 'Removed from favorites' : 'Saved to your Liked presets', exists ? 'neutral' : 'lime');
        return exists ? safePrev.filter((item) => item !== id) : [...safePrev, id];
      });
    },
    [pushToast]
  );

  const addGeneration = useCallback(
    (generationOrList) => {
      const items = Array.isArray(generationOrList) ? generationOrList : [generationOrList];
      const totalCost = items.reduce((sum, item) => sum + (Number(item?.cost) || 0), 0);
      if (totalCost > 0 && availableCredits < totalCost) {
        pushToast(
          `Insufficient credits (${availableCredits} cr left, need ${totalCost} cr). Sign up or upgrade for instant credits.`,
          'neutral'
        );
        return false;
      }
      setSavedGenerations((prev) => [...items, ...(Array.isArray(prev) ? prev : [])].slice(0, 40));
      if (totalCost > 0) spendCredits(totalCost);
      const first = items[0];
      pushToast(
        items.length > 1
          ? `Generated ${items.length} renders with ${first?.modelName || 'Studio'}`
          : `Generated with ${first?.modelName || 'Studio'}`
      );
      return true;
    },
    [availableCredits, pushToast, spendCredits]
  );

  const joinWaitlist = useCallback(
    (payload) => {
      const entry =
        typeof payload === 'string'
          ? { email: payload, role: 'Creator', joinedAt: new Date().toISOString() }
          : { ...payload, joinedAt: new Date().toISOString() };
      setWaitlistJoined(entry);
      setActiveModal(null);
      pushToast(`Added ${entry.email} (${entry.role}) to the Higgsfield Miracle waitlist`);
    },
    [pushToast]
  );

  const saveCookiePrefs = useCallback(
    (prefs) => {
      setCookieConsent({ ...prefs, essential: true, saved: true });
      setActiveModal(null);
      pushToast('Privacy preferences saved', 'neutral');
    },
    [pushToast]
  );

  const openModal = useCallback((modalConfig) => {
    setActiveModal(modalConfig);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const t = useCallback(
    (key) => {
      const pack = UI_STRINGS[activeLanguage] || UI_STRINGS.en;
      return pack[key] || UI_STRINGS.en[key] || key;
    },
    [activeLanguage]
  );

  // Global keyboard shortcuts: Ctrl+K / Cmd+K for Search, Escape to close modal
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setActiveModal((prev) => (prev?.type === 'search' ? null : { type: 'search' }));
      } else if (event.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      user,
      availableCredits,
      language: activeLanguage,
      persistedLanguage: language,
      setLanguage,
      setRouteLangOverride,
      likedIds,
      toggleLike,
      savedGenerations,
      addGeneration,
      waitlistJoined,
      joinWaitlist,
      cookieConsent,
      saveCookiePrefs,
      activeModal,
      openModal,
      closeModal,
      loginDemo,
      logout,
      upgradePlan,
      toasts,
      pushToast,
      t,
    }),
    [
      user,
      availableCredits,
      activeLanguage,
      language,
      setLanguage,
      likedIds,
      toggleLike,
      savedGenerations,
      addGeneration,
      waitlistJoined,
      joinWaitlist,
      cookieConsent,
      saveCookiePrefs,
      activeModal,
      openModal,
      closeModal,
      loginDemo,
      logout,
      upgradePlan,
      toasts,
      pushToast,
      t,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="hf-toast-stack" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className={`hf-toast hf-toast--${toast.tone}`}>
              <span className="hf-toast__dot" />
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

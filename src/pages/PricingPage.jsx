import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Building2, Check, Crown, ShieldCheck, Sliders } from 'lucide-react';
import { PRICING_PLANS } from '../data/showcase';
import { useApp } from '../context/AppContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RECOMMENDER_GOALS = [
  { id: 'product', label: 'Product photos & videos', rec: 'plus' },
  { id: 'cinema', label: 'Cinematic videos', rec: 'ultra' },
  { id: 'ugc', label: 'UGC talking avatars', rec: 'plus' },
  { id: 'viral', label: 'Viral content & Genjutsu', rec: 'plus' },
  { id: 'mcp', label: 'MCP, CLI, Supercomputer', rec: 'ultra' },
  { id: 'hobby', label: 'Quick hobby prototyping', rec: 'starter' },
];

export default function PricingPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { upgradePlan, pushToast } = useApp();

  const [tierType, setTierType] = useState(
    location.pathname === '/enterprise' || searchParams.get('plan') === 'team'
      ? 'business'
      : 'individual'
  );
  const [billing, setBilling] = useState('annual');
  const [selectedGoals, setSelectedGoals] = useState(['cinema', 'mcp']);
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [enterpriseError, setEnterpriseError] = useState('');
  const [enterpriseSent, setEnterpriseSent] = useState(false);

  useEffect(() => {
    if (location.pathname === '/enterprise' || searchParams.get('plan') === 'team') {
      setTierType('business');
    } else {
      setTierType('individual');
    }
    setEnterpriseSent(false);
    setEnterpriseError('');
  }, [location.pathname, searchParams]);

  const recommendedPlanId = useMemo(() => {
    if (tierType === 'business') return 'scale';
    if (selectedGoals.includes('cinema') || selectedGoals.includes('mcp') || selectedGoals.length >= 3) {
      return 'ultra';
    }
    if (selectedGoals.length === 1 && selectedGoals[0] === 'hobby') return 'starter';
    return 'plus';
  }, [tierType, selectedGoals]);

  const toggleGoal = (id) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const plans = PRICING_PLANS[tierType];

  return (
    <main className="hf-container hf-subpage">
      <section className="hf-page-hero">
        <div>
          <span className="hf-page-badge">
            <Crown size={13} />
            <span>UP TO 55% OFF LIMITED LAUNCH OFFER</span>
          </span>
          <h1 className="hf-page-title">
            {location.pathname === '/enterprise'
              ? 'Higgsfield Enterprise & Studio Scale'
              : 'Simple Plans. Unlimited Creativity.'}
          </h1>
          <p className="hf-page-desc">
            Create with Seedance 2.5, GPT Image 2.6, Seedream 5.5, Cinema Studio 4.0, and Claude
            MCP. Switch or cancel anytime.
          </p>
        </div>
      </section>

      {/* Interactive 30-second Plan Recommender */}
      {tierType === 'individual' && (
        <section className="hf-studio-panel" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <span className="hf-form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sliders size={13} color="#d1fe17" />
                <span>30-Second Plan Match</span>
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: 17 }}>
                What will you create most? Recommended:{' '}
                <span style={{ color: '#d1fe17', textTransform: 'uppercase' }}>{recommendedPlanId}</span>
              </h2>
            </div>
            <span style={{ fontSize: 12, color: '#8f939c' }}>Select goals to tailor recommendation</span>
          </div>

          <div className="hf-chip-row">
            {RECOMMENDER_GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`hf-chip ${selectedGoals.includes(g.id) ? 'is-active' : ''}`}
                onClick={() => toggleGoal(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="hf-pricing-controls">
        <div className="hf-seg-control">
          <button
            type="button"
            className={`hf-seg-btn ${tierType === 'individual' ? 'is-active' : ''}`}
            onClick={() => setTierType('individual')}
          >
            Individual
          </button>
          <button
            type="button"
            className={`hf-seg-btn ${tierType === 'business' ? 'is-active' : ''}`}
            onClick={() => setTierType('business')}
          >
            Business &amp; Teams
          </button>
        </div>

        <div className="hf-seg-control">
          <button
            type="button"
            className={`hf-seg-btn ${billing === 'monthly' ? 'is-active' : ''}`}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`hf-seg-btn ${billing === 'annual' ? 'is-active' : ''}`}
            onClick={() => setBilling('annual')}
          >
            Annual (30% OFF)
          </button>
        </div>
      </div>

      <section
        className={`hf-pricing-grid ${tierType === 'business' ? 'hf-pricing-grid--two' : ''}`}
        aria-label="Subscription tiers"
      >
        {plans.map((plan) => {
          const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const numericCredits = Number(plan.credits.replace(/[^0-9]/g, '')) || 1000;
          const isMatched = plan.id === recommendedPlanId;
          return (
            <article key={plan.id} className={`hf-plan-card ${plan.popular || isMatched ? 'is-popular' : ''}`}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: 'var(--hf-font-display)',
                      fontSize: 22,
                      textTransform: 'uppercase',
                    }}
                  >
                    {plan.name}
                  </h2>
                  {isMatched ? (
                    <span className="hf-bento-new" style={{ padding: '4px 8px' }}>
                      BEST MATCH
                    </span>
                  ) : plan.popular ? (
                    <span className="hf-bento-new" style={{ padding: '4px 8px' }}>
                      MOST POPULAR
                    </span>
                  ) : null}
                </div>

                <p style={{ margin: '0 0 18px', fontSize: 13, color: '#9ea2ab' }}>{plan.tagline}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                  <span className="hf-plan-price">${price}</span>
                  <span style={{ fontSize: 13.5, color: '#8f939c' }}>
                    / mo {tierType === 'business' ? 'per seat' : ''}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#d1fe17', marginBottom: 20 }}>
                  {plan.credits}
                </div>

                <ul className="hf-plan-features">
                  {plan.features.map((feat) => (
                    <li key={feat}>
                      <Check size={15} color="#d1fe17" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={plan.popular || isMatched ? 'hf-btn-lime-block' : 'hf-btn-ghost-block'}
                onClick={() => upgradePlan(`${plan.name} (${billing})`, numericCredits)}
              >
                Activate {plan.name}
              </button>
            </article>
          );
        })}
      </section>

      <section
        className="hf-studio-panel"
        style={{ marginTop: 32, maxWidth: 840, marginInline: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Building2 size={20} color="#d1fe17" />
          <h2 style={{ margin: 0, fontSize: 18 }}>Need Dedicated H100 Clusters or Custom SLA?</h2>
        </div>

        {enterpriseSent ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d1fe17', fontSize: 14 }}>
              <ShieldCheck size={18} />
              <span>
                Enterprise inquiry submitted for {companyName} ({workEmail})! Our San Francisco solutions team will follow up shortly.
              </span>
            </div>
            <button
              type="button"
              className="hf-cta-dark"
              onClick={() => {
                setEnterpriseSent(false);
                setCompanyName('');
                setWorkEmail('');
              }}
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!companyName.trim()) {
                setEnterpriseError('Please enter your company or agency name.');
                return;
              }
              if (!EMAIL_RE.test(workEmail.trim())) {
                setEnterpriseError('Please enter a valid work email address.');
                return;
              }
              setEnterpriseError('');
              setEnterpriseSent(true);
              pushToast('Enterprise request received');
            }}
          >
            {enterpriseError && (
              <div className="hf-form-error" role="alert">
                {enterpriseError}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
              <input
                type="text"
                required
                className="hf-input"
                placeholder="Company / Agency name"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (enterpriseError) setEnterpriseError('');
                }}
              />
              <input
                type="email"
                required
                className="hf-input"
                placeholder="Work email"
                value={workEmail}
                onChange={(e) => {
                  setWorkEmail(e.target.value);
                  if (enterpriseError) setEnterpriseError('');
                }}
              />
              <button type="submit" className="hf-cta-lime" style={{ height: 42 }}>
                Contact Enterprise Sales
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorModal from '@/components/ErrorModal';
import SuccessModal from '@/components/SuccessModal';
import PaymentModal from '@/components/PaymentModal';
import { Check, Sparkles, Crown, Zap, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';
import { checkSubscription } from '@/lib/metamask';

interface Subscription {
  active: boolean;
  isTrial: boolean;
  startDate: string;
  endDate: string;
  plan: string;
  expired?: boolean;
}

interface ModalState { isOpen: boolean; title: string; message: string; }
interface SuccessModalState extends ModalState { isPremium: boolean; }

const freeTrialFeatures = [
  'Access to 12 professional trading strategies',
  'Real-time backtesting results',
  'Basic algorithm details',
  'Community discussions',
  'Portfolio tracking dashboard',
  'Strategy download scripts',
  'Email support',
  '30-day trial period',
];

const premiumFeatures = [
  'Access to 50+ professional trading strategies',
  '2 NEW strategies added DAILY',
  'Real-time backtesting with live data',
  'Advanced algorithm details & source code',
  'AI-powered strategy recommendations',
  'Custom strategy builder tool',
  'Automated trading bot integration',
  'Advanced risk management tools',
  'Real-time market alerts & signals',
  'Priority 24/7 support',
  'Private community & expert webinars',
  'Monthly performance reports & analytics',
  'API access for custom integrations',
  'Multi-exchange support',
  'Personal trading coach (monthly call)',
];

const eliteFeatures = [
  'Everything in Premium PLUS:',
  'Access to 100+ elite trading strategies',
  '5 NEW strategies added DAILY',
  'Exclusive institutional-grade algorithms',
  'Dedicated personal trading coach (weekly calls)',
  'Custom strategy development service',
  'White-label trading bot',
  'Priority algorithm requests',
  'Advanced AI portfolio manager',
  'Hedge fund-level risk analytics',
  'Direct access to strategy developers',
  'VIP community & networking events',
  'Unlimited API calls',
  'Revenue sharing opportunities',
];

const Subscription = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<Subscription | null>(null);
  const [errorModal, setErrorModal] = useState<ModalState>({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState<SuccessModalState>({ isOpen: false, title: '', message: '', isPremium: false });
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; plan: 'premium' | 'elite' }>({ open: false, plan: 'premium' });

  useEffect(() => {
    const sub = checkSubscription();
    if (sub) setSubscriptionStatus(sub as Subscription);
  }, []);

  const handleFreeTrial = async () => {
    setIsConnecting(true);
    try {
      const subscription: Subscription = {
        active: true, isTrial: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        plan: 'Free Trial',
      };
      localStorage.setItem('subscription', JSON.stringify(subscription));
      setSuccessModal({ isOpen: true, title: '🎉 Free Trial Activated!', message: 'Your 30-day free trial is now active. Enjoy access to professional trading strategies!', isPremium: false });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const error = err as Error;
      setErrorModal({ isOpen: true, title: 'Activation Failed', message: error.message || 'Failed to activate free trial.' });
    } finally {
      setIsConnecting(false);
    }
  };

  const compareRows = [
    { label: 'Trading Strategies', free: '12', premium: '50+', elite: '100+' },
    { label: 'New Strategies Daily', free: '✗', premium: '2/day', elite: '5/day' },
    { label: 'Algorithm Details', free: 'Basic', premium: 'Advanced', elite: 'Institutional' },
    { label: 'AI Recommendations', free: '✗', premium: '✓', elite: '✓' },
    { label: 'Trading Bot', free: '✗', premium: '✓', elite: 'White-label' },
    { label: 'API Access', free: '✗', premium: 'Limited', elite: 'Unlimited' },
    { label: 'Support', free: 'Email', premium: '24/7 Priority', elite: 'VIP Dedicated' },
    { label: 'Personal Coach', free: '✗', premium: 'Monthly', elite: 'Weekly' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      <ErrorModal isOpen={errorModal.isOpen} onClose={() => setErrorModal({ ...errorModal, isOpen: false })} title={errorModal.title} message={errorModal.message} />
      <SuccessModal isOpen={successModal.isOpen} onClose={() => { setSuccessModal({ ...successModal, isOpen: false }); navigate('/dashboard'); }} title={successModal.title} message={successModal.message} isPremium={successModal.isPremium} />
      {paymentModal.open && <PaymentModal plan={paymentModal.plan} onClose={() => setPaymentModal({ ...paymentModal, open: false })} />}

      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Active subscription banner */}
        {subscriptionStatus?.active && !subscriptionStatus?.expired && (
          <div className="mb-10 flex items-center gap-3 px-5 py-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] max-w-4xl mx-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-400 font-semibold text-sm">Current Plan: {subscriptionStatus.plan || (subscriptionStatus.isTrial ? 'Free Trial' : 'Premium')}</p>
              <p className="text-white/40 text-xs mt-0.5">Active until {new Date(subscriptionStatus.endDate).toLocaleDateString()} · Want more? Upgrade below.</p>
            </div>
          </div>
        )}

        {/* Page header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-400">Premium Trading Platform</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-4">
            {subscriptionStatus?.active ? 'Upgrade Your Plan' : 'Choose Your Plan'}
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            {subscriptionStatus?.active
              ? 'Unlock more strategies and premium features with an upgrade'
              : 'Get access to professional trading strategies and start your journey to financial freedom'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-16">

          {/* Free Trial */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 flex flex-col">
            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-400/10 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-blue-400" />
              </div>
              <p className="text-white font-black text-2xl mb-1">Free Trial</p>
              <p className="text-white/40 text-sm">Perfect to get started</p>
              <div className="mt-4">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-white/30 text-sm ml-1">/month</span>
              </div>
            </div>

            <button
              onClick={handleFreeTrial}
              disabled={isConnecting || (subscriptionStatus?.active ?? false)}
              className="w-full py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 font-semibold text-sm transition-all disabled:opacity-50 mb-6 flex items-center justify-center gap-2"
            >
              {isConnecting ? <><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />Activating...</>
                : subscriptionStatus?.active ? <><Check className="w-4 h-4" />Current Plan</>
                : <><Zap className="w-4 h-4" />Start Free Trial</>}
            </button>

            <div className="space-y-3 flex-1">
              {freeTrialFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-white/60 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-b from-yellow-500/[0.07] to-transparent p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500" />
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />MOST POPULAR
            </div>

            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center mb-4">
                <Crown className="w-7 h-7 text-yellow-400" />
              </div>
              <p className="text-white font-black text-2xl mb-1">Premium</p>
              <p className="text-white/40 text-sm">For serious traders</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-white/30 text-xl line-through">$99</span>
                <span className="text-5xl font-black text-white">$50</span>
                <span className="text-white/30 text-sm mb-1">/month</span>
              </div>
              <p className="text-emerald-400 text-xs font-semibold mt-1">Save 50% — Limited Time</p>
            </div>

            <button
              onClick={() => setPaymentModal({ open: true, plan: 'premium' })}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold text-sm transition-all mb-6 flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/30"
            >
              <Crown className="w-4 h-4" />Upgrade to Premium
            </button>

            <div className="space-y-3 flex-1 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {premiumFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white/60 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[{ v: '50+', l: 'Strategies' }, { v: '24/7', l: 'Support' }, { v: 'API', l: 'Access' }].map(s => (
                <div key={s.l} className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-base font-black text-yellow-400">{s.v}</p>
                  <p className="text-[10px] text-white/30">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Elite */}
          <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-500/[0.07] to-transparent p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600" />
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 text-[10px] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />ELITE
            </div>

            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-400/10 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-violet-400" />
              </div>
              <p className="text-white font-black text-2xl mb-1">Elite</p>
              <p className="text-white/40 text-sm">For professional traders</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-white/30 text-xl line-through">$199</span>
                <span className="text-5xl font-black text-white">$99</span>
                <span className="text-white/30 text-sm mb-1">/month</span>
              </div>
              <p className="text-violet-400 text-xs font-semibold mt-1">5 strategies daily</p>
            </div>

            <button
              onClick={() => setPaymentModal({ open: true, plan: 'elite' })}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold text-sm transition-all mb-6 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30"
            >
              <Zap className="w-4 h-4" />Upgrade to Elite
            </button>

            <div className="space-y-3 flex-1 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {eliteFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span className={`text-sm ${i === 0 ? 'text-violet-400 font-semibold' : 'text-white/60'}`}>{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[{ v: '100+', l: 'Strategies' }, { v: '5/day', l: 'New Daily' }, { v: 'VIP', l: 'Support' }].map(s => (
                <div key={s.l} className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-base font-black text-violet-400">{s.v}</p>
                  <p className="text-[10px] text-white/30">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compare Plans */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center gap-2 justify-center mb-2">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Comparison</span>
              <div className="h-px w-6 bg-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-white">Compare Plans</h2>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
            <div className="grid grid-cols-4 gap-0 text-sm">
              <div className="p-4 text-white/30 text-xs font-semibold uppercase tracking-widest border-b border-white/[0.05]">Feature</div>
              <div className="p-4 text-center text-blue-400 font-bold text-xs border-b border-white/[0.05]">Free Trial</div>
              <div className="p-4 text-center text-yellow-400 font-bold text-xs border-b border-white/[0.05]">Premium</div>
              <div className="p-4 text-center text-violet-400 font-bold text-xs border-b border-white/[0.05]">Elite</div>
              {compareRows.map((row, i) => (
                <>
                  <div key={`l-${i}`} className={`p-4 text-white/60 text-sm ${i < compareRows.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>{row.label}</div>
                  <div key={`f-${i}`} className={`p-4 text-center text-sm ${row.free === '✗' ? 'text-red-400' : row.free === '✓' ? 'text-emerald-400' : 'text-white/50'} ${i < compareRows.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>{row.free}</div>
                  <div key={`p-${i}`} className={`p-4 text-center text-sm font-semibold ${row.premium === '✗' ? 'text-red-400' : row.premium === '✓' ? 'text-emerald-400' : 'text-yellow-400'} ${i < compareRows.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>{row.premium}</div>
                  <div key={`e-${i}`} className={`p-4 text-center text-sm font-semibold ${row.elite === '✗' ? 'text-red-400' : row.elite === '✓' ? 'text-emerald-400' : 'text-violet-400'} ${i < compareRows.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>{row.elite}</div>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Why Premium */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white">Why Choose Premium?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: '4x More Strategies', desc: 'Access 50+ professional strategies vs 12 in free trial. More options = better opportunities.' },
              { icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10', title: 'AI-Powered Tools', desc: 'Get personalized strategy recommendations and automated trading bot integration.' },
              { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'Personal Coaching', desc: 'Monthly 1-on-1 calls with expert traders to optimize your strategy and results.' },
            ].map(c => (
              <div key={c.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mx-auto mb-4`}>
                  <c.icon className={`w-7 h-7 ${c.color}`} />
                </div>
                <p className="text-white font-bold mb-2">{c.title}</p>
                <p className="text-white/40 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-8">
            <div className="flex items-center gap-2 justify-center mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <p className="text-white font-bold text-lg">Premium ROI Calculator</p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Monthly Investment', value: '$50', color: 'text-white' },
                { label: 'Average Strategy Return', value: '+22.4%/month', color: 'text-emerald-400' },
                { label: 'On $1,000 capital', value: '+$224/month', color: 'text-emerald-400' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="border-t border-white/[0.07] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-sm">Net Profit (after subscription)</span>
                  <span className="text-2xl font-black text-emerald-400">+$174/month</span>
                </div>
                <p className="text-xs text-center text-white/30 mt-2">That's a 348% ROI on your subscription</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="text-center text-white/30 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4" />
            <span className="font-semibold text-white/50">Secure Payment</span>
          </div>
          <p>All payments are processed securely via crypto. We never store your private keys or sensitive information.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Subscription;

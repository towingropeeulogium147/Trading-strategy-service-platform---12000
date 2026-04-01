import { useState, useEffect } from 'react';
import { X, Copy, Check, ArrowRight, ArrowLeft, Shield, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WALLET = '0xd4062e68022ef5235898CBc4f069A0df4fF2Ea6C';

// CoinGecko IDs for non-stable tokens
const CG_IDS: Record<string, string> = {
  ETH:  'ethereum',
  BNB:  'binancecoin',
  MATIC:'matic-network',
  AVAX: 'avalanche-2',
  SOL:  'solana',
  TRX:  'tron',
  BTC:  'bitcoin',
  LTC:  'litecoin',
  XRP:  'ripple',
};
// Stablecoins — always 1:1 with USD
const STABLE = new Set(['USDT', 'USDC']);

interface Token { id: string; symbol: string; label: string; color: string; icon: string; }
interface Chain { id: string; label: string; color: string; icon: string; tokens: Token[]; }

const CHAINS: Chain[] = [
  {
    id: 'eth', label: 'Ethereum', color: '#627EEA', icon: '⟠',
    tokens: [
      { id: 'eth_eth',  symbol: 'ETH',  label: 'Ethereum',  color: '#627EEA', icon: '⟠' },
      { id: 'eth_usdt', symbol: 'USDT', label: 'Tether',    color: '#26A17B', icon: '₮' },
      { id: 'eth_usdc', symbol: 'USDC', label: 'USD Coin',  color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'bnb', label: 'BNB Chain', color: '#F3BA2F', icon: '◈',
    tokens: [
      { id: 'bnb_bnb',  symbol: 'BNB',  label: 'BNB',      color: '#F3BA2F', icon: '◈' },
      { id: 'bnb_usdt', symbol: 'USDT', label: 'Tether',   color: '#26A17B', icon: '₮' },
      { id: 'bnb_usdc', symbol: 'USDC', label: 'USD Coin', color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'polygon', label: 'Polygon', color: '#8247E5', icon: '⬡',
    tokens: [
      { id: 'pol_matic', symbol: 'MATIC', label: 'Polygon',  color: '#8247E5', icon: '⬡' },
      { id: 'pol_usdt',  symbol: 'USDT',  label: 'Tether',   color: '#26A17B', icon: '₮' },
      { id: 'pol_usdc',  symbol: 'USDC',  label: 'USD Coin', color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'arb', label: 'Arbitrum', color: '#28A0F0', icon: '🔵',
    tokens: [
      { id: 'arb_eth',  symbol: 'ETH',  label: 'Ethereum', color: '#627EEA', icon: '⟠' },
      { id: 'arb_usdt', symbol: 'USDT', label: 'Tether',   color: '#26A17B', icon: '₮' },
      { id: 'arb_usdc', symbol: 'USDC', label: 'USD Coin', color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'op', label: 'Optimism', color: '#FF0420', icon: '🔴',
    tokens: [
      { id: 'op_eth',  symbol: 'ETH',  label: 'Ethereum', color: '#627EEA', icon: '⟠' },
      { id: 'op_usdt', symbol: 'USDT', label: 'Tether',   color: '#26A17B', icon: '₮' },
      { id: 'op_usdc', symbol: 'USDC', label: 'USD Coin', color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'avax', label: 'Avalanche', color: '#E84142', icon: '▲',
    tokens: [
      { id: 'avax_avax', symbol: 'AVAX', label: 'Avalanche', color: '#E84142', icon: '▲' },
      { id: 'avax_usdt', symbol: 'USDT', label: 'Tether',    color: '#26A17B', icon: '₮' },
      { id: 'avax_usdc', symbol: 'USDC', label: 'USD Coin',  color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'sol', label: 'Solana', color: '#9945FF', icon: '◎',
    tokens: [
      { id: 'sol_sol',  symbol: 'SOL',  label: 'Solana',   color: '#9945FF', icon: '◎' },
      { id: 'sol_usdt', symbol: 'USDT', label: 'Tether',   color: '#26A17B', icon: '₮' },
      { id: 'sol_usdc', symbol: 'USDC', label: 'USD Coin', color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'tron', label: 'TRON', color: '#FF0013', icon: '◆',
    tokens: [
      { id: 'trx_trx',  symbol: 'TRX',  label: 'TRON',     color: '#FF0013', icon: '◆' },
      { id: 'trx_usdt', symbol: 'USDT', label: 'Tether',   color: '#26A17B', icon: '₮' },
    ],
  },
  {
    id: 'base', label: 'Base', color: '#0052FF', icon: '🔷',
    tokens: [
      { id: 'base_eth',  symbol: 'ETH',  label: 'Ethereum', color: '#627EEA', icon: '⟠' },
      { id: 'base_usdc', symbol: 'USDC', label: 'USD Coin', color: '#2775CA', icon: '◎' },
    ],
  },
  {
    id: 'btc', label: 'Bitcoin', color: '#F7931A', icon: '₿',
    tokens: [
      { id: 'btc_btc', symbol: 'BTC', label: 'Bitcoin', color: '#F7931A', icon: '₿' },
    ],
  },
  {
    id: 'ltc', label: 'Litecoin', color: '#BFBBBB', icon: 'Ł',
    tokens: [
      { id: 'ltc_ltc', symbol: 'LTC', label: 'Litecoin', color: '#BFBBBB', icon: 'Ł' },
    ],
  },
  {
    id: 'xrp', label: 'XRP', color: '#00AAE4', icon: '✕',
    tokens: [
      { id: 'xrp_xrp', symbol: 'XRP', label: 'XRP', color: '#00AAE4', icon: '✕' },
    ],
  },
];

interface Props { plan: 'premium' | 'elite'; onClose: () => void; }

export default function PaymentModal({ plan, onClose }: Props) {
  const { toast } = useToast();
  const price = plan === 'premium' ? '$50' : '$99';
  const planColor = plan === 'elite' ? '#a855f7' : '#eab308';

  const [step, setStep] = useState<'chain' | 'token' | 'pay' | 'confirm'>('chain');
  const [chain, setChain] = useState<Chain>(CHAINS[0]);
  const [token, setToken] = useState<Token>(CHAINS[0].tokens[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Live price conversion
  const [tokenAmount, setTokenAmount] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  const usdAmount = plan === 'premium' ? 50 : 99;

  const fetchTokenPrice = async (sym: string) => {
    if (STABLE.has(sym)) {
      setTokenAmount(usdAmount.toFixed(2));
      return;
    }
    const cgId = CG_IDS[sym];
    if (!cgId) { setTokenAmount(null); return; }
    setPriceLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=usd`
      );
      const data = await res.json();
      const usdPrice: number = data[cgId]?.usd;
      if (usdPrice) {
        const amt = usdAmount / usdPrice;
        // show enough decimals based on magnitude
        const decimals = amt >= 1 ? 4 : amt >= 0.01 ? 6 : 8;
        setTokenAmount(amt.toFixed(decimals));
      } else {
        setTokenAmount(null);
      }
    } catch {
      setTokenAmount(null);
    } finally {
      setPriceLoading(false);
    }
  };

  // Fetch price whenever we enter the pay step
  useEffect(() => {
    if (step === 'pay') fetchTokenPrice(token.symbol);
  }, [step, token.symbol]);

  const copy = () => {
    navigator.clipboard.writeText(WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectChain = (c: Chain) => {
    setChain(c);
    setToken(c.tokens[0]);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(WALLET)}&bgcolor=111827&color=ffffff&margin=12`;

  const submit = async () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Required', description: 'Please fill in your name and email', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const tk = localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/payments/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` },
        body: JSON.stringify({ name, email, plan, chain: `${chain.label} · ${token.symbol}`, amount: price }),
      });
      if (!res.ok) throw new Error('Failed');
      setStep('confirm');
    } catch {
      toast({ title: 'Error', description: 'Failed to submit. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ['chain', 'token', 'pay'];
  const stepIndex = stepLabels.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: planColor, top: '30%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      <div className="relative w-full max-w-md bg-[#0d1117] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${planColor}, transparent)` }} />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-10">
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: planColor }}>
              {plan === 'elite' ? '⚡ Elite Plan' : '👑 Premium Plan'}
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/40 text-xs font-medium">{price} / month</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {step === 'chain' ? 'Choose Network' : step === 'token' ? 'Choose Token' : step === 'pay' ? 'Send Payment' : 'Request Sent'}
          </h2>

          {/* Step indicator */}
          {step !== 'confirm' && (
            <div className="flex items-center gap-2 mt-3">
              {[
                { key: 'chain', label: 'Network' },
                { key: 'token', label: 'Token'   },
                { key: 'pay',   label: 'Payment' },
              ].map(({ key, label }, i) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === key ? 'text-white' : i < stepIndex ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'
                  }`} style={step === key ? { background: planColor } : {}}>
                    {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step === key ? 'text-white' : 'text-white/30'}`}>{label}</span>
                  {i < 2 && <div className="w-6 h-px bg-white/10 mx-1" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-6">

          {/* ── STEP 1: Chain ── */}
          {step === 'chain' && (
            <div>
              <p className="text-xs text-white/40 mb-3">Select the blockchain network you'll use to send:</p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {CHAINS.map(c => (
                  <button key={c.id} onClick={() => selectChain(c)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border text-left transition-all ${
                      chain.id === c.id ? 'border-white/20 bg-white/[0.07]' : 'border-white/[0.05] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                    }`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: chain.id === c.id ? `${c.color}25` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${chain.id === c.id ? c.color + '60' : 'rgba(255,255,255,0.06)'}`,
                        color: c.color,
                      }}>
                      {c.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{c.label}</p>
                      <p className="text-[10px] text-white/30">{c.tokens.length} token{c.tokens.length > 1 ? 's' : ''}</p>
                    </div>
                    {chain.id === c.id && (
                      <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: planColor }}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('token')}
                className="w-full mt-4 py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${planColor}, ${planColor}99)` }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Token ── */}
          {step === 'token' && (
            <div>
              {/* Selected chain pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/[0.07]">
                  <span style={{ color: chain.color }}>{chain.icon}</span>
                  <span className="text-xs font-semibold text-white">{chain.label}</span>
                </div>
                <button onClick={() => setStep('chain')} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                  <ArrowLeft className="w-3 h-3" />Change
                </button>
              </div>

              <p className="text-xs text-white/40 mb-3">Select the token you want to pay with:</p>
              <div className="flex flex-col gap-2">
                {chain.tokens.map(t => (
                  <button key={t.id} onClick={() => setToken(t)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border text-left transition-all ${
                      token.id === t.id ? 'border-white/20 bg-white/[0.07]' : 'border-white/[0.05] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                    }`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                      style={{
                        background: token.id === t.id ? `${t.color}25` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${token.id === t.id ? t.color + '60' : 'rgba(255,255,255,0.06)'}`,
                        color: t.color,
                      }}>
                      {t.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{t.symbol}</p>
                      <p className="text-xs text-white/30">{t.label} on {chain.label}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      token.id === t.id ? 'border-transparent' : 'border-white/20'
                    }`} style={token.id === t.id ? { background: planColor } : {}}>
                      {token.id === t.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <button onClick={() => setStep('pay')}
                className="w-full mt-4 py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${planColor}, ${planColor}99)` }}>
                Pay with {token.symbol} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── STEP 3: Pay ── */}
          {step === 'pay' && (
            <div className="space-y-4">
              {/* Chain + token pills */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/[0.07]">
                    <span style={{ color: chain.color }}>{chain.icon}</span>
                    <span className="text-xs font-semibold text-white">{chain.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.07]"
                    style={{ background: `${token.color}15` }}>
                    <span style={{ color: token.color }}>{token.icon}</span>
                    <span className="text-xs font-bold" style={{ color: token.color }}>{token.symbol}</span>
                  </div>
                </div>
                <button onClick={() => setStep('token')} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                  <ArrowLeft className="w-3 h-3" />Change
                </button>
              </div>

              {/* QR + address */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex gap-4 items-start">
                  <img src={qrUrl} alt="QR" className="w-24 h-24 rounded-xl shrink-0 border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white/40 mb-1">Send exactly</p>
                    {priceLoading ? (
                      <div className="flex items-center gap-2 mb-1">
                        <RefreshCw className="w-4 h-4 text-white/30 animate-spin" />
                        <span className="text-white/30 text-sm">Fetching live price...</span>
                      </div>
                    ) : tokenAmount ? (
                      <div className="mb-1">
                        <p className="text-2xl font-black text-white leading-tight">
                          {tokenAmount}{' '}
                          <span className="text-base font-bold" style={{ color: token.color }}>{token.symbol}</span>
                        </p>
                        <p className="text-[11px] text-white/30">≈ {price} USD · live rate</p>
                      </div>
                    ) : (
                      <div className="mb-1">
                        <p className="text-2xl font-black text-white">{price}</p>
                        <p className="text-[11px] text-white/30">worth of <span className="font-semibold" style={{ color: token.color }}>{token.symbol}</span></p>
                      </div>
                    )}
                    <p className="text-[11px] text-white/40 mb-2">to this address:</p>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2">
                      <span className="text-[10px] text-white/50 font-mono flex-1 truncate">{WALLET}</span>
                      <button onClick={copy} className="shrink-0">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/30 hover:text-white" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User details */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/30">Your details for verification</p>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Registered email address" type="email"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all" />
              </div>

              <div className="flex items-center gap-4 text-[11px] text-white/25">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" />Secure</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Activated within 24h</span>
                <button onClick={() => fetchTokenPrice(token.symbol)} className="flex items-center gap-1 hover:text-white/50 transition-colors ml-auto">
                  <RefreshCw className="w-3 h-3" />Refresh rate
                </button>
              </div>

              <button onClick={submit} disabled={submitting}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${planColor}, ${planColor}99)` }}>
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
                  : <>I've Sent the Payment <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* ── STEP 4: Confirm ── */}
          {step === 'confirm' && (
            <div className="text-center py-6 space-y-5">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#10b981' }} />
                <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="w-9 h-9 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">Request Submitted!</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
                  Our team will verify your <span className="font-bold" style={{ color: token.color }}>{token.symbol}</span> payment and activate your{' '}
                  <span className="font-bold capitalize" style={{ color: planColor }}>{plan}</span> plan within 24 hours.
                </p>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/40">
                Confirmation sent to <span className="text-white/70 font-medium">{email}</span>
              </div>
              <button onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] text-white font-bold text-sm transition-all">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

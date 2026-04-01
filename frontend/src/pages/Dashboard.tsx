import Typewriter from '@/components/Typewriter';
import RevealSection from '@/components/RevealSection';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarketTicker from '@/components/MarketTicker';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import {
  TrendingUp, Target, Award, Activity, BarChart3,
  Zap, TrendingDown, ArrowRight, Crown,
  ChevronLeft, ChevronRight, ShieldCheck, CalendarCheck,
  Monitor, Download, Cpu, LineChart, Bell, Lock, RefreshCw, LayoutDashboard,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Bar, ReferenceLine, Cell,
} from 'recharts';
import { checkSubscription } from '@/lib/metamask';

const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=90',
    eyebrow: 'DAILY EDGE',
    headline: ['Outperform', 'the market.'],
    sub: 'Two fresh, backtested strategies land every morning — so your edge never expires.',
    accent: 'from-emerald-400 to-teal-400',
    btnBg: 'bg-white text-slate-900 hover:bg-white/90',
    btnOutline: 'border-white/40 text-white hover:bg-white/10',
  },
  {
    src: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=1920&q=90',
    eyebrow: 'CRYPTO ALPHA',
    headline: ['Trade the future', 'of money.'],
    sub: 'Strategies engineered for crypto volatility — BTC, ETH, SOL and beyond.',
    accent: 'from-violet-400 to-indigo-400',
    btnBg: 'bg-violet-500 text-white hover:bg-violet-600',
    btnOutline: 'border-white/40 text-white hover:bg-white/10',
  },
  {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=90',
    eyebrow: 'VERIFIED RESULTS',
    headline: ['730+ strategies', 'per year.'],
    sub: 'Every strategy is 100% backtested and verified before it reaches your dashboard.',
    accent: 'from-amber-400 to-orange-400',
    btnBg: 'bg-amber-400 text-slate-900 hover:bg-amber-300',
    btnOutline: 'border-white/40 text-white hover:bg-white/10',
  },
];

const btcEquity = [
  { d: 'Jan', strategy: 10000, market: 10000 },
  { d: 'Feb', strategy: 11200, market: 9800 },
  { d: 'Mar', strategy: 12800, market: 10400 },
  { d: 'Apr', strategy: 12100, market: 9600 },
  { d: 'May', strategy: 14500, market: 10900 },
  { d: 'Jun', strategy: 16200, market: 10200 },
  { d: 'Jul', strategy: 15400, market: 9700 },
  { d: 'Aug', strategy: 18900, market: 11100 },
  { d: 'Sep', strategy: 21300, market: 10500 },
  { d: 'Oct', strategy: 19800, market: 9900 },
  { d: 'Nov', strategy: 24600, market: 11800 },
  { d: 'Dec', strategy: 28400, market: 12200 },
];

const monthlyReturns = [
  { m: 'Jan', r: 0 }, { m: 'Feb', r: 12 }, { m: 'Mar', r: 14.3 },
  { m: 'Apr', r: -5.5 }, { m: 'May', r: 19.8 }, { m: 'Jun', r: 11.7 },
  { m: 'Jul', r: -4.9 }, { m: 'Aug', r: 22.7 }, { m: 'Sep', r: 12.7 },
  { m: 'Oct', r: -7.0 }, { m: 'Nov', r: 24.2 }, { m: 'Dec', r: 15.4 },
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    checkSubscription();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { title: 'Active Strategies', value: '12', icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', change: '+3 this week', link: '/' },
    { title: 'Total Profit', value: '+24.5%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', change: '+5.2% this month', link: '/dashboard' },
    { title: 'Win Rate', value: '68%', icon: Activity, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', change: '+2% vs last month', link: '/dashboard' },
    { title: 'Total Trades', value: '247', icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', change: '18 today', link: '/dashboard' },
  ];

  const performanceData = [
    { month: 'Jan', value: 10000 }, { month: 'Feb', value: 10650 },
    { month: 'Mar', value: 11420 }, { month: 'Apr', value: 10890 },
    { month: 'May', value: 12340 }, { month: 'Jun', value: 13680 },
    { month: 'Jul', value: 12980 }, { month: 'Aug', value: 15120 },
    { month: 'Sep', value: 16890 }, { month: 'Oct', value: 15740 },
    { month: 'Nov', value: 18920 }, { month: 'Dec', value: 21700 },
  ];

  const recentTrades = [
    { id: 1, strategy: 'Breakout Momentum', pair: 'BTC/USDT', type: 'buy', profit: '+12.3%', time: '2h ago', status: 'active' },
    { id: 2, strategy: 'Mean Reversion RSI', pair: 'ETH/USDT', type: 'sell', profit: '+8.7%', time: '5h ago', status: 'closed' },
    { id: 3, strategy: 'Ichimoku Cloud', pair: 'SOL/USDT', type: 'buy', profit: '-2.1%', time: '1d ago', status: 'active' },
    { id: 4, strategy: 'VWAP Scalper', pair: 'AAPL', type: 'sell', profit: '+15.4%', time: '1d ago', status: 'closed' },
  ];

  const topStrategies = [
    { id: 10, name: 'Machine Learning Momentum', return: '+137%', winRate: 61, trades: 89, icon: Zap },
    { id: 2, name: 'Breakout Momentum Scanner', return: '+121%', winRate: 58, trades: 67, icon: TrendingUp },
    { id: 3, name: 'Turtle Trading System', return: '+72%', winRate: 42, trades: 124, icon: Activity },
  ];

  const current = heroSlides[slide];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero Slider */}
      <div className="relative w-full h-screen overflow-hidden">
        {heroSlides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${s.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>
        ))}
        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-24 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-px w-8 bg-gradient-to-r ${current.accent}`} />
            <span className={`text-xs font-bold tracking-[0.3em] bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}>{current.eyebrow}</span>
          </div>
          <h2 className="font-black text-white leading-[1.05] mb-8" style={{ fontSize: 'clamp(2rem, 4.5vw, 4.5rem)' }}>
            <span className="block">{current.headline[0]}</span>
            <span className={`block pb-3 bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}>{current.headline[1]}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-md leading-relaxed font-light">{current.sub}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={() => navigate('/strategies')} className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-lg ${current.btnBg}`}>
              <Zap className="w-4 h-4" />View Today's Strategies
            </button>
            <button onClick={() => navigate('/subscription')} className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border transition-all ${current.btnOutline}`}>
              Learn More<ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-6 mt-10 flex-wrap">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <CalendarCheck className="w-4 h-4 text-white/40" />
              <span><span className="text-white font-semibold">2 strategies</span> released daily</span>
            </div>
            <div className="w-px h-4 bg-white/15" />
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <ShieldCheck className="w-4 h-4 text-white/40" />
              <span><span className="text-white font-semibold">100%</span> backtested before release</span>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
          <span className="text-white/20 text-xs tracking-widest" style={{ writingMode: 'vertical-rl' }}>
            {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </span>
          <div className="flex flex-col gap-1.5">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                className={`w-0.5 rounded-full transition-all duration-300 ${i === slide ? 'h-10 bg-white' : 'h-4 bg-white/25 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 right-10 z-10 flex items-center gap-2">
          <button onClick={() => setSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 backdrop-blur-sm flex items-center justify-center text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setSlide((p) => (p + 1) % heroSlides.length)} aria-label="Next"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 backdrop-blur-sm flex items-center justify-center text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 lg:hidden">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* Dashboard content */}
      <div className="bg-[#0a0e1a]">
        <MarketTicker />
        <div className="container mx-auto px-6 py-16 space-y-16">
          <SubscriptionBanner />

          {/* Welcome */}
          <RevealSection variant="up">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-5xl font-black tracking-tight text-white">
                Welcome back,{' '}
                <Typewriter text={user?.name ?? 'Trader'} as="span" speed={80} charClassName="text-emerald-400" />
              </h1>
              <p className="text-white/40 mt-3 text-base">Here's your trading overview for today.</p>
            </div>
            <button onClick={() => navigate('/strategies')}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all hover-lift">
              <Zap className="w-4 h-4" />Browse Strategies
            </button>
          </div>
          </RevealSection>

          {/* Stat cards */}
          <RevealSection variant="stagger">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={stat.title} onClick={() => navigate(stat.link)}
                className={`cursor-pointer rounded-2xl border ${stat.border} bg-white/[0.03] hover:bg-white/[0.06] p-6 transition-all hover-lift`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/30">{stat.title}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-4xl font-black tracking-tight text-white mb-1">{stat.value}</div>
                <p className="text-sm text-white/30">{stat.change}</p>
              </div>
            ))}
          </div>
          </RevealSection>

          {/* Strategy Performance Section */}
          <RevealSection variant="up">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-6 bg-emerald-500" />
                <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Proven Edge</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">Why our strategies win</h2>
              <p className="text-white/40 mt-1 text-sm">Real backtested performance vs. buy-and-hold market returns</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <RevealSection variant="left" className="lg:col-span-2">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 hover-lift h-full">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-bold text-base">Strategy vs. Market</p>
                    <p className="text-white/30 text-xs mt-0.5">Breakout Momentum · 12 months</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />Strategy +184%</span>
                    <span className="flex items-center gap-1.5 text-white/30"><span className="w-3 h-0.5 bg-white/20 inline-block rounded" />Market +22%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={btcEquity} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6b7280" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="d" fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 12 }}
                      formatter={(val: any, name: string) => [`${Number(val).toLocaleString()}`, name === 'strategy' ? 'Strategy' : 'Market']} />
                    <Area type="monotone" dataKey="market" stroke="rgba(107,114,128,0.5)" strokeWidth={1.5} fill="url(#mg)" strokeDasharray="4 3" />
                    <Area type="monotone" dataKey="strategy" stroke="#10b981" strokeWidth={2.5} fill="url(#sg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              </RevealSection>

              <RevealSection variant="right">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 hover-lift">
                <p className="text-white/30 text-xs mb-4">ML Momentum · 2024</p>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={monthlyReturns} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="m" fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 12 }}
                      formatter={(val: any) => [`${val}%`, 'Return']} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    <Bar dataKey="r" radius={[3, 3, 0, 0]} maxBarSize={24}>
                      {monthlyReturns.map((e, i) => <Cell key={i} fill={e.r >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.85} />)}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              </RevealSection>
            </div>

            <RevealSection variant="stagger">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Annual Return', value: '+184%', sub: 'vs +22% market', pos: true },
                { label: 'Win Rate', value: '68%', sub: '247 trades sampled', pos: true },
                { label: 'Max Drawdown', value: '-8.4%', sub: 'Controlled risk', pos: false },
                { label: 'Sharpe Ratio', value: '2.31', sub: 'Risk-adjusted return', pos: true },
              ].map((m, i) => (
                <div key={m.label}
                  className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover-lift transition-colors">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">{m.label}</p>
                  <p className={`text-3xl font-black tracking-tight ${m.pos ? 'text-emerald-400' : 'text-red-400'}`}>{m.value}</p>
                  <p className="text-xs text-white/30 mt-1">{m.sub}</p>
                </div>
              ))}
            </div>
            </RevealSection>
          </div>
          </RevealSection>

          {/* Portfolio Growth + Top Performers */}
          <RevealSection variant="up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 hover-lift animate-slide-left delay-200">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <p className="text-white font-bold text-base">Portfolio Growth</p>
              </div>
              <p className="text-white/30 text-xs mb-5">Your equity curve over the past 12 months</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 13 }}
                    formatter={(v: any) => [`${Number(v).toLocaleString()}`, 'Portfolio Value']} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#pf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 hover-lift animate-slide-right delay-200">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-yellow-400" />
                <p className="text-white font-bold text-base">Top Performers</p>
              </div>
              <p className="text-white/30 text-xs mb-5">Best strategies this year</p>
              <div className="space-y-3">
                {topStrategies.map((s, i) => (
                  <div key={s.id} onClick={() => navigate(`/strategy/${s.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] hover:bg-white/[0.05] hover-lift transition-colors cursor-pointer group animate-fade-up"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-yellow-400/10' : i === 1 ? 'bg-blue-400/10' : 'bg-purple-400/10'}`}>
                        {i === 0 ? <Crown className="w-4 h-4 text-yellow-400" /> : <s.icon className={`w-4 h-4 ${i === 1 ? 'text-blue-400' : 'text-purple-400'}`} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{s.name}</p>
                        <p className="text-xs text-white/30 mt-0.5">{s.trades} trades · {s.winRate}% win</p>
                      </div>
                    </div>
                    <span className="text-base font-black text-emerald-400">{s.return}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </RevealSection>

          {/* Desktop App Section */}
          <RevealSection variant="scale">
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.07]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-[#0a0e1a] to-emerald-900/20" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-px w-6 bg-violet-500" />
                  <span className="text-xs font-bold tracking-[0.25em] text-violet-400 uppercase">Desktop App</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.05] mb-5">
                  <Typewriter text="Trade like a pro." as="span" speed={40} cursor={false} />
                  <br />
                  <Typewriter text="Right on your desktop." as="span" speed={40} delay={700} charClassName="text-violet-400" />
                </h2>
                <Typewriter
                  text="Our native desktop app brings the full power of a professional trading terminal — think MetaTrader, but built around our strategy ecosystem. Live charts, one-click execution, real-time alerts, and your full strategy library, all in one window."
                  as="p"
                  speed={12}
                  delay={1600}
                  cursor={false}
                  className="text-white/50 text-base leading-relaxed mb-8 max-w-md"
                />
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {[
                    { icon: LineChart, label: 'Live candlestick charts', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { icon: Cpu, label: 'Strategy auto-execution', color: 'text-violet-400', bg: 'bg-violet-400/10' },
                    { icon: Bell, label: 'Real-time signal alerts', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { icon: LayoutDashboard, label: 'Multi-panel workspace', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { icon: RefreshCw, label: 'Auto strategy sync', color: 'text-teal-400', bg: 'bg-teal-400/10' },
                    { icon: Lock, label: 'Encrypted local data', color: 'text-pink-400', bg: 'bg-pink-400/10' },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>
                      <span className="text-xs font-medium text-white/70">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Download for your platform</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a href="https://www.dropbox.com/scl/fi/7ljdblj8eslqbsshi4dgg/Tradex.exe?rlkey=7a1svh0j0n5n5yztxi0v1dpw0&st=j968znuc&dl=1" download="Tradex.exe"
                      className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-violet-600 border border-violet-500 hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40">
                      <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M3 5.5L10.5 4.5V11.5H3V5.5Z" fill="white"/>
                        <path d="M11.5 4.35L21 3V11.5H11.5V4.35Z" fill="white"/>
                        <path d="M3 12.5H10.5V19.5L3 18.5V12.5Z" fill="white"/>
                        <path d="M11.5 12.5H21V21L11.5 19.65V12.5Z" fill="white"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[11px] text-white/70 leading-none mb-0.5">Download for</div>
                        <div className="text-base font-black text-white">Windows</div>
                        <div className="text-[10px] text-white/60">v2.4.1 · .exe · 64-bit</div>
                      </div>
                      <Download className="w-4 h-4 text-white/60 group-hover:text-white ml-auto transition-colors" />
                    </a>
                    <button className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.07] border border-white/20 hover:bg-white/[0.12] hover:border-white/30 transition-all">
                      <Monitor className="w-8 h-8 shrink-0 text-white/80" />
                      <div className="text-left">
                        <div className="text-[11px] text-white/50 leading-none mb-0.5">Download for</div>
                        <div className="text-base font-black text-white">macOS</div>
                        <div className="text-[10px] text-white/40">v2.4.1 · .dmg · M1/Intel</div>
                      </div>
                      <Download className="w-4 h-4 text-white/30 group-hover:text-white ml-auto transition-colors" />
                    </button>
                    <button className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.07] border border-white/20 hover:bg-white/[0.12] hover:border-white/30 transition-all">
                      <Monitor className="w-8 h-8 shrink-0 text-white/80" />
                      <div className="text-left">
                        <div className="text-[11px] text-white/50 leading-none mb-0.5">Download for</div>
                        <div className="text-base font-black text-white">Linux</div>
                        <div className="text-[10px] text-white/40">v2.4.1 · .AppImage</div>
                      </div>
                      <Download className="w-4 h-4 text-white/30 group-hover:text-white ml-auto transition-colors" />
                    </button>
                  </div>
                  <p className="text-[11px] text-white/20">Free forever · No credit card · Auto-updates</p>
                </div>
              </div>

              <div className="relative flex items-center justify-center lg:justify-end overflow-hidden p-6 lg:p-10 lg:pl-0">
                <div className="relative w-full max-w-[760px] mselect-none">
                  <img
                    src="/desktop.png"
                    alt="TradexStrategies Desktop App"do you 
                    className="w-full rounded-xl"
                    style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.7)' }}
                  />
                </div>
              </div>
            </div>
          </div>
          </RevealSection>

          {/* Recent Trades */}
          <RevealSection variant="up">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-white/50" />
              <p className="text-white font-bold text-base">Recent Trades</p>
            </div>
            <p className="text-white/30 text-xs mb-5">Your latest trading activity</p>
            <div className="space-y-2">
              {recentTrades.map((trade, i) => (
                <div key={trade.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/[0.05] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer group animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trade.type === 'buy' ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                      {trade.type === 'buy' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{trade.strategy}</p>
                      <p className="text-sm text-white/30 mt-0.5">{trade.pair} · {trade.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-base font-black ${trade.profit.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{trade.profit}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${trade.status === 'active' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-white/30'}`}>
                      {trade.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </RevealSection>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

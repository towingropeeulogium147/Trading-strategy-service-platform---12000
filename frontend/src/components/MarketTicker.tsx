import { useEffect, useState, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

interface MarketData {
  symbol: string;
  name: string;
  cgId: string;
  price: number;
  change24h: number;
  loading: boolean;
}

interface ChartPoint { t: number; p: number; }

interface TooltipState {
  market: MarketData;
  x: number;
  y: number;
}

const COINS: Pick<MarketData, 'symbol' | 'name' | 'cgId'>[] = [
  { symbol: 'BTC',   name: 'Bitcoin',   cgId: 'bitcoin'       },
  { symbol: 'ETH',   name: 'Ethereum',  cgId: 'ethereum'      },
  { symbol: 'SOL',   name: 'Solana',    cgId: 'solana'        },
  { symbol: 'BNB',   name: 'BNB',       cgId: 'binancecoin'   },
  { symbol: 'XRP',   name: 'Ripple',    cgId: 'ripple'        },
  { symbol: 'DOGE',  name: 'Dogecoin',  cgId: 'dogecoin'      },
  { symbol: 'ADA',   name: 'Cardano',   cgId: 'cardano'       },
  { symbol: 'AVAX',  name: 'Avalanche', cgId: 'avalanche-2'   },
  { symbol: 'LINK',  name: 'Chainlink', cgId: 'chainlink'     },
  { symbol: 'POL',   name: 'Polygon',   cgId: 'polygon-ecosystem-token' },
];

// Rotate across 4 keys to stay well under per-key rate limits
const API_KEYS = [
  'CG-kZAyF6JFYTrNQYg16MVo3DTr',
  'CG-p9jNvCS7NQaHQ1GiS1LfSDVp',
  'CG-9PWjnPacwMz4nZStx5ALeVCP',
];
let keyIndex = 0;
const nextKey = () => { const k = API_KEYS[keyIndex % API_KEYS.length]; keyIndex++; return k; };
const cgUrl = (path: string) => `https://api.coingecko.com/api/v3/${path}&x_cg_demo_api_key=${nextKey()}`;

const chartCache: Record<string, ChartPoint[]> = {};

async function prefetchAllCharts() {
  for (const coin of COINS) {
    if (chartCache[coin.cgId]) continue;
    try {
      const res = await fetch(
        cgUrl(`coins/${coin.cgId}/market_chart?vs_currency=usd&days=1&interval=hourly`)
      );
      if (res.ok) {
        const data = await res.json();
        chartCache[coin.cgId] = (data.prices || []).map(([t, p]: [number, number]) => ({ t, p }));
      }
    } catch { /* skip */ }
    await new Promise(r => setTimeout(r, 1200)); // 1.2s between each — safe with key rotation
  }
}

export default function MarketTicker() {
  const [markets, setMarkets] = useState<MarketData[]>(
    COINS.map(c => ({ ...c, price: 0, change24h: 0, loading: true }))
  );
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCgId = useRef<string | null>(null);

  const fetchMarketData = async () => {
    try {
      const ids = COINS.map(c => c.cgId).join(',');
      const res = await fetch(
        cgUrl(`simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`)
      );
      const data = await res.json();
      setMarkets(COINS.map(c => ({
        ...c,
        price: data[c.cgId]?.usd || 0,
        change24h: data[c.cgId]?.usd_24h_change || 0,
        loading: false,
      })));
    } catch {
      setMarkets(prev => prev.map(m => ({ ...m, loading: false })));
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    prefetchAllCharts();
    return () => clearInterval(interval);
  }, []);

  const fetchChart = useCallback((cgId: string) => {
    if (chartCache[cgId]) {
      setChartData(chartCache[cgId]);
      setChartLoading(false);
      return;
    }
    setChartLoading(true);
    const poll = setInterval(() => {
      if (chartCache[cgId]) {
        clearInterval(poll);
        if (activeCgId.current === cgId) {
          setChartData(chartCache[cgId]);
          setChartLoading(false);
        }
      }
    }, 400);
    setTimeout(() => { clearInterval(poll); if (activeCgId.current === cgId) setChartLoading(false); }, 30000);
  }, []);

  const handleMouseEnter = (market: MarketData, e: React.MouseEvent) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    activeCgId.current = market.cgId;
    setTooltip({ market, x: rect.left + rect.width / 2, y: rect.top });
    setChartData([]);
    fetchChart(market.cgId);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setTooltip(null), 200);
  };

  const formatPrice = (price: number, symbol: string) => {
    if (price === 0) return '—';
    if (symbol === 'BTC' || symbol === 'ETH')
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return `$${price.toFixed(4)}`;
  };

  const repeated = [...markets, ...markets, ...markets, ...markets, ...markets, ...markets];
  const isPositiveTooltip = (tooltip?.market.change24h ?? 0) >= 0;
  const chartColor = isPositiveTooltip ? '#10b981' : '#ef4444';
  const prices = chartData.map(d => d.p);
  const minP = prices.length ? Math.min(...prices) : 0;
  const maxP = prices.length ? Math.max(...prices) : 0;

  return (
    <div className="bg-[#0d1120] border-y border-white/[0.06] overflow-hidden relative">
      <div className="flex animate-ticker">
        {repeated.map((market, idx) => {
          const isPositive = market.change24h >= 0;
          return (
            <div
              key={`${market.symbol}-${idx}`}
              className="flex items-center gap-2.5 px-8 py-4 whitespace-nowrap shrink-0 cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(market, e)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-white/50 text-xs font-bold tracking-widest uppercase">{market.symbol}</span>
              {market.loading ? (
                <span className="text-white/20 text-sm">—</span>
              ) : (
                <>
                  <span className="text-white font-bold text-sm">{formatPrice(market.price, market.symbol)}</span>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{market.change24h.toFixed(2)}%
                  </div>
                </>
              )}
              <div className="w-px h-4 bg-white/10 ml-1" />
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: Math.min(tooltip.x - 140, window.innerWidth - 296),
            top: tooltip.y - 220,
          }}
        >
          <div className="w-72 bg-[#0d1120] border border-white/[0.10] rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${chartColor}, transparent)` }} />
            <div className="px-4 pt-3 pb-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-black text-base">{tooltip.market.name}</p>
                  <p className="text-white/30 text-xs font-bold tracking-widest">{tooltip.market.symbol}/USD</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-lg">{formatPrice(tooltip.market.price, tooltip.market.symbol)}</p>
                  <div className={`flex items-center justify-end gap-0.5 text-xs font-bold ${isPositiveTooltip ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositiveTooltip ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositiveTooltip ? '+' : ''}{tooltip.market.change24h.toFixed(2)}% 24h
                  </div>
                </div>
              </div>
            </div>
            <div className="px-2 pb-3 pt-1 h-28">
              {chartLoading ? (
                <div className="h-full flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`cg-${tooltip.market.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={chartColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <YAxis domain={[minP * 0.9995, maxP * 1.0005]} hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, '']}
                      labelFormatter={(t: any) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    />
                    <Area type="monotone" dataKey="p" stroke={chartColor} strokeWidth={1.5}
                      fill={`url(#cg-${tooltip.market.symbol})`} dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/20 text-xs">No data</div>
              )}
            </div>
            <div className="px-4 pb-3 flex justify-between text-[10px] text-white/25 font-medium">
              <span>24h Low: <span className="text-white/50">${minP > 0 ? minP.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}</span></span>
              <span>24h High: <span className="text-white/50">${maxP > 0 ? maxP.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}</span></span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite;
          width: max-content;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

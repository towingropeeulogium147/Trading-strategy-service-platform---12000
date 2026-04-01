import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, Search, ChevronDown, X } from "lucide-react";

interface FilterProps {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  winRateRange: [number, number];
  setWinRateRange: (range: [number, number]) => void;
  profitFactorRange: [number, number];
  setProfitFactorRange: (range: [number, number]) => void;
  maxDrawdownRange: [number, number];
  setMaxDrawdownRange: (range: [number, number]) => void;
  selectedIndicators: string[];
  setSelectedIndicators: (indicators: string[]) => void;
  onClearAll: () => void;
}

const markets = ["All", "Crypto", "Forex", "Stocks"];
const timeframes = ["All", "1H", "4H", "Daily", "Weekly"];
const indicators = ["EMA", "RSI", "MACD", "Bollinger Bands", "Stochastic", "Fibonacci", "Ichimoku", "ADX", "Volume", "Price Action"];

const StrategyFilters = ({
  selectedMarket, setSelectedMarket,
  selectedTimeframe, setSelectedTimeframe,
  searchQuery, setSearchQuery,
  winRateRange, setWinRateRange,
  profitFactorRange, setProfitFactorRange,
  maxDrawdownRange, setMaxDrawdownRange,
  selectedIndicators, setSelectedIndicators,
  onClearAll,
}: FilterProps) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const toggleIndicator = (indicator: string) => {
    setSelectedIndicators(
      selectedIndicators.includes(indicator)
        ? selectedIndicators.filter(i => i !== indicator)
        : [...selectedIndicators, indicator]
    );
  };

  const hasActiveFilters =
    selectedMarket !== "All" || selectedTimeframe !== "All" || searchQuery !== "" ||
    winRateRange[0] !== 0 || winRateRange[1] !== 100 ||
    profitFactorRange[0] !== 0 || profitFactorRange[1] !== 5 ||
    maxDrawdownRange[0] !== 0 || maxDrawdownRange[1] !== 20 ||
    selectedIndicators.length > 0;

  const chipBase = "px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all";
  const chipActive = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
  const chipInactive = "bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/80";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-emerald-400" />
        <p className="font-bold text-white text-sm">Search & Filter</p>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-xs text-white/40 mb-2 block uppercase tracking-widest font-semibold">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Market */}
        <div>
          <label className="text-xs text-white/40 mb-2 block uppercase tracking-widest font-semibold">Market</label>
          <div className="flex flex-wrap gap-2">
            {markets.map(m => (
              <button key={m} onClick={() => setSelectedMarket(m)} className={`${chipBase} ${selectedMarket === m ? chipActive : chipInactive}`}>{m}</button>
            ))}
          </div>
        </div>

        {/* Timeframe */}
        <div>
          <label className="text-xs text-white/40 mb-2 block uppercase tracking-widest font-semibold">Timeframe</label>
          <div className="flex flex-wrap gap-2">
            {timeframes.map(t => (
              <button key={t} onClick={() => setSelectedTimeframe(t)} className={`${chipBase} ${selectedTimeframe === t ? chipActive : chipInactive}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
              Advanced Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-5">
            {/* Win Rate */}
            <div>
              <label className="text-xs text-white/40 mb-3 block">
                Win Rate: <span className="text-emerald-400 font-semibold">{winRateRange[0]}% – {winRateRange[1]}%</span>
              </label>
              <Slider value={winRateRange} onValueChange={v => setWinRateRange(v as [number, number])} min={0} max={100} step={1} className="mt-2" />
            </div>

            {/* Profit Factor */}
            <div>
              <label className="text-xs text-white/40 mb-3 block">
                Profit Factor: <span className="text-emerald-400 font-semibold">{profitFactorRange[0].toFixed(1)} – {profitFactorRange[1].toFixed(1)}</span>
              </label>
              <Slider value={profitFactorRange} onValueChange={v => setProfitFactorRange(v as [number, number])} min={0} max={5} step={0.1} className="mt-2" />
            </div>

            {/* Max Drawdown */}
            <div>
              <label className="text-xs text-white/40 mb-3 block">
                Max Drawdown: <span className="text-red-400 font-semibold">{maxDrawdownRange[0]}% – {maxDrawdownRange[1]}%</span>
              </label>
              <Slider value={maxDrawdownRange} onValueChange={v => setMaxDrawdownRange(v as [number, number])} min={0} max={20} step={0.1} className="mt-2" />
            </div>

            {/* Indicators */}
            <div>
              <label className="text-xs text-white/40 mb-3 block uppercase tracking-widest font-semibold">
                Indicators {selectedIndicators.length > 0 && <span className="text-emerald-400">({selectedIndicators.length})</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {indicators.map(ind => (
                  <button key={ind} onClick={() => toggleIndicator(ind)} className={`${chipBase} ${selectedIndicators.includes(ind) ? chipActive : chipInactive}`}>{ind}</button>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Clear All */}
        {hasActiveFilters && (
          <button onClick={onClearAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.07] text-red-400 hover:bg-red-500/[0.12] text-sm font-medium transition-all">
            <X className="w-4 h-4" />Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default StrategyFilters;

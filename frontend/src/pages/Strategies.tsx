import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StrategyGrid from '@/components/StrategyGrid';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Strategies = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <div className="container mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-emerald-500" />
            <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Library</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">Trading Strategies</h1>
          <p className="text-white/40 text-base">Browse and discover proven trading strategies</p>
        </div>

        {!isLoggedIn && (
          <div className="mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/[0.07]">
            <Lock className="w-5 h-5 text-yellow-400 shrink-0" />
            <p className="text-sm text-yellow-300/80">
              Showing 4 sample strategies.{' '}
              <Link to="/login" className="font-semibold text-yellow-300 underline underline-offset-2 hover:text-yellow-200">
                Sign in
              </Link>{' '}
              or{' '}
              <Link to="/signup" className="font-semibold text-yellow-300 underline underline-offset-2 hover:text-yellow-200">
                create an account
              </Link>{' '}
              to unlock all strategies.
            </p>
          </div>
        )}

        <StrategyGrid limitedView={!isLoggedIn} />
      </div>
      <Footer />
    </div>
  );
};

export default Strategies;

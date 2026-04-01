import { Crown, Sparkles, Bell, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkSubscription } from "@/lib/metamask";

const navLinks = [
  { to: '/dashboard',    label: 'Dashboard'    },
  { to: '/strategies',   label: 'Strategies'   },
  { to: '/subscription', label: 'Subscription' },
  { to: '/community',    label: 'Community'    },
  { to: '/profile',      label: 'Profile'      },
];

const Header = () => {
  const [user, setUser]               = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const load = () => {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      setSubscription(checkSubscription());
    };
    load();
    window.addEventListener('user-updated', load);
    return () => window.removeEventListener('user-updated', load);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const transparent = !scrolled && !menuOpen;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-[#0a0e1a]/95 backdrop-blur-md border-b border-white/[0.06] shadow-sm'
      }`}>
        <div className="w-full px-16 md:px-24 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 flex-1">
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="eth-top" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa"/><stop offset="1" stopColor="#6366f1"/>
                </linearGradient>
                <linearGradient id="eth-bot" x1="0" y1="16" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8"/><stop offset="1" stopColor="#4f46e5"/>
                </linearGradient>
              </defs>
              <polygon points="12,1 23,13 12,17 1,13" fill="url(#eth-top)" opacity="0.95"/>
              <polygon points="12,31 23,18 12,22 1,18" fill="url(#eth-bot)" opacity="0.85"/>
              <polygon points="12,17 23,13 12,22 1,13" fill="white" opacity="0.12"/>
            </svg>
            <span className="text-[19px] font-bold tracking-[-0.01em] whitespace-nowrap leading-none select-none text-white">
              Tradex<span className="text-[#a78bfa]">Strategies</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {user ? (
              <>
                <button className="relative p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400" />
                </button>

                {subscription?.active && !subscription?.expired && (
                  <Link to="/subscription" className="hidden sm:inline-flex">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80">
                      {subscription.isTrial
                        ? <><Sparkles className="w-3 h-3" />Free Trial</>
                        : <><Crown className="w-3 h-3" />Premium</>}
                    </span>
                  </Link>
                )}

                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-sm text-white/80">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/20 text-white">
                      {user.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  )}
                  <span className="font-medium hidden lg:block">{user.name}</span>
                </div>

                <button onClick={handleLogout}
                  className="hidden sm:block px-4 py-1.5 rounded-full text-sm font-medium border border-white/25 text-white hover:bg-white/10 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="hidden sm:block px-4 py-1.5 rounded-full text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">
                  Login
                </Link>
                <Link to="/signup"
                  className="hidden sm:block px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-slate-900 hover:bg-white/90 transition-all">
                  Sign Up
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(p => !p)}
              className="md:hidden p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

        {/* Panel */}
        <div className={`absolute top-16 left-0 right-0 bg-[#0a0e1a] border-b border-white/[0.08] transition-all duration-300 ${menuOpen ? 'translate-y-0' : '-translate-y-4'}`}>
          <div className="px-4 py-6 space-y-1">

            {/* Nav links */}
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}>
                  {label}
                </Link>
              );
            })}

            <div className="h-px bg-white/[0.06] my-3" />

            {/* User section */}
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-4 py-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white/20 text-white">
                      {user.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    {subscription?.active && !subscription?.expired && (
                      <p className="text-xs text-violet-400">{subscription.isTrial ? 'Free Trial' : 'Premium'}</p>
                    )}
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/login"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium border border-white/15 text-white/80 hover:bg-white/5 transition-all">
                  Login
                </Link>
                <Link to="/signup"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-white text-slate-900 hover:bg-white/90 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

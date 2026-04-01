import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#080c18] border-t border-white/[0.06] text-white font-sans">
      <div className="w-full px-6 md:px-16 xl:px-24 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-14">

          {/* Brand col */}
          <div className="lg:col-span-1 lg:pr-6 max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ft-eth-top" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a78bfa"/>
                    <stop offset="1" stopColor="#6366f1"/>
                  </linearGradient>
                  <linearGradient id="ft-eth-bot" x1="0" y1="16" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8"/>
                    <stop offset="1" stopColor="#4f46e5"/>
                  </linearGradient>
                </defs>
                <polygon points="12,1 23,13 12,17 1,13" fill="url(#ft-eth-top)" opacity="0.95"/>
                <polygon points="12,31 23,18 12,22 1,18" fill="url(#ft-eth-bot)" opacity="0.85"/>
                <polygon points="12,17 23,13 12,22 1,13" fill="white" opacity="0.12"/>
              </svg>
              <span className="text-[19px] font-bold tracking-[-0.01em] whitespace-nowrap leading-none select-none text-white">
                Tradex<span className="text-violet-400">Strategies</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              A product by <a href="https://pumapulse.org" target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-white/70 transition-colors font-medium">PumaPulse</a>.
              We deliver backtested trading strategies daily — built for crypto, forex, and equity traders who want a real edge.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook,  href: 'https://pumapulse.org' },
                { icon: Linkedin,  href: 'https://pumapulse.org' },
                { icon: Twitter,   href: 'https://pumapulse.org' },
                { icon: Instagram, href: 'https://pumapulse.org' },
                { icon: Youtube,   href: 'https://pumapulse.org' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] hover:border-white/20 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { label: 'About Us',         href: 'https://pumapulse.org/aboutus/' },
                { label: 'Contact Us',       href: 'https://pumapulse.org/contact-us/' },
                { label: 'Careers',          href: 'https://pumapulse.org/careers/' },
                { label: 'Blog',             href: 'https://pumapulse.org/blog/' },
                { label: 'Privacy Policy',   href: 'https://pumapulse.org/privacy-policy/' },
                { label: 'Terms of Service', href: 'https://pumapulse.org/terms-conditions/' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">Platform</p>
            <ul className="space-y-3">
              {[
                { label: 'Strategies',    href: '/strategies' },
                { label: 'Dashboard',     href: '/dashboard' },
                { label: 'Community',     href: '/community' },
                { label: 'Premium Plans', href: '/subscription' },
                { label: 'Desktop App',   href: '/dashboard' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:pl-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">Get In Touch</p>
            <ul className="space-y-4">
              <li>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Business Inquiries</p>
                <a href="mailto:sales@pumapulse.org" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0" />sales@pumapulse.org
                </a>
              </li>
              <li>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Jobs</p>
                <a href="mailto:hr@pumapulse.org" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0" />hr@pumapulse.org
                </a>
              </li>
              <li>
                <a href="tel:+16815534010" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 shrink-0" />+1 (681) 553-4010
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-white/40">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>43 King Street West,<br />Toronto, ON, Canada</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-8" />

        {/* Bottom bar */}
        <div className="flex items-center justify-center">
          <p className="text-xs text-white/25 text-center">
            © 2025 PumaPulse Infoservices Private Limited. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

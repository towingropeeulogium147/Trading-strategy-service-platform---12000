import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'left' | 'right' | 'scale' | 'stagger';
  delay?: number;   // ms
  threshold?: number;
}

export default function RevealSection({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  threshold = 0.1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const variantClass = {
    up:      'reveal',
    left:    'reveal-left',
    right:   'reveal-right',
    scale:   'reveal-scale',
    stagger: 'reveal-stagger',
  }[variant];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`${variantClass} ${className}`}>
      {children}
    </div>
  );
}

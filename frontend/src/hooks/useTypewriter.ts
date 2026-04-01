import { useEffect, useRef, useState } from 'react';

export function useTypewriter(text: string, speed = 28, triggerOnView = true) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(!triggerOnView);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!triggerOnView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setStarted(true); observer.unobserve(el); }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView]);

  useEffect(() => {
    if (!started) return;
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [started, text, speed]);

  return { displayed, ref };
}

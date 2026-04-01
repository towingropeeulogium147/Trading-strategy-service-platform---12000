import { useEffect, useRef, useState, ElementType } from 'react';

interface Props {
  text: string;
  speed?: number;
  className?: string;      // outer tag class
  charClassName?: string;  // applied to each character span (for color)
  as?: ElementType;
  cursor?: boolean;
  delay?: number;
}

export default function Typewriter({
  text,
  speed = 35,
  className = '',
  charClassName = '',
  as: Tag = 'span',
  cursor = true,
  delay = 0,
}: Props) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    setCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setCount(i);
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [started, text, speed]);

  const done = count >= text.length;

  return (
    // @ts-ignore
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={charClassName}
          style={{
            display: 'inline',
            opacity: i < count ? 1 : 0,
            filter: i < count ? 'blur(0px)' : 'blur(5px)',
            transform: i < count ? 'translateY(0)' : 'translateY(5px)',
            transition: i < count
              ? `opacity 0.4s ease ${Math.min(i * 0.011, 0.28)}s,
                 filter  0.4s ease ${Math.min(i * 0.011, 0.28)}s,
                 transform 0.38s cubic-bezier(0.22,1,0.36,1) ${Math.min(i * 0.011, 0.28)}s`
              : 'none',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char}
        </span>
      ))}
      {cursor && !done && started && (
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '0.85em',
          background: 'currentColor',
          verticalAlign: 'middle',
          marginLeft: '2px',
          borderRadius: '1px',
          animation: 'cursorBlink 0.9s ease-in-out infinite',
        }} />
      )}
      <style>{`@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </Tag>
  );
}

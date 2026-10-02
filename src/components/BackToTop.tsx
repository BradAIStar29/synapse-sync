import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/** Floating back-to-top button — appears after scrolling past the hero */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#C9A84C] text-[#0D1B2A] shadow-lg shadow-[#C9A84C]/25 hover:bg-[#C9A84C]/90 hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:ring-offset-2 focus:ring-offset-[#0D1B2A]"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

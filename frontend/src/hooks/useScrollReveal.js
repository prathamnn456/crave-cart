import { useEffect } from 'react'

// reveals any element with the `reveal` class as it scrolls into view
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.reveal-in)');
    if (!els.length) return;

    const revealAll = () => els.forEach(el => el.classList.add('reveal-in'));

    // reduced motion or no IO support → just show everything
    if ((window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      || typeof IntersectionObserver === 'undefined') {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));

    // safety net: if something goes wrong and nothing has revealed, show all
    const safety = setTimeout(() => {
      const stuck = document.querySelectorAll('.reveal:not(.reveal-in)');
      if (stuck.length === els.length) stuck.forEach(el => el.classList.add('reveal-in'));
    }, 3000);

    return () => { observer.disconnect(); clearTimeout(safety); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

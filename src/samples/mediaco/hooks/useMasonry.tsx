import { useEffect, useRef } from 'react';

/**
 * Uses CSS Grid with `grid-auto-rows: 1px` and calculates row spans
 * from each card's rendered height so cards pack tightly without gaps.
 */
export default function useMasonry(gap = 16, rowHeight = 1, itemSelector = '.mc-card') {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const applyLayout = () => {
      const items = grid.querySelectorAll<HTMLElement>(itemSelector);
      if (items.length === 0) return;

      // Reset spans first
      items.forEach(item => item.style.removeProperty('grid-row-end'));

      // Measure and set spans in the next frame
      requestAnimationFrame(() => {
        items.forEach(item => {
          const height = item.getBoundingClientRect().height;
          const span = Math.ceil((height + gap) / (rowHeight + gap));
          item.style.gridRowEnd = `span ${span}`;
        });
      });
    };

    // Initial layout (slight delay for render to settle)
    const initTimer = setTimeout(applyLayout, 100);

    // Recalculate on resize (throttled)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyLayout, 150);
    };
    window.addEventListener('resize', onResize);

    // Recalculate on DOM mutations (debounced)
    const observer = new MutationObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyLayout, 100);
    });
    observer.observe(grid, { childList: true, subtree: true });

    return () => {
      clearTimeout(initTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, [gap, rowHeight, itemSelector]);

  return gridRef;
}

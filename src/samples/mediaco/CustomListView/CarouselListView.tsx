import React, { useEffect, useRef, useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import './CarouselListView.scss';

interface CarouselProps {
  data: any[];
  getPConnect?: any;
  title?: string;
  showAllItems?: () => void;
  referenceDataPage?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ data, title, showAllItems }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayItems, setDisplayItems] = useState<any[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const skeletonItems = new Array(6).fill(0);

  // 1. Build Data and Preload Images
  useEffect(() => {
    if (!data || data.length === 0) {
      setIsLoading(true);
      return;
    }

    const mappedData = data.map(item => ({
      title: item.Carouselheading || item.Description || 'Untitled',
      img: item.ImageURL,
      ...item
    }));

    let loopList = [...mappedData];
    const MIN_ITEMS = 12;

    if (loopList.length > 0) {
      while (loopList.length < MIN_ITEMS) {
        loopList = [...loopList, ...loopList];
      }
    }

    const finalDisplayItems = [...loopList, ...loopList, ...loopList];
    setDisplayItems(finalDisplayItems);

    // Preload Logic
    const uniqueUrls = [...new Set(finalDisplayItems.map(item => item.img))].filter(Boolean);
    let loadedCount = 0;
    const total = uniqueUrls.length;

    if (total === 0) {
      setIsLoading(false);
      return;
    }

    uniqueUrls.forEach(url => {
      const img = new Image();
      img.src = url;

      const onImageComplete = () => {
        loadedCount++;
        if (loadedCount === total) {
          setIsLoading(false);
        }
      };

      img.onload = onImageComplete;
      img.onerror = onImageComplete;
    });
  }, [data]);

  // The Scroll Math Logic
  const handleScroll = useCallback(
    (event: Event) => {
      if (isLoading) return;

      const container = event.target as HTMLElement;
      if (!container) return;

      requestAnimationFrame(() => {
        const totalWidth = container.scrollWidth;
        const singleSetWidth = totalWidth / 3;
        const currentScroll = container.scrollLeft;

        // Infinite scroll snapping
        if (currentScroll < 100) {
          container.scrollLeft = currentScroll + singleSetWidth;
        } else if (currentScroll >= singleSetWidth * 2 - 100) {
          container.scrollLeft = currentScroll - singleSetWidth;
        }

        const containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0) return;

        // Dynamic width and opacity calculation
        cardRefs.current.forEach(el => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const cardCenter = rect.left - containerRect.left + rect.width / 2;
          const containerCenter = containerRect.width / 2;
          const distance = Math.abs(containerCenter - cardCenter);

          const activeZone = 400;
          const minWidth = 200;
          const maxWidth = 500;
          let currentWidth = minWidth;
          let opacity = 0.7;

          if (distance < activeZone) {
            const factor = 1 - distance / activeZone;
            currentWidth = minWidth + (maxWidth - minWidth) * factor;
            opacity = 0.7 + 0.3 * factor;
          }

          el.style.flexBasis = `${currentWidth}px`;
          el.style.minWidth = `${currentWidth}px`;
          el.style.opacity = `${opacity}`;
        });
      });
    },
    [isLoading]
  );

  // Attach Scroll Listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Initialize Scroll Position once loading finishes
  useEffect(() => {
    if (!isLoading && scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      // setTimeout allows the browser to paint the flex items before measuring
      setTimeout(() => {
        if (container.scrollWidth > 0) {
          const singleSetWidth = container.scrollWidth / 3;
          container.scrollLeft = singleSetWidth;

          // Trigger the calculation to set initial card sizes
          handleScroll({ target: container } as any);
        }
      }, 0);
    }
  }, [isLoading, handleScroll]);

  return (
    <div className='carousel-host-container'>
      {title && (
        <div className='header-container'>
          <h2 className='alv-title'>{title}</h2>
        </div>
      )}

      <div className='carousel-frame'>
        <div className='carousel-scroll-area' ref={scrollContainerRef}>
          {isLoading
            ? // Skeleton State
              skeletonItems.map((_, index) => (
                <div className='card-wrapper' key={`skeleton-${index}`}>
                  <Card className='inner-material-card'>
                    <div className='skeleton-shimmer'></div>
                    <div className='card-overlay'>
                      <div className='skeleton-text'></div>
                    </div>
                  </Card>
                </div>
              ))
            : // Loaded State
              displayItems.map((item, index) => (
                <div
                  className='card-wrapper'
                  key={`${item.id || index}-${Math.random()}`}
                  ref={el => {
                    cardRefs.current[index] = el;
                  }}
                >
                  <Card className='inner-material-card'>
                    <img src={item.img} alt='Card Image' />
                    <div className='card-overlay'>
                      <h3>{item.title}</h3>
                    </div>
                  </Card>
                </div>
              ))}
        </div>
      </div>

      {showAllItems && (
        <div className='alv-headerBtn' onClick={showAllItems} aria-label='Open gallery'>
          Show all
        </div>
      )}
    </div>
  );
};

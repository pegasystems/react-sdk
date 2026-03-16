import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

interface CarouselItem {
  Carouselheading?: string;
  ImageURL?: string;
  Description?: string;
  [key: string]: any;
}

interface CarouselProps {
  data: CarouselItem[];
}

export default function Carousel({ data }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayItems, setDisplayItems] = useState<any[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setIsLoading(true);
      return;
    }
    buildCarouselItems();
  }, [data]);

  function buildCarouselItems() {
    const mapped = data.map(item => ({
      title: item.Carouselheading || item.Description || 'Untitled',
      img: item.ImageURL,
      ...item
    }));

    let loopList = [...mapped];
    const MIN_ITEMS = 12;
    while (loopList.length > 0 && loopList.length < MIN_ITEMS) {
      loopList = [...loopList, ...loopList];
    }

    const tripled = [...loopList, ...loopList, ...loopList];
    setDisplayItems(tripled);
    preloadImages(tripled);
  }

  function preloadImages(items: any[]) {
    setIsLoading(true);
    const uniqueUrls = [...new Set(items.map(i => i.img).filter(Boolean))];
    if (uniqueUrls.length === 0) {
      finishLoading();
      return;
    }
    let loaded = 0;
    const total = uniqueUrls.length;
    uniqueUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      const onComplete = () => {
        loaded++;
        if (loaded === total) finishLoading();
      };
      img.onload = onComplete;
      img.onerror = onComplete;
    });
  }

  function finishLoading() {
    setIsLoading(false);
    setTimeout(() => initializeScroll(), 0);
  }

  function initializeScroll() {
    const container = scrollRef.current;
    if (container && container.scrollWidth > 0) {
      const singleSetWidth = container.scrollWidth / 3;
      container.scrollLeft = singleSetWidth;
      handleScroll();
    }
  }

  function handleScroll() {
    if (isLoading) return;
    const container = scrollRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      const totalWidth = container.scrollWidth;
      const singleSetWidth = totalWidth / 3;
      const currentScroll = container.scrollLeft;

      if (currentScroll < 100) {
        container.scrollLeft = currentScroll + singleSetWidth;
      } else if (currentScroll >= singleSetWidth * 2 - 100) {
        container.scrollLeft = currentScroll - singleSetWidth;
      }

      const containerRect = container.getBoundingClientRect();
      if (containerRect.width === 0) return;

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
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isLoading, displayItems]);

  // Skeleton placeholders while images are preloading
  const skeletonItems = Array.from({ length: 6 }).map((_, i) => <Box key={`skeleton-${i}`} className='mc-carousel-skeleton-item' />);

  return (
    <Box className='mc-carousel-root'>
      <Box ref={scrollRef} className='mc-carousel-track'>
        {isLoading
          ? skeletonItems
          : displayItems.map((item, i) => (
              <Box
                key={i}
                ref={(el: HTMLDivElement | null) => {
                  cardRefs.current[i] = el;
                }}
                className='mc-carousel-item'
              >
                <Card className='mc-carousel-card'>
                  <Box component='img' src={item.img} alt='Card Image' className='mc-carousel-image' />
                  <Box className='mc-carousel-overlay'>
                    <Typography variant='subtitle1' className='mc-carousel-title'>
                      {item.title}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
      </Box>
    </Box>
  );
}

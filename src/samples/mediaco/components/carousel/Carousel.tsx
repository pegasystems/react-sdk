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
  const skeletonItems = Array.from({ length: 6 }).map((_, i) => (
    <Box
      key={`skeleton-${i}`}
      sx={{
        flex: '0 0 200px',
        height: 350,
        mx: '10px',
        borderRadius: '8px',
        background: 'linear-gradient(90deg, #e0e0e0 25%, #ececec 50%, #e0e0e0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      }}
    />
  ));

  return (
    <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'auto',
          borderRadius: '12px',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}
      >
        {isLoading
          ? skeletonItems
          : displayItems.map((item, i) => (
              <Box
                key={i}
                ref={(el: HTMLDivElement | null) => {
                  cardRefs.current[i] = el;
                }}
                sx={{
                  flex: '0 0 200px',
                  height: 350,
                  mx: '10px',
                  transition: 'flex-basis 0.1s linear, min-width 0.1s linear',
                  willChange: 'flex-basis, min-width',
                  minWidth: 0
                }}
              >
                <Card sx={{ width: '100%', height: '100%', p: 0, overflow: 'hidden', position: 'relative', background: '#000', borderRadius: '8px' }}>
                  <Box component='img' src={item.img} alt='Card Image' sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      p: 2,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                      color: '#fff'
                    }}
                  >
                    <Typography variant='subtitle1' sx={{ m: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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

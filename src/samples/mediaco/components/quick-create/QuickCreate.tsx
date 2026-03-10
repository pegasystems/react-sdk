import { useEffect, useState, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageSrc } from '../../utils/helpers';
import { QUICK_LINKS_DATA } from './quickCreateData';

/**
 * Uses CSS Grid with `grid-auto-rows: 1px` and calculates row spans
 * from each card's rendered height so cards pack tightly without gaps.
 */
function useMasonry(gap = 16, rowHeight = 1, itemSelector = '.mc-card') {
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

const bgGradients: Record<string, string> = {
  'bg-purple': 'linear-gradient(135deg, rgb(184,167,212) 0%, rgb(212,199,232) 100%)',
  'bg-pink': 'linear-gradient(135deg, rgb(232,168,212) 0%, rgb(240,199,229) 100%)',
  'bg-cyan': 'linear-gradient(135deg, rgb(168,212,230) 0%, rgb(199,229,240) 100%)',
  'bg-orange': 'linear-gradient(135deg, rgb(240,196,179) 0%, rgb(245,217,204) 100%)',
  'bg-magenta': 'linear-gradient(135deg, rgb(212,168,207) 0%, rgb(232,199,229) 100%)'
};

interface QuickCreateProps {
  getPConnect: () => typeof PConnect;
  heading?: string;
  showCaseIcons?: boolean;
  classFilter?: any[];
}

export default function QuickCreate({ getPConnect, classFilter: classFilterProp }: QuickCreateProps) {
  const pConn = getPConnect();
  const [cases, setCases] = useState<any[]>([]);
  const gridRef = useMasonry(16, 1, '.mc-card');

  const createCase = useCallback(
    (className: string) => {
      pConn
        .getActionsApi()
        .createWork(className, {} as any)
        .catch((error: any) => {
          console.log('Error in case creation: ', error?.message);
        });
    },
    [pConn]
  );

  useEffect(() => {
    const defaultCases: any[] = [];

    const envInfo = PCore.getEnvironmentInfo();
    if ((envInfo as any)?.environmentInfoObject?.pyCaseTypeList) {
      (envInfo as any).environmentInfoObject.pyCaseTypeList.forEach((casetype: any) => {
        if (casetype.pyWorkTypeName && casetype.pyWorkTypeImplementationClassName) {
          defaultCases.push({
            classname: casetype.pyWorkTypeImplementationClassName,
            onClick: () => createCase(casetype.pyWorkTypeImplementationClassName),
            label: casetype.pyWorkTypeName
          });
        }
      });
    } else {
      const pConnectInAppContext = PCore.createPConnect({
        options: { context: PCore.getConstants().APP.APP }
      }).getPConnect();
      const pyPortalInAppContext: any = pConnectInAppContext.getValue('pyPortal');
      pyPortalInAppContext?.pyCaseTypesAvailableToCreate?.forEach((casetype: any) => {
        if (casetype.pyClassName && casetype.pyLabel) {
          defaultCases.push({
            classname: casetype.pyClassName,
            onClick: () => createCase(casetype.pyClassName),
            label: casetype.pyLabel
          });
        }
      });
    }

    let filteredCases = defaultCases;
    if (classFilterProp && classFilterProp.length > 0) {
      filteredCases = [];
      classFilterProp.forEach((item: string) => {
        defaultCases.forEach(casetype => {
          if (casetype.classname === item) filteredCases.push(casetype);
        });
      });
    }

    // Merge with quick links data
    const cardMap = new Map(QUICK_LINKS_DATA.map(card => [card.title, card]));
    const merged = filteredCases.map(caseItem => {
      const match = cardMap.get(caseItem.label);
      return match ? { ...caseItem, ...match } : caseItem;
    });

    setCases(merged);
  }, [createCase, classFilterProp]);

  return (
    <Box sx={{ backgroundColor: 'transparent' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Section Header */}
        <Box sx={{ display: 'flex', mb: '32px', p: '0 4px' }}>
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 400, color: '#2c2c2c', m: '0 0 4px 0' }}>Get started</Typography>
            <Box sx={{ height: 4, backgroundColor: '#9c27b0', width: '100%', borderRadius: '2px' }} />
          </Box>
        </Box>

        {/* Grid — masonry layout via grid-auto-rows: 1px + JS row-span calculation */}
        <Box
          ref={gridRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gridAutoRows: '1px',
            gridAutoFlow: 'row dense',
            gap: '16px',
            width: '100%',
            alignItems: 'start'
          }}
        >
          {cases.length === 0
            ? [1, 2, 3, 4].map(i => (
                <Box
                  key={i}
                  className='mc-card'
                  sx={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0px 1px 2px 0px #0000004d, 0px 2px 6px 2px #00000026',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      borderRadius: '0 0 16px 16px',
                      animation: 'skeleton-loading 1s linear infinite alternate',
                      '@keyframes skeleton-loading': {
                        '0%': { backgroundColor: 'hsl(200,20%,80%)' },
                        '100%': { backgroundColor: 'hsl(200,20%,95%)' }
                      }
                    }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '0.7rem',
                        mb: '0.5rem',
                        borderRadius: '0.25rem',
                        animation: 'skeleton-loading 1s linear infinite alternate'
                      }}
                    />
                    <Box
                      sx={{
                        width: '100%',
                        height: '0.7rem',
                        mb: '0.5rem',
                        borderRadius: '0.25rem',
                        animation: 'skeleton-loading 1s linear infinite alternate'
                      }}
                    />
                    <Box sx={{ width: 100, height: 36, borderRadius: '18px', animation: 'skeleton-loading 1s linear infinite alternate' }} />
                  </Box>
                </Box>
              ))
            : cases.map((card, i) => (
                <Box
                  key={i}
                  className='mc-card'
                  sx={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0px 1px 2px 0px #0000004d, 0px 2px 6px 2px #00000026',
                    border: '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover .mc-icon-box': { transform: 'scale(1.1) rotateZ(10deg)', transition: 'transform 0.3s ease' },
                    '&:hover .mc-arrow': { transform: 'translateX(4px)', transition: 'transform 0.2s ease' }
                  }}
                >
                  {/* Card Header */}
                  <Box
                    sx={{
                      height: 140,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '0 0 16px 16px',
                      background: bgGradients[card.bgClass] || bgGradients['bg-purple']
                    }}
                  >
                    {/* Watermark */}
                    {card.icon && (
                      <Box sx={{ position: 'absolute', opacity: 0.1, transform: 'rotate(45deg) scale(8)', pointerEvents: 'none' }}>
                        <Box
                          component='img'
                          src={getImageSrc(card.icon)}
                          sx={{ color: '#fff', height: 48, filter: 'brightness(0) saturate(100%) invert(100%)', width: 48 }}
                        />
                      </Box>
                    )}
                    {/* Icon box */}
                    <Box
                      className='mc-icon-box'
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        boxShadow: '0 8px 32px rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                        backgroundImage: card.gradient || undefined
                      }}
                    >
                      {card.icon && (
                        <Box component='img' src={getImageSrc(card.icon)} sx={{ height: 45, filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                      )}
                    </Box>
                  </Box>

                  {/* Card Body */}
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ m: '0 0 10px', fontSize: 16, fontWeight: 500, lineHeight: '24px', color: '#1a1a1a' }}>
                      {card.title || card.label}
                    </Typography>
                    <Typography sx={{ m: '0 0 16px', color: '#555', fontSize: 14 }}>{card.description}</Typography>
                    <Button
                      variant='outlined'
                      onClick={card.onClick}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        px: 3,
                        py: '10px',
                        borderRadius: '30px',
                        background: 'transparent',
                        color: '#a83fa1',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        borderColor: '#a83fa1',
                        textTransform: 'none',
                        '&:hover': { borderColor: '#a83fa1', background: 'rgba(168,63,161,0.04)' }
                      }}
                    >
                      Get Started
                      <ArrowForwardIcon className='mc-arrow' sx={{ fontSize: 20, height: 20, width: 20 }} />
                    </Button>
                  </Box>
                </Box>
              ))}
        </Box>
      </Box>
    </Box>
  );
}

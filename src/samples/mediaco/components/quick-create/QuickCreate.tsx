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

const headerGradientClassMap: Record<string, string> = {
  'bg-purple': 'mc-quick-create-header-purple',
  'bg-pink': 'mc-quick-create-header-pink',
  'bg-cyan': 'mc-quick-create-header-cyan',
  'bg-orange': 'mc-quick-create-header-orange',
  'bg-magenta': 'mc-quick-create-header-magenta'
};

const iconGradientClassMap: Record<string, string> = {
  'icon-purple': 'mc-quick-create-icon-purple',
  'icon-pink': 'mc-quick-create-icon-pink',
  'icon-cyan': 'mc-quick-create-icon-cyan',
  'icon-orange': 'mc-quick-create-icon-orange',
  'icon-magenta': 'mc-quick-create-icon-magenta'
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

  const getHeaderGradientClass = (bgClass?: string) => {
    if (bgClass && headerGradientClassMap[bgClass]) return headerGradientClassMap[bgClass];
    return headerGradientClassMap['bg-purple'];
  };

  const getIconGradientClass = (iconBgClass?: string) => {
    if (iconBgClass && iconGradientClassMap[iconBgClass]) return iconGradientClassMap[iconBgClass];
    return iconGradientClassMap['icon-purple'];
  };

  return (
    <Box className='mc-quick-create-root'>
      <Box className='mc-quick-create-content'>
        {/* Section Header */}
        <Box className='mc-quick-create-header'>
          <Box>
            <Typography className='mc-quick-create-title'>Get started</Typography>
            <Box className='mc-quick-create-title-underline' />
          </Box>
        </Box>

        {/* Grid — masonry layout via grid-auto-rows: 1px + JS row-span calculation */}
        <Box ref={gridRef} className='mc-quick-create-grid'>
          {cases.length === 0
            ? [1, 2, 3, 4].map(i => (
                <Box key={i} className='mc-card mc-quick-create-card mc-quick-create-card-skeleton'>
                  <Box className='mc-quick-create-skeleton-header' />
                  <Box className='mc-quick-create-skeleton-body'>
                    <Box className='mc-quick-create-skeleton-line' />
                    <Box className='mc-quick-create-skeleton-line' />
                    <Box className='mc-quick-create-skeleton-button' />
                  </Box>
                </Box>
              ))
            : cases.map((card, i) => (
                <Box key={i} className='mc-card mc-quick-create-card mc-quick-create-card-live'>
                  {/* Card Header */}
                  <Box className={`mc-quick-create-card-header ${getHeaderGradientClass(card.bgClass)}`}>
                    {/* Watermark */}
                    {card.icon && (
                      <Box className='mc-quick-create-watermark'>
                        <Box component='img' src={getImageSrc(card.icon)} className='mc-quick-create-watermark-image' />
                      </Box>
                    )}
                    {/* Icon box */}
                    <Box className={`mc-icon-box mc-quick-create-icon-box ${getIconGradientClass(card.iconBgClass)}`}>
                      {card.icon && <Box component='img' src={getImageSrc(card.icon)} className='mc-quick-create-icon-image' />}
                    </Box>
                  </Box>

                  {/* Card Body */}
                  <Box className='mc-quick-create-card-body'>
                    <Typography className='mc-quick-create-card-title'>{card.title || card.label}</Typography>
                    <Typography className='mc-quick-create-card-description'>{card.description}</Typography>
                    <Button variant='outlined' onClick={card.onClick} className='mc-quick-create-button'>
                      Get Started
                      <ArrowForwardIcon className='mc-arrow mc-quick-create-arrow' />
                    </Button>
                  </Box>
                </Box>
              ))}
        </Box>
      </Box>
    </Box>
  );
}

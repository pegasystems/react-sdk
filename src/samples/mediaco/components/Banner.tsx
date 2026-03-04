import React, { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import { usePortal } from '../context/PortalContext';

/**
 * Banner is called by BannerPage/DefaultPage via getComponentFromMap('Banner').
 * The OOTB caller passes: { a, b, banner, variant }
 *   - a: first region content (React element)
 *   - b: second region content (React element)
 *   - banner: { title, message, backgroundImage, variant, backgroundColor, tintImage }
 *   - variant: layout type ('two-column' | 'wide-narrow' | 'narrow-wide')
 */
interface BannerProps {
  a?: ReactNode;
  b?: ReactNode;
  banner?: {
    title?: string;
    message?: string;
    backgroundImage?: string;
    variant?: string;
    backgroundColor?: string;
    tintImage?: boolean;
  };
  variant?: string;
}

export default function Banner(props: BannerProps) {
  const { a, b, banner, variant = 'two-column' } = props;
  const title = banner?.title || '';
  const message = banner?.message || '';

  const { portalContent } = usePortal();

  // Grid column sizes based on variant/layout
  const getGridColumns = () => {
    switch (variant) {
      case 'two-column':
        return { xs: '1fr', lg: 'repeat(2, 1fr)' };
      case 'wide-narrow':
        return { xs: '1fr', lg: '7fr 3fr' };
      case 'narrow-wide':
        return { xs: '1fr', lg: '3fr 7fr' };
      default:
        return { xs: '1fr', lg: 'repeat(2, 1fr)' };
    }
  };

  const gridCols = getGridColumns();

  return (
    <div style={{ width: '100%', backgroundColor: '#fff' }}>
      {/* Banner header area — sticky like Angular's .background-image-style */}
      <Box
        sx={{
          position: 'sticky',
          top: 64, // AppBar height
          backgroundColor: '#fff',
          zIndex: 10,
          pb: '2rem',
          width: '100%'
        }}
      >
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', pt: '5rem', gap: '0.5rem' }}>
            <Box sx={{ justifyContent: 'center', display: 'inline-grid' }}>
              {title && (
                <Box
                  component='h1'
                  sx={{ m: 0, fontSize: 36, color: '#46185a', fontWeight: 700 }}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {message && (
                <Box component='p' sx={{ fontSize: 14, mt: '16px', color: '#49454f' }}>
                  {message}
                </Box>
              )}
              {/* Portal content from Todo (survey banner) */}
              {portalContent}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content regions */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: gridCols,
          columnGap: '1rem',
          gap: '1.5rem',
          alignItems: 'start',
          background: '#fff',
          padding: '40px 44px 16px',
          borderTopLeftRadius: '28px'
        }}
      >
        {a && (
          <Box sx={{ minWidth: 0 }}>
            {a}
          </Box>
        )}
        {b && (
          <Box sx={{ minWidth: 0 }}>
            {b}
          </Box>
        )}
      </Box>
    </div>
  );
}

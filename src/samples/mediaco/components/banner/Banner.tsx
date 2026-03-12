import { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OOTBBanner from '@pega/react-sdk-components/lib/components/designSystemExtension/Banner';
import { useTodoPortal } from '../../utils/TodoPortalContext';
import { getImageSrc } from '../../utils/helpers';

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
  // Delegate to OOTB Banner when not on the WSS portal
  const isWssPortal = (PCore.getEnvironmentInfo() as any).environmentInfoObject?.pyPortalTemplate === 'wss';
  if (!isWssPortal) {
    return <OOTBBanner {...(props as any)} />;
  }

  const { a, b, banner, variant = 'two-column' } = props;
  const title = banner?.title || '';
  const message = banner?.message || '';
  const { surveyCase, clickGoRef } = useTodoPortal();
  const imgSrc = getImageSrc('message-circle');

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
      {/* Banner header area  */}
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
                <Box component='h1' sx={{ m: 0, fontSize: 36, color: '#46185a', fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: title }} />
              )}
              {message && (
                <Box component='p' sx={{ fontSize: 14, mt: '16px', color: '#49454f' }}>
                  {message}
                </Box>
              )}

              {/* Todo survey banner */}
              {surveyCase && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    py: '1rem'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      background: 'linear-gradient(135deg, rgb(103,80,164) 0%, rgb(248,20,227) 50%, rgb(0,201,255) 100%)',
                      backgroundSize: '200% 200%',
                      borderRadius: '24px',
                      padding: '24px 32px',
                      width: '670px',
                      maxWidth: '100%',
                      color: '#fff',
                      boxShadow: '0 8px 20px rgba(94, 75, 159, 0.25)',
                      fontFamily: "'Roboto', sans-serif",
                      textAlign: 'left',
                      '@media (max-width: 768px)': {
                        flexDirection: 'column',
                        textAlign: 'center',
                        padding: '32px 24px'
                      }
                    }}
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '72px',
                          height: '72px',
                          borderRadius: '16px',
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <Box
                          component='img'
                          src={imgSrc}
                          sx={{
                            height: '35px',
                            filter: 'brightness(0) saturate(100%) invert(100%)'
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box component='h2' sx={{ m: '0 0 6px 0', fontSize: '22px', fontWeight: 400 }}>
                        Share Your Experience
                      </Box>
                      <Box component='p' sx={{ m: 0, fontSize: '15px', opacity: 0.9, fontWeight: 400, lineHeight: 1.4 }}>
                        Take a quick survey about your recent experience with MediaCo.
                      </Box>
                    </Box>

                    <Box sx={{ flexShrink: 0 }}>
                      <Button
                        onClick={() => clickGoRef.current()}
                        sx={{
                          backgroundColor: '#fff',
                          color: '#5c4498',
                          border: 'none',
                          padding: '12px 28px',
                          borderRadius: '50px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          letterSpacing: '0.1px',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#f0f0f0'
                          }
                        }}
                      >
                        Start
                        <ArrowForwardIcon sx={{ fontSize: '20px' }} />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
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
        {a && <Box sx={{ minWidth: 0 }}>{a}</Box>}
        {b && <Box sx={{ minWidth: 0 }}>{b}</Box>}
      </Box>
    </div>
  );
}

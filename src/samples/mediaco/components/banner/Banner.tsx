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

  // Grid class based on variant/layout
  const getGridClass = () => {
    switch (variant) {
      case 'two-column':
        return 'mc-banner-content--two-column';
      case 'wide-narrow':
        return 'mc-banner-content--wide-narrow';
      case 'narrow-wide':
        return 'mc-banner-content--narrow-wide';
      default:
        return 'mc-banner-content--two-column';
    }
  };

  const gridClass = getGridClass();

  return (
    <div className='mc-banner-root'>
      {/* Banner header area  */}
      <Box className='mc-banner-header'>
        <Box className='mc-banner-header-inner'>
          <Box className='mc-banner-header-stack'>
            <Box className='mc-banner-header-content'>
              {title && <Box component='h1' className='mc-banner-title' dangerouslySetInnerHTML={{ __html: title }} />}
              {message && (
                <Box component='p' className='mc-banner-message'>
                  {message}
                </Box>
              )}

              {/* Todo survey banner */}
              {surveyCase && (
                <Box className='mc-banner-survey-wrap'>
                  <Box className='mc-banner-survey-card'>
                    <Box className='mc-banner-survey-icon-wrap'>
                      <Box className='mc-banner-survey-icon-box'>
                        <Box component='img' src={imgSrc} className='mc-banner-survey-icon-image' />
                      </Box>
                    </Box>

                    <Box className='mc-banner-survey-text'>
                      <Box component='h2' className='mc-banner-survey-title'>
                        Share Your Experience
                      </Box>
                      <Box component='p' className='mc-banner-survey-message'>
                        Take a quick survey about your recent experience with MediaCo.
                      </Box>
                    </Box>

                    <Box className='mc-banner-survey-action'>
                      <Button onClick={() => clickGoRef.current()} className='mc-banner-survey-button'>
                        Start
                        <ArrowForwardIcon className='mc-banner-survey-button-icon' />
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
      <Box className={`mc-banner-content ${gridClass}`}>
        {a && <Box className='mc-banner-region'>{a}</Box>}
        {b && <Box className='mc-banner-region'>{b}</Box>}
      </Box>
    </div>
  );
}

import { useMemo, Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import BannerPage from '../BannerPage';
import OneColumnPage from '@pega/react-sdk-components/lib/components/template/OneColumn/OneColumnPage';
import TwoColumnPage from '@pega/react-sdk-components/lib/components/template/TwoColumn/TwoColumnPage';
import WideNarrowPage from '@pega/react-sdk-components/lib/components/template/WideNarrow/WideNarrowPage';
import NarrowWidePage from '@pega/react-sdk-components/lib/components/template/NarrowWide/NarrowWidePage';
import Banner from '../../designSystemExtension/Banner';

export default function DefaultPage({
  title,
  icon = '',
  layout = 'two-column',
  children,
  getPConnect,
  enableGetNextWork,
  localeReference,
  enableBanner,
  heading = '',
  message = '',
  imageTheme,
  backgroundImage = '',
  backgroundColor = '',
  tintImage,
  layoutModel,
  coaches = []
}) {
  const childArray = useMemo(() => {
    return Children.toArray(children);
  }, [children]);

  if (enableBanner) {
    return (
      <Banner
        variant={layout === 'one-column' ? 'two-column' : layout}
        a={[childArray[0]]}
        b={layout !== 'one-column' ? [childArray[1]] : undefined}
        banner={{
          variant: imageTheme,
          backgroundColor,
          title: heading,
          message,
          backgroundImage,
          tintImage
        }}
      />
    );
  }

  const commonProps = {
    title,
    icon: icon?.replace('pi pi-', ''),
    a: childArray[0],
    getPConnect,
    children: childArray
  };

  if (layout === 'one-column') {
    return <OneColumnPage {...commonProps} />;
  }
  if (layout === 'two-column') {
    return <TwoColumnPage {...commonProps} />;
  }
  if (layout === 'wide-narrow') {
    return <WideNarrowPage {...commonProps} />;
  }
  if (layout === 'narrow-wide') {
    return <NarrowWidePage templateCol='' {...commonProps} />;
  }
}

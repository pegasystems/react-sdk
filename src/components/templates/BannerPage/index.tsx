import { useMemo, Children } from 'react';
import PropTypes from 'prop-types';
import Banner from '../../designSystemExtensions/Banner';
import React from 'react';

/*
 * BannerPage template.
 */
export default function BannerPage(props) {
  const {
    children,
    layout,
    heading,
    message,
    imageTheme,
    backgroundImage,
    backgroundColor,
    tintImage
  } = props;

  const childArray = useMemo(() => {
    return Children.toArray(children);
  }, [children]);

  return (
    <Banner
      variant={layout}
      a={childArray[0]}
      b={childArray[1]}
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

BannerPage.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  layout: PropTypes.string,
  heading: PropTypes.string,
  message: PropTypes.string,
  imageTheme: PropTypes.string,
  backgroundImage: PropTypes.string,
  backgroundColor: PropTypes.string,
  tintImage: PropTypes.bool
};

BannerPage.defaultProps = {
  layout: 'two-column',
  heading: '',
  message: '',
  imageTheme: 'light',
  backgroundImage: '',
  backgroundColor: '',
  tintImage: false
};

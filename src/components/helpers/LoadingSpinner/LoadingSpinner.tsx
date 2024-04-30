import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({
  size,
  label,
  topText,
  bottomText,
  topTag,
  bottomTag,
  borderColor,
  topBorderColor
}) => {
  const TopHeaderTag = topTag || 'h1';
  const BottomTextTag = bottomTag || 'h1';
  const AccLabel = label || 'loading';
  const BorderColor = borderColor || '#dee0e2';
  const TopBorderColor = topBorderColor || '#1d70b8';

  return (
    <>
      <TopHeaderTag className='govuk-heading-s'>{topText}</TopHeaderTag>
      <div
        className='loading-spinner'
        role='status'
        style={{
          width: size,
          height: size,
          borderColor: BorderColor,
          borderTopColor: TopBorderColor
        }}
        aria-label={AccLabel}
      >
        <div className='spinner'></div>
      </div>
      <BottomTextTag className='govuk-heading-s'>{bottomText}</BottomTextTag>
    </>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  topTag: PropTypes.string,
  bottomTag: PropTypes.string,
  topText: PropTypes.string,
  label: PropTypes.string.isRequired,
  bottomText: PropTypes.string,
  borderColor: PropTypes.string,
  topBorderColor: PropTypes.string
};

LoadingSpinner.defaultProps = {
  size: '50px',
  borderColor: '#dee0e2',
  topBorderColor: '#1d70b8'
};

export default LoadingSpinner;

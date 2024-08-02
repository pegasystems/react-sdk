import { withConfiguration } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';
import React from 'react';

import type { PConnFieldProps } from './PConnProps';

import StyledHmrcOdxSectionBasedWrapper from './styles';

// interface for props
interface HmrcOdxSectionBasedProps extends PConnFieldProps {
  children: any;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function HmrcOdxSectionBased(props: HmrcOdxSectionBasedProps) {
  const { children } = props;

  function generateUniqueKey() {
    return Math.random().toString(36).substring(2, 15);
  }

  // console.log(`Rendering ${getPConnect()?.getComponentName()} with ${template} with ${children?.length} Region(s)`);

  return (
    <StyledHmrcOdxSectionBasedWrapper>
      <div className='sectionBased'>
        {/* Loop through the children array and render each child */}
        {children.map((child: any) => {
          const uniqueKey = generateUniqueKey(); // Generate a unique key for each child element
          return (
            <div key={uniqueKey} className='sectionBased-region'>
              {child}
            </div>
          );
        })}
      </div>
    </StyledHmrcOdxSectionBasedWrapper>
  );
}

HmrcOdxSectionBased.defaultProps = {
  // NumCols: 1,
  children: []
};

HmrcOdxSectionBased.propTypes = {
  // NumCols: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.node)
};

export default withConfiguration(HmrcOdxSectionBased);

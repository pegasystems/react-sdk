import React from 'react';
import PropTypes from 'prop-types';

export default function ReadOnlyDisplay(props) {
  const { value } = props;

  return (
    <div className='govuk-summary-list__row'>
    <dd className='govuk-summary-list__value'>{value}</dd>
  </div>
  )

}

ReadOnlyDisplay.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),

};

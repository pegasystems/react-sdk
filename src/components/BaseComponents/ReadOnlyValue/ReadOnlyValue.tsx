import React from 'react';
import PropTypes from 'prop-types';

interface ReadOnlyValueProps {
  label: string;
  value: string;
}

export default function ReadOnlyValue(props: ReadOnlyValueProps) {
  const { label, value } = props;

  return (
    <div className='govuk-summary-list'>
      <div className='govuk-summary-list__row'>
        <dt className='govuk-summary-list__key'>{label}</dt>
        <dd className='govuk-summary-list__value'>{value}</dd>
      </div>
    </div>
  );
}

ReadOnlyValue.propTypes = {
  value: PropTypes.string
};

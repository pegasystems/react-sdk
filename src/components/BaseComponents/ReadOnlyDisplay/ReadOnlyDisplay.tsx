import React from 'react';
import PropTypes from 'prop-types';

export default function ReadOnlyDisplay(props){

  const {label, value} = props;

  return (
    <div className="govuk-summary-list__row">
      <dt className="govuk-summary-list__key">{label}</dt>

      <dd className="govuk-summary-list__value">
      { Array.isArray(value) ?
        <ul className="govuk-list">
          {value.map( valueItem => <li key={valueItem}>{valueItem}</li>)}
        </ul>
        :
        value
      } </dd>
    </div>
  )
}


ReadOnlyDisplay.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
}

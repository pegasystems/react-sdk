import React from 'react';

export default function ReadOnlyDisplay(props){

  const {label, value} = props;

  return (
    <div className="govuk-summary-list__row">
      <dt className="govuk-summary-list__key">{label}</dt>
      <dd className="govuk-summary-list__value">{value}</dd>
    </div>
  )
}

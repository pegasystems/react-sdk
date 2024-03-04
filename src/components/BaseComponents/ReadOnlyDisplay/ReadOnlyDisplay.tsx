import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ReadOnlyDisplay(props) {
  const COMMA_DELIMITED_FIELD = 'CSV';
  const { label, value, name } = props;
  const [formattedValue, setFormattedValue] = useState<string | []>(value);

  useEffect(() => {
    if (name && name.indexOf(COMMA_DELIMITED_FIELD) !== -1 && value.indexOf(',') !== -1) {
      const formatValue = value.split(',').map((item: string) => item.trim());
      setFormattedValue(formatValue);
    }
  }, []);

  return (
    <div className='govuk-summary-list__row'>
      <dt className='govuk-summary-list__key'>{label}</dt>

      <dd className='govuk-summary-list__value'>
        {Array.isArray(formattedValue) ? (
          <ul className='govuk-list'>
            {formattedValue.map(valueItem => (
              <li key={valueItem}>{valueItem}</li>
            ))}
          </ul>
        ) : (
          formattedValue || value
        )}{' '}
      </dd>
    </div>
  );
}

ReadOnlyDisplay.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  name: PropTypes.string
};

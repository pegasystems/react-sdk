import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ReadOnlyDisplay(props) {
  const COMMA_DELIMITED_FIELD = 'CSV';
  const { label, value, name, emptyValue } = props;

  const [formattedValue, setFormattedValue] = useState<string | []>(value);
  let isCSV = false;

  if (name && name.includes(COMMA_DELIMITED_FIELD) && value.includes(',')) {
    isCSV = true;
  }

  useEffect(() => {
    if (name && name.indexOf(COMMA_DELIMITED_FIELD) !== -1 && value.indexOf(',') !== -1) {
      const formatValue = value.split(',').map((item: string) => item.trim());
      setFormattedValue(formatValue);
    }
  }, []);

  return (
    <div className='govuk-summary-list__row'>
      <dt className='govuk-summary-list__key'>{label}</dt>

      <dd className='govuk-summary-list__value' data-empty-value={emptyValue} data-is-csv={isCSV}>
        {Array.isArray(formattedValue) ? (
          <>
            {formattedValue?.map(item => (
              <React.Fragment key={item}>
                {item}
                <br />
              </React.Fragment>
            ))}
          </>
        ) : (
          (isCSV && formattedValue) || value
        )}
      </dd>
    </div>
  );
}

ReadOnlyDisplay.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  name: PropTypes.string,
  emptyValue: PropTypes.string
};

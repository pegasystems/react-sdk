import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ReadOnlyDisplay(props) {
  const COMMA_DELIMITED_FIELD = 'CSV';
  const { value, name } = props;
  const [formattedValue, setFormattedValue] = useState<string | []>(value);

  useEffect(() => {
    if (name && name.indexOf(COMMA_DELIMITED_FIELD) !== -1 && value.indexOf(',') !== -1) {
      const formatValue = value.split(',').map((item: string) => item.trim());
      setFormattedValue(formatValue);
    }
  }, []);

  return <span>{formattedValue}</span>;
}

ReadOnlyDisplay.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  name: PropTypes.string
};

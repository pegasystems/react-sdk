import React from 'react';
import PropTypes from 'prop-types';
import { makeHintId, makeErrorId } from '../FormGroup/FormGroup';
import FieldSet from '../FormGroup/FieldSet';

export default function Select(props) {
  const { name, onChange, value, children, errorText, hintText } = props;

  const describedbyIds = `${hintText ? makeHintId(name) : ''} ${
    errorText ? makeErrorId(name) : ''
  }`.trim();
  const ariaDescBy = describedbyIds.length !== 0 ? { 'aria-describedby': describedbyIds } : {};

  return (
    <FieldSet {...props}>
      <select
        className='govuk-select'
        id={name}
        name={name}
        onChange={onChange}
        value={value}
        {...ariaDescBy}
      >
        {children}
      </select>
    </FieldSet>
  );
}

Select.propTypes = {
  ...FieldSet.propTypes,
  name: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string
};

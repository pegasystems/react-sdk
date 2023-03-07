import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormGroup, { makeErrorId, makeHintId } from '../FormGroup/FormGroup';

// TODO - fix styling
// TODO - fix data handling
// values are array : value , label, hintid everything..

// add error Id .. where? individual or group
// value : single val from arr

export default function Checkboxes(props) {
  const {
    name,
    label,
    items,
    isSmall,
    labelIsHeading,
    errorText,
    required,
    onChange,
    onBlur,
    inputProps
  } = props;

  const checkboxClasses = `govuk-checkboxes ${isSmall ? 'govuk-checkboxes--small' : ''}`;
  const itemClasses = 'govuk-checkboxes__item'
  const checkboxItemClasses = 'govuk-checkboxes__input'
  const hintTextClasses = `govuk-hint govuk-checkboxes__hint`
  const labelClasses = `govuk-label govuk-checkboxes__label`
  // inputProps['aria-describedby'] = `${errorText ? makeErrorId(name) : ''} ${
  //   hintText ? makeHintId(name) : ''
  // }`.trim();
  // const initialiseChecked = () => {
  //   const values = []
  //   items.forEach(item => values.push(item.label))
  //   return values
  // }
  // const [values, setValues] = useState([])

  useEffect(()=> {
    console.log(items)
  })
  // TODO - check with a normal checkbox
  return (
    <FormGroup {...props}>
      <div className={checkboxClasses}>
        {items.map(item => (
          <div className={itemClasses}>
            <input
              className={checkboxItemClasses}
              {...inputProps}
              id={item.name}
              name={item.name}
              type='checkbox'
              value={item.checked}
              onChange={!item.readOnly ? onChange : ()=>{}}
              onBlur={!item.readOnly ? onBlur : ()=>{}}
            ></input>
            <label className={labelClasses}>{item.label}</label>
          </div>
        ))}
      </div>
    </FormGroup>
  );
}

Checkboxes.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  label: PropTypes.string,
  isSmall: PropTypes.bool,
  labelIsHeading: PropTypes.bool,
  items: PropTypes.array,
  required: PropTypes.bool,
  errorText: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

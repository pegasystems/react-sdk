import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormGroup, { makeItemId } from '../FormGroup/FormGroup';

// TODO - fix data handling
export default function Checkboxes(props) {
  const {
    name,
    label,
    items,
    isSmall,
    labelIsHeading,
    errorText,
    hintText,
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

  // const initialiseChecked = () => {
  //   const values = []
  //   items.forEach(item => values.push(item.label))
  //   return values
  // }
  // const [values, setValues] = useState([])


  return (
    <FormGroup {...props}>
      <div className={checkboxClasses}>
        {/* TODO - add item ids and names */}
        {items.map((item, index) => (
          <div className={itemClasses} key={makeItemId(index, name)}>
            <input
              className={checkboxItemClasses}
              {...inputProps}
              id={makeItemId(index, name)}
              name={makeItemId(index, name)}
              type='checkbox'
              value={item.checked}
              onChange={!item.readOnly ? onChange : ()=>{}}
              onBlur={!item.readOnly ? onBlur : ()=>{}}
            ></input>
            <label className={labelClasses}>{item.label}</label>
            {item.hintText ? <div id={makeItemId(index, `${name}-item-hint`)} className={hintTextClasses}>{item.hintText}</div>: null}
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

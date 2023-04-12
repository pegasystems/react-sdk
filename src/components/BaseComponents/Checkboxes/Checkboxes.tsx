import React from 'react';
import PropTypes from 'prop-types';
import FieldSet from '../FormGroup/FieldSet';
import GDSCheckbox from './Checkbox'

export default function Checkboxes(props) {
  const {
    name,
    optionsList,
    onChange,
    onBlur,
    inputProps,
  } = props;

  const checkboxClasses = `govuk-checkboxes`;


  return (
    <FieldSet {...props}>
      <div className={checkboxClasses}>
        {optionsList.map((item, index) => (
          <GDSCheckbox
            item={item}
            index={index}
            name={name}
            inputProps={...inputProps}
            onChange={onChange}
            onBlur={onBlur}
          />
        ))}
      </div>
    </FieldSet>
  );
}

Checkboxes.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  legendIsHeading: PropTypes.bool,
  optionsList: PropTypes.array,
  errorText: PropTypes.string,
  hintText: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

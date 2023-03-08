import React from 'react';
import PropTypes from 'prop-types';
import FieldSet from '../FormGroup/FieldSet';
import GDSCheckbox from './Checkbox'

// TODO - fix data handling
export default function Checkboxes(props) {
  const {
    name,
    label,
    optionsList,
    isSmall,
    legendIsHeading,
    errorText,
    hintText,
    required,
    onChange,
    onBlur,
    inputProps
  } = props;

  const checkboxClasses = `govuk-checkboxes ${isSmall ? 'govuk-checkboxes--small' : ''}`;

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
  isSmall: PropTypes.bool,
  legendIsHeading: PropTypes.bool,
  optionsList: PropTypes.array,
  required: PropTypes.bool,
  errorText: PropTypes.string,
  hintText: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

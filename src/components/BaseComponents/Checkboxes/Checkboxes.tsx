import React from 'react';
import PropTypes from 'prop-types';
import FieldSet from '../FormGroup/FieldSet';
import GDSCheckbox from './Checkbox'

export default function Checkboxes(props) {
  const {
    optionsList,
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
            name={item.name}
            inputProps={...inputProps}
            onChange={item.onChange}
            onBlur={onBlur}
            key={item.name}
          />
        ))}
      </div>
    </FieldSet>
  );
}

Checkboxes.propTypes = {
  name: PropTypes.string,
  optionsList: PropTypes.arrayOf(PropTypes.shape({
    checked: PropTypes.bool,
    label: PropTypes.string,
    hintText: PropTypes.string,
    readOnly:PropTypes.bool,
    onChange:PropTypes.func})
  ),
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ...FieldSet.propTypes ,
};

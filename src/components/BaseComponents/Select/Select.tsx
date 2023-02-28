import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../FormGroup/FormGroup';

export default function Select(props){

  const {name, onChange, value, children} = props;

  return(
    <FormGroup {...props}>
        <select className="govuk-select" id={name} name={name} onChange={onChange} value={value}>
          {children}
        </select>
    </FormGroup>
  )
}

Select.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string,
}

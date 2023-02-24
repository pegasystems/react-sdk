import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../FormGroup/FormGroup';

export default function Select(props){

  const {name, children, onChange} = props;

  return(
    <FormGroup {...props}>
      <select className="govuk-select" id={name} name={name} onChange={onChange}>
        {children}
      </select>
    </FormGroup>
  )
}

Select.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  labelIsHeading: PropTypes.bool,
  inputProps: PropTypes.object,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.array,
  onChange: PropTypes.func,
}

Select.defaultProps ={
  labelIsHeading: true,
}

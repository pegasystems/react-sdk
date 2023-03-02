import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, {makeHintId, makeErrorId} from '../FormGroup/FormGroup';

export default function Select(props){

  const {name, onChange, value, children, errorText, hintText} = props;

  const describedbyIds = `${errorText?makeErrorId(name):""} ${hintText?makeHintId(name):""}`.trim();

  return(
    <FormGroup {...props}>
        <select className="govuk-select" id={name} name={name} onChange={onChange} value={value} aria-describedby={describedbyIds}>
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

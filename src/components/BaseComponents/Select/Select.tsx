import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, {makeHintId, makeErrorId} from '../FormGroup/FormGroup';

export default function Select(props){

  const {name, onChange, value, children, errorText, hintText} = props;

  const describedbyIds = `${errorText?makeErrorId(name):""} ${hintText?makeHintId(name):""}`.trim();
  const ariaDescBy = describedbyIds.length !== 0 ? {'aria-describedby' : describedbyIds} : {};

  return(
    <FormGroup {...props}>
        <select className="govuk-select" id={name} name={name} onChange={onChange} value={value} {...ariaDescBy}>
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

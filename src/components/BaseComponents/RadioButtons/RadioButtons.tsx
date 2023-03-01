import React from 'react';
import PropTypes from 'prop-types';
import FieldSet from '../FormGroup/FieldSet';

export default function RadioButtons(props){

  const {name, onChange, value, options} = props;


  return(
    <FieldSet {...props}>
      <div className={`govuk-radios ${options.length === 2 && "govuk-radios--inline"}`} data-module="govuk-radios">
        {options.map( (option, index) => {
          return (
            <div key={`${name}_${option.value}`}className="govuk-radios__item">
              <input className="govuk-radios__input" id={`${name}-${index}`} name={name} type="radio" onChange={onChange} value={option.value} defaultChecked={option.value === value}/>
              <label className="govuk-label govuk-radios__label" htmlFor={`${name}-${index}`}>
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
    </FieldSet>
  )
}

RadioButtons.propTypes = {
  ...FieldSet.propTypes,
  name: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({value:PropTypes.string, label:PropTypes.string})),
}

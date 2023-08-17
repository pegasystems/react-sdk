import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, { makeErrorId, makeHintId } from '../FormGroup/FormGroup';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';

export default function TextInput(props) {
  const { name, errorText, hintText, inputProps = {}, maxLength, id, onBlur, disabled } = props;

  if (disabled) {
    return (
      <>
        {hintText && (
          <div id={makeHintId(name)} className='govuk-hint'>
            <HintTextComponent htmlString={hintText} />
          </div>
        )}
        <span className='govuk-body govuk-!-font-weight-bold'>{inputProps.value}</span><br/>
      </>
    );
  }

  const inputClasses = `govuk-input ${errorText ? 'govuk-input--error' : ''}`.trim();

  const textInputClassesWithWidth = (width: number) => {
    if (width !== undefined || width !== null) {
      if (width >= 6 && width <= 10) return `${inputClasses} govuk-input--width-${10}`.trim();
      else if (width >= 11 && width <= 20) return `${inputClasses} govuk-input--width-${20}`.trim();
      else if (width >= 21) return `${inputClasses}`.trim();
      else return `${inputClasses} govuk-input--width-${width}`.trim();
    } else return inputClasses;
  };

  // TODO - Handle input types (password, email, numeric) - Or investigate if these should be separate components, or can simple be handled by inputProps
  // TODO - Handle autocomplete settings

  const describedByIDs = `${errorText ? makeErrorId(name) : ''} ${
    hintText ? makeHintId(name) : ''
  }`.trim();
  if(describedByIDs.length !== 0){
    inputProps['aria-describedby'] = describedByIDs;
  }

  return (
    <FormGroup {...props}>
      <input
        className={textInputClassesWithWidth(maxLength)}
        {...inputProps}
        id={id}
        name={name}
        onBlur={onBlur}
      ></input>
    </FormGroup>
  );
}

TextInput.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  maxLength: PropTypes.number,
  inputProps: PropTypes.object,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func
};

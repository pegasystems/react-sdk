import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, {makeErrorId, makeHintId} from '../FormGroup/FormGroup';
import FieldSet from '../FormGroup/FieldSet'

export default function DateInput(props){

  const {name, errorText, hintText, onChangeDay, onChangeMonth, onChangeYear, inputProps={}} = props;

  const inputClasses = `govuk-input ${errorText?'govuk-input--error':""} ${inputProps.className}`.trim();

  // NOTE - Calculating outside of JSX incase of future translation requirements
  const dayLabel = "Day";
  const monthLabel = "Month";
  const yearLabel = "Year"

  // TODO - Handle input widths
  // TODO - Handle input types (password, email, numeric) - Or investigate if these should be separate components, or can simple be handled by inputProps
  // TODO - Handle autocomplete settings

  inputProps["aria-describedby"] = `${errorText?makeErrorId(name):""} ${hintText?makeHintId(name):""}`.trim();

  return(
    <FieldSet {...props}>
      <div className="govuk-date-input" id={name}>
        <div className="govuk-date-input__item">
          <FormGroup {...props} label={dayLabel} labelIsHeading={false}>
            <input className="govuk-input govuk-date-input__input govuk-input--width-2" id={`${name}-day`} name={`${name}-day`} type="text" inputMode="numeric"></input>
          </FormGroup>
        </div>
        <div className="govuk-date-input__item">
          <FormGroup {...props} label={monthLabel} labelIsHeading={false}>
            <input className="govuk-input govuk-date-input__input govuk-input--width-2" id={`${name}-month`} name={`${name}-month`} type="text" inputMode="numeric"></input>
          </FormGroup>
        </div>
        <div className="govuk-date-input__item">
          <FormGroup {...props} label={yearLabel} labelIsHeading={false}></FormGroup>
          <input className="govuk-input govuk-date-input__input govuk-input--width-4" id={`${name}-year`} name={`${name}-year`} type="text" inputMode="numeric"></input>
        </div>
      </div>
    </FieldSet>
    )
}

DateInput.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  inputProps: PropTypes.object,
  onChangeDay: PropTypes.func,
  onChangeMonth: PropTypes.func,
  onChangeYear: PropTypes.func,
}

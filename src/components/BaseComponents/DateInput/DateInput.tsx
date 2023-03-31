import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, {makeErrorId, makeHintId} from '../FormGroup/FormGroup';
import FieldSet from '../FormGroup/FieldSet'

export default function DateInput(props){

  const {name, errorText, hintText, value ,onChangeDay, onChangeMonth, onChangeYear, inputProps={}} = props;

  const inputClasses = `govuk-input ${errorText?'govuk-input--error':""} ${inputProps.className}`.trim();
  const dateInputClassesWithWidth = (width: number) => {
    return `${inputClasses} govuk-input--width-${width}`.trim();
  }

  // NOTE - Calculating outside of JSX incase of future translation requirements
  const dayLabel = "Day";
  const monthLabel = "Month";
  const yearLabel = "Year"

  // TODO - Handle Autocomplete settings (if always required)
  // TODO - Investigate if possible to set error class per input depending on error message (e.g. if only year is missing, only error style year input)

  inputProps["aria-describedby"] = `${errorText?makeErrorId(name):""} ${hintText?makeHintId(name):""}`.trim();

  return(
    <FieldSet {...props} fieldsetElementProps={{role:"group"}} >
      <div className="govuk-date-input" id={name}>
        <div className="govuk-date-input__item">
          <FormGroup name={`${name}-day`} label={dayLabel} labelIsHeading={false} extraLabelClasses="govuk-date-input__label">
            <input className={dateInputClassesWithWidth(2)}
              id={`${name}-day`} name={`${name}-day`} type="text"
              inputMode="numeric" value={value?.day}
              onChange={onChangeDay} />
          </FormGroup>
        </div>
        <div className="govuk-date-input__item">
          <FormGroup name={`${name}-month`} label={monthLabel} labelIsHeading={false} extraLabelClasses="govuk-date-input__label">
            <input className={dateInputClassesWithWidth(2)}
              id={`${name}-month`} name={`${name}-month`} type="text"
              inputMode="numeric" value={value?.month}
              onChange={onChangeMonth}
            />
          </FormGroup>
        </div>
        <div className="govuk-date-input__item">
          <FormGroup name={`${name}-year`} label={yearLabel} labelIsHeading={false} extraLabelClasses="govuk-date-input__label"></FormGroup>
          <input className={dateInputClassesWithWidth(4)}
            id={`${name}-year`} name={`${name}-year`} type="text"
            inputMode="numeric" value={value?.year}
            onChange={onChangeYear}
          />
        </div>
      </div>
    </FieldSet>
    )
}

DateInput.propTypes = {
  ...FieldSet.propTypes,
  name: PropTypes.string,
  inputProps: PropTypes.object,
  onChangeDay: PropTypes.func,
  onChangeMonth: PropTypes.func,
  onChangeYear: PropTypes.func,
  value: PropTypes.shape({day:PropTypes.string, month:PropTypes.string, year:PropTypes.string})
}

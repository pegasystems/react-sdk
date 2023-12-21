import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FormGroup, { makeErrorId, makeHintId } from '../FormGroup/FormGroup';
import FieldSet from '../FormGroup/FieldSet';

export default function DateInput(props) {
  const {
    name,
    errorText,
    hintText,
    value,
    onChangeDay,
    onChangeMonth,
    onChangeYear,
    testId,
    inputProps = {},
    autoComplete
  } = props;
  let { errorProps } = props;
  const { t } = useTranslation();

  if (!errorProps) {
    errorProps = {};
    if (!errorProps.specificError) {
      errorProps.specificError = { day: true, month: true, year: true };
    }
  }

  const inputClasses = `govuk-input ${inputProps.className ? inputProps.className : ''}`.trim();
  const widthClass = (width: number) => {
    return `govuk-input--width-${width}`;
  };

  const errorClass = (targetOfError: boolean) => {
    if (errorText) {
      return `${targetOfError ? 'govuk-input--error' : null}`;
    }
  };

  // NOTE - Calculating outside of JSX incase of future translation requirements
  const dayLabel = t('Day');
  const monthLabel = t('Month');
  const yearLabel = t('Year');

  // TODO - Investigate if possible to set error class per input depending on error message (e.g. if only year is missing, only error style year input)

  const describedbyIds = `${hintText ? makeHintId(name) : ''} ${
    errorText ? makeErrorId(name) : ''
  }`.trim();
  if (describedbyIds.length !== 0) {
    inputProps['aria-describedby'] = describedbyIds;
  }

  let acDay = '';
  let acMonth = '';
  let acYear = '';
  if (autoComplete === 'bday') {
    acDay = 'bday-day';
    acMonth = 'bday-month';
    acYear = 'bday-year';
  }

  const extraProps = { testProps: { 'data-test-id': testId } };

  return (
    <FieldSet {...props} fieldsetElementProps={{ role: 'group' }} {...extraProps}>
      <div className='govuk-date-input' id={name}>
        <div className='govuk-date-input__item'>
          <FormGroup
            name={`${name}-day`}
            label={dayLabel}
            labelIsHeading={false}
            extraLabelClasses='govuk-date-input__label'
          >
            <input
              className={[
                inputClasses,
                widthClass(2),
                errorClass(errorProps?.specificError?.day)
              ].join(' ')}
              id={`${name}-day`}
              name={`${name}-day`}
              type='text'
              inputMode='numeric'
              value={value?.day}
              onChange={onChangeDay}
              autoComplete={acDay || undefined}
            />
          </FormGroup>
        </div>
        <div className='govuk-date-input__item'>
          <FormGroup
            name={`${name}-month`}
            label={monthLabel}
            labelIsHeading={false}
            extraLabelClasses='govuk-date-input__label'
          >
            <input
              className={[
                inputClasses,
                widthClass(2),
                errorClass(errorProps?.specificError?.month)
              ].join(' ')}
              id={`${name}-month`}
              name={`${name}-month`}
              type='text'
              inputMode='numeric'
              value={value?.month}
              onChange={onChangeMonth}
              autoComplete={acMonth || undefined}
            />
          </FormGroup>
        </div>
        <div className='govuk-date-input__item'>
          <FormGroup
            name={`${name}-year`}
            label={yearLabel}
            labelIsHeading={false}
            extraLabelClasses='govuk-date-input__label'
          >
            <input
              className={[
                inputClasses,
                widthClass(4),
                errorClass(errorProps?.specificError?.year)
              ].join(' ')}
              id={`${name}-year`}
              name={`${name}-year`}
              type='text'
              inputMode='numeric'
              value={value?.year}
              onChange={onChangeYear}
              autoComplete={acYear || undefined}
            />
          </FormGroup>
        </div>
      </div>
    </FieldSet>
  );
}

DateInput.propTypes = {
  ...FieldSet.propTypes,
  name: PropTypes.string,
  inputProps: PropTypes.object,
  onChangeDay: PropTypes.func,
  onChangeMonth: PropTypes.func,
  onChangeYear: PropTypes.func,
  value: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string
  }),
  errorProps: PropTypes.shape({
    specificError: PropTypes.shape({
      day: PropTypes.bool,
      month: PropTypes.bool,
      year: PropTypes.bool
    })
  })
};

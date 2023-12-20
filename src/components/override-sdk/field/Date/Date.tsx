import React, { useState, useLayoutEffect, useEffect } from 'react';
import DateInput from '../../../BaseComponents/DateInput/DateInput';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import {
  DateErrorFormatter,
  DateErrorTargetFields
} from '../../../helpers/formatters/DateErrorFormatter';
import { GBdate } from '../../../helpers/utils';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';

declare const global;

export default function Date(props) {
  const {
    getPConnect,
    value = '',
    validatemessage,
    helperText,
    readOnly,
    name,
    testId,
    configAlternateDesignSystem
  } = props;
  const pConn = getPConnect();

  let label = props.label;
  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  // PM - Set up state for each input field, either the value we received from pega, or emtpy
  const [day, setDay] = useState(value ? value.split('-')[2] : '');
  const [month, setMonth] = useState(value ? value.split('-')[1] : '');
  const [year, setYear] = useState(value ? value.split('-')[0] : '');
  const [editedValidateMessage, setEditedValidateMessage] = useState(
    DateErrorFormatter(
      validatemessage,
      getPConnect().resolveConfigProps(getPConnect().getMetadata().config).label
    )
  );
  const [specificErrors, setSpecificErrors] = useState<any>(null);

  const actionsApi = getPConnect().getActionsApi();
  const propName = getPConnect().getStateProps().value;
  // PM - Create ISODate string (as expected by onChange) and pass to onchange value, adding 0 padding here for day and month to comply with isostring format.
  const handleDateChange = () => {
    let isoDate;
    if (year || month || day) {
      const trimMonth = month.replace(/\s/g, '');
      const trimDay = day.replace(/\s/g, '');
      isoDate = `${year.replace(/\s/g, '')}-${
        trimMonth.toString().length === 1 ? `0${trimMonth}` : trimMonth
      }-${trimDay.toString().length === 1 ? `0${trimDay}` : trimDay}`;
    } else {
      isoDate = '';
    }
    if (isoDate !== value) {
      // Using handle event instead of onChange to workaround client side validation issue (BUG-6202)
      handleEvent(actionsApi, 'change', propName, isoDate);
    }
  };

  // PM - On change of any of the date fields, call handleDateChange
  useLayoutEffect(() => {
    handleDateChange();
  }, [day, month, year]);

  useEffect(() => {
    setEditedValidateMessage(validatemessage);
    const errorTargets = DateErrorTargetFields(validatemessage);
    let specificError: any = null;
    if (errorTargets.length > 0)
      specificError = {
        day: errorTargets.includes('day'),
        month: errorTargets.includes('month'),
        year: errorTargets.includes('year')
      };

    // This sets a state prop to be exposed to the error summary set up in Assisgnment component - and should match the id of the first field of
    //  the date component. Will investigate better way to do this, to avoid mismatches if the Date BaseComponent changes.
    pConn.setStateProps({ fieldId: `${name}-day` });
    if (!specificError?.day) {
      if (specificError?.month) {
        pConn.setStateProps({ fieldId: `${name}-month` });
      } else if (specificError?.year) {
        pConn.setStateProps({ fieldId: `${name}-year` });
      }
    }
    setSpecificErrors(specificError);
  }, [validatemessage]);

  // PM - Handlers for each part of date inputs, update state for each respectively
  //      0 pad for ISOString compatibilitiy, with conditions to allow us to clear the fields

  const handleChangeDay = dayChange => {
    setDay(dayChange.target.value);
  };

  const handleChangeMonth = monthChange => {
    setMonth(monthChange.target.value);
  };

  const handleChangeYear = yearChange => {
    setYear(yearChange.target.value);
  };

  if (props.disabled && value.length > 9) {
    return <span className='govuk-body govuk-!-font-weight-bold'>{GBdate(value)}</span>;
  }

  if (readOnly) {
    return <ReadOnlyDisplay label={label} value={new global.Date(value).toLocaleDateString()} />;
  }

  const extraProps = { testProps: { 'data-test-id': testId } };

  if (configAlternateDesignSystem?.autocomplete) {
    extraProps['autoComplete'] = configAlternateDesignSystem.autocomplete;
  }

  return (
    <DateInput
      label={label}
      legendIsHeading={isOnlyField}
      onChangeDay={handleChangeDay}
      onChangeMonth={handleChangeMonth}
      onChangeYear={handleChangeYear}
      value={{ day, month, year }}
      name={name}
      errorText={editedValidateMessage}
      hintText={helperText}
      errorProps={specificErrors ? { specificError: specificErrors } : null}
      {...extraProps}
    />
  );
}

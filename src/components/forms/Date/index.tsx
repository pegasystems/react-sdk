import React, { useState, useLayoutEffect } from 'react';
import DateInput from '../../BaseComponents/DateInput/DateInput';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';

declare const global;

export default function Date(props) {
  const { getPConnect, label, value = '', validatemessage, onChange, helperText, readOnly, name, testId } = props;
  const pConn = getPConnect();

  const isOnlyField = useIsOnlyField();

  // PM - Set up state for each input field, either the value we received from pega, or emtpy
  const [day, setDay] = useState(value ? value.split('-')[2] : '');
  const [month, setMonth] = useState(value ? value.split('-')[1] : '');
  const [year, setYear] = useState(value ? value.split('-')[0] : '');

  // PM - Create ISODate string (as expected by onChange) and pass to onchange value, adding 0 padding here for day and month to comply with isostring format.
  const handleDateChange = () => {
    let isoDate;
    if (year || month || day) {
      isoDate = `${year}-${month.toString().length === 1 ? `0${month}` : month}-${
        day.toString().length === 1 ? `0${day}` : day
      }`;
    } else {
      isoDate = '';
    }
    if (isoDate !== value) {
      onChange({ value: isoDate });
    }
  };

  // PM - On change of any of the date fields, call handleDateChange
  useLayoutEffect(() => {
    handleDateChange();
  }, [day, month, year]);

  if (readOnly) {
    return <ReadOnlyDisplay label={label} value={new global.Date(value).toLocaleDateString()} />;
  }

  // This sets a state prop to be exposed to the error summary set up in Assisgnment component - and should match the id of the first field of
  // the date component. Will investigate better way to do this, to avoid mismatches if the Date BaseComponent changes.
  pConn.setStateProps({fieldId: `${name}-day`});

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

  if(readOnly){
    return <ReadOnlyDisplay label={label} value={new global.Date(value).toLocaleDateString()} />
  }

  const extraProps= {testProps:{'data-test-id':testId}};

  return (
    <DateInput
      label={label}
      legendIsHeading={isOnlyField}
      onChangeDay={handleChangeDay}
      onChangeMonth={handleChangeMonth}
      onChangeYear={handleChangeYear}
      value={{ day, month, year }}
      name={name}
      errorText={validatemessage}
      hintText={helperText}
      {...extraProps}
    />
  );
}

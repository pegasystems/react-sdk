import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Fieldset, Input, Label, HintText, ErrorText, InputField } from 'govuk-react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';

// --- ABSOLUTE IMPORTS ---
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import handleEvent from '@pega/react-sdk-components/lib//components/helpers/event-utils';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';
import { dateFormatInfoDefault, getDateFormatInfo } from '@pega/react-sdk-components/lib/components/helpers/date-format-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// Initialize DayJS plugins
dayjs.extend(utc);
dayjs.extend(timezonePlugin);

// --- STYLED COMPONENTS FOR MANUAL DATE INPUT ---

const DateInputContainer = styled('div')`
  display: flex;
  margin-top: 10px;

  /* Add spacing between date fields */
  & > div {
    margin-right: 20px;
  }
`;

const DateFieldWrapper = styled('div')`
  display: flex;
  flex-direction: column;
`;

// GDS Width Classes Simulation
const DayMonthInput = styled(Input)`
  width: 4ex; /* Approx 2 chars + padding */
  text-align: center;
`;

const YearInput = styled(Input)`
  width: 8ex; /* Approx 4 chars + padding */
  text-align: center;
`;

const TimeInputWrapper = styled('div')`
  margin-top: 20px;
  max-width: 15ex;
`;

interface DateTimeProps extends PConnFieldProps {
  // If any, enter additional props that only exist on DateTime here
}

export default function DateTime(props: DateTimeProps) {
  // Get emitted components from map
  const TextInput = getComponentFromMap('TextInput');
  const FieldValueList = getComponentFromMap('FieldValueList');

  const { getPConnect, label, required, disabled, value = '', validatemessage, status, readOnly, testId, helperText, displayMode, hideLabel } = props;

  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo && environmentInfo.getTimeZone();

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;
  const isError = status === 'error';

  // --- STATE ---
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [time, setTime] = useState(''); // HH:mm format

  // Date Formatting Info
  const dateFormatInfo = dateFormatInfoDefault;
  const theDateFormat = getDateFormatInfo();
  dateFormatInfo.dateFormatString = theDateFormat.dateFormatString;
  dateFormatInfo.dateFormatStringLC = theDateFormat.dateFormatStringLC;
  dateFormatInfo.dateFormatMask = theDateFormat.dateFormatMask;

  // --- EFFECT: Parse Value to State ---
  useEffect(() => {
    if (value) {
      const dt = dayjs(DateFormatter.convertToTimezone(value, { timezone }));
      if (dt.isValid()) {
        setDay(dt.format('D'));
        setMonth(dt.format('M'));
        setYear(dt.format('YYYY'));
        setTime(dt.format('HH:mm'));
      }
    } else {
      setDay('');
      setMonth('');
      setYear('');
      setTime('');
    }
  }, [value, timezone]);

  // --- RENDER MODES ---
  if (displayMode === 'DISPLAY_ONLY') {
    const formattedDateTime = format(props.value, 'datetime', {
      format: `${dateFormatInfo.dateFormatString} hh:mm a`
    });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDateTime} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const formattedDateTime = format(props.value, 'datetime', {
      format: `${dateFormatInfo.dateFormatString} hh:mm a`
    });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDateTime} variant='stacked' />;
  }

  if (readOnly) {
    const formattedDateTime = format(props.value, 'datetime');
    return <TextInput {...props} value={formattedDateTime} />;
  }

  // --- HANDLERS ---
  const handleDateChange = (newDay, newMonth, newYear, newTime) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);
    setTime(newTime);

    if (newDay && newMonth && newYear) {
      const paddedDay = newDay.padStart(2, '0');
      const paddedMonth = newMonth.padStart(2, '0');
      const timeStr = newTime || '00:00';

      const isoString = `${newYear}-${paddedMonth}-${paddedDay}T${timeStr}:00`;
      const timeZoneDateTime = (dayjs as any).tz(isoString, timezone);

      if (timeZoneDateTime.isValid()) {
        handleEvent(actions, 'changeNblur', propName, timeZoneDateTime.toISOString());
      }
    } else if (!newDay && !newMonth && !newYear && !newTime) {
      handleEvent(actions, 'changeNblur', propName, '');
    }
  };

  const testProps: any = { 'data-test-id': testId };

  return (
    <Fieldset>
      {/*
        GDS PATTERN:
        Legend (Label) -> Hint -> Error -> Fields
      */}
      <Fieldset.Legend size='S' mb={2}>
        {!hideLabel ? label : null}
      </Fieldset.Legend>

      {!isError && helperText && <HintText>{helperText}</HintText>}
      {isError && <ErrorText>{helperTextToDisplay}</ErrorText>}

      <DateInputContainer>
        {/* DAY */}
        <DateFieldWrapper>
          <Label error={isError}>Day</Label>
          <DayMonthInput
            error={isError}
            value={day}
            onChange={e => handleDateChange(e.target.value, month, year, time)}
            type='number'
            pattern='[0-9]*'
            maxLength={2}
            disabled={disabled}
            {...testProps}
          />
        </DateFieldWrapper>

        {/* MONTH */}
        <DateFieldWrapper>
          <Label error={isError}>Month</Label>
          <DayMonthInput
            error={isError}
            value={month}
            onChange={e => handleDateChange(day, e.target.value, year, time)}
            type='number'
            pattern='[0-9]*'
            maxLength={2}
            disabled={disabled}
          />
        </DateFieldWrapper>

        {/* YEAR */}
        <DateFieldWrapper>
          <Label error={isError}>Year</Label>
          <YearInput
            error={isError}
            value={year}
            onChange={e => handleDateChange(day, month, e.target.value, time)}
            type='number'
            pattern='[0-9]*'
            maxLength={4}
            disabled={disabled}
          />
        </DateFieldWrapper>
      </DateInputContainer>

      {/* TIME INPUT */}
      <TimeInputWrapper>
        <InputField
          input={{
            type: 'time',
            name: `${propName}-time`,
            value: time,
            onChange: e => handleDateChange(day, month, year, e.target.value),
            disabled,
            required
          }}
          hint='Time (e.g. 09:30)'
        >
          Time
        </InputField>
      </TimeInputWrapper>
    </Fieldset>
  );
}

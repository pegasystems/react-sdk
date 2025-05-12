import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';
import { dateFormatInfoDefault, getDateFormatInfo } from '@pega/react-sdk-components/lib/components/helpers/date-format-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import './Date.css';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

// Will return the date string in YYYY-MM-DD format which we'll be POSTing to the server
function getFormattedDate(date) {
  return `${date.$y.toString()}-${(date.$M + 1).toString().padStart(2, '0')}-${date.$D.toString().padStart(2, '0')}`;
}

interface DateProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Date here
}

export default function Date(props: DateProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const TextInput = getComponentFromMap('TextInput');
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect,
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    onChange,
    onBlur,
    readOnly,
    testId,
    helperText,
    displayMode,
    hideLabel
  } = props;

  const [dateValue, setDateValue] = useState<Dayjs | null>(value ? dayjs(value) : null);

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;

  // Start with default dateFormatInfo
  const dateFormatInfo = dateFormatInfoDefault;
  // and then update, as needed, based on locale, etc.
  const theDateFormat = getDateFormatInfo();
  dateFormatInfo.dateFormatString = theDateFormat.dateFormatString;
  dateFormatInfo.dateFormatStringLC = theDateFormat.dateFormatStringLC;
  dateFormatInfo.dateFormatMask = theDateFormat.dateFormatMask;

  if (displayMode === 'LABELS_LEFT') {
    const formattedDate = format(props.value, 'date', {
      format: dateFormatInfo.dateFormatString
    });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDate} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const formattedDate = format(props.value, 'date', {
      format: dateFormatInfo.dateFormatString
    });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDate} variant='stacked' />;
  }

  if (readOnly) {
    // const theReadOnlyComp = <TextInput props />
    return <TextInput {...props} />;
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  const handleChange = date => {
    if (date && date.isValid()) {
      onChange({ value: getFormattedDate(date) });
    }
  };

  const handleAccept = date => {
    if (date && date.isValid()) {
      setDateValue(date);
      handleEvent(actions, 'changeNblur', propName, getFormattedDate(date));
    }
  };

  return (
    <DatePicker
      label={label}
      disabled={disabled}
      format={dateFormatInfo.dateFormatString}
      value={dateValue}
      slotProps={{
        textField: {
          required,
          variant: 'outlined',
          placeholder: dateFormatInfo.dateFormatStringLC,
          error: status === 'error',
          helperText: helperTextToDisplay,
          size: 'small',
          InputProps: { ...testProp }
        }
      }}
      onChange={handleChange}
    />
  );
}

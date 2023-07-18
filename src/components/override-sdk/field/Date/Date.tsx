import React from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import TextInput from '@pega/react-sdk-components/lib/components/field/TextInput';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import FieldValueList from '@pega/react-sdk-components/lib/components/designSystemExtension/FieldValueList';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters/';
import { dateFormatInfoDefault, getDateFormatInfo} from '@pega/react-sdk-components/lib/components/helpers/date-format-utils';

export default function Date(props) {
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

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const helperTextToDisplay = validatemessage || helperText;

  // Start with default dateFormatInfo
  const dateFormatInfo = dateFormatInfoDefault;
  // and then update, as needed, based on locale, etc.
  const theDateFormat = getDateFormatInfo()
  dateFormatInfo.dateFormatString = theDateFormat.dateFormatString;
  dateFormatInfo.dateFormatStringLC = theDateFormat.dateFormatStringLC;
  dateFormatInfo.dateFormatMask = theDateFormat.dateFormatMask;


  if (displayMode === 'LABELS_LEFT') {
    const formattedDate = format(props.value, 'date', { format: dateFormatInfo.dateFormatString });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDate} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const formattedDate = format(props.value, 'date', { format: dateFormatInfo.dateFormatString });
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
    const changeValue = date && date.isValid() ? date.toISOString() : null;
    onChange({ value: changeValue });
  };

  const handleAccept = date => {
    const changeValue = date && date.isValid() ? date.toISOString() : null;
    handleEvent(actions, 'changeNblur', propName, changeValue);
  };

  return (
    <KeyboardDatePicker
      disableToolbar
      variant='inline'
      inputVariant='outlined'
      placeholder={dateFormatInfo.dateFormatStringLC}
      format={dateFormatInfo.dateFormatString}
      mask={dateFormatInfo.dateFormatMask}
      fullWidth
      autoOk
      required={required}
      disabled={disabled}
      error={status === 'error'}
      helperText={helperTextToDisplay}
      size='small'
      label={label}
      value={value || null}
      onChange={handleChange}
      onBlur={!readOnly ? onBlur : undefined}
      onAccept={handleAccept}
      InputProps={{ ...testProp }}
    />
  );
}

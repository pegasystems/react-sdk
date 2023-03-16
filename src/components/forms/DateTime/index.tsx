import React from 'react';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import TextInput from '../TextInput';
import handleEvent from '../../../helpers/event-utils';
import FieldValueList from '../../designSystemExtensions/FieldValueList';
import { format } from '../../../helpers/formatters/';
import { dateFormatInfoDefault, getDateFormatInfo} from '../../../helpers/date-format-utils';

export default function DateTime(props) {
  const {
    getPConnect,
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    onChange,
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
    const formattedDate = format(props.value, 'datetime', { format: `${dateFormatInfo.dateFormatString} hh:mm a` });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDate} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  if (readOnly) {
    const formattedDate = format(props.value, 'datetime');
    props.value = formattedDate;
    return <TextInput {...props} />;
  }

  const handleChange = date => {
    const changeValue = date && date.isValid() ? date.toISOString() : null;
    onChange({ value: changeValue });
  };

  const handleAccept = date => {
    const changeValue = date && date.isValid() ? date.toISOString() : null;
    handleEvent(actions, 'changeNblur', propName, changeValue);
  };

  //
  // TODO: Keyboard doesn't work in the minute field, it updates one digit then jump to am/pm field
  //       try an older version of the lib or use DateTimePicker
  //

  return (
    <KeyboardDateTimePicker
      variant='inline'
      inputVariant='outlined'
      fullWidth
      autoOk
      required={required}
      disabled={disabled}
      placeholder={`${dateFormatInfo.dateFormatStringLC} hh:mm a`}
      format={`${dateFormatInfo.dateFormatString} hh:mm a`}
      mask={`${dateFormatInfo.dateFormatMask} __:__ _m`}
      minutesStep={5}
      error={status === 'error'}
      helperText={helperTextToDisplay}
      size='small'
      label={label}
      value={value || null}
      onChange={handleChange}
      onAccept={handleAccept}
      data-test-id={testId}
    />
  );
}

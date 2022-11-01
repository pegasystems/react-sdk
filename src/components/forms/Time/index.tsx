import React from 'react';
import { KeyboardTimePicker } from '@material-ui/pickers';
import TextInput from '../TextInput';
import dayjs from 'dayjs';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

export default function Time(props) {
  const {
    label,
    required,
    disabled,
    value,
    validatemessage,
    status,
    onChange,
    readOnly,
    helperText,
    displayMode
  } = props;
  const helperTextToDisplay = validatemessage || helperText;

  if(displayMode === 'LABELS_LEFT'){
    const field = {
      [label]: value
    };
    return <FieldValueList item={field}/>
  }

  if (readOnly) {
    return <TextInput {...props} />;
  }

  const handleChange = date => {
    const theValue = date && date.isValid() ? date.format('HH:mm') : null;
    onChange({ theValue });
  };

  let timeValue: any = null;
  if (value) {
    const timeArray = value.split(':').map(itm => Number(itm));
    timeValue = dayjs().hour(timeArray[0]).minute(timeArray[1]);
  }

  //
  // TODO: Keyboard doesn't work in the minute field, it updates one digit then jump to am/pm field
  //       try an older version of the lib or use DateTimePicker
  //

  return (
    <KeyboardTimePicker
      variant='inline'
      inputVariant='outlined'
      placeholder='hh:mm am'
      keyboardIcon={<AccessTimeIcon />}
      fullWidth
      required={required}
      disabled={disabled}
      error={status === 'error'}
      helperText={helperTextToDisplay}
      minutesStep={5}
      size='small'
      label={label}
      autoOk
      mask='__:__ _m'
      format='hh:mm a'
      value={timeValue}
      onChange={handleChange}
    />
  );
}

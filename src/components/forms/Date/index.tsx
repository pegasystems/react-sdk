import React from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import TextInput from '../TextInput';
import handleEvent from '../../../helpers/event-utils';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

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
    displayMode
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const helperTextToDisplay = validatemessage || helperText;

  if(displayMode === 'LABELS_LEFT'){
    const field = {
      [label]: value
    };
    return <FieldValueList item={field}/>
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
      placeholder='mm/dd/yyyy'
      fullWidth
      autoOk
      required={required}
      disabled={disabled}
      format='MM/DD/YYYY'
      mask='__/__/____'
      error={status === 'error'}
      helperText={helperTextToDisplay}
      size='small'
      label={label}
      value={value || null}
      onChange={handleChange}
      onBlur={onBlur}
      onAccept={handleAccept}
      InputProps={{ ...testProp }}
    />
  );
}

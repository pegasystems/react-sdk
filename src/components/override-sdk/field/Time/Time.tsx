import { KeyboardTimePicker } from '@material-ui/pickers';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import dayjs from 'dayjs';

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import './Time.css';

interface TimeProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Time here
}

export default function Time(props: TimeProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const FieldValueList = getComponentFromMap('FieldValueList');
  const TextInput = getComponentFromMap('TextInput');

  const { label, required, disabled, value = '', validatemessage, status, onChange, readOnly, helperText, displayMode, hideLabel, testId } = props;
  const helperTextToDisplay = validatemessage || helperText;

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  if (readOnly) {
    return <TextInput {...props} />;
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  const handleChange = date => {
    const theValue = date && date.isValid() ? date.format('HH:mm') : null;
    onChange({ value: theValue });
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
      className='time'
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
      size='medium'
      label={label}
      autoOk
      mask='__:__ _m'
      format='hh:mm a'
      value={timeValue}
      onChange={handleChange}
      InputProps={{ inputProps: { ...testProp } }}
      InputLabelProps={{
        style: {
          fontSize: '1.5em'
        } as any
      }}
    />
  );
}

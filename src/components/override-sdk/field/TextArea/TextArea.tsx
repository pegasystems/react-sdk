import { useEffect, useState } from 'react';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface TextAreaProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextArea here
  // fieldMetadata?: any;
}

export default function TextArea(props: TextAreaProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect,
    label,
    // required,
    // disabled,
    value = '',
    validatemessage,
    status,
    readOnly,
    // testId,
    // fieldMetadata,
    helperText,
    displayMode,
    hideLabel
    // placeholder
  } = props;
  const helperTextToDisplay = validatemessage || helperText;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  // const maxLength = fieldMetadata?.maxLength;

  const [inputValue, setInputValue] = useState('');

  // let readOnlyProp = {};

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  if (readOnly) {
    // Not just emitting a read only Textfield like some other components do
    //  since we want to preserve the minRows, maxRows info.
    // readOnlyProp = { readOnly: true };
  }

  // let testProp = {};

  // testProp = {
  //   'data-test-id': testId
  // };

  function handleChange(event) {
    // update internal value
    setInputValue(event?.target?.value);
  }

  function handleBlur() {
    handleEvent(actions, 'changeNblur', propName, inputValue);
  }

  return (
    <div className={`govuk-form-group ${status === 'error' ? 'govuk-form-group--error' : ''} `}>
      <h1 className='govuk-label-wrapper'>
        <label className='govuk-label govuk-label--l' htmlFor='more-detail'>
          {label}
        </label>
      </h1>
      <div id='more-detail-hint' className='govuk-hint'>
        Do not include personal or financial information, like your National Insurance number or credit card details
      </div>
      {status === 'error' && (
        <p id='more-detail-error' className='govuk-error-message'>
          <span className='govuk-visually-hidden'>Error:</span> {helperTextToDisplay}
        </p>
      )}
      <textarea
        className={`govuk-textarea ${status === 'error' ? 'govuk-textarea--error' : ''}`}
        id='more-detail'
        name='moreDetail'
        rows={5}
        aria-describedby='more-detail-hint more-detail-error'
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );

  // return (
  //   <TextField
  //     multiline
  //     minRows={5}
  //     maxRows={5}
  //     fullWidth
  //     variant={readOnly ? 'standard' : 'outlined'}
  //     helperText={helperTextToDisplay}
  //     placeholder={placeholder ?? ''}
  //     size='small'
  //     required={required}
  //     disabled={disabled}
  //     onChange={handleChange}
  //     onBlur={!readOnly ? handleBlur : undefined}
  //     error={status === 'error'}
  //     label={label}
  //     value={inputValue}
  //     InputProps={{ ...readOnlyProp, inputProps: { maxLength, ...testProp } }}
  //   />
  // );
}

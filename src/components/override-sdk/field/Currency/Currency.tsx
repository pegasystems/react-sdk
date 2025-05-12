import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';
import { getCurrencyCharacters, getCurrencyOptions } from './currency-utils';
import './Currency.css';

/* Using @unicef/material-ui-currency-textfield component here, since it allows formatting decimal values,
as per the locale.
*/

interface CurrrencyProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Currency here
  currencyISOCode?: string;
  allowDecimals: boolean;
}

export default function Currency(props: CurrrencyProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect,
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    /* onChange, onBlur, */
    readOnly,
    testId,
    helperText,
    displayMode,
    hideLabel,
    currencyISOCode = 'USD',
    placeholder,
    allowDecimals
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;
  const [values, setValues] = useState(value.toString());

  // console.log(`Currency: label: ${label} value: ${value}`);

  const testProp = {
    'data-test-id': testId
  };

  // currencySymbols looks like this: { theCurrencySymbol: '$', theDecimalIndicator: '.', theSeparator: ',' }
  const theSymbols = getCurrencyCharacters(currencyISOCode);
  const theCurrSym = theSymbols.theCurrencySymbol;
  const theCurrDec = theSymbols.theDecimalIndicator;
  const theCurrSep = theSymbols.theDigitGroupSeparator;

  const theCurrencyOptions = getCurrencyOptions(currencyISOCode);
  const formattedValue = format(value, pConn.getComponentName().toLowerCase(), theCurrencyOptions);

  let readOnlyProp = {}; // Note: empty if NOT ReadOnly

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  let currencyProp = {};
  currencyProp = { prefix: theCurrSym, decimalSeparator: theCurrDec, thousandSeparator: theCurrSep };

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={formattedValue} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={formattedValue} variant='stacked' />;
  }

  function currOnBlur(event, inValue) {
    // console.log(`Currency currOnBlur inValue: ${inValue}`);
    handleEvent(actions, 'changeNblur', propName, inValue !== '' ? Number(inValue) : inValue);
  }

  const handleChange = val => {
    setValues(val.value);
  };

  // console.log(`theCurrSym: ${theCurrSym} | theCurrDec: ${theCurrDec} | theCurrSep: ${theCurrSep}`);

  return (
    <NumericFormat
      valueIsNumericString
      label={label}
      helperText={helperTextToDisplay}
      placeholder={placeholder ?? ''}
      required={required}
      disabled={disabled}
      onValueChange={val => {
        handleChange(val);
      }}
      onBlur={!readOnly ? event => currOnBlur(event, event.target.value) : undefined}
      error={status === 'error'}
      name='numberformat'
      value={values}
      {...currencyProp}
      decimalScale={allowDecimals !== false ? 2 : 0}
      fixedDecimalScale={allowDecimals}
      InputProps={{ ...readOnlyProp, inputProps: { ...testProp } }}
      customInput={TextField}
    />
  );
}

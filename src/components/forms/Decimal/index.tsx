import React, { useState, useEffect } from 'react';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import FieldValueList from '../../designSystemExtensions/FieldValueList';
import { getCurrencyCharacters, getCurrencyOptions } from '../Currency/currency-utils';
import handleEvent from '../../../helpers/event-utils';
import { format } from "../../../helpers/formatters";

// Using control from: https://github.com/unicef/material-ui-currency-textfield

export default function Decimal(props) {
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
    helperText,
    displayMode,
    hideLabel,
    currencyISOCode = "USD",
    decimalPrecision = 2,
    showGroupSeparators = true
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const helperTextToDisplay = validatemessage || helperText;

  const [decValue, setDecimalvalue] = useState();
  const [theCurrDec, setCurrDec] = useState(".");
  const [theCurrSep, setCurrSep] = useState(",");

  useEffect(() => {
    const theSymbols = getCurrencyCharacters(currencyISOCode);
    setCurrDec(theSymbols.theDecimalIndicator);
    setCurrSep(theSymbols.theDigitGroupSeparator);
  }, [currencyISOCode]);

  useEffect(() => {
    setDecimalvalue(value.toString());
  }, [value]);

  const theCurrencyOptions = getCurrencyOptions(currencyISOCode);
  const formattedValue = format(value, pConn.getComponentName().toLowerCase(), theCurrencyOptions);

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={formattedValue} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={formattedValue} variant='stacked' />;
  }

  let readOnlyProp = {}; // Note: empty if NOT ReadOnly

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  function decimalOnChange(event) {
    // update internal value
    setDecimalvalue(event?.target?.value);
  }

  function decimalOnBlur(event, inValue) {
    handleEvent(actions, 'changeNblur', propName, inValue !== '' ? Number(inValue) : inValue);
  }

  return (
    <CurrencyTextField
      fullWidth
      variant={readOnly ? 'standard' : 'outlined'}
      helperText={helperTextToDisplay}
      placeholder=''
      size='small'
      required={required}
      disabled={disabled}
      onChange={decimalOnChange}
      onBlur={!readOnly ? decimalOnBlur : undefined}
      error={status === 'error'}
      label={label}
      value={decValue}
      type='text'
      outputFormat='number'
      textAlign='left'
      InputProps={{ ...readOnlyProp, inputProps: { value: decValue } }}
      currencySymbol=''
      decimalCharacter={theCurrDec}
      digitGroupSeparator={showGroupSeparators ? theCurrSep : ''}
      decimalPlaces={decimalPrecision}
    />
  );
}

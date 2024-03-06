// TODO - comment

import React from 'react';
import { TextField } from '@material-ui/core';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import ReadOnlyValue from '../../../BaseComponents/ReadOnlyValue/ReadOnlyValue';

import StyledHmrcOdxGdsTextPresentationWrapper from './styles';

interface HmrcOdxGdsTextPresentationProps extends PConnFieldProps {
  // If any, enter additional props that only exist on this componentName
  fieldMetadata?: any;
  configAlternateDesignSystem;
}

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsTextPresentation(props: HmrcOdxGdsTextPresentationProps) {
  const {
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    onChange,
    onBlur,
    readOnly = true,
    testId,
    fieldMetadata,
    helperText,
    displayMode,
    hideLabel,
    configAlternateDesignSystem
  } = props;
  const helperTextToDisplay = validatemessage || helperText;

  const FieldValueList = getComponentFromMap('FieldValueList');

  const maxLength = fieldMetadata?.maxLength;

  const readOnlyProp = {}; // Note: empty if NOT ReadOnly

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  // if (readOnly) {
  //   readOnlyProp = { readOnly: true };
  // }
  const extraInputProps = { onChange, value };

  if (configAlternateDesignSystem?.GDSPresentationType) {
    // TODO - add logic to determine string manipulation
    extraInputProps['nino'] = configAlternateDesignSystem.nino;
  } else {
    extraInputProps['nino'] = 'off';
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  // Check presentation type - e.g., NINO
  const formatValue = (val: string) => {
    return val
      .toUpperCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s/g, '')
      .replace(/(.{2})/g, '$1 ')
      .trim();
  };

  if (readOnly) {
    return <ReadOnlyValue label={label} value={formatValue(value)} />;
  }

  return (
    <StyledHmrcOdxGdsTextPresentationWrapper>
      <TextField
        fullWidth
        variant={readOnly ? 'standard' : 'outlined'}
        helperText={helperTextToDisplay}
        placeholder=''
        name=''
        size='small'
        required={required}
        disabled={disabled}
        onChange={onChange}
        onBlur={!readOnly ? onBlur : undefined}
        error={status === 'error'}
        label={label}
        value={formatValue(value)}
        InputProps={{ ...readOnlyProp, inputProps: { maxLength, ...testProp } }}
      />
    </StyledHmrcOdxGdsTextPresentationWrapper>
  );
}

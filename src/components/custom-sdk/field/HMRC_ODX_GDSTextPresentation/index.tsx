import React, { useContext } from 'react';
import { TextField } from '@material-ui/core';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyValue from '../../../BaseComponents/ReadOnlyValue/ReadOnlyValue';

import StyledHmrcOdxGdsTextPresentationWrapper from './styles';
import GDSCheckAnswers from '../../../BaseComponents/CheckAnswer';
import { ReadOnlyDefaultFormContext } from '../../../helpers/HMRCAppContext';
import { checkStatus } from '../../../helpers/utils';

interface HmrcOdxGdsTextPresentationProps extends PConnFieldProps {
  stepId: any;
  fieldMetadata?: any;
  configAlternateDesignSystem;
  displayOrder?: any;
  name?: any;
}

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsTextPresentation(props: HmrcOdxGdsTextPresentationProps) {
  const {
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    onChange,
    onBlur,
    readOnly = true,
    testId,
    name,
    fieldMetadata,
    helperText,
    getPConnect,
    configAlternateDesignSystem
  } = props;
  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);
  const helperTextToDisplay = validatemessage || helperText;

  const maxLength = fieldMetadata?.maxLength;

  const readOnlyProp = {};

  const extraInputProps = { onChange, value };

  if (configAlternateDesignSystem?.GDSPresentationType) {
    extraInputProps['nino'] = configAlternateDesignSystem.nino;
  } else {
    extraInputProps['nino'] = 'off';
  }

  let label = props.label;
  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  let testProp = {};
  testProp = {
    'data-test-id': testId
  };

  const formatValue = (val: string) => {
    return val
      .toUpperCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s/g, '')
      .replace(/(.{2})/g, '$1 ')
      .trim();
  };
  const inprogressStatus = checkStatus();
  if (hasBeenWrapped && props.stepId && inprogressStatus === 'Open-InProgress') {
    return (
      <GDSCheckAnswers
        label={label}
        value={formatValue(value)}
        name={name}
        stepId={props.stepId}
        getPConnect={getPConnect}
        required={false}
        disabled={false}
        validatemessage=''
        onChange={undefined}
        readOnly={false}
        testId=''
        helperText=''
        hideLabel={false}
      />
    );
  }

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

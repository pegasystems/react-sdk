import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NumericFormat } from 'react-number-format';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import { getCurrencyCharacters, getCurrencyOptions } from '@pega/react-sdk-components/lib/components/field/Currency/currency-utils';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';

// ---------------------------------------------------------------------------
// Northwestern Mutual "Luna" design tokens
// ---------------------------------------------------------------------------
const NM = {
  border: '#5c697f',
  borderHover: '#1f2d46',
  focusBlue: '#2d4dc5',
  errorRed: '#c93939',
  errorRedDark: '#b52828',
  placeholder: '#9ba7bc',
  labelColor: '#5c697f',
  textColor: '#1f2d46',
  surface: '#fffffe',
  helperText: '#5c697f',
  disabledOpacity: '0.5',
  fontFamily: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif",
  fontSize: '1rem',
  labelFontSize: '0.875rem',
  helperFontSize: '0.75rem',
  transitionSpeed: '0.2s'
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  font-family: ${NM.fontFamily};
`;

const Label = styled.label<{ $required?: boolean; $hasError?: boolean }>`
  font-size: ${NM.labelFontSize};
  font-weight: 500;
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.labelColor)};
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
  ${({ $required }) => $required && `&::after { content: ' *'; color: ${NM.errorRed}; }`}
`;

const StyledInput = styled.input<{ $hasError?: boolean; $readOnly?: boolean }>`
  width: 100%;
  font-family: ${NM.fontFamily};
  font-size: ${NM.fontSize};
  color: ${NM.textColor};
  background-color: ${NM.surface};
  border: 1px solid ${({ $hasError }) => ($hasError ? 'transparent' : NM.border)};
  border-bottom: ${({ $hasError }) => ($hasError ? `2px solid ${NM.errorRed}` : `1px solid ${NM.border}`)}
  border-radius: ${({ $hasError }) => ($hasError ? '0' : '4px')};
  padding: 0.625rem 0.75rem;
  outline: none;
  transition:
    border-color ${NM.transitionSpeed} ease,
    border-bottom-color ${NM.transitionSpeed} ease,
    box-shadow ${NM.transitionSpeed} ease;
  &::placeholder { color: ${NM.placeholder}; opacity: 1; }
  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) => ($hasError ? 'transparent' : NM.borderHover)};
    border-bottom-color: ${({ $hasError }) => ($hasError ? NM.errorRedDark : NM.borderHover)};
  }
  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? 'transparent' : NM.focusBlue)};
    border-bottom-color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.focusBlue)};
    box-shadow: 0 1px 0 0 ${({ $hasError }) => ($hasError ? NM.errorRed : NM.focusBlue)};
  }
  &:disabled { opacity: ${NM.disabledOpacity}; cursor: not-allowed; }
  ${({ $readOnly }) => $readOnly && `background-color: transparent; border: none; border-bottom: 1px dashed ${NM.border}; border-radius: 0; cursor: default;`}
`;

const HelperText = styled.span<{ $hasError?: boolean }>`
  font-size: ${NM.helperFontSize};
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.helperText)};
  margin-top: 0.25rem;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  ${({ $hasError }) => $hasError && `&::before { content: '⚠'; }`}
`;

// forwardRef wrapper so NumericFormat can use our styled input as customInput
const NMInputForNumeric = React.forwardRef<HTMLInputElement, any>((props, ref) => <StyledInput ref={ref} {...props} />);

/* Using react-number-format component here, since it allows formatting decimal values,
as per the locale.
*/
interface PercentageProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Percentage here
  currencyISOCode?: string;
  showGroupSeparators?: string;
  decimalPrecision?: number;
}

export default function Percentage(props: PercentageProps) {
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect,
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    readOnly,
    currencyISOCode = 'USD',
    testId,
    helperText,
    displayMode,
    hideLabel,
    placeholder,
    showGroupSeparators,
    decimalPrecision
  } = props;

  const [values, setValues] = useState(value.toString());

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;
  const hasError = status === 'error';

  const theCurrencyOptions = getCurrencyOptions(currencyISOCode);
  const formattedValue = format(value, pConn.getComponentName()?.toLowerCase(), theCurrencyOptions);
  const theSymbols = getCurrencyCharacters(currencyISOCode);
  const theCurrDec = theSymbols.theDecimalIndicator;
  const theCurrSep = theSymbols.theDigitGroupSeparator;

  useEffect(() => {
    setValues(value.toString());
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') return <FieldValueList name={hideLabel ? '' : label} value={formattedValue} />;
  if (displayMode === 'STACKED_LARGE_VAL') return <FieldValueList name={hideLabel ? '' : label} value={formattedValue} variant='stacked' />;

  function percentageOnBlur() {
    handleEvent(actions, 'changeNblur', propName, values);
  }
  const handleChange = val => {
    setValues(val.value);
  };

  const inputId = `nm-percentage-${testId ?? propName ?? label}`;

  return (
    <Wrapper>
      {!hideLabel && label && (
        <Label htmlFor={inputId} $required={required} $hasError={hasError}>
          {label}
        </Label>
      )}
      <NumericFormat
        id={inputId}
        customInput={NMInputForNumeric}
        valueIsNumericString
        value={values}
        placeholder={placeholder ?? ''}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        decimalSeparator={theCurrDec}
        thousandSeparator={showGroupSeparators ? theCurrSep : ''}
        decimalScale={decimalPrecision}
        suffix='%'
        onValueChange={val => handleChange(val)}
        onBlur={!readOnly ? percentageOnBlur : undefined}
        data-test-id={testId}
        aria-invalid={hasError}
        aria-describedby={helperTextToDisplay ? `${inputId}-helper` : undefined}
        $hasError={hasError}
        $readOnly={readOnly}
      />
      {helperTextToDisplay && (
        <HelperText id={`${inputId}-helper`} $hasError={hasError} role={hasError ? 'alert' : undefined}>
          {helperTextToDisplay}
        </HelperText>
      )}
    </Wrapper>
  );
}

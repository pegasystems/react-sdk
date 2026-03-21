import styled from 'styled-components';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
`;

const StyledInput = styled.input<{ $hasError?: boolean; $readOnly?: boolean }>`
  width: 100%;
  font-family: ${NM.fontFamily};
  font-size: ${NM.fontSize};
  color: ${NM.textColor};
  background-color: ${NM.surface};
  border: 1px solid ${({ $hasError }) => ($hasError ? 'transparent' : NM.border)};
  border-bottom: ${({ $hasError }) => ($hasError ? `2px solid ${NM.errorRed}` : `1px solid ${NM.border}`)};
  border-radius: ${({ $hasError }) => ($hasError ? '0' : '4px')};
  padding: 0.625rem 0.75rem;
  outline: none;
  transition:
    border-color ${NM.transitionSpeed} ease,
    border-bottom-color ${NM.transitionSpeed} ease,
    box-shadow ${NM.transitionSpeed} ease;
  &::placeholder {
    color: ${NM.placeholder};
    opacity: 1;
  }
  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) => ($hasError ? 'transparent' : NM.borderHover)};
    border-bottom-color: ${({ $hasError }) => ($hasError ? NM.errorRedDark : NM.borderHover)};
  }
  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? 'transparent' : NM.focusBlue)};
    border-bottom-color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.focusBlue)};
    box-shadow: 0 1px 0 0 ${({ $hasError }) => ($hasError ? NM.errorRed : NM.focusBlue)};
  }
  &:disabled {
    opacity: ${NM.disabledOpacity};
    cursor: not-allowed;
  }
  ${({ $readOnly }) =>
    $readOnly && `background-color: transparent; border: none; border-bottom: 1px dashed ${NM.border}; border-radius: 0; cursor: default;`}
  /* hide native time picker icon on webkit/blink */
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    width: 2.5rem;
    height: 100%;
    cursor: pointer;
  }
`;

const ClockIconButton = styled.span<{ $disabled?: boolean }>`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  pointer-events: none;
  opacity: ${({ $disabled }) => ($disabled ? NM.disabledOpacity : '1')};
  color: ${NM.labelColor};
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

// Clock SVG icon
const ClockIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <circle cx='12' cy='12' r='10' />
    <polyline points='12 6 12 12 16 14' />
  </svg>
);

interface TimeProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Time here
}

export default function Time(props: TimeProps) {
  const FieldValueList = getComponentFromMap('FieldValueList');
  const TextInput = getComponentFromMap('TextInput');

  const { getPConnect, label, required, disabled, value = '', validatemessage, status, readOnly, helperText, displayMode, hideLabel, testId } = props;
  const helperTextToDisplay = validatemessage || helperText;
  const hasError = status === 'error';
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;

  if (displayMode === 'DISPLAY_ONLY') return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  if (displayMode === 'STACKED_LARGE_VAL') return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  if (readOnly) return <TextInput {...props} />;

  // Server stores HH:mm:ss, <input type="time"> uses HH:mm
  const inputValue = value && value.includes(':') ? value.substring(0, 5) : '';

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const timeVal = event.target.value; // 'HH:mm' or ''
    const serverVal = timeVal ? `${timeVal}:00` : '';
    handleEvent(actions, 'changeNblur', propName, serverVal);
  }

  const inputId = `nm-time-${testId ?? propName ?? label}`;

  return (
    <Wrapper>
      {!hideLabel && label && (
        <Label htmlFor={inputId} $required={required} $hasError={hasError}>
          {label}
        </Label>
      )}
      <InputWrapper>
        <StyledInput
          id={inputId}
          type='time'
          step={300}
          value={inputValue}
          required={required}
          disabled={disabled}
          $hasError={hasError}
          onChange={handleChange}
          data-test-id={testId}
          aria-invalid={hasError}
          aria-describedby={helperTextToDisplay ? `${inputId}-helper` : undefined}
        />
        <ClockIconButton $disabled={disabled}>
          <ClockIcon />
        </ClockIconButton>
      </InputWrapper>
      {helperTextToDisplay && (
        <HelperText id={`${inputId}-helper`} $hasError={hasError} role={hasError ? 'alert' : undefined}>
          {helperTextToDisplay}
        </HelperText>
      )}
    </Wrapper>
  );
}

interface TimeProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Time here
}

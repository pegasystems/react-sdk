import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import dayjs, { Dayjs } from 'dayjs';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';
import { dateFormatInfoDefault, getDateFormatInfo } from '@pega/react-sdk-components/lib/components/helpers/date-format-utils';
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
  iconColor: '#78869b',
  surface: '#fffffe',
  helperText: '#5c697f',
  disabledOpacity: '0.5',
  fontFamily: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif",
  fontSize: '1rem',
  labelFontSize: '0.875rem',
  helperFontSize: '0.75rem',
  transitionSpeed: '0.2s',
};

// Luna calendar icon (encoded SVG, steel grey fill to match icon style)
const CALENDAR_ICON = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8h16V5h-2v2h-2V5H8v2H6V5H4v3Zm0 2v8.154c0 .917.043 1.142.164 1.368.075.14.174.239.314.314.226.12.45.164 1.368.164h12.308c.917 0 1.142-.043 1.368-.164a.727.727 0 0 0 .314-.314c.12-.226.164-.45.164-1.368V10H4Zm14-7h4v15.154c0 1.337-.14 1.822-.4 2.311a2.726 2.726 0 0 1-1.135 1.134c-.489.262-.974.401-2.31.401H5.844c-1.336 0-1.821-.14-2.31-.4A2.726 2.726 0 0 1 2.4 20.464c-.262-.489-.401-.974-.401-2.31V3h4V1h2v2h8V1h2v2ZM7 11.6a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm0 4.1a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm5-4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm0 4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm5-4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z' fill-rule='nonzero' fill='%2378869b'/%3E%3C/svg%3E")`;

// --- Styled primitives -------------------------------------------------------

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: ${NM.fontFamily};
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Label = styled.label<{ $required?: boolean; $hasError?: boolean }>`
  font-size: ${NM.labelFontSize};
  font-weight: 500;
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.labelColor)};
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;

  ${({ $required }) =>
    $required &&
    `
    &::after {
      content: ' *';
      color: ${NM.errorRed};
    }
  `}
`;

// Luna form_control-date_picker pattern: native input with calendar icon,
// bottom-border only, animated focus underline
const StyledInput = styled.input<{ $hasError?: boolean; $readOnly?: boolean }>`
  width: 100%;
  font-family: ${NM.fontFamily};
  font-size: ${NM.fontSize};
  color: ${NM.textColor};
  background-color: ${NM.surface};
  border: 1px solid ${({ $hasError }) => ($hasError ? 'transparent' : NM.border)};
  border-bottom: ${({ $hasError }) => ($hasError ? `2px solid ${NM.errorRed}` : `1px solid ${NM.border}`)};
  border-radius: ${({ $hasError }) => ($hasError ? '0' : '4px')};
  padding: 0.625rem 2.5rem 0.625rem 0.75rem;
  outline: none;
  /* Luna calendar icon on right */
  background-image: ${CALENDAR_ICON};
  background-repeat: no-repeat;
  background-size: 1rem;
  background-position: right 0.75rem center;
  transition:
    border-color ${NM.transitionSpeed} ease,
    border-bottom-color ${NM.transitionSpeed} ease,
    box-shadow ${NM.transitionSpeed} ease;

  /* Hide the native browser calendar icon so our SVG shows */
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-clear-button {
    display: none;
  }

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
    $readOnly &&
    `
    background-image: none;
    border: none;
    border-bottom: 1px dashed ${NM.border};
    border-radius: 0;
    cursor: default;
    padding-right: 0.75rem;
  `}
`;

const CalendarButton = styled.button<{ $disabled?: boolean }>`
  position: absolute;
  top: 50%;
  right: 0.375rem;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border: 0;
  background: transparent;
  border-radius: 4px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? NM.disabledOpacity : '1')};

  &::before {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    margin: 0 auto;
    background-image: ${CALENDAR_ICON};
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  &:focus-visible {
    outline: 2px solid ${NM.focusBlue};
    outline-offset: 1px;
  }
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

// ---------------------------------------------------------------------------

interface DateTimeProps extends PConnFieldProps {
  // If any, enter additional props that only exist on DateTime here
}

export default function DateTime(props: DateTimeProps) {
  const TextInput = getComponentFromMap('TextInput');
  const FieldValueList = getComponentFromMap('FieldValueList');

  const { getPConnect, label, required, disabled, value = '', validatemessage, status, readOnly, testId, helperText, displayMode, hideLabel } = props;

  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo && environmentInfo.getTimeZone();

  const [dateValue, setDateValue] = useState<Dayjs | null>(
    value ? dayjs(DateFormatter.convertToTimezone(value, { timezone })) : null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;
  const hasError = status === 'error';

  // Start with default dateFormatInfo
  const dateFormatInfo = dateFormatInfoDefault;
  // and then update, as needed, based on locale, etc.
  const theDateFormat = getDateFormatInfo();
  dateFormatInfo.dateFormatString = theDateFormat.dateFormatString;
  dateFormatInfo.dateFormatStringLC = theDateFormat.dateFormatStringLC;
  dateFormatInfo.dateFormatMask = theDateFormat.dateFormatMask;

  useEffect(() => {
    setDateValue(dayjs(DateFormatter.convertToTimezone(value, { timezone })));
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    const formattedDateTime = format(props.value, 'datetime', {
      format: `${dateFormatInfo.dateFormatString} hh:mm a`
    });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDateTime} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const formattedDateTime = format(props.value, 'datetime', {
      format: `${dateFormatInfo.dateFormatString} hh:mm a`
    });
    return <FieldValueList name={hideLabel ? '' : label} value={formattedDateTime} variant='stacked' />;
  }

  if (readOnly) {
    const formattedDateTime = format(props.value, 'datetime');
    return <TextInput {...props} value={formattedDateTime} />;
  }

  // datetime-local inputs require YYYY-MM-DDTHH:mm format
  const inputValue = dateValue && dateValue.isValid() ? dateValue.format('YYYY-MM-DDTHH:mm') : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) {
      setDateValue(null);
      handleEvent(actions, 'changeNblur', propName, '');
      return;
    }
    const timeZoneDateTime = (dayjs as any).tz(raw, timezone);
    const changeValue = timeZoneDateTime && timeZoneDateTime.isValid() ? timeZoneDateTime.toISOString() : '';
    setDateValue(timeZoneDateTime);
    handleEvent(actions, 'changeNblur', propName, changeValue);
  };

  const openDateTimePicker = () => {
    if (disabled || readOnly) {
      return;
    }

    const inputEl = inputRef.current as HTMLInputElement & { showPicker?: () => void };
    if (!inputEl) {
      return;
    }

    if (typeof inputEl.showPicker === 'function') {
      inputEl.showPicker();
    } else {
      inputEl.focus();
      inputEl.click();
    }
  };

  const inputId = `nm-datetime-${testId ?? propName ?? label}`;

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
          ref={inputRef}
          type='datetime-local'
          value={inputValue}
          required={required}
          disabled={disabled}
          $hasError={hasError}
          $readOnly={readOnly}
          onChange={handleChange}
          data-test-id={testId}
          aria-invalid={hasError}
          aria-describedby={helperTextToDisplay ? `${inputId}-helper` : undefined}
        />
        <CalendarButton
          type='button'
          aria-label='Open date and time picker'
          onClick={openDateTimePicker}
          disabled={disabled || readOnly}
          $disabled={disabled || readOnly}
          tabIndex={disabled || readOnly ? -1 : 0}
        />
      </InputWrapper>
      {helperTextToDisplay && (
        <HelperText id={`${inputId}-helper`} $hasError={hasError} role={hasError ? 'alert' : undefined}>
          {helperTextToDisplay}
        </HelperText>
      )}
    </Wrapper>
  );
}

import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
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
  placeholder: '#9ba7bc',
  labelColor: '#5c697f',
  textColor: '#1f2d46',
  helperText: '#5c697f',
  disabledOpacity: '0.5',
  fontFamily: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif",
  labelFontSize: '0.875rem',
  helperFontSize: '0.75rem',
  transitionSpeed: '0.2s'
};

const GroupWrapper = styled.fieldset<{ $hasError?: boolean }>`
  border: none;
  margin: 0;
  padding: 0;
  font-family: ${NM.fontFamily};
`;

const GroupLegend = styled.legend<{ $required?: boolean; $hasError?: boolean }>`
  font-size: ${NM.labelFontSize};
  font-weight: 500;
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.labelColor)};
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
  ${({ $required }) => $required && `&::after { content: ' *'; color: ${NM.errorRed}; }`}
`;

const OptionsWrapper = styled.div<{ $inline?: boolean }>`
  display: flex;
  flex-direction: ${({ $inline }) => ($inline ? 'row' : 'column')};
  flex-wrap: ${({ $inline }) => ($inline ? 'wrap' : 'nowrap')};
  gap: 0.625rem 1.5rem;
`;

const RadioRow = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? NM.disabledOpacity : '1')};
  user-select: none;
`;

const HiddenRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
`;

const RadioCircle = styled.span<{ $checked?: boolean; $hasError?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid ${({ $checked, $hasError }) => ($hasError ? NM.errorRed : $checked ? NM.textColor : NM.border)};
  background: transparent;
  flex-shrink: 0;
  transition: border-color ${NM.transitionSpeed} ease;
  ${HiddenRadio}:focus-visible + & {
    outline: 2px solid ${NM.focusBlue};
    outline-offset: 2px;
  }
  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.textColor)};
  }
`;

const RadioLabel = styled.span`
  font-size: 1rem;
  color: ${NM.textColor};
  line-height: 1.4;
`;

const HelperText = styled.span<{ $hasError?: boolean }>`
  display: block;
  font-size: ${NM.helperFontSize};
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.helperText)};
  margin-top: 0.25rem;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  ${({ $hasError }) => $hasError && `&::before { content: '⚠'; }`}
`;

// Can't use RadioButtonProps until getLocaleRuleNameFromKeys is NOT private
interface RadioButtonsProps extends PConnFieldProps {
  // If any, enter additional props that only exist on RadioButtons here
  inline: boolean;
  fieldMetadata?: any;
  variant?: string;
  hideFieldLabels?: boolean;
  additionalProps?: any;
  imagePosition?: string;
  imageSize?: string;
  showImageDescription?: boolean;
  datasource?: any;
}

export default function RadioButtons(props: RadioButtonsProps) {
  const FieldValueList = getComponentFromMap('FieldValueList');
  const SelectableCard = getComponentFromMap('SelectableCard');

  const {
    getPConnect,
    label,
    value = '',
    readOnly,
    validatemessage,
    helperText,
    status,
    required,
    inline,
    displayMode,
    hideLabel,
    fieldMetadata,
    variant,
    hideFieldLabels,
    additionalProps,
    datasource,
    imagePosition,
    imageSize,
    showImageDescription
  } = props;
  const [theSelectedButton, setSelectedButton] = useState(value);

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const actionsApi = thePConn.getActionsApi();
  const propName = (thePConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;
  const hasError = status === 'error';
  const className = thePConn.getCaseInfo().getClassName();

  let configProperty = (thePConn.getRawMetadata() as any)?.config?.value || '';
  configProperty = configProperty.startsWith('@P') ? configProperty.substring(3) : configProperty;
  configProperty = configProperty.startsWith('.') ? configProperty.substring(1) : configProperty;

  const metaData = Array.isArray(fieldMetadata) ? fieldMetadata.filter(field => field?.classID === className)[0] : fieldMetadata;
  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : configProperty;
  const localePath = localeContext === 'datapage' ? displayName : localeName;

  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject(''));

  useEffect(() => {
    setSelectedButton(value);
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return (
      <FieldValueList
        name={hideLabel ? '' : label}
        value={thePConn.getLocalizedValue(value, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
      />
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <FieldValueList
        name={hideLabel ? '' : label}
        value={thePConn.getLocalizedValue(value, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
        variant='stacked'
      />
    );
  }

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.value);
  };

  const handleBlur = event => {
    thePConn.getValidationApi().validate(event.target.value, '');
  };

  if (variant === 'card') {
    const stateProps = thePConn.getStateProps();
    return (
      <div>
        <h4 style={{ marginTop: 0, marginBottom: 0 }}>{label}</h4>
        <div id='selectable-card' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1rem' }}>
          <SelectableCard
            hideFieldLabels={hideFieldLabels}
            additionalProps={additionalProps}
            getPConnect={getPConnect}
            dataSource={datasource}
            image={{
              imagePosition,
              imageSize,
              showImageDescription,
              imageField: stateProps.image?.split('.').pop(),
              imageDescription: stateProps.imageDescription?.split('.').pop()
            }}
            onChange={handleChange}
            recordKey={stateProps.value?.split('.').pop()}
            cardLabel={stateProps.primaryField?.split('.').pop()}
            radioBtnValue={value}
            type='radio'
            setIsRadioCardSelected={displayMode !== 'DISPLAY_ONLY' ? setSelectedButton : undefined}
          />
        </div>
      </div>
    );
  }

  const groupId = `nm-radio-${propName ?? label}`;

  return (
    <GroupWrapper $hasError={hasError} aria-required={required}>
      {!hideLabel && label && (
        <GroupLegend $required={required} $hasError={hasError}>
          {label}
        </GroupLegend>
      )}
      <OptionsWrapper $inline={inline}>
        {theOptions.map(theOption => {
          const optionLabel = thePConn.getLocalizedValue(
            theOption.value,
            localePath,
            thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
          );
          const isChecked = theSelectedButton === theOption.key;
          const optionId = `${groupId}-${theOption.key}`;
          return (
            <RadioRow key={theOption.key} htmlFor={optionId} $disabled={readOnly}>
              <HiddenRadio
                id={optionId}
                name={groupId}
                type='radio'
                value={theOption.key}
                checked={isChecked}
                disabled={readOnly}
                required={required}
                onChange={handleChange}
                onBlur={!readOnly ? handleBlur : undefined}
                aria-invalid={hasError}
              />
              <RadioCircle $checked={isChecked} $hasError={hasError} aria-hidden='true' />
              <RadioLabel>{optionLabel}</RadioLabel>
            </RadioRow>
          );
        })}
      </OptionsWrapper>
      {helperTextToDisplay && (
        <HelperText $hasError={hasError} role={hasError ? 'alert' : undefined}>
          {helperTextToDisplay}
        </HelperText>
      )}
    </GroupWrapper>
  );
}

// Can't use RadioButtonProps until getLocaleRuleNameFromKeys is NOT private
interface RadioButtonsProps extends PConnFieldProps {
  // If any, enter additional props that only exist on RadioButtons here
  inline: boolean;
  fieldMetadata?: any;
  variant?: string;
  hideFieldLabels?: boolean;
  additionalProps?: any;
  imagePosition?: string;
  imageSize?: string;
  showImageDescription?: boolean;
  datasource?: any;
}

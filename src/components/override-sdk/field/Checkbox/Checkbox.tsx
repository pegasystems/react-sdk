import { useState, useEffect } from 'react';
import styled from 'styled-components';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { insertInstruction, deleteInstruction, updateNewInstuctions } from '@pega/react-sdk-components/lib/components/helpers/instructions-utils';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// ---------------------------------------------------------------------------
// Northwestern Mutual "Luna" design tokens
// ---------------------------------------------------------------------------
const NM = {
  navy: '#1f2d46',
  border: '#c8ced8',
  focusBlue: '#2d4dc5',
  errorRed: '#c93939',
  labelColor: '#5c697f',
  textColor: '#2f3747',
  helperText: '#5c697f',
  disabledOpacity: '0.5',
  fontFamily: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif",
  fontSize: '1rem',
  labelFontSize: '0.875rem',
  helperFontSize: '0.75rem',
};

// --- Styled primitives -------------------------------------------------------

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${NM.fontFamily};
`;

const GroupLabel = styled.legend`
  font-size: ${NM.labelFontSize};
  font-weight: 500;
  color: ${NM.labelColor};
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
  padding: 0;
  border: none;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SelectableCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 40ch), 1fr));
  grid-auto-rows: 1fr;
  gap: 0.5rem;
`;

// Visually hides the native checkbox while keeping it accessible
const HiddenInput = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  margin: 0;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

// Custom visual checkbox square
const CheckBox = styled.span<{ $checked?: boolean; $hasError?: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 2px;
  border: 2px solid
    ${({ $hasError, $checked }) =>
      $hasError ? NM.errorRed : $checked ? NM.navy : NM.border};
  background-color: ${({ $checked }) => ($checked ? NM.navy : '#fff')};
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  opacity: ${({ $disabled }) => ($disabled ? NM.disabledOpacity : '1')};

  /* Checkmark (shown when checked) */
  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 1.15rem;
    height: 0.65rem;
    border-left: 3px solid #fff;
    border-bottom: 3px solid #fff;
    transform: rotate(-45deg) translateY(-0.08rem);
  }
`;

// Label row: [hidden input] [visual box] [caption text]
const ControlRow = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: ${NM.fontFamily};
  font-size: 1.02rem;
  color: ${NM.textColor};
  user-select: none;
  position: relative;
  line-height: 1.35;

  /* Focus ring on the visual box when native input is focused */
  &:focus-within ${CheckBox} {
    box-shadow: 0 0 0 3px ${NM.focusBlue}33;
  }
`;

const HelperText = styled.span<{ $hasError?: boolean }>`
  font-size: ${NM.helperFontSize};
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.helperText)};
  margin-top: 0.25rem;
  line-height: 1.4;
`;

interface CheckboxProps extends Omit<PConnFieldProps, 'value'> {
  // If any, enter additional props that only exist on Checkbox here
  value?: boolean;
  caption?: string;
  trueLabel?: string;
  falseLabel?: string;
  selectionMode?: string;
  datasource?: any;
  selectionKey?: string;
  selectionList?: any;
  primaryField: string;
  readonlyContextList: any;
  referenceList: string;
  variant?: string;
  hideFieldLabels: boolean;
  additionalProps: any;
  imagePosition: string;
  imageSize: string;
  showImageDescription: string;
  renderMode: string;
  image: string;
}

export default function CheckboxComponent(props: CheckboxProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const FieldValueList = getComponentFromMap('FieldValueList');
  const SelectableCard = getComponentFromMap('SelectableCard');

  const {
    getPConnect,
    label,
    caption,
    value,
    readOnly,
    testId,
    required,
    disabled,
    status,
    helperText,
    validatemessage,
    displayMode,
    hideLabel,
    trueLabel,
    falseLabel,
    selectionMode,
    datasource,
    selectionKey,
    selectionList,
    primaryField,
    referenceList,
    readonlyContextList: selectedvalues,
    variant,
    hideFieldLabels,
    additionalProps,
    imagePosition,
    imageSize,
    showImageDescription,
    renderMode,
    image
  } = props;
  const readOnlyMode = renderMode === 'ReadOnly' || displayMode === 'DISPLAY_ONLY' || readOnly;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [theSelectedButton, setSelectedButton] = useState(value);
  const helperTextToDisplay = validatemessage || helperText;
  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = (thePConn.getStateProps() as any).value;

  const [checked, setChecked] = useState<any>(false);
  useEffect(() => {
    // This update theSelectedButton which will update the UI to show the selected button correctly
    setChecked(value);
  }, [value]);

  useEffect(() => {
    if (referenceList?.length > 0 && !readOnlyMode) {
      thePConn.setReferenceList(selectionList);
      updateNewInstuctions(thePConn, selectionList);
    }
  }, [thePConn]);

  useEffect(() => {
    // This update theSelectedButton which will update the UI to show the selected button correctly
    setSelectedButton(value);
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : caption} value={value ? trueLabel : falseLabel} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : caption} value={value ? trueLabel : falseLabel} variant='stacked' />;
  }

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.checked);
  };

  const handleBlur = event => {
    thePConn.getValidationApi().validate(event.target.checked);
  };

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      insertInstruction(thePConn, selectionList, selectionKey, primaryField, item);
    } else {
      deleteInstruction(thePConn, selectionList, selectionKey, item);
    }
    thePConn.clearErrorMessages({ property: selectionList });
  };

  const actions = thePConn.getActionsApi();

  const commonProps = {
    ...additionalProps,
    className: 'standard',
    disabled,
    readOnly,
    onClick: (actions as any).onClick
  };

  if (variant === 'card') {
    return (
      <div>
        <h4 style={{ marginTop: 0, marginBottom: 0 }}>{label}</h4>
        <SelectableCardGrid>
          <SelectableCard
            {...commonProps}
            testId={testId}
            displayMode={displayMode}
            dataSource={datasource}
            getPConnect={getPConnect}
            readOnly={renderMode === 'ReadOnly' || displayMode === 'DISPLAY_ONLY' || readOnly}
            onChange={e => {
              e.stopPropagation();
              const recordKey = selectionKey?.split('.').pop();
              const selectedItem = datasource?.source?.find(item => item[recordKey as any] === e.target.id) ?? {};
              handleCheckboxChange(e, {
                id: selectedItem[recordKey as any],
                primary: selectedItem[recordKey as any]
              });
            }}
            onBlur={() => {
              thePConn.getValidationApi().validate(selectedvalues, selectionList);
            }}
            hideFieldLabels={hideFieldLabels}
            recordKey={selectionKey?.split('.').pop()}
            cardLabel={primaryField.split('.').pop()}
            image={{
              imagePosition,
              imageSize,
              showImageDescription,
              imageField: image?.split('.').pop(),
              imageDescription: (thePConn?.getRawMetadata()?.config as any).imageDescription?.split('.').pop()
            }}
            readOnlyList={selectedvalues}
            type='checkbox'
            showNoValue={(renderMode === 'ReadOnly' || readOnly || displayMode === 'DISPLAY_ONLY') && selectedvalues.length === 0}
          />
        </SelectableCardGrid>
      </div>
    );
  }

  const handleChangeMultiMode = (event, element) => {
    if (event.target.checked) {
      insertInstruction(thePConn, selectionList, selectionKey, primaryField, {
        id: element.key,
        primary: element.text ?? element.value
      });
    } else {
      deleteInstruction(thePConn, selectionList, selectionKey, {
        id: element.key,
        primary: element.text ?? element.value
      });
    }
    thePConn.clearErrorMessages({
      property: selectionList,
      category: '',
      context: ''
    });
  };

  const hasError = status === 'error';

  let theCheckbox;
  const listOfCheckboxes: any = [];
  if (selectionMode === 'multi') {
    const listSourceItems = datasource?.source ?? [];
    const dataField: any = selectionKey?.split?.('.')[1];
    listSourceItems.forEach((element, index) => {
      const isChecked = selectedvalues?.some?.(data => data[dataField] === element.key);
      listOfCheckboxes.push(
        <ControlRow key={index} $disabled={disabled} data-test-id={testId}>
          <HiddenInput
            checked={isChecked}
            onChange={event => handleChangeMultiMode(event, element)}
            onBlur={() => {
              thePConn.getValidationApi().validate(selectedvalues, selectionList);
            }}
            data-testid={`${testId}:${element.value}`}
          />
          <CheckBox $checked={isChecked} $hasError={hasError} $disabled={disabled} />
          <span>{element.text ?? element.value}</span>
        </ControlRow>
      );
    });
    theCheckbox = <CheckboxList>{listOfCheckboxes}</CheckboxList>;
  } else {
    theCheckbox = (
      <ControlRow $disabled={disabled || readOnly} data-test-id={testId}>
        <HiddenInput
          checked={!!checked}
          onChange={!readOnly ? handleChange : undefined}
          onBlur={!readOnly ? handleBlur : undefined}
          value={value as any}
          disabled={disabled}
          readOnly={readOnly}
        />
        <CheckBox $checked={!!checked} $hasError={hasError} $disabled={disabled} />
        <span>{caption}</span>
      </ControlRow>
    );
  }

  return (
    <GroupWrapper as='fieldset' style={{ border: 'none', padding: 0, margin: 0 }}>
      {!hideLabel && <GroupLabel>{label}</GroupLabel>}
      <div>{theCheckbox}</div>
      {helperTextToDisplay && (
        <HelperText $hasError={hasError} role={hasError ? 'alert' : undefined}>
          {helperTextToDisplay}
        </HelperText>
      )}
    </GroupWrapper>
  );
}

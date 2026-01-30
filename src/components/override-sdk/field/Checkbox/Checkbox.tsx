import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Checkbox, MultiChoice, LabelText, ErrorText, HintText, H4 } from 'govuk-react';

// --- ABSOLUTE IMPORTS ---
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { insertInstruction, deleteInstruction, updateNewInstuctions } from '@pega/react-sdk-components/lib/components/helpers/instructions-utils';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// --- STYLED COMPONENTS ---
const CheckboxContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const SelectableCardWrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 40ch), 1fr));
  grid-auto-rows: 1fr;
  gap: 0.5rem;
`;

const FormGroupWrapper = styled('div')`
  margin-bottom: 20px;
`;

// --- INTERFACES ---
interface CheckboxProps extends Omit<PConnFieldProps, 'value'> {
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
  // Get emitted components from map
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
  const isError = status === 'error';

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = (thePConn.getStateProps() as any).value;

  const [checked, setChecked] = useState<any>(false);

  useEffect(() => {
    setChecked(value);
  }, [value]);

  useEffect(() => {
    if (referenceList?.length > 0 && !readOnlyMode) {
      thePConn.setReferenceList(selectionList);
      updateNewInstuctions(thePConn, selectionList);
    }
  }, [thePConn, referenceList, readOnlyMode, selectionList]);

  useEffect(() => {
    setSelectedButton(value);
  }, [value]);

  // --- DISPLAY MODE: READ ONLY ---
  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : caption} value={value ? trueLabel : falseLabel} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : caption} value={value ? trueLabel : falseLabel} variant='stacked' />;
  }

  // --- HANDLERS ---
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
    disabled,
    readOnly,
    onClick: (actions as any).onClick
  };

  // --- VARIANT: CARD ---
  if (variant === 'card') {
    return (
      <FormGroupWrapper>
        {/* Using H4 for semantic header inside the form group */}
        {!hideLabel && <H4 style={{ marginTop: 0, marginBottom: '10px' }}>{label}</H4>}

        <SelectableCardWrapper>
          <SelectableCard
            {...commonProps}
            testId={testId}
            displayMode={displayMode}
            dataSource={datasource}
            getPConnect={getPConnect}
            readOnly={readOnlyMode}
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
            showNoValue={readOnlyMode && selectedvalues.length === 0}
          />
        </SelectableCardWrapper>
        {/* Render error for card variant if needed */}
        {isError && <ErrorText>{helperTextToDisplay}</ErrorText>}
      </FormGroupWrapper>
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

  // --- RENDER LOGIC ---

  // Case 1: Multi-Select (Group of Checkboxes)
  if (selectionMode === 'multi') {
    const listSourceItems = datasource?.source ?? [];
    const dataField: any = selectionKey?.split?.('.')[1];

    return (
      <MultiChoice
        label={!hideLabel ? label : undefined}
        meta={{
          touched: isError,
          error: isError ? helperTextToDisplay : undefined
        }}
        hint={!isError ? helperText : undefined}
      >
        <CheckboxContainer>
          {listSourceItems.map((element, index) => (
            <Checkbox
              key={index}
              name={`${propName}[${index}]`}
              checked={selectedvalues?.some?.(data => data[dataField] === element.key)}
              onChange={event => handleChangeMultiMode(event, element)}
              onBlur={() => {
                thePConn.getValidationApi().validate(selectedvalues, selectionList);
              }}
              value={element.value}
              disabled={disabled || readOnly}
              data-test-id={testId}
            >
              {element.text ?? element.value}
            </Checkbox>
          ))}
        </CheckboxContainer>
      </MultiChoice>
    );
  }

  // Case 2: Single Checkbox
  return (
    <FormGroupWrapper>
      {!hideLabel && <LabelText>{label}</LabelText>}
      {isError && <ErrorText>{helperTextToDisplay}</ErrorText>}

      <Checkbox
        checked={checked}
        onChange={!readOnly ? handleChange : undefined}
        onBlur={!readOnly ? handleBlur : undefined}
        value={value ? 'true' : 'false'}
        disabled={disabled}
        hint={!isError ? helperText : undefined}
        data-test-id={testId}
      >
        {caption}
      </Checkbox>
    </FormGroupWrapper>
  );
}

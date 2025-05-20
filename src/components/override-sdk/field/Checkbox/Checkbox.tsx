/* eslint-disable react/no-array-index-key */
import { useState, useEffect } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { insertInstruction, deleteInstruction, updateNewInstuctions } from '@pega/react-sdk-components/lib/components/helpers/instructions-utils';
import { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import SelectableCard from '../SelectableCard/SelectableCard';

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

const useStyles = makeStyles(() => ({
  checkbox: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function CheckboxComponent(props: CheckboxProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const FieldValueList = getComponentFromMap('FieldValueList');

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
  const [theSelectedButton, setSelectedButton] = useState(value);
  const classes = useStyles();
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
    if (referenceList?.length > 0) {
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
    const stateProps = thePConn.getStateProps();
    return (
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
          imageField: image.split('.').pop(),
          imageDescription: (thePConn?.getRawMetadata()?.config as any).imageDescription?.split('.').pop()
        }}
        readOnlyList={selectedvalues}
        type='checkbox'
        showNoValue={(renderMode === 'ReadOnly' || readOnly || displayMode === 'DISPLAY_ONLY') && selectedvalues.length === 0}
      />
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

  let theCheckbox;
  const listOfCheckboxes: any = [];
  if (selectionMode === 'multi') {
    const listSourceItems = datasource?.source ?? [];
    const dataField: any = selectionKey?.split?.('.')[1];
    listSourceItems.forEach((element, index) => {
      listOfCheckboxes.push(
        <FormControlLabel
          control={
            <Checkbox
              key={index}
              checked={selectedvalues?.some?.(data => data[dataField] === element.key)}
              onChange={event => handleChangeMultiMode(event, element)}
              onBlur={() => {
                thePConn.getValidationApi().validate(selectedvalues, selectionList);
              }}
              data-testid={`${testId}:${element.value}`}
            />
          }
          key={index}
          label={element.text ?? element.value}
          labelPlacement='end'
          data-test-id={testId}
        />
      );
    });
    theCheckbox = <div className={classes.checkbox}>{listOfCheckboxes}</div>;
  } else {
    theCheckbox = (
      <FormControlLabel
        control={
          <Checkbox
            color='primary'
            checked={checked}
            onChange={!readOnly ? handleChange : undefined}
            onBlur={!readOnly ? handleBlur : undefined}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
          />
        }
        label={caption}
        labelPlacement='end'
        data-test-id={testId}
      />
    );
  }

  return (
    <FormControl variant='standard' required={required} error={status === 'error'}>
      {!hideLabel && <FormLabel component='legend'>{label}</FormLabel>}
      <FormGroup>{theCheckbox}</FormGroup>
      <FormHelperText>{helperTextToDisplay}</FormHelperText>
    </FormControl>
  );
}

import React, { useRef } from 'react';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps'
import InstructionComp from '../../../helpers/formatters/ParsedHtml';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';

interface RichTextProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextArea here
  additionalProps?: object;
}

export default function RichText(props: RichTextProps) {
  // Get emitted components from map (so we can get any override that may exist)
  //const FieldValueList = getComponentFromMap('FieldValueList');
  //const RichTextEditor = getComponentFromMap('RichTextEditor');

  registerNonEditableField(true);

  const { getPConnect, value, placeholder, validatemessage, label, hideLabel, helperText, testId, displayMode, additionalProps } = props;
  const pConn = getPConnect();
  const editorRef: any = useRef(null);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map((prop) => prop === true || (typeof prop === 'string' && prop === 'true'));

  const helperTextToDisplay = validatemessage || helperText;

  /*if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant="stacked" />;
  }*/

  let richTextComponent;

  if (readOnly) {
    // Rich Text read-only component    
    richTextComponent = (
      <>
        <InstructionComp htmlString={value}></InstructionComp>
      </>
    );
  } else {
    // Rich Text editable component
    const actionsApi = pConn.getActionsApi();
    let status = '';
    if (validatemessage !== '') {
      status = 'error';
    }
    const handleChange = () => {
      if (status === 'error') {
        const property = pConn.getStateProps()["value"];
        pConn.clearErrorMessages({
          property,
          category: '',
          context: ''
        });
      }
    };

    const handleBlur = () => {
      if (editorRef.current) {
        const editorValue = editorRef.current.getContent({ format: 'html' });
        const property = pConn.getStateProps()["value"];
        handleEvent(actionsApi, 'changeNblur', property, editorValue);
      }
    };


    // Component returns value of field, (parsed if it is html) as readonly block - as no requirement for editable RichText as of US-9579
    richTextComponent = (        
      <InstructionComp htmlString={value}></InstructionComp>        
    );
    // TODO - Add implementation of Editable Rich Text component (Unsure whether this would simply be text area, or full richtext)
    /* richTextComponent = (        
      <RichTextEditor
        {...additionalProps}
        label={label}
        labelHidden={hideLabel}
        info={helperTextToDisplay}
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        testId={testId}
        ref={editorRef}
        error={status === 'error'}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    ); */
  }

  return richTextComponent;
}
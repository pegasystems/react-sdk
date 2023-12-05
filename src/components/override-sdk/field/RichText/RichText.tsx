import React from 'react';
// import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps'
import InstructionComp from '../../../helpers/formatters/ParsedHtml';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';

interface RichTextProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextArea here
  additionalProps?: object;
  name: string;
}

export default function RichText(props: RichTextProps) {
  registerNonEditableField(true);

  const { value, name } = props;
 

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map((prop) => prop === true || (typeof prop === 'string' && prop === 'true'));

  /* if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant="stacked" />;
  } */

  let richTextComponent;

  if (readOnly) {
    // Rich Text read-only component    
    richTextComponent = (
      <div id={`${name}-hint`} className="govuk-hint">      
        <InstructionComp htmlString={value}></InstructionComp>
      </div>
    );
  } else {
    // Rich Text editable component
    /* const actionsApi = pConn.getActionsApi();
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
    }; */


    // Component returns value of field, (parsed if it is html) as readonly block - as no requirement for editable RichText as of US-9579
    richTextComponent = (        
      <div id={`${name}-hint`} className="govuk-hint">      
        <InstructionComp htmlString={value}></InstructionComp>
      </div>        
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
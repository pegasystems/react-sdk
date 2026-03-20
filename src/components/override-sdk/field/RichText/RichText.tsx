import { useRef } from 'react';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './RichText.css';

interface RichTextProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextArea here
  additionalProps?: object;
}

export default function RichText(props: RichTextProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const FieldValueList = getComponentFromMap('FieldValueList');
  const RichTextEditor = getComponentFromMap('RichTextEditor');

  const { getPConnect, value, placeholder, validatemessage, label, hideLabel, helperText, testId, displayMode, additionalProps } = props;
  const pConn = getPConnect();
  const editorRef: any = useRef(null);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(prop => prop === true || (typeof prop === 'string' && prop === 'true'));

  const helperTextToDisplay = validatemessage || helperText;

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} isHtml />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} isHtml variant='stacked' />;
  }

  let richTextComponent;

  if (readOnly) {
    // Rich Text read-only component
    richTextComponent = (
      <RichTextEditor
        {...additionalProps}
        label={label}
        labelHidden={hideLabel}
        defaultValue={value}
        testId={testId}
        info={helperTextToDisplay}
        ref={editorRef}
        readOnly
      />
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
        const property = (pConn.getStateProps() as any).value;
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
        const property = (pConn.getStateProps() as any).value;
        handleEvent(actionsApi, 'changeNblur', property, editorValue);
      }
    };

    richTextComponent = (
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
    );
  }

  return richTextComponent;
}

import { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TextInput from '@pega/react-sdk-components/lib/components/field/TextInput';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import PlainCssTextInput from '../../../override-sdk/field/TextInput/PlainCssTextInput';

// ---------------------------------------------------------------------------
// Mock getPConnect (matches the contract used by TextInput)
// ---------------------------------------------------------------------------
const mockGetPConnect = () => ({
  getActionsApi: () => ({
    updateFieldValue: () => {},
    triggerFieldChange: () => {}
  }),
  getStateProps: () => ({ value: '.Customer.FirstName' }),
  getValidationApi: () => ({ validate: () => {} }),
  ignoreSuggestion: () => {},
  acceptSuggestion: () => {},
  clearErrorMessages: () => {}
});

// ---------------------------------------------------------------------------
// Wrapper that wires the toggle into the story
// ---------------------------------------------------------------------------
function TextInputOverrideDemoWrapper() {
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const toggle = useCallback(() => {
    setIsOverrideActive(prev => {
      const next = !prev;
      if (SdkComponentMap) {
        if (next) {
          const current = SdkComponentMap.getLocalComponentMap();
          SdkComponentMap.setLocalComponentMap({ ...current, TextInput: PlainCssTextInput });
        } else {
          const current = { ...SdkComponentMap.getLocalComponentMap() };
          delete current.TextInput;
          SdkComponentMap.setLocalComponentMap(current);
        }
      }
      setRenderKey(k => k + 1);
      return next;
    });
  }, []);

  // Shared props for the demo fields
  const baseProps = {
    getPConnect: mockGetPConnect as any,
    required: false,
    disabled: false,
    readOnly: false,
    validatemessage: '',
    testId: 'demo-text-input',
    helperText: 'This is helper text',
    hideLabel: false,
    onChange: () => {}
  };

  return (
    <div style={{ maxWidth: 480, fontFamily: 'system-ui, sans-serif' }}>
      <h3>SDK Component Override Demo — TextInput</h3>
      <p style={{ fontSize: 13, color: '#64748b' }}>
        Toggle the switch below to swap between the default MUI TextInput and the custom Plain-CSS override at runtime.
      </p>

      {/* Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          margin: '12px 0',
          borderRadius: 8,
          background: '#f8fafc',
          border: '1px solid #e2e8f0'
        }}
      >
        <button
          type='button'
          onClick={toggle}
          aria-pressed={isOverrideActive}
          data-test-id='override-toggle-btn'
          style={{
            position: 'relative',
            width: 48,
            height: 26,
            borderRadius: 13,
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            backgroundColor: isOverrideActive ? '#2563eb' : '#cbd5e1',
            transition: 'background-color 0.2s'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: isOverrideActive ? 25 : 3,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          />
        </button>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>
          {isOverrideActive ? '✦ Custom Design System (Plain CSS)' : 'Default Design System (MUI)'}
        </span>
      </div>

      {/* Rendered TextInput (key change forces remount to pick up new map) */}
      <div key={renderKey} style={{ marginTop: 16 }}>
        {isOverrideActive ? (
          <PlainCssTextInput {...baseProps} label='First Name (override)' value='Jane' placeholder='Enter first name' />
        ) : (
          <TextInput {...baseProps} label='First Name (default)' value='Jane' placeholder='Enter first name' />
        )}
        <div style={{ height: 12 }} />
        {isOverrideActive ? (
          <PlainCssTextInput {...baseProps} label='Last Name (override)' value='' placeholder='Enter last name' required />
        ) : (
          <TextInput {...baseProps} label='Last Name (default)' value='' placeholder='Enter last name' required />
        )}
        <div style={{ height: 12 }} />
        {isOverrideActive ? (
          <PlainCssTextInput {...baseProps} label='Error example' value='bad value' status='error' validatemessage='This field has an error' />
        ) : (
          <TextInput {...baseProps} label='Error example' value='bad value' status='error' validatemessage='This field has an error' />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Storybook meta
// ---------------------------------------------------------------------------
const meta: Meta = {
  title: 'Override Demo/TextInput',
  component: TextInputOverrideDemoWrapper,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how to override the SDK TextInput component at runtime, ' +
          'swapping between the default MUI implementation and a custom Plain-CSS design system.'
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof TextInputOverrideDemoWrapper>;

export const Default: Story = {};

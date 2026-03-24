/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock CSS imports (ts-jest doesn't handle .css files)
jest.mock('../../../src/components/override-sdk/field/TextInput/PlainCssTextInput.css', () => ({}));

// ---------------------------------------------------------------------------
// Minimal mock for PCore (needed by the SDK component map)
// ---------------------------------------------------------------------------
beforeAll(() => {
  (globalThis as any).PCore = {
    getEnvironmentInfo: () => ({
      getUseLocale: () => 'en-US',
      getLocale: () => 'en-US',
      getTimeZone: () => ''
    }),
    getLocaleUtils: () => ({
      getLocaleValue: (v: any) => v
    }),
    getConstants: () => ({
      CASE_INFO: { INSTRUCTIONS: '' }
    })
  };
});

// ---------------------------------------------------------------------------
// Mock the SDK helpers that PlainCssTextInput imports
// ---------------------------------------------------------------------------
jest.mock('@pega/react-sdk-components/lib/components/helpers/event-utils', () => {
  return { __esModule: true, default: jest.fn() };
});

jest.mock('@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map', () => {
  const localMap: Record<string, any> = {};
  const pegaMap: Record<string, any> = {};
  return {
    __esModule: true,
    SdkComponentMap: {
      getLocalComponentMap: () => localMap,
      setLocalComponentMap: (map: any) => Object.assign(localMap, map),
      getPegaProvidedComponentMap: () => pegaMap,
      setPegaProvidedComponentMap: (map: any) => Object.assign(pegaMap, map)
    },
    getComponentFromMap: (name: string) => {
      // For FieldValueList, return a simple stub
      if (name === 'FieldValueList') {
        return ({ name: n, value: v }: any) => (
          <span data-test-id='field-value-list'>
            {n}: {v}
          </span>
        );
      }
      return localMap[name] || pegaMap[name] || null;
    },
    getSdkComponentMap: jest.fn().mockResolvedValue({})
  };
});

// Import after mocks are set up
import PlainCssTextInput from '../../../src/components/override-sdk/field/TextInput/PlainCssTextInput';
import { SdkComponentMap, getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

// ---------------------------------------------------------------------------
// Shared mock getPConnect factory
// ---------------------------------------------------------------------------
const createMockPConnect = () => ({
  getActionsApi: () => ({
    updateFieldValue: jest.fn(),
    triggerFieldChange: jest.fn()
  }),
  getStateProps: () => ({ value: '.Test.Field' }),
  getValidationApi: () => ({ validate: jest.fn() }),
  ignoreSuggestion: jest.fn(),
  acceptSuggestion: jest.fn(),
  clearErrorMessages: jest.fn()
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('PlainCssTextInput', () => {
  it('renders with the correct label and value', () => {
    render(
      <PlainCssTextInput
        getPConnect={createMockPConnect as any}
        label='First Name'
        value='Alice'
        required={false}
        disabled={false}
        readOnly={false}
        validatemessage=''
        testId='first-name'
        helperText='Enter your name'
        hideLabel={false}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
    // The "Custom DS" badge should be visible
    expect(screen.getByText('Custom DS')).toBeInTheDocument();
  });

  it('shows error styling when status is error', () => {
    render(
      <PlainCssTextInput
        getPConnect={createMockPConnect as any}
        label='Email'
        value='bad'
        required={false}
        disabled={false}
        readOnly={false}
        validatemessage='Invalid email'
        status='error'
        testId='email-field'
        helperText=''
        hideLabel={false}
        onChange={jest.fn()}
      />
    );

    const input = screen.getByDisplayValue('bad');
    expect(input.className).toContain('plain-ds-input--error');
    expect(screen.getByText('Invalid email')).toHaveClass('plain-ds-helper--error');
  });

  it('renders in display-only mode via FieldValueList', () => {
    render(
      <PlainCssTextInput
        getPConnect={createMockPConnect as any}
        label='Status'
        value='Active'
        displayMode='DISPLAY_ONLY'
        required={false}
        disabled={false}
        readOnly={false}
        validatemessage=''
        testId='status-field'
        helperText=''
        hideLabel={false}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText(/Status.*Active/)).toBeInTheDocument();
  });

  it('updates the local component map when registered as override', () => {
    SdkComponentMap.setLocalComponentMap({ TextInput: PlainCssTextInput });
    const resolved = getComponentFromMap('TextInput');
    expect(resolved).toBe(PlainCssTextInput);
  });

  it('handles user input via onChange', () => {
    render(
      <PlainCssTextInput
        getPConnect={createMockPConnect as any}
        label='Test'
        value=''
        required={false}
        disabled={false}
        readOnly={false}
        validatemessage=''
        testId='test-input'
        helperText=''
        hideLabel={false}
        onChange={jest.fn()}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
  });
});

import { useState, useCallback, useEffect } from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SdkComponentMap, getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import TextInput from '@pega/react-sdk-components/lib/components/field/TextInput';

import PlainCssTextInput from '../../components/override-sdk/field/TextInput/PlainCssTextInput';
import OverrideToggle from '../../components/override-sdk/OverrideToggle';
import { theme } from '../../theme';

// ---------------------------------------------------------------------------
// Mock getPConnect — same shape the real TextInput expects
// ---------------------------------------------------------------------------
const createMockPConnect = (propName: string) => () => ({
  getActionsApi: () => ({
    updateFieldValue: () => {},
    triggerFieldChange: () => {}
  }),
  getStateProps: () => ({ value: propName }),
  getValidationApi: () => ({ validate: () => {} }),
  ignoreSuggestion: () => {},
  acceptSuggestion: () => {},
  clearErrorMessages: () => {}
});

// ---------------------------------------------------------------------------
// OverrideDemo — standalone page reachable via /override-demo
// ---------------------------------------------------------------------------
export default function OverrideDemo() {
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [mapReady, setMapReady] = useState(!!SdkComponentMap);

  // Ensure SdkComponentMap is initialized before rendering any SDK components
  useEffect(() => {
    if (!SdkComponentMap) {
      getSdkComponentMap({}).then(() => setMapReady(true));
    }
  }, []);

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

  // Choose which TextInput to render based on toggle state
  const ActiveTextInput = isOverrideActive ? PlainCssTextInput : TextInput;

  const baseProps = {
    required: false,
    disabled: false,
    readOnly: false,
    validatemessage: '',
    testId: 'demo-field',
    helperText: '',
    hideLabel: false,
    onChange: () => {}
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 20px' }}>
          <h2 style={{ marginBottom: 4 }}>SDK Component Override Demo</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 0 }}>
            Use the toggle below to swap the <code>TextInput</code> component between the default MUI implementation and a custom Plain-CSS override{' '}
            <strong>at runtime</strong> — no rebuild needed.
          </p>

          <OverrideToggle isActive={isOverrideActive} onToggle={toggle} />

          {!mapReady ? (
            <div style={{ marginTop: 24, padding: 24, textAlign: 'center', color: '#64748b' }}>Initializing component map…</div>
          ) : (
            <div key={renderKey} style={{ marginTop: 24, padding: 24, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
              <h4 style={{ margin: '0 0 16px', color: '#334155' }}>
                Currently rendering: <em>{isOverrideActive ? 'PlainCssTextInput (Custom DS)' : 'TextInput (MUI)'}</em>
              </h4>

              <ActiveTextInput
                {...baseProps}
                getPConnect={createMockPConnect('.Customer.FirstName') as any}
                label='First Name'
                value='Jane'
                placeholder='Enter first name'
                helperText='Your given name'
              />

              <ActiveTextInput
                {...baseProps}
                getPConnect={createMockPConnect('.Customer.LastName') as any}
                label='Last Name'
                value=''
                placeholder='Enter last name'
                required
                helperText='Required field'
              />

              <ActiveTextInput
                {...baseProps}
                getPConnect={createMockPConnect('.Customer.Email') as any}
                label='Email (error state)'
                value='not-an-email'
                status='error'
                validatemessage='Please enter a valid email address'
              />

              <ActiveTextInput
                {...baseProps}
                getPConnect={createMockPConnect('.Customer.Notes') as any}
                label='Notes (read-only)'
                value='This field is read-only'
                readOnly
              />
            </div>
          )}

          <details style={{ marginTop: 24, fontSize: 13, color: '#475569' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>How does this work?</summary>
            <ol style={{ lineHeight: 1.8, paddingLeft: 20 }}>
              <li>
                The SDK resolves components via a <code>SdkComponentMap</code> singleton that has two maps: <em>localComponentMap</em> (your
                overrides) and <em>pegaProvidedComponentMap</em> (SDK defaults).
              </li>
              <li>
                When you toggle the switch, we call <code>SdkComponentMap.setLocalComponentMap({'{ TextInput: PlainCssTextInput }'})</code> to
                register the override.
              </li>
              <li>
                A React key change forces the form to re-mount, so each <code>getComponentFromMap("TextInput")</code> call picks up the override.
              </li>
              <li>Toggle OFF removes the entry, restoring the Pega-provided MUI TextInput.</li>
            </ol>
          </details>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

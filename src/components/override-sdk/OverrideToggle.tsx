import { useState, useCallback } from 'react';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import PlainCssTextInput from './field/TextInput/PlainCssTextInput';

/**
 * OverrideToggle — Provides a UI switch that swaps the SDK `TextInput` component
 * between the default MUI implementation and the PlainCssTextInput override at runtime.
 *
 * Returns { isOverrideActive, renderKey, ToggleButton } so that the consuming parent can
 * use `renderKey` as a React key to force a re-mount of the component tree.
 */
export function useOverrideToggle() {
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const toggle = useCallback(() => {
    setIsOverrideActive(prev => {
      const next = !prev;
      if (next) {
        // Register the override in the local component map (takes priority over Pega-provided)
        const current = SdkComponentMap.getLocalComponentMap();
        SdkComponentMap.setLocalComponentMap({ ...current, TextInput: PlainCssTextInput });
      } else {
        // Remove the override — restore the original (empty) local map
        const current = { ...SdkComponentMap.getLocalComponentMap() };
        delete current.TextInput;
        SdkComponentMap.setLocalComponentMap(current);
      }
      // Bump key so the consuming tree re-mounts and picks up the new map entry
      setRenderKey(k => k + 1);
      return next;
    });
  }, []);

  return { isOverrideActive, renderKey, toggle };
}

const toggleContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  margin: '12px 0',
  borderRadius: '8px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0'
};

const toggleButtonBaseStyle: React.CSSProperties = {
  position: 'relative',
  width: '48px',
  height: '26px',
  borderRadius: '13px',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  transition: 'background-color 0.2s'
};

const knobStyle = (active: boolean): React.CSSProperties => ({
  position: 'absolute',
  top: '3px',
  left: active ? '25px' : '3px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  transition: 'left 0.2s',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
});

interface OverrideToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function OverrideToggle({ isActive, onToggle }: OverrideToggleProps) {
  return (
    <div style={toggleContainerStyle} data-test-id='override-toggle-container'>
      <button
        type='button'
        onClick={onToggle}
        aria-pressed={isActive}
        aria-label='Toggle design system override'
        data-test-id='override-toggle-btn'
        style={{
          ...toggleButtonBaseStyle,
          backgroundColor: isActive ? '#2563eb' : '#cbd5e1'
        }}
      >
        <span style={knobStyle(isActive)} />
      </button>
      <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
        {isActive ? '✦ Custom Design System (Plain CSS)' : 'Default Design System (MUI)'}
      </span>
    </div>
  );
}

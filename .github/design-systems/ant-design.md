# Ant Design (antd)

## Package Info

| Field | Value |
|-------|-------|
| Package name | `antd` |
| Version | `^5.0.0` |
| Peer dependencies | `react`, `react-dom` (already in project) |
| Install command | `npm install antd @ant-design/icons` |

## Component Mapping

| SDK Component | DS Component | Import Statement | Notes |
|---------------|-------------|------------------|-------|
| TextInput | `Input` | `import { Input } from 'antd';` | |
| Dropdown | `Select` | `import { Select } from 'antd';` | Uses `options` array prop, not children `MenuItem` |
| Checkbox | `Checkbox` / `Checkbox.Group` | `import { Checkbox } from 'antd';` | Single: `Checkbox`, Multi: `Checkbox.Group` |
| RadioButtons | `Radio.Group` | `import { Radio } from 'antd';` | Wrap options in `Radio.Group` |
| Date | `DatePicker` | `import { DatePicker } from 'antd';` | Built-in dayjs support |
| DateTime | `DatePicker` | `import { DatePicker } from 'antd';` | Use `showTime` prop |
| Time | `TimePicker` | `import { TimePicker } from 'antd';` | |
| TextArea | `Input.TextArea` | `import { Input } from 'antd';` | Use `Input.TextArea` |
| Currency | `InputNumber` | `import { InputNumber } from 'antd';` | Use `formatter`/`parser` for currency format |
| Decimal | `InputNumber` | `import { InputNumber } from 'antd';` | Set `precision` for decimal places |
| Integer | `InputNumber` | `import { InputNumber } from 'antd';` | Set `precision={0}` or delegate to TextInput override |
| Percentage | `InputNumber` | `import { InputNumber } from 'antd';` | Use `formatter={v => \`${v}%\`}` |
| Phone | `Input` | `import { Input } from 'antd';` | Consider `addonBefore` for country code |
| Email | `Input` | `import { Input } from 'antd';` | Delegates to TextInput in default SDK |
| URL | `Input` | `import { Input } from 'antd';` | Use `addonBefore="https://"` optionally |
| AutoComplete | `AutoComplete` | `import { AutoComplete } from 'antd';` | Uses `options` prop, `onSearch` for filtering |
| Multiselect | `Select` | `import { Select } from 'antd';` | Use `mode="multiple"` |
| RichText | `Input.TextArea` | `import { Input } from 'antd';` | Basic fallback; for rich editing consider `@ant-design/pro-editor` |
| Location | `Input` | `import { Input } from 'antd';` | Text input fallback; geolocation logic stays |

## Prop Mapping

| MUI Prop | Ant Design Equivalent | Notes |
|----------|----------------------|-------|
| `error={true}` | `status="error"` | Direct on Input/Select/DatePicker |
| `helperText="text"` | `<Form.Item help="text">` | Requires Form.Item wrapper |
| `variant="outlined"` | `variant="outlined"` | Default in Ant v5, can omit |
| `variant="standard"` | `variant="borderless"` | For readOnly display |
| `size="small"` | `size="small"` | Same |
| `fullWidth` | `style={{ width: '100%' }}` | Or parent layout handles it |
| `required={true}` | `<Form.Item required>` | On Form.Item, not on Input |
| `disabled={true}` | `disabled={true}` | Same |
| `placeholder="text"` | `placeholder="text"` | Same |
| `label="Label"` | `<Form.Item label="Label">` | On Form.Item, not on Input |
| `multiline` | Use `Input.TextArea` | Separate component |
| `rows={4}` | `rows={4}` | Same on Input.TextArea |
| `slotProps.input.inputProps` | Direct props on component | `maxLength`, `data-test-id` go directly on `<Input>` |
| `InputProps.readOnly` | `readOnly` | Direct prop on Input |

## Event Handler Mapping

| Component Type | MUI onChange Signature | Ant Design onChange Signature | Value Extraction |
|----------------|----------------------|------------------------------|------------------|
| Input (text) | `(event) => event.target.value` | `(event) => event.target.value` | Same — no change needed |
| Select | `(event) => event.target.value` | `(value, option) => value` | Extract value directly, no `event.target` |
| Checkbox | `(event) => event.target.checked` | `(event) => event.target.checked` | Same — no change needed |
| Radio.Group | `(event) => event.target.value` | `(event) => event.target.value` | Same — no change needed |
| DatePicker | `(date: Dayjs) => getFormattedDate(date)` | `(date: Dayjs, dateString: string) => dateString` | Use `dateString` directly or `date` dayjs object |
| InputNumber | `(event) => event.target.value` | `(value: number \| null) => value` | Direct value, no event |
| AutoComplete | `(event, value) => value` | `(value) => value` | Direct value |

## Form Wrapper Pattern

Ant Design separates label, validation, and help text into `Form.Item`. Every field component needs this wrapper:

```tsx
import { Form } from 'antd';

// Wrapper pattern for every field component:
<Form.Item
  label={hideLabel ? undefined : label}
  required={required}
  validateStatus={status === 'error' ? 'error' : undefined}
  help={helperTextToDisplay}
  style={{ marginBottom: '16px' }}
>
  <Input
    placeholder={placeholder ?? ''}
    size="small"
    disabled={disabled}
    readOnly={readOnly}
    onChange={handleChange}
    onBlur={!readOnly ? handleBlur : undefined}
    value={inputValue}
    maxLength={maxLength}
    data-test-id={testId}
    variant={readOnly ? 'borderless' : 'outlined'}
  />
</Form.Item>
```

**Important**: Do NOT wrap the Form.Item inside an Ant `<Form>` component. The SDK manages form state via PConnect. Only use `Form.Item` as a layout/display wrapper.

## Styling Approach

- **No makeStyles needed**: Remove all MUI `makeStyles` / `styled-components` usage
- **CSS-in-JS**: Use Ant's built-in component styling via props (`size`, `variant`, `style`)
- **Custom styles**: Use `style` prop for inline or `className` with CSS modules
- **Theming**: Use `ConfigProvider` at app level for theme tokens (colors, spacing, fonts)
- **Conflict avoidance**: Ant v5 uses CSS-in-JS (emotion) with auto-prefixed class names — minimal conflict with Cosmos CSS
- **Full width**: Apply `style={{ width: '100%' }}` on Input/Select components or use parent layout

```tsx
// Optional: Wrap override components with ConfigProvider for theming
import { ConfigProvider } from 'antd';

<ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
  {/* component content */}
</ConfigProvider>
```

## Example Transformation

### TextInput — Before (MUI):

```tsx
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface TextInputProps extends PConnFieldProps {
  fieldMetadata?: any;
}

export default function TextInput(props: TextInputProps) {
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect, label, required, disabled, value = '', validatemessage, status,
    readOnly, testId, fieldMetadata, helperText, displayMode, hideLabel, placeholder
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;
  const [inputValue, setInputValue] = useState('');
  const maxLength = fieldMetadata?.maxLength;

  let readOnlyProp = {};

  useEffect(() => { setInputValue(value); }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }
  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }
  if (readOnly) { readOnlyProp = { readOnly: true }; }

  function handleChange(event) { setInputValue(event?.target?.value); }
  function handleBlur() { handleEvent(actions, 'changeNblur', propName, inputValue); }

  return (
    <TextField
      fullWidth
      variant={readOnly ? 'standard' : 'outlined'}
      helperText={helperTextToDisplay}
      placeholder={placeholder ?? ''}
      size='small'
      required={required}
      disabled={disabled}
      onChange={handleChange}
      onBlur={!readOnly ? handleBlur : undefined}
      error={status === 'error'}
      label={label}
      value={inputValue}
      slotProps={{ input: { ...readOnlyProp, inputProps: { maxLength, ...{ 'data-test-id': testId } } } }}
    />
  );
}
```

### TextInput — After (Ant Design):

```tsx
import { useState, useEffect } from 'react';
import { Input, Form } from 'antd';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface TextInputProps extends PConnFieldProps {
  fieldMetadata?: any;
}

export default function TextInput(props: TextInputProps) {
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect, label, required, disabled, value = '', validatemessage, status,
    readOnly, testId, fieldMetadata, helperText, displayMode, hideLabel, placeholder
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;
  const [inputValue, setInputValue] = useState('');
  const maxLength = fieldMetadata?.maxLength;

  useEffect(() => { setInputValue(value); }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }
  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  function handleChange(event) { setInputValue(event?.target?.value); }
  function handleBlur() { handleEvent(actions, 'changeNblur', propName, inputValue); }

  return (
    <Form.Item
      label={hideLabel ? undefined : label}
      required={required}
      validateStatus={status === 'error' ? 'error' : undefined}
      help={helperTextToDisplay}
    >
      <Input
        placeholder={placeholder ?? ''}
        size='small'
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        onBlur={!readOnly ? handleBlur : undefined}
        value={inputValue}
        maxLength={maxLength}
        data-test-id={testId}
        variant={readOnly ? 'borderless' : 'outlined'}
        style={{ width: '100%' }}
      />
    </Form.Item>
  );
}
```

### Dropdown — Before (MUI):

```tsx
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
// ... SDK imports preserved ...

// In JSX:
<TextField select ...>
  {options.map(opt => <MenuItem key={opt.key} value={opt.key}>{opt.value}</MenuItem>)}
</TextField>
```

### Dropdown — After (Ant Design):

```tsx
import { Select, Form } from 'antd';
// ... SDK imports preserved ...

// In JSX:
<Form.Item label={hideLabel ? undefined : label} required={required}
  validateStatus={status === 'error' ? 'error' : undefined} help={helperTextToDisplay}>
  <Select
    placeholder={placeholder}
    size="small"
    disabled={disabled}
    onChange={handleChange}  // Note: Ant Select onChange gives (value) directly, not event
    onBlur={!readOnly ? handleBlur : undefined}
    value={value || undefined}
    options={options.map(opt => ({ label: opt.value, value: opt.key }))}
    data-test-id={testId}
    style={{ width: '100%' }}
  />
</Form.Item>
```

**Note for Dropdown**: Ant `Select.onChange` passes `(value)` directly, not an event. Update `handleChange`:
```tsx
// MUI version:
function handleChange(event) { ... event.target.value ... }

// Ant Design version:
function handleChange(selectedValue) {
  handleEvent(actions, 'changeNblur', propName, selectedValue);
}
```

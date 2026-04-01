# GOV.UK Design System (govuk-react)

## Package Info

| Field | Value |
|-------|-------|
| Package name | `govuk-react` |
| Version | `^0.10.0` |
| Peer dependencies | `react`, `react-dom`, `styled-components` (already in project) |
| Additional CSS | `govuk-frontend` for GOV.UK styles |
| Install command | `npm install govuk-react @govuk-react/icons govuk-frontend` |

## Post-Install Setup

GOV.UK Design System requires loading the GOV.UK Frontend CSS. Add to the app entry or a global CSS file:

```css
/* In src/common.css or equivalent */
@import 'govuk-frontend/dist/govuk/govuk-frontend.min.css';
```

Or import in `src/index.tsx`:
```tsx
import 'govuk-frontend/dist/govuk/govuk-frontend.min.css';
```

## Component Mapping

| SDK Component | DS Component | Import Statement | Notes |
|---------------|-------------|------------------|-------|
| TextInput | `InputField` | `import { InputField } from 'govuk-react';` | Built-in label, hint, error |
| Dropdown | `Select` | `import { Select } from 'govuk-react';` | Uses `<option>` children |
| Checkbox | `Checkbox` | `import { Checkbox } from 'govuk-react';` | Single checkbox |
| RadioButtons | `Radio` | `import { Radio } from 'govuk-react';` | Use `MultiChoice` for group |
| Date | `DateField` | `import { DateField } from 'govuk-react';` | Day/Month/Year separate inputs |
| DateTime | `DateField` + `InputField` | `import { DateField, InputField } from 'govuk-react';` | Combine DateField + time input |
| Time | `InputField` | `import { InputField } from 'govuk-react';` | Use `type="time"` or custom |
| TextArea | `TextArea` | `import { TextArea } from 'govuk-react';` | Built-in label, hint, error |
| Currency | `InputField` | `import { InputField } from 'govuk-react';` | Use `prefix="£"` or custom |
| Decimal | `InputField` | `import { InputField } from 'govuk-react';` | Use `inputMode="decimal"` |
| Integer | `InputField` | `import { InputField } from 'govuk-react';` | Use `inputMode="numeric"` |
| Percentage | `InputField` | `import { InputField } from 'govuk-react';` | Use `suffix="%"` or custom |
| Phone | `InputField` | `import { InputField } from 'govuk-react';` | Use `type="tel"` |
| Email | `InputField` | `import { InputField } from 'govuk-react';` | Use `type="email"` |
| URL | `InputField` | `import { InputField } from 'govuk-react';` | Use `type="url"` |
| AutoComplete | `Select` | `import { Select } from 'govuk-react';` | GOV.UK uses accessible-autocomplete for this |
| Multiselect | `Checkbox` group | `import { Checkbox } from 'govuk-react';` | GOV.UK uses checkboxes for multi-select |
| RichText | `TextArea` | `import { TextArea } from 'govuk-react';` | Basic fallback; GOV.UK doesn't have rich text |
| Location | `InputField` | `import { InputField } from 'govuk-react';` | Text input fallback |

## Prop Mapping

| MUI Prop | GOV.UK Equivalent | Notes |
|----------|-------------------|-------|
| `error={true}` | `meta={{ error: 'Error message', touched: true }}` | Via `meta` prop on InputField |
| `helperText="text"` | `hint="text"` | Built-in hint prop |
| `variant="outlined"` | N/A | GOV.UK has a single input style |
| `variant="standard"` | N/A | No borderless variant; use `readOnly` display |
| `size="small"` | N/A | GOV.UK has fixed sizing; use `input={{ width: 10 }}` for width hints |
| `fullWidth` | Default behavior | GOV.UK inputs are full width by default |
| `required={true}` | Include "(required)" in label or use custom validation | GOV.UK doesn't show asterisks; relies on clear labeling |
| `disabled={true}` | `disabled={true}` | Same |
| `placeholder="text"` | `placeholder="text"` | Discouraged in GOV.UK guidelines but supported |
| `label="Label"` | `<Label>Label</Label>` or built-in `label` prop | Most GOV.UK components accept `children` as label |
| `multiline` | Use `TextArea` | Separate component |
| `rows={4}` | `rows={4}` | Same on TextArea |
| `slotProps.input.inputProps` | Pass via `input` prop | `<InputField input={{ maxLength, 'data-test-id': testId }}>` |

## Event Handler Mapping

| Component Type | MUI onChange Signature | GOV.UK onChange Signature | Value Extraction |
|----------------|----------------------|--------------------------|------------------|
| InputField | `(event) => event.target.value` | `(event) => event.target.value` | Same — no change needed |
| Select | `(event) => event.target.value` | `(event) => event.target.value` | Same — no change needed |
| Checkbox | `(event) => event.target.checked` | `(event) => event.target.checked` | Same — no change needed |
| Radio | `(event) => event.target.value` | `(event) => event.target.value` | Same — no change needed |
| DateField | `(date: Dayjs) => formatted` | `({ day, month, year })` | Three separate values — combine into date string |

## Form Wrapper Pattern

GOV.UK components have built-in label and error support. No separate `Form.Item` wrapper is needed for most components:

```tsx
import { InputField } from 'govuk-react';

// InputField has built-in label, hint, and error support:
<InputField
  meta={{
    error: status === 'error' ? helperTextToDisplay : undefined,
    touched: status === 'error'
  }}
  hint={status !== 'error' ? helperTextToDisplay : undefined}
  input={{
    name: propName,
    value: inputValue,
    onChange: handleChange,
    onBlur: !readOnly ? handleBlur : undefined,
    maxLength,
    'data-test-id': testId,
    disabled,
    readOnly
  }}
>
  {hideLabel ? undefined : label}
</InputField>
```

For components that DON'T have built-in label/error (like `Select`), use wrappers:

```tsx
import { FormGroup, Label, ErrorText, HintText } from 'govuk-react';

<FormGroup error={status === 'error'}>
  {!hideLabel && <Label>{label}</Label>}
  {helperTextToDisplay && status !== 'error' && <HintText>{helperTextToDisplay}</HintText>}
  {status === 'error' && <ErrorText>{helperTextToDisplay}</ErrorText>}
  <Select
    input={{
      value: selectedValue,
      onChange: handleChange,
      onBlur: !readOnly ? handleBlur : undefined,
      'data-test-id': testId
    }}
  >
    <option value="">Select...</option>
    {options.map(opt => <option key={opt.key} value={opt.key}>{opt.value}</option>)}
  </Select>
</FormGroup>
```

## Styling Approach

- **No makeStyles needed**: Remove all MUI `makeStyles` / `styled-components` for MUI. GOV.UK uses `styled-components` internally (already in the project)
- **BEM classes**: GOV.UK Frontend provides `govuk-` prefixed BEM classes if using raw HTML
- **govuk-react components**: Handle their own styling automatically — no manual class assignment needed
- **Custom styles**: Use `styled-components` (already a dependency) for any custom styling needs
- **Conflict avoidance**: GOV.UK CSS uses `govuk-` prefixed classes — minimal conflict with Cosmos CSS. For extra safety, scope GOV.UK CSS import to a container:
  ```css
  .govuk-scope { /* import govuk styles here */ }
  ```
- **Spacing**: GOV.UK uses `govuk-!-margin-bottom-X` classes. In govuk-react, spacing is built into components.

## Accessibility Notes

GOV.UK Design System has strict accessibility requirements:
- All inputs MUST have associated labels (handled by component props)
- Error messages MUST be linked to inputs via `aria-describedby` (handled by govuk-react)
- Required fields should be indicated in the label text, not with asterisks
- Placeholder text should not be used as a substitute for labels
- Color must not be the only means of conveying error state

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

### TextInput — After (GOV.UK):

```tsx
import { useState, useEffect } from 'react';
import { InputField } from 'govuk-react';

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
    <InputField
      meta={{
        error: status === 'error' ? helperTextToDisplay : undefined,
        touched: status === 'error'
      }}
      hint={status !== 'error' ? helperTextToDisplay : undefined}
      input={{
        name: propName,
        value: inputValue,
        onChange: handleChange,
        onBlur: !readOnly ? handleBlur : undefined,
        placeholder: placeholder ?? '',
        maxLength,
        disabled,
        readOnly,
        'data-test-id': testId
      }}
    >
      {hideLabel ? undefined : (required ? `${label} (required)` : label)}
    </InputField>
  );
}
```

### Dropdown — After (GOV.UK):

```tsx
import { Select, FormGroup, Label, ErrorText, HintText } from 'govuk-react';
// ... SDK imports preserved ...

// In JSX:
<FormGroup error={status === 'error'}>
  {!hideLabel && <Label>{required ? `${label} (required)` : label}</Label>}
  {helperTextToDisplay && status !== 'error' && <HintText>{helperTextToDisplay}</HintText>}
  {status === 'error' && <ErrorText>{helperTextToDisplay}</ErrorText>}
  <Select
    input={{
      value: value || '',
      onChange: handleChange,
      onBlur: !readOnly ? handleBlur : undefined,
      disabled,
      'data-test-id': testId
    }}
  >
    <option value="">{placeholder || 'Select...'}</option>
    {options.map(opt => (
      <option key={opt.key} value={opt.key}>{opt.value}</option>
    ))}
  </Select>
</FormGroup>
```

### DateField — Special Handling (GOV.UK):

GOV.UK `DateField` uses three separate inputs (day, month, year) instead of a single date picker:

```tsx
import { DateField } from 'govuk-react';

// State needs to track individual parts:
const [dateparts, setDateParts] = useState({ day: '', month: '', year: '' });

// On change, combine into YYYY-MM-DD for PConnect:
function handleDateChange(newParts) {
  setDateParts(newParts);
  if (newParts.year && newParts.month && newParts.day) {
    const formatted = `${newParts.year}-${newParts.month.padStart(2, '0')}-${newParts.day.padStart(2, '0')}`;
    handleEvent(actions, 'changeNblur', propName, formatted);
  }
}

<DateField
  errorText={status === 'error' ? helperTextToDisplay : undefined}
  hintText={status !== 'error' ? helperTextToDisplay : undefined}
  input={{
    onInputChange: handleDateChange,
    value: dateparts
  }}
>
  {hideLabel ? undefined : label}
</DateField>
```

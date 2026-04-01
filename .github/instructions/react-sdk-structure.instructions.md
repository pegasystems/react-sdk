---
description: "Use when editing, creating, or transforming override SDK components. Covers PConnect API, component anatomy, MUI imports, helper utilities, and display mode patterns for Pega React SDK overrides."
applyTo: "src/components/override-sdk/**"
---

# React SDK Override Component Structure

## Component Anatomy

Every override component follows this pattern:

```tsx
// 1. React imports
import { useState, useEffect } from 'react';

// 2. UI library imports (THIS IS WHAT GETS REPLACED)
import { TextField } from '@mui/material';

// 3. SDK helper imports (NEVER MODIFY)
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// 4. Props interface extending PConnFieldProps
interface TextInputProps extends PConnFieldProps {
  fieldMetadata?: any;
}

// 5. Component function
export default function TextInput(props: TextInputProps) {
  // 6. Get other components from SDK map
  const FieldValueList = getComponentFromMap('FieldValueList');

  // 7. Destructure props
  const { getPConnect, label, required, disabled, value, validatemessage, status, readOnly, testId, helperText, displayMode, hideLabel, placeholder } = props;

  // 8. PConnect API calls
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;

  // 9. State and derived values
  const helperTextToDisplay = validatemessage || helperText;
  const [inputValue, setInputValue] = useState('');

  // 10. Display mode handlers (KEEP AS-IS)
  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  // 11. Event handlers using SDK utilities
  function handleChange(event) { setInputValue(event?.target?.value); }
  function handleBlur() { handleEvent(actions, 'changeNblur', propName, inputValue); }

  // 12. JSX return (THIS IS WHAT GETS REPLACED)
  return <TextField ... />;
}
```

## Zones: What to Change vs. Preserve

| Zone | Action | Examples |
|------|--------|---------|
| UI imports (zone 2) | **REPLACE** | `@mui/material`, `@mui/x-date-pickers`, `@mui/styles` |
| JSX return (zone 12) | **REPLACE** | MUI components → target DS components |
| Styling | **REPLACE** | `makeStyles`, `sx` prop, `styled-components` for MUI |
| React imports (zone 1) | KEEP | `useState`, `useEffect` |
| SDK imports (zone 3) | KEEP | `handleEvent`, `getComponentFromMap`, types |
| Props interface (zone 4) | KEEP | `PConnFieldProps` extensions |
| PConnect API (zone 8) | KEEP | `getPConnect()`, `getActionsApi()`, etc. |
| Display modes (zone 10) | KEEP | `DISPLAY_ONLY`, `STACKED_LARGE_VAL` checks |
| Event handlers (zone 11) | KEEP logic, adapt binding | `handleEvent` call stays, event extraction may change |

## Field Components — Current MUI Imports

| Component | MUI Imports | Notes |
|-----------|------------|-------|
| TextInput | `TextField` from `@mui/material` | Basic text field |
| Dropdown | `TextField`, `MenuItem` from `@mui/material` | Select with options |
| Checkbox | `Checkbox`, `FormControl`, `FormControlLabel`, `FormGroup`, `FormHelperText`, `FormLabel` from `@mui/material`; `makeStyles` from `@mui/styles` | Single + multi-select |
| RadioButtons | `Radio`, `RadioGroup`, `FormControl`, `FormControlLabel`, `FormLabel`, `FormHelperText` from `@mui/material` | Radio group |
| Date | `DatePicker` from `@mui/x-date-pickers`; uses `dayjs` | Date only |
| DateTime | `DateTimePicker` from `@mui/x-date-pickers`; uses `dayjs` | Date + time |
| Time | `TimePicker` from `@mui/x-date-pickers`; uses `dayjs` | Time only |
| TextArea | `TextField` from `@mui/material` | multiline TextField |
| Currency | `TextField` from `@mui/material`; `NumericFormat` from `react-number-format` | Formatted number |
| Decimal | `TextField` from `@mui/material`; `NumericFormat` from `react-number-format` | Number with decimal |
| Integer | Delegates to `TextInput` via `getComponentFromMap` | No direct MUI |
| Percentage | `TextField` from `@mui/material`; `NumericFormat` from `react-number-format` | Percentage format |
| Phone | `TextField` from `@mui/material` | Phone input |
| Email | Delegates to `TextInput` via `getComponentFromMap` | No direct MUI |
| URL | `TextField` from `@mui/material` | URL input |
| AutoComplete | `Autocomplete`, `TextField` from `@mui/material` | Autocomplete select |
| Multiselect | MUI `Autocomplete` with `multiple` | Multi-select chips |
| RichText | Custom rich text editor | Complex component |
| Location | `TextField` from `@mui/material` + geolocation | Map/location |

## SDK Helper Imports (Never Modify)

```tsx
// Event handling — fires PConnect actions on change/blur
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';

// Component map — gets registered components by name
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

// Type definitions for component props
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// Data page fetching for dropdowns/lists
import { getDataPage } from '@pega/react-sdk-components/lib/components/helpers/data_page';

// Formatting utilities
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';

// Date formatting
import { dateFormatInfoDefault, getDateFormatInfo } from '@pega/react-sdk-components/lib/components/helpers/date-format-utils';

// Instructions utilities (for Checkbox multi-select)
import { insertInstruction, deleteInstruction, updateNewInstuctions } from '@pega/react-sdk-components/lib/components/helpers/instructions-utils';
```

## Display Mode Pattern

Most field components handle two read-only display modes. Always preserve this pattern:

```tsx
if (displayMode === 'DISPLAY_ONLY') {
  return <FieldValueList name={hideLabel ? '' : label} value={value} />;
}
if (displayMode === 'STACKED_LARGE_VAL') {
  return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
}
```

## Test ID Pattern

Components pass `data-test-id` for E2E testing:

```tsx
const testProps: any = { 'data-test-id': testId };
// Apply to the actual input element
```

Always ensure the target DS component supports passing `data-test-id` to the underlying input element.

---
name: design-system-transform
description: "Transform Pega React SDK override components from MUI to a target design system. Use when overriding components to Ant Design, GOV.UK Design, or any other registered design system. Handles import replacement, JSX transformation, prop mapping, and styling migration."
argument-hint: "Component name and target design system, e.g. 'TextInput to ant-design'"
---

# Design System Transformation Skill

## When to Use

- Transforming an override component from MUI to a target design system
- After running `npm run override` to generate the MUI-based starting code
- When asked to convert a component to Ant Design, GOV.UK Design, or any design system in `.github/design-systems/`

## Procedure

### Step 1: Read the Override Component

Read the generated override file at `src/components/override-sdk/<type>/<ComponentName>/<ComponentName>.tsx`.

Identify:
- All `@mui/*` imports (these will be replaced)
- All `@pega/*` imports (these must be preserved)
- The JSX return block (will be rewritten)
- Any `makeStyles` or `styled-components` usage (will be replaced)
- Event handler functions and how they extract values

### Step 2: Load the Target Design System Config

Read the design system config from `.github/design-systems/<designSystem>.md`.

Extract:
- **Package name** and install command
- **Component mapping table**: SDK component → DS component → import path
- **Prop mapping table**: MUI prop → DS equivalent
- **Event handler mapping**: how onChange/onBlur signatures differ
- **Form wrapper pattern**: how to render labels, validation, help text
- **Styling approach**: CSS modules, className, tokens, etc.

### Step 3: Install DS Package (if needed)

Check if the package is installed:
```bash
ls node_modules/<package-name>/package.json
```

If not found, install it:
```bash
npm install <package-name> [peer-dependencies]
```

### Step 4: Transform the Component

Apply transformations in this exact order:

#### 4a. Replace Imports

```
REMOVE: import { TextField } from '@mui/material';
ADD:    import { Input } from 'antd';  // (example for Ant Design)
```

Remove ALL `@mui/*` imports. Add target DS imports per the mapping table.

#### 4b. Replace Styling

```
REMOVE: import makeStyles from '@mui/styles/makeStyles';
REMOVE: const useStyles = makeStyles(() => ({ ... }));
REMOVE: const classes = useStyles();
ADD:    (target DS styling approach from config)
```

#### 4c. Rewrite JSX Return

Map each MUI component to its DS equivalent using the config's component and prop mapping tables.

**Critical rules:**
- Preserve ALL `data-test-id` attributes (move them to the actual input element)
- Preserve the `readOnly` prop handling
- Preserve `disabled`, `required`, `placeholder` props (map names if needed)
- If DS needs a form wrapper (like Ant `Form.Item` or GOV.UK `FormGroup`), add it around the input

#### 4d. Adapt Event Handlers

If the target component's `onChange` signature differs:
- MUI TextField: `(event) => event.target.value`
- Ant Select: `(value) => value` (direct)
- Ant DatePicker: `(date, dateString) => dateString`

Update the `handleChange` function body while keeping the `handleEvent` call to PConnect unchanged.

### Step 5: Preserve SDK Zones (Mandatory)

**NEVER modify any of the following:**

```tsx
// PConnect API
const pConn = getPConnect();
const actions = pConn.getActionsApi();
const propName = (pConn.getStateProps() as any).value;

// Display mode checks
if (displayMode === 'DISPLAY_ONLY') { ... }
if (displayMode === 'STACKED_LARGE_VAL') { ... }

// Event handler SDK calls
handleEvent(actions, 'changeNblur', propName, inputValue);

// Component map calls
const FieldValueList = getComponentFromMap('FieldValueList');

// All imports from @pega/react-sdk-components/lib/
```

### Step 6: Validate

1. Run `get_errors` on the transformed file
2. If TypeScript errors exist, diagnose using `.github/instructions/error-patterns.instructions.md`
3. Fix errors and re-validate (max 3 iterations)

### Step 7: Build Check

```bash
npm run build:dev
```

If build fails, read the error output, fix, and rebuild.

### Step 8: Start Dev Server

```bash
npm run start-dev
```

Report the local URL to the user for visual verification.

## Example Transformation (TextInput → Ant Design)

### Before (MUI):
```tsx
import { TextField } from '@mui/material';
// ...
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
    slotProps={{ input: { ...readOnlyProp, inputProps: { maxLength, ...testProps } } }}
  />
);
```

### After (Ant Design):
```tsx
import { Input, Form } from 'antd';
// ...
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
    />
  </Form.Item>
);
```

## Resources

- Design system configs: [.github/design-systems/](../../design-systems/)
- Error patterns: [.github/instructions/error-patterns.instructions.md](../../instructions/error-patterns.instructions.md)
- SDK structure: [.github/instructions/react-sdk-structure.instructions.md](../../instructions/react-sdk-structure.instructions.md)

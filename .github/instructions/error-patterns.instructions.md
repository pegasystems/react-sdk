---
description: "Use when debugging or fixing errors in override SDK components. Covers common TypeScript, import, styling, and runtime errors during design system transformation."
applyTo: "src/components/override-sdk/**"
---

# Error Patterns in Override Components

## 1. Missing Package / Module Not Found

**Symptom**: `Cannot find module 'antd'` or `Cannot find module 'govuk-react'`

**Root Cause**: Target design system package not installed.

**Fix**:
```bash
# For Ant Design
npm install antd @ant-design/icons

# For GOV.UK Design
npm install govuk-react @govuk-react/icons govuk-frontend
```

---

## 2. Missing Named Export

**Symptom**: `Module '"antd"' has no exported member 'TextInput'`

**Root Cause**: Wrong component name used for the target design system. Each DS has different naming.

**Fix**: Check the design system config file in `.github/design-systems/<name>.md` for the correct component name and import path.

---

## 3. TypeScript Prop Type Mismatch

**Symptom**: `Type '{ variant: string; error: boolean; }' is not assignable to type 'IntrinsicAttributes & InputProps'`

**Root Cause**: MUI prop names don't exist on the target DS component.

**Fix**: Consult the prop mapping table in the design system config. Common mappings:
- MUI `error={true}` → Ant Design `status="error"`
- MUI `helperText="..."` → Ant Design uses `Form.Item` `help` prop
- MUI `variant="outlined"` → Ant Design `variant="outlined"` (or remove, as it's the default)
- MUI `size="small"` → Ant Design `size="small"` (same) or GOV.UK (not applicable)
- MUI `fullWidth` → Ant Design `style={{ width: '100%' }}` or GOV.UK (default full width)

---

## 4. makeStyles / styled-components Migration

**Symptom**: `Cannot find module '@mui/styles/makeStyles'` or runtime style errors

**Root Cause**: MUI's `makeStyles` was removed but replacement styling wasn't added.

**Fix**:
- **Ant Design**: Remove `makeStyles`, use `className` with Ant's built-in styles or CSS modules
- **GOV.UK**: Remove `makeStyles`, use `govuk-` BEM class names directly

---

## 5. Date Picker Library Conflict

**Symptom**: `Cannot find module '@mui/x-date-pickers'` or incompatible date formats

**Root Cause**: MUI date pickers use `@mui/x-date-pickers` + `dayjs`. Target DS may use different date library.

**Fix**:
- **Ant Design**: Uses its own `DatePicker` from `antd` with built-in `dayjs` support. Remove `@mui/x-date-pickers` import, keep `dayjs` import.
- **GOV.UK**: Uses `DateField` with day/month/year individual inputs. Remove both `@mui/x-date-pickers` and adapt date handling.

---

## 6. Event Handler Signature Mismatch

**Symptom**: `event?.target?.value` is undefined, or `onChange` callback has different signature

**Root Cause**: Different DS components pass different arguments to `onChange`.

**Fix**:
- MUI `TextField onChange`: `(event) => event.target.value`
- Ant Design `Input onChange`: `(event) => event.target.value` (same)
- Ant Design `Select onChange`: `(value) => value` (direct value, no event)
- Ant Design `DatePicker onChange`: `(date, dateString) => dateString`
- GOV.UK `InputField onChange`: `(event) => event.target.value` (same)

Adapt the `handleChange` function to extract the value correctly for the target component.

---

## 7. Missing Form Wrapper

**Symptom**: Labels, validation messages, or required indicators not displaying

**Root Cause**: MUI components have built-in label/error/helper support. Other DS libraries need explicit wrappers.

**Fix**:
- **Ant Design**: Wrap with `Form.Item` for `label`, `required`, `help`, `validateStatus`
- **GOV.UK**: Use `FormGroup` + `Label` + `ErrorMessage` + `HintText` pattern

---

## 8. Build Error: Unused Imports

**Symptom**: `'TextField' is declared but its value is never read` (after replacing MUI components)

**Root Cause**: Old MUI imports left behind after transformation.

**Fix**: Remove all unused MUI imports. Ensure no `@mui/*` imports remain unless intentionally needed.

---

## 9. Runtime: Component Not Rendering

**Symptom**: Blank space where component should appear, no console errors

**Root Cause**: The override component is not registered in `sdk-local-component-map.js`.

**Fix**: Verify the component is properly registered:
```js
// sdk-local-component-map.js
import TextInput from './src/components/override-sdk/field/TextInput';
const localSdkComponentMap = {
  TextInput,
};
```

---

## 10. CSS/Style Conflicts

**Symptom**: Components look broken, overlapping styles, wrong spacing

**Root Cause**: Pega Cosmos CSS conflicts with the target DS global styles.

**Fix**:
- **Ant Design**: Use `ConfigProvider` with `prefixCls` to namespace Ant styles, or use CSS modules
- **GOV.UK**: Scope GOV.UK styles under a container class to avoid global CSS bleeding

---

## Error Resolution Loop

When fixing errors, follow this sequence:
1. Run `get_errors` on the file
2. Categorize the error using patterns above
3. Apply the fix
4. Re-run `get_errors` to verify
5. If new errors appear, repeat (max 3 iterations)
6. If stuck after 3 iterations, report the remaining errors to the user

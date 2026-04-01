# Design System Configuration Template

Use this template to add a new design system. Copy this file, rename to `<design-system-name>.md`, and fill in all sections.

---

## Package Info

| Field | Value |
|-------|-------|
| Package name | `<npm-package-name>` |
| Version | `^x.y.z` |
| Peer dependencies | `<list peer deps>` |
| Install command | `npm install <package> <peers>` |

## Component Mapping

Map each SDK field component to its equivalent in the target design system.

| SDK Component | DS Component | Import Statement | Notes |
|---------------|-------------|------------------|-------|
| TextInput | `<Component>` | `import { Component } from '<package>';` | |
| Dropdown | `<Component>` | `import { Component } from '<package>';` | |
| Checkbox | `<Component>` | `import { Component } from '<package>';` | |
| RadioButtons | `<Component>` | `import { Component } from '<package>';` | |
| Date | `<Component>` | `import { Component } from '<package>';` | |
| DateTime | `<Component>` | `import { Component } from '<package>';` | |
| Time | `<Component>` | `import { Component } from '<package>';` | |
| TextArea | `<Component>` | `import { Component } from '<package>';` | |
| Currency | `<Component>` | `import { Component } from '<package>';` | |
| Decimal | `<Component>` | `import { Component } from '<package>';` | |
| Integer | `<Component>` | `import { Component } from '<package>';` | Delegates to TextInput in default SDK |
| Percentage | `<Component>` | `import { Component } from '<package>';` | |
| Phone | `<Component>` | `import { Component } from '<package>';` | |
| Email | `<Component>` | `import { Component } from '<package>';` | Delegates to TextInput in default SDK |
| URL | `<Component>` | `import { Component } from '<package>';` | |
| AutoComplete | `<Component>` | `import { Component } from '<package>';` | |
| Multiselect | `<Component>` | `import { Component } from '<package>';` | |
| RichText | `<Component>` | `import { Component } from '<package>';` | |
| Location | `<Component>` | `import { Component } from '<package>';` | |

## Prop Mapping

Map MUI props to the target design system equivalents.

| MUI Prop | DS Equivalent | Notes |
|----------|--------------|-------|
| `error={true}` | | |
| `helperText="text"` | | |
| `variant="outlined"` | | |
| `size="small"` | | |
| `fullWidth` | | |
| `required={true}` | | |
| `disabled={true}` | | |
| `placeholder="text"` | | |
| `label="Label"` | | |
| `multiline` | | |
| `rows={4}` | | |
| `slotProps.input.inputProps` | | How to pass data-test-id, maxLength |

## Event Handler Mapping

| Component Type | MUI onChange Signature | DS onChange Signature | Value Extraction |
|----------------|----------------------|---------------------|------------------|
| Text Input | `(event) => event.target.value` | | |
| Select/Dropdown | `(event) => event.target.value` | | |
| Checkbox | `(event) => event.target.checked` | | |
| Date Picker | `(date) => getFormattedDate(date)` | | |
| Autocomplete | `(event, value) => value` | | |

## Form Wrapper Pattern

Describe how the DS renders labels, required indicators, validation errors, and help text.

```tsx
// Example wrapper pattern:
```

## Styling Approach

Describe how to handle component styling:
- How to apply custom styles
- How to handle layout (full width, spacing)
- How to integrate with existing Pega Cosmos CSS
- How to scope styles to avoid conflicts

## Example Transformation

### TextInput — Before (MUI):
```tsx
// Paste full MUI TextInput component
```

### TextInput — After (Target DS):
```tsx
// Paste fully transformed component
```

---
description: "Override and transform multiple Pega React SDK components to a target design system in batch"
agent: "override-agent"
argument-hint: "e.g. 'all field components to ant-design' or 'TextInput, Dropdown, Checkbox to gov-uk-design'"
---

Override and transform multiple React SDK components to a target design system in a single batch operation.

## Input

The user will provide:
- **Components**: A comma-separated list of component names, OR one of these shortcuts:
  - `all-fields` — all 27 field components
  - `core-fields` — TextInput, Dropdown, Checkbox, RadioButtons, Date, TextArea, Currency, AutoComplete
  - A comma-separated list like `TextInput, Dropdown, Checkbox`
- **Design system**: The target design system (e.g., `ant-design`, `gov-uk-design`)

Parse these from the user's input. If unclear, ask.

## Component Shortcuts

### `core-fields` (8 components):
TextInput, Dropdown, Checkbox, RadioButtons, Date, TextArea, Currency, AutoComplete

### `all-fields` (27 components):
AutoComplete, CancelAlert, Checkbox, Currency, Date, DateTime, Decimal, Dropdown, Email, Group, Integer, Location, Multiselect, ObjectReference, Percentage, Phone, RadioButtons, RichText, ScalarList, SelectableCard, SemanticLink, TextArea, TextContent, TextInput, Time, URL, UserReference

## Task

For each component in the list:

1. Track progress using the todo list — create one todo per component
2. **Run override**: Execute `npm run override` for the component
3. **Read DS config**: Load `.github/design-systems/<designSystem>.md`
4. **Transform**: Rewrite the component from MUI to the target DS
5. **Validate**: Check for errors, fix up to 3 iterations
6. Mark the component as completed in the todo list
7. Move to the next component

After all components are done:
1. **Build**: Run `npm run build:dev` to confirm no regressions
2. **Serve**: Start `npm run start-dev` and report the URL

## Output

Report a summary table:

| Component | Status | DS Component Used | Errors Fixed |
|-----------|--------|-------------------|-------------|
| TextInput | Done | Input (antd) | 0 |
| Dropdown | Done | Select (antd) | 1 |
| ... | ... | ... | ... |

Plus the dev server URL for visual verification.

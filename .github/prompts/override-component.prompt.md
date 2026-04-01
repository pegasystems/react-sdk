---
description: "Override a single Pega React SDK component and transform it to a target design system (Ant Design, GOV.UK, etc.)"
agent: "override-agent"
argument-hint: "e.g. 'TextInput to ant-design' or 'Dropdown to gov-uk-design'"
---

Override and transform a single React SDK component to a target design system.

## Input

The user will provide:
- **Component name**: The SDK component to override (e.g., TextInput, Dropdown, Checkbox, RadioButtons, Date, TextArea, Currency, AutoComplete)
- **Design system**: The target design system (e.g., `ant-design`, `gov-uk-design`)

Parse these from the user's input. If unclear, ask.

## Task

1. **Verify environment**: Ensure `node_modules` exists, install DS package if missing
2. **Run override**: Execute `npm run override` for the specified component
3. **Read DS config**: Load `.github/design-systems/<designSystem>.md`
4. **Transform**: Rewrite the override component from MUI to the target DS
5. **Validate**: Check for TypeScript/lint errors, fix up to 3 iterations
6. **Build**: Run `npm run build:dev` to confirm no regressions
7. **Serve**: Run `npm run start-dev` and report the URL

## Output

Report:
- Which file was created/modified
- What MUI components were replaced with what DS components
- Whether the build succeeded
- The dev server URL for visual verification

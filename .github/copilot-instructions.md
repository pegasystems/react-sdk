# React SDK — Copilot Workspace Instructions

## Repository Overview

This is the **Pega React SDK** repository. It renders Pega Constellation DX components using React. The default UI layer uses **MUI (Material UI)** and **Pega Cosmos** components. Developers override components to swap them to a different design system.

## Key Paths

| Path | Purpose |
|------|---------|
| `src/components/override-sdk/` | Override components live here (field, infra, template, widget, designSystemExtension) |
| `sdk-local-component-map.js` | Registers local/override components so the SDK loads them instead of defaults |
| `node_modules/@pega/react-sdk-overrides/lib/` | Default MUI-based override component source (read-only reference) |
| `node_modules/@pega/react-sdk-components/lib/` | Core SDK helpers (event-utils, data_page, formatters, sdk_component_map) |
| `sdk-config.json` | Server URL, auth, app config |
| `.github/design-systems/` | Design system configuration files — one per target DS |

## Override Mechanism

1. Run `npm run override` → interactive prompt asks which component to override
2. The `dx-component-builder-sdk override` tool copies the default MUI component into `src/components/override-sdk/<type>/<ComponentName>/`
3. It also updates `sdk-local-component-map.js` to register the override
4. Developer then modifies the override file to use a different design system
5. The SDK automatically loads override components instead of defaults at runtime

## Component Categories

| Category | Count | Examples |
|----------|-------|---------|
| field | 27 | TextInput, Dropdown, Checkbox, RadioButtons, Date, DateTime, TextArea, Currency, AutoComplete, etc. |
| infra | 15 | Assignment, NavBar, View, Region, RootContainer, Stages, etc. |
| template | 30 | CaseView, DefaultForm, SimpleTable, ListView, TwoColumn, etc. |
| widget | 9 | Attachment, CaseHistory, ToDo, FileUtility, etc. |
| designSystemExtension | 11 | FieldValueList, FieldGroup, AlertBanner, RichTextEditor, etc. |

## Dev Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run override` | Override a single component (interactive) |
| `npm run overrideAll` | Override all components |
| `npm run build:dev` | Development build |
| `npm run start-dev` | Start webpack dev server (HTTP) |
| `npm run start-dev-https` | Start webpack dev server (HTTPS) |
| `npm run lint` | Run ESLint + Prettier checks |

## Design System Override Workflow

When asked to override a component to a specific design system:

1. Check `.github/design-systems/` for the target design system config file
2. The config file contains: package info, component mappings, prop mappings, styling approach, and example transformations
3. Available design systems: `ant-design`, `gov-uk-design` (add more by creating new files from `_template.md`)

## PConnect API — Do Not Modify

Every override component receives `getPConnect()` which provides the Pega runtime API. This code must **never** be changed during design system transformation:

- `getPConnect()`, `getActionsApi()`, `getStateProps()`, `getCaseInfo()`
- `getComponentFromMap()` calls
- `handleEvent()` calls from `event-utils`
- All imports from `@pega/react-sdk-components/lib/`
- State management (`useState`, `useEffect`) tied to PConnect data flow
- `PConnFieldProps` type and its extensions

Only the **UI rendering layer** (imports from `@mui/*`, JSX components, styling) should be replaced.

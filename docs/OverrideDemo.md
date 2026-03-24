# SDK Component Override Demo

This demo shows how to **override an SDK component** and **swap the design system at runtime** — no rebuild needed.

## Overview

The Pega React SDK resolves components via a `SdkComponentMap` singleton that has two layers:

| Layer | Priority | Source |
|-------|----------|--------|
| `localComponentMap` | **1st (highest)** | Your overrides in `sdk-local-component-map.js` |
| `pegaProvidedComponentMap` | 2nd | SDK defaults from `@pega/react-sdk-components` |

When any component is requested (via `getComponentFromMap('TextInput')` or the internal `react_pconnect` bridge), the **local map is checked first**. If an entry exists there, it wins over the Pega-provided default.

## File Locations

| File | Purpose |
|------|---------|
| `src/components/override-sdk/field/TextInput/PlainCssTextInput.tsx` | Override component — renders a native `<input>` styled with plain CSS instead of MUI `<TextField>` |
| `src/components/override-sdk/field/TextInput/PlainCssTextInput.css` | Namespaced CSS styles for the override (blue border, "Custom DS" badge) |
| `src/components/override-sdk/OverrideToggle.tsx` | Toggle switch UI + `useOverrideToggle()` hook for runtime swapping |
| `src/samples/OverrideDemo/index.tsx` | Standalone demo page at `/override-demo` |
| `src/components/custom-sdk/field/TextInputOverrideDemo/TextInputOverrideDemo.stories.tsx` | Storybook story |
| `sdk-local-component-map.js` | Static override entry point (commented-out example added) |
| `tests/unit/components/PlainCssTextInput.test.tsx` | Unit test |
| `tests/e2e/OverrideDemo/override-toggle.spec.js` | Playwright e2e test |

## How the Override Works

1. **`PlainCssTextInput`** implements the exact same props contract as the SDK's `TextInput` (`PConnFieldProps + { fieldMetadata? }`) but renders a native `<input>` with custom CSS instead of MUI's `<TextField>`.

2. **Static override** (always active, requires restart):
   ```js
   // sdk-local-component-map.js
   import PlainCssTextInput from './src/components/override-sdk/field/TextInput/PlainCssTextInput';

   const localSdkComponentMap = {
     TextInput: PlainCssTextInput,
   };
   ```

3. **Runtime override** (toggle on/off, no rebuild):
   ```ts
   import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
   import PlainCssTextInput from './components/override-sdk/field/TextInput/PlainCssTextInput';

   // Enable override
   const current = SdkComponentMap.getLocalComponentMap();
   SdkComponentMap.setLocalComponentMap({ ...current, TextInput: PlainCssTextInput });

   // Disable override (restore default)
   const map = { ...SdkComponentMap.getLocalComponentMap() };
   delete map.TextInput;
   SdkComponentMap.setLocalComponentMap(map);
   ```

## How the Runtime Toggle Works

The `OverrideToggle` component (and `useOverrideToggle` hook):
1. Calls `SdkComponentMap.setLocalComponentMap()` to add or remove the `TextInput` entry.
2. Increments a React `key` on the component tree to force a re-mount — this makes each `getComponentFromMap('TextInput')` call resolve the updated entry.
3. Switching is instantaneous with no page reload or rebuild.

## Commands to Run

### Dev Server (standalone demo page)

```bash
npm run start-dev
# Open http://localhost:3502/override-demo
```

### Storybook

```bash
npm run storybookSDK
# Opens on http://localhost:6040
# Navigate to "Override Demo / TextInput" in the sidebar
```

### Unit Tests

```bash
npx jest tests/unit/components/PlainCssTextInput.test.tsx
```

### E2E Tests

```bash
# In one terminal: start the dev server
npm run start-dev

# In another terminal: run the Playwright test
npx playwright test tests/e2e/OverrideDemo/override-toggle.spec.js
```

## Extending to Other Components

To override additional components, follow the same pattern:

1. Create your override in `src/components/override-sdk/<type>/<ComponentName>/`.
2. Match the props contract of the original (check the `.d.ts` file in `node_modules/@pega/react-sdk-components/lib/components/`).
3. Register in the local component map:
   ```js
   SdkComponentMap.setLocalComponentMap({
     ...SdkComponentMap.getLocalComponentMap(),
     TextInput: PlainCssTextInput,
     Dropdown: MyCustomDropdown,
     Email: MyCustomEmail
   });
   ```

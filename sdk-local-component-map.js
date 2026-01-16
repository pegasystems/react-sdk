// Statically load all "local" components that aren't yet in the npm package

import AppShell from './src/components/override-sdk/template/AppShell/';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  AppShell: AppShell
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;

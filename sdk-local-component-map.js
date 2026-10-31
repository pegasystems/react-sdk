// Statically load all "local" components that aren't yet in the npm package

// import sdkMediaCoComponentMap from './src/samples/mediaco/sdk-mediaco-component-map';
import sdkSiemensPocComponentMap from './src/samples/siemens-poc/sdk-siemens-poc-component-map';

/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  // ...sdkMediaCoComponentMap
  ...sdkSiemensPocComponentMap
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;

// Statically load all "local" components that aren't yet in the npm package

// import sdkMediaCoComponentMap from './src/samples/mediaco/sdk-mediaco-component-map';

// Override demo: uncomment the line below to statically override TextInput at startup
// import PlainCssTextInput from './src/components/override-sdk/field/TextInput/PlainCssTextInput';

/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  // ...sdkMediaCoComponentMap
  // TextInput: PlainCssTextInput,  // Override demo: uncomment to always use PlainCssTextInput
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;

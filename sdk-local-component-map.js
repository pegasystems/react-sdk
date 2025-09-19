// Statically load all "local" components that aren't yet in the npm package

import TextInput from './src/components/override-sdk/field/TextInput/TextInput';

import TextArea from './src/components/override-sdk/field/TextArea/';
import Date from './src/components/override-sdk/field/Date/';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  TextArea: TextArea,
  Date: Date,
  /* map end - DO NOT REMOVE */
  TextInput
};

export default localSdkComponentMap;

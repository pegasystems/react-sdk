// Statically load all "local" components that aren't yet in the npm package

import FieldCheckbox from './src/components/override-sdk/field/Checkbox/';
import FieldTextInput from './src/components/override-sdk/field/TextInput/';
/*import end - DO NOT REMOVE*/

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  "Checkbox" : FieldCheckbox,
  "TextInput" : FieldTextInput,
/*map end - DO NOT REMOVE*/
};

export default localSdkComponentMap;

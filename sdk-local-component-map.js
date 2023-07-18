// Statically load all "local" components that aren't yet in the npm package

import FieldCheckbox from './src/components/override-sdk/field/Checkbox/';
import FieldTextInput from './src/components/override-sdk/field/TextInput/';
import FieldDate from './src/components/override-sdk/field/Date/';
import ChangeLink from './src/components/custom-sdk/field/ChangeLink/'
import CheckAnswers from './src/components/custom-sdk/template/CheckAnswers/'
/*import end - DO NOT REMOVE*/

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  "Checkbox" : FieldCheckbox,
  "TextInput" : FieldTextInput,
  "Date" : FieldDate,
  "HMRC_ODX_CheckAnswers" : CheckAnswers,
  "HMRC_ODX_ChangeLink" : ChangeLink,
/*map end - DO NOT REMOVE*/
};

export default localSdkComponentMap;

// Statically load all "local" components that aren't yet in the npm package

import TextInput from './src/components/override-sdk/field/TextInput/';
import AutoComplete from './src/components/override-sdk/field/AutoComplete/';
import Checkbox from './src/components/override-sdk/field/Checkbox/';
import Date from './src/components/override-sdk/field/Date/';
import Dropdown from './src/components/override-sdk/field/Dropdown/';
import Phone from './src/components/override-sdk/field/Phone/';
import RadioButtons from './src/components/override-sdk/field/RadioButtons/';
import RichText from './src/components/override-sdk/field/RichText/';
import ActionButtons from './src/components/override-sdk/infra/ActionButtons/';
import TextArea from './src/components/override-sdk/field/TextArea/';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  TextInput: TextInput,
  AutoComplete: AutoComplete,
  Checkbox: Checkbox,
  Date: Date,
  Dropdown: Dropdown,
  Phone: Phone,
  RadioButtons: RadioButtons,
  RichText: RichText,
  ActionButtons: ActionButtons,
  TextArea: TextArea
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;

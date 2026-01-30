// Statically load all "local" components that aren't yet in the npm package
// import MediaCoTodo from '@pega/react-sdk-components/lib/mediaco/ToDo';

import TextArea from './src/components/override-sdk/field/TextArea/';
import Date from './src/components/override-sdk/field/Date/';
import Checkbox from './src/components/override-sdk/field/Checkbox';
import Email from './src/components/override-sdk/field/Email';
import Integer from './src/components/override-sdk/field/Integer';
import DateTime from './src/components/override-sdk/field/DateTime';
import TextInput from './src/components/override-sdk/field/TextInput';
import WssQuickCreate from './src/components/override-sdk/designSystemExtension/WssQuickCreate/';
import QuickCreate from './src/components/override-sdk/widget/QuickCreate/';
import Banner from './src/components/override-sdk/designSystemExtension/Banner/';
import WssNavBar from './src/components/override-sdk/template/WssNavBar/';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  // Todo: MediaCoTodo,
  WssQuickCreate: WssQuickCreate,
  QuickCreate: QuickCreate,
  Banner: Banner,
  WssNavBar: WssNavBar,
  /* map end - DO NOT REMOVE */
  TextArea,
  Date,
  TextInput,
  Checkbox,
  Email,
  Integer,
  DateTime,
  AutoComplete: TextInput
};

export default localSdkComponentMap;

// Statically load all "local" components that aren't yet in the npm package
// import MediaCoTodo from '@pega/react-sdk-components/lib/mediaco/ToDo';

import TextArea from './src/components/override-sdk/field/TextArea/';
import Date from './src/components/override-sdk/field/Date/';
import Checkbox from './src/components/override-sdk/field/Checkbox';
import Email from './src/components/override-sdk/field/Email';
import Integer from './src/components/override-sdk/field/Integer';
import DateTime from './src/components/override-sdk/field/DateTime';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  // Todo: MediaCoTodo,
  /* map end - DO NOT REMOVE */
  TextInput,
  Checkbox,
  Email,
  Integer,
  DateTime
};

export default localSdkComponentMap;

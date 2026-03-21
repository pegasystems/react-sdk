// Statically load all "local" components that aren't yet in the npm package
// import MediaCoTodo from '@pega/react-sdk-components/lib/mediaco/ToDo';

import TextInput from './src/components/override-sdk/field/TextInput/';
import Dropdown from './src/components/override-sdk/field/Dropdown/';
import Checkbox from './src/components/override-sdk/field/Checkbox/';
import AutoComplete from './src/components/override-sdk/field/AutoComplete/';
import DateTime from './src/components/override-sdk/field/DateTime/';
// eslint-disable-next-line no-redeclare
import Date from './src/components/override-sdk/field/Date/';
import Currency from './src/components/override-sdk/field/Currency/';
import Decimal from './src/components/override-sdk/field/Decimal/';
import Email from './src/components/override-sdk/field/Email/';
import Integer from './src/components/override-sdk/field/Integer/';
// eslint-disable-next-line no-redeclare
import Percentage from './src/components/override-sdk/field/Percentage/';
import RadioButtons from './src/components/override-sdk/field/RadioButtons/';
import RichText from './src/components/override-sdk/field/RichText/';
import TextArea from './src/components/override-sdk/field/TextArea/';
import Time from './src/components/override-sdk/field/Time/';
import Url from './src/components/override-sdk/field/URL/';
import ActionButtons from './src/components/override-sdk/infra/ActionButtons/';
import FieldValueList from './src/components/override-sdk/designSystemExtension/FieldValueList/';
import MultiStep from './src/components/override-sdk/infra/MultiStep/';
import DefaultForm from './src/components/override-sdk/template/DefaultForm/';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  // ...sdkMediaCoComponentMap,
  TextInput: TextInput,
  Dropdown: Dropdown,
  Checkbox: Checkbox,
  AutoComplete: AutoComplete,
  DateTime: DateTime,
  Date: Date,
  Currency: Currency,
  Decimal: Decimal,
  Email: Email,
  Integer: Integer,
  Percentage: Percentage,
  RadioButtons: RadioButtons,
  RichText: RichText,
  TextArea: TextArea,
  Time: Time,
  URL: Url,
  ActionButtons: ActionButtons,
  FieldValueList: FieldValueList,
  MultiStep: MultiStep,
  DefaultForm: DefaultForm
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;

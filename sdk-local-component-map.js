// Statically load all "local" components that aren't yet in the npm package
// import MediaCoTodo from '@pega/react-sdk-components/lib/mediaco/ToDo';

import TextInput from './src/components/override-sdk/field/TextInput/';
import Dropdown from './src/components/override-sdk/field/Dropdown/';
import Checkbox from './src/components/override-sdk/field/Checkbox/';
import AutoComplete from './src/components/override-sdk/field/AutoComplete/';
import DateTime from './src/components/override-sdk/field/DateTime/';
import Date from './src/components/override-sdk/field/Date/';
import CancelAlert from './src/components/override-sdk/field/CancelAlert/';
import Currency from './src/components/override-sdk/field/Currency/';
import Decimal from './src/components/override-sdk/field/Decimal/';
import Email from './src/components/override-sdk/field/Email/';
import Group from './src/components/override-sdk/field/Group/';
import Integer from './src/components/override-sdk/field/Integer/';
import Location from './src/components/override-sdk/field/Location/';
import Multiselect from './src/components/override-sdk/field/Multiselect/';
import ObjectReference from './src/components/override-sdk/field/ObjectReference/';
import Percentage from './src/components/override-sdk/field/Percentage/';
import Phone from './src/components/override-sdk/field/Phone/';
import RadioButtons from './src/components/override-sdk/field/RadioButtons/';
import RichText from './src/components/override-sdk/field/RichText/';
import ScalarList from './src/components/override-sdk/field/ScalarList/';
import SemanticLink from './src/components/override-sdk/field/SemanticLink/';
import SelectableCard from './src/components/override-sdk/field/SelectableCard/';
import TextArea from './src/components/override-sdk/field/TextArea/';
import TextContent from './src/components/override-sdk/field/TextContent/';
import Time from './src/components/override-sdk/field/Time/';
import Url from './src/components/override-sdk/field/URL/';
import UserReference from './src/components/override-sdk/field/UserReference/';
import ActionButtons from './src/components/override-sdk/infra/ActionButtons/';
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
  CancelAlert: CancelAlert,
  Currency: Currency,
  Decimal: Decimal,
  Email: Email,
  Group: Group,
  Integer: Integer,
  Location: Location,
  Multiselect: Multiselect,
  ObjectReference: ObjectReference,
  Percentage: Percentage,
  Phone: Phone,
  RadioButtons: RadioButtons,
  RichText: RichText,
  ScalarList: ScalarList,
  SemanticLink: SemanticLink,
  SelectableCard: SelectableCard,
  TextArea: TextArea,
  TextContent: TextContent,
  Time: Time,
  URL: Url,
  UserReference: UserReference,
  ActionButtons: ActionButtons
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;

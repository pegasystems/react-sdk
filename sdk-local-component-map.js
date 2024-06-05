/* eslint-disable object-shorthand */
// Statically load all "local" components that aren't yet in the npm package
import WssNavBar from './src/components/override-sdk/template/WssNavBar/';
import WssQuickCreate from './src/components/override-sdk/designSystemExtension/WssQuickCreate/';
import Banner from './src/components/override-sdk/designSystemExtension/Banner/';
import ToDo from './src/components/override-sdk/widget/ToDo/';
import AppShell from './src/components/override-sdk/template/AppShell/';
import QuickCreate from './src/components/override-sdk/widget/QuickCreate/';
import AssignmentCard from './src/components/override-sdk/infra/AssignmentCard/';
import ActionButtons from './src/components/override-sdk/infra/ActionButtons/';
import ListView from './src/components/override-sdk/template/ListView/';
import Confirmation from './src/components/override-sdk/template/Confirmation/';
import Region from './src/components/override-sdk/widget/Region';
import TextInput from '@pega/react-sdk-components/lib/components/field/TextInput';
import View from './src/components/override-sdk/infra/View/';
import FlowContainer from './src/components/override-sdk/infra/FlowContainer';
import CaseView from '@pega/react-sdk-components/lib/components/template/CaseView/CaseView';
import Details from './src/components/override-sdk/template/Details/';
import PegaExtensionsPersonaDetails from './src/components/override-sdk/widget/Pega_Extensions_personaDetails';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  WssNavBar,
  WssQuickCreate,
  Banner,
  Todo: ToDo,
  AppShell,
  FlowContainer,
  QuickCreate,
  AssignmentCard,
  ActionButtons,
  ListView,
  Confirmation,
  Region,
  Text: TextInput,
  View,
  Pega_Extensions_CaseLauncher: QuickCreate,
  Details: Details,
  Pega_Extensions_personaDetails: PegaExtensionsPersonaDetails
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;

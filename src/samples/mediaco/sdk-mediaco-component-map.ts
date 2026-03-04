// Statically load all "MediaCo" components.
import ActionButtons from './components/ActionButtons';
import AppShell from './components/AppShell';
import Banner from './components/Banner';
import ListView from './components/ListView';
import MultiStep from './components/MultiStep';
import QuickCreate from './components/QuickCreate';
import SelfServiceCaseView from './components/SelfServiceCaseView';
import Todo from './components/Todo';
import WssNavBar from './components/WssNavBar';

/* import end - DO NOT REMOVE */

// sdkMediaCoComponentMap is the JSON object where we'll store the components that are
// specific to MediaCo application.

const sdkMediaCoComponentMap = {
  ActionButtons,
  AppShell,
  Banner,
  ListView,
  MultiStep,
  QuickCreate,
  SelfServiceCaseView,
  Todo,
  WssNavBar
  /* map end - DO NOT REMOVE */
};

export default sdkMediaCoComponentMap;

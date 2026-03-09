// Statically load all "MediaCo" components.
import ActionButtons from './components/action-buttons/ActionButtons';
import AppShell from './components/app-shell/AppShell';
import Banner from './components/banner/Banner';
import ListView from './components/list-view/ListView';
import MultiStep from './components/multi-step/MultiStep';
import QuickCreate from './components/quick-create/QuickCreate';
import SelfServiceCaseView from './components/self-service-case-view/SelfServiceCaseView';
import Todo from './components/todo/Todo';
import WssNavBar from './components/wss-nav-bar/WssNavBar';

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

// Statically load all "MediaCo" components.
import AppShell from './components/AppShell/AppShell';
import Banner from './components/Banner/Banner';
import ListView from './components/ListView/ListView';
import MultiStep from './components/MultiStep';
import QuickCreate from './components/QuickCreate';
import Todo from './components/Todo/Todo';
import WssNavBar from './components/WssNavBar';
//import './mediaCoStyles.scss';

/* import end - DO NOT REMOVE */

// sdkMediaCoComponentMap is the JSON object where we'll store the components that are
// specific to MediaCo application.

const sdkMediaCoComponentMap = {
  AppShell,
  Banner,
  ListView,
  MultiStep,
  QuickCreate,
  Todo,
  WssNavBar
  /* map end - DO NOT REMOVE */
};

export default sdkMediaCoComponentMap;

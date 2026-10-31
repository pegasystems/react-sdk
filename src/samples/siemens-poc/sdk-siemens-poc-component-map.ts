// Components for the Siemens POC: renders the APF new (WSS) portal with the SCM Buyer Cockpit look.
import AppShell from './components/AppShell/AppShell';
import DefaultPage from './components/DefaultPage/DefaultPage';
import GenAICoach from './components/GenAICoach/GenAICoach';
import Insight from './components/Insight/Insight';
import ListView from './components/ListView/ListView';
import ModalViewContainer from './components/ModalViewContainer/ModalViewContainer';
import Shortcuts from './components/Shortcuts/Shortcuts';

const sdkSiemensPocComponentMap = {
  AppShell,
  DefaultPage,
  GenAICoach,
  Insight,
  ListView,
  ModalViewContainer,
  Shortcuts
};

export default sdkSiemensPocComponentMap;

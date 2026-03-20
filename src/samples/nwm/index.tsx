import PegaAuthProvider from '../Embedded/context/PegaAuthProvider';
import { PegaReadyProvider } from '../Embedded/context/PegaReadyContext';
import { theme } from '../../theme';
import Home from './components/Home';

export default function NwmHome() {
  return (
    <div id='nwm-root'>
      <PegaAuthProvider>
        <PegaReadyProvider theme={theme}>
          <Home />
        </PegaReadyProvider>
      </PegaAuthProvider>
    </div>
  );
}

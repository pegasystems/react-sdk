import { Outlet } from 'react-router';
import PegaAuthProvider from '../Embedded/context/PegaAuthProvider';
import { PegaReadyProvider } from '../Embedded/context/PegaReadyContext';
import { theme } from '../../theme';

export default function NwmHome() {
  return (
    <div id='nwm-root'>
      <PegaAuthProvider>
        <PegaReadyProvider theme={theme}>
          <Outlet />
        </PegaReadyProvider>
      </PegaAuthProvider>
    </div>
  );
}

import PegaAuthProvider from './context/PegaAuthProvider';
import { PegaReadyProvider } from './context/PegaReadyContext';

import Header from './Header';
import MainScreen from './MainScreen';
import { theme } from '../../theme';
import './styles.css';

export default function Embedded() {
  return (
    <PegaAuthProvider>
      <PegaReadyProvider theme={theme}>
        <>
          <Header />
          <MainScreen />
        </>
      </PegaReadyProvider>
    </PegaAuthProvider>
  );
}

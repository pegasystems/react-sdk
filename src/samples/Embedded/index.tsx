import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import Header from './Header';
import MainScreen from './MainScreen';
import PegaAuthProvider from './context/PegaAuthProvider';
import { PegaReadyProvider } from './context/PegaReadyContext';
import { theme } from '../../theme';

export default function Embedded() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PegaAuthProvider>
          <PegaReadyProvider>
            <>
              <Header />
              <MainScreen />
            </>
          </PegaReadyProvider>
        </PegaAuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

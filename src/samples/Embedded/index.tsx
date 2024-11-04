/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from 'react';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { getSdkConfig, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';

import Header from './Header';
import MainScreen from './MainScreen';
import localSdkComponentMap from '../../../sdk-local-component-map';
import { initializeAuthentication } from './utils';
import { theme } from '../../theme';

declare const myLoadMashup: any;

export default function Embedded() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rootProps, setRootProps] = useState({});

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      // Add event listener for when logged in and constellation bootstrap is loaded
      document.addEventListener('SdkConstellationReady', () => handleSdkConstellationReady());

      const { authConfig } = await getSdkConfig();
      initializeAuthentication(authConfig);

      // this function will handle login process, and SdkConstellationReady event will be fired once PCore is ready
      loginIfNecessary({ appName: 'embedded', mainRedirect: false });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Something went wrong while login', error);
    }
  };

  const initializeRootContainerProps = renderObj => {
    const { props } = renderObj;

    setRootProps(props);
  };

  const startMashup = () => {
    PCore.onPCoreReady(async renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      await getSdkComponentMap(localSdkComponentMap);
      // eslint-disable-next-line no-console
      console.log(`SdkComponentMap initialized`);

      // Don't call initializeRootContainerProps until SdkComponentMap is fully initialized
      initializeRootContainerProps(renderObj);
    });

    myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
  };

  const handleSdkConstellationReady = () => {
    setIsLoggedIn(true);

    startMashup();
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoggedIn ? (
          <>
            <Header />
            <MainScreen {...rootProps} />
          </>
        ) : (
          <div>Loading...</div>
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

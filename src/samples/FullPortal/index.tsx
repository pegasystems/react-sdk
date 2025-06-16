/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { SdkConfigAccess, loginIfNecessary, getAvailablePortals } from '@pega/auth/lib/sdk-auth-manager';

import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../sdk-local-component-map';
import { theme } from '../../theme';

import InvalidPortal from './InvalidPortal';

declare const myLoadPortal;
declare const myLoadDefaultPortal;

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function RootComponent(props) {
  const PegaConnectObj = createPConnectComponent();
  const thePConnObj = <PegaConnectObj {...props} />;

  const contextValue = useMemo(() => {
    return { store: PCore.getStore() };
  }, []);

  return <StoreContext.Provider value={contextValue}>{thePConnObj}</StoreContext.Provider>;
}

export default function FullPortal() {
  const [portalSelectionScreen, setPortalSelectionScreen] = useState(false);
  const [defaultPortalName, setDefaultPortalName] = useState<string>('');
  const [availablePortals, setAvailablePortals] = useState<string[]>([]);
  const [rootComponentProps, setRootComponentProps] = useState<object | null>(null);

  const navigate = useNavigate();
  const query = useQuery();
  if (query.get('portal')) {
    const portalValue: any = query.get('portal');
    sessionStorage.setItem('rsdk_portalName', portalValue);
  }
  if (query.get('locale')) {
    const localeOverride: any = query.get('locale');
    sessionStorage.setItem('rsdk_locale', localeOverride);
  }

  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
  function initialRender(inRenderObj) {
    const { props, portalTarget, styleSheetTarget } = inRenderObj;

    // set root components props
    setRootComponentProps({ ...props, portalTarget, styleSheetTarget });
  }

  /**
   * kick off the application's portal that we're trying to serve up
   */
  function startPortal() {
    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Initialize the SdkComponentMap (local and pega-provided)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getSdkComponentMap(localSdkComponentMap).then(theComponentMap => {
        console.log(`SdkComponentMap initialized`);

        // Don't call initialRender until SdkComponentMap is fully initialized
        initialRender(renderObj);
      });
    });

    // load the Portal and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    const { appPortal: thePortal, excludePortals } = SdkConfigAccess.getSdkConfigServer();
    const defaultPortal = PCore.getEnvironmentInfo().getDefaultPortal() || '';
    const queryPortal = sessionStorage.getItem('rsdk_portalName');

    // Note: myLoadPortal and myLoadDefaultPortal are set when bootstrapWithAuthHeader is invoked
    if (queryPortal) {
      myLoadPortal('pega-root', queryPortal, []);
    } else if (thePortal) {
      console.log(`Loading specified appPortal: ${thePortal}`);
      myLoadPortal('pega-root', thePortal, []);
    } else if (myLoadDefaultPortal && defaultPortal && !excludePortals.includes(defaultPortal)) {
      console.log(`Loading default portal`);
      myLoadDefaultPortal('pega-root', []);
    } else {
      console.log('Loading portal selection screen');
      setPortalSelectionScreen(true);
      setDefaultPortalName(defaultPortal);
      // Getting current user's access group's available portals list other than excluded portals (relies on Traditional DX APIs)
      getAvailablePortals().then(portals => {
        setAvailablePortals(portals as string[]);
      });
    }
  }

  function loadSelectedPortal(portal) {
    setPortalSelectionScreen(false);
    myLoadPortal('app-root', portal, []); // this is defined in bootstrap shell that's been loaded already
  }

  function doRedirectDone() {
    navigate(window.location.pathname);
    let localeOverride: any = sessionStorage.getItem('rsdk_locale');
    if (!localeOverride) {
      localeOverride = undefined;
    }
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'portal', mainRedirect: true, locale: localeOverride });
  }

  // One time (initialization)
  useEffect(() => {
    document.addEventListener('SdkConstellationReady', handleSdkConstellationReady);

    const locale = sessionStorage.getItem('rsdk_locale') || undefined;

    // Login if needed, doing an initial main window redirect
    loginIfNecessary({
      appName: 'portal',
      mainRedirect: true,
      redirectDoneCB: doRedirectDone,
      locale
    });
  }, []);

  const handleSdkConstellationReady = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    // start the portal
    startPortal();
  };

  return portalSelectionScreen ? (
    <InvalidPortal defaultPortal={defaultPortalName} portals={availablePortals} onSelect={loadSelectedPortal} />
  ) : (
    <div id='pega-root'>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {rootComponentProps && <RootComponent {...rootComponentProps} />}
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

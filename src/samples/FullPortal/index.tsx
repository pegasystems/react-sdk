import React, { useEffect, useMemo }  from 'react';
import ReactDOM from "react-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';
import StoreContext from "@pega/react-sdk-components/lib/bridge/Context/StoreContext";
import createPConnectComponent from "@pega/react-sdk-components/lib/bridge/react_pconnect";
import { SdkConfigAccess } from '@pega/react-sdk-components/lib/components/helpers/config_access';
import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import { loginIfNecessary } from '@pega/react-sdk-components/lib/components/helpers/authManager';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../sdk-local-component-map';


declare const myLoadPortal: any;
declare const myLoadDefaultPortal: any;

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function FullPortal() {
  const history = useHistory();
  const query = useQuery();
  if (query.get('portal')) {
    const portalValue: any = query.get('portal');
    sessionStorage.setItem("rsdk_portalName", portalValue);
  }

  const theme = createTheme({
    // palette: {
    //   primary: {
    //     main: '#2196f3',
    //   },
    //   secondary: {
    //     main: '#ff9800',
    //   },
    // },
  });

  //  const outlet = document.getElementById("outlet");

  // from react_root.js with some modifications
  function RootComponent(props) {
    // const { portalTarget, styleSheetTarget } = props;
    const PegaConnectObj = createPConnectComponent();

    // remove from Provider to work around compiler error for now: context={StoreContext}
    // return (
    //   <Provider store={PCore.getStore()} context={StoreContext} >
    //     <PegaConnectObj {...props} />
    //   </Provider>
    // );

    // const thePConnObj = <div>the RootComponent</div>;
    const thePConnObj = <PegaConnectObj {...props} />;

    const theComp =
      <StoreContext.Provider value={{store: PCore.getStore()}} >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {thePConnObj}
          </ThemeProvider>
      </StoreContext.Provider>;

    return theComp;

  }

  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
   function initialRender(inRenderObj) {

    // modified from react_root.js render
    const {
      props,
      domContainerID = null,
      componentName,
      portalTarget,
      styleSheetTarget
    } = inRenderObj;
    let target:any = null;
    if (domContainerID !== null) {
      target = document.getElementById(domContainerID);
    } else if (portalTarget !== null) {
      target = portalTarget;
    }
    const Component: any = RootComponent;
    if (componentName) {
      Component.displayName = componentName;
    }

    // 1st arg was:
    // <Component
    //   {...props}
    //   portalTarget={portalTarget}
    //   styleSheetTarget={styleSheetTarget}
    // />,

    // var theComponent = <div>the Component</div>;
    const theComponent = (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component
            {...props}
            portalTarget={portalTarget}
            styleSheetTarget={styleSheetTarget}
          />;
        </ThemeProvider>
      );

    ReactDOM.render(  // was <Component
      theComponent,
      target ||
        document.getElementById("app") ||
        document.getElementsByTagName(domContainerID)[0]
    );

  };


  /**
   * kick off the application's portal that we're trying to serve up
   */
   function startPortal() {

    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Initialize the SdkComponentMap (local and pega-provided)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      getSdkComponentMap(localSdkComponentMap).then( (theComponentMap: any) => {
        // eslint-disable-next-line no-console
        console.log(`SdkComponentMap initialized`);

        // Don't call initialRender until SdkComponentMap is fully initialized
        initialRender(renderObj);

      })
    });

    // load the Portal and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    const thePortal = SdkConfigAccess.getSdkConfigServer().appPortal;
    const defaultPortal = PCore?.getEnvironmentInfo?.().getDefaultPortal?.();
    const queryPortal = sessionStorage.getItem("rsdk_portalName");
    // Note: myLoadPortal and myLoadDefaultPortal are set when bootstrapWithAuthHeader is invoked
    if ( queryPortal ) {
      myLoadPortal("pega-root", queryPortal, []);
    } else if( thePortal ) {
      // eslint-disable-next-line no-console
      console.log(`Loading specified appPortal: ${thePortal}`);
      myLoadPortal("pega-root", thePortal, []);
    }
    else if( myLoadDefaultPortal && defaultPortal ) {
      // eslint-disable-next-line no-console
      console.log(`Loading default portal`);
      myLoadDefaultPortal("pega-root", []);
    }
    else {
      // This path of selecting a portal by enumerating entries within current user's access group's portals list
      //  relies on Traditional DX APIs and should be avoided when the Constellation bootstrap supports
      //  the loadDefaultPortal API
      SdkConfigAccess.selectPortal()
      .then( () => {
        const selPortal = SdkConfigAccess.getSdkConfigServer().appPortal;
        myLoadPortal("pega-root", selPortal, []);   // this is defined in bootstrap shell that's been loaded already
      });
    }
  }

  function doRedirectDone() {
    history.push(window.location.pathname);
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({appName:'portal', mainRedirect:true});
  }

  // One time (initialization)
  useEffect(() => {

    document.addEventListener('SdkConstellationReady', () => {
      // start the portal
      startPortal();
    });
    // Login if needed, doing an initial main window redirect
    loginIfNecessary({appName:'portal', mainRedirect:true, redirectDoneCB:doRedirectDone});
  }, []);

  return (
    <div>
      {/* <h4>React SDK: /portal</h4> */}
      <div id="pega-root"></div>
    </div>)

}

import React from 'react';
import ReactDOM from "react-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import StoreContext from "../../bridge/Context/StoreContext";
import createPConnectComponent from "../../bridge/react_pconnect";
import { SdkConfigAccess } from '../../helpers/config_access';
import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';
import { loginIfNecessary } from '../../helpers/authWrapper';

declare const PCore: any;
declare const myLoadPortal: any;

export default function FullPortal() {

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

      initialRender(renderObj);
    });

    // load the Portal and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    SdkConfigAccess.selectPortal()
    .then( () => {
      const thePortal = SdkConfigAccess.getSdkConfigServer().appPortal;
      myLoadPortal("pega-root", thePortal, []);   // this is defined in bootstrap shell that's been loaded already
    })
  }


  document.addEventListener("ConstellationReady", () => {
    // start the portal
    startPortal();
  });

  document.addEventListener("SdkConfigAccessReady", () => {

    // Login and indicate not an embedded scenario
    loginIfNecessary("portal",false);

  });

  return (
    <div>
      {/* <h4>React SDK: /portal</h4> */}
      <div id="pega-here"></div>
    </div>)

}

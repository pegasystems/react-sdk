import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import StoreContext from '../../bridge/Context/StoreContext';
import createPConnectComponent from '../../bridge/react_pconnect';
import { SdkConfigAccess } from '../../helpers/config_access';
import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';
import { loginIfNecessary, logout } from '../../helpers/authManager';
import { processQueryParams } from '../../helpers/common-utils';

declare const PCore: any;
declare const myLoadPortal: any;
declare const myLoadDefaultPortal: any;
declare const myUpdateLocale: any;

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

    const theComp = (
      <StoreContext.Provider value={{ store: PCore.getStore() }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {thePConnObj}
        </ThemeProvider>
      </StoreContext.Provider>
    );

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
    let target: any = null;
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
        <Component {...props} portalTarget={portalTarget} styleSheetTarget={styleSheetTarget} />;
      </ThemeProvider>
    );

    ReactDOM.render(
      // was <Component
      theComponent,
      target || document.getElementById('app') || document.getElementsByTagName(domContainerID)[0]
    );
  }

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

    const locale = sessionStorage.getItem('rsdk_locale');
    if (locale) {
      myUpdateLocale(locale);
    }

    const thePortal = SdkConfigAccess.getSdkConfigServer().appPortal;
    const defaultPortal = PCore?.getEnvironmentInfo?.().getDefaultPortal?.();
    const queryPortal = sessionStorage.getItem('rsdk_portalName');
    // Note: myLoadPortal and myLoadDefaultPortal are set when bootstrapWithAuthHeader is invoked
    if (queryPortal) {
      myLoadPortal('pega-root', queryPortal, []);
    } else if (thePortal) {
      // eslint-disable-next-line no-console
      console.log(`Loading specified appPortal: ${thePortal}`);
      myLoadPortal('pega-root', thePortal, []);
    } else if (
      defaultPortal &&
      SdkConfigAccess.getSdkConfigServer().excludePortals.includes(defaultPortal)
    ) {
      const rootElement = document.getElementById('pega-root') as HTMLElement;
      rootElement.classList.add('portal-load-error');
      rootElement.innerHTML = `<div>
                                Unable to open portal: <span class="portal-name">${defaultPortal}</span><br />
                                Please authenticate as an end user operator, rather than a developer or an administrator.
                              </div>`;
      const logoutButton = document.createElement('button');
      logoutButton.innerText = 'Logout';
      logoutButton.classList.add('logout-btn');
      logoutButton.addEventListener('click', () => {
        rootElement.classList.remove('portal-load-error');
        logout();
      });

      rootElement.appendChild(logoutButton);
    } else if (myLoadDefaultPortal && defaultPortal) {
      // eslint-disable-next-line no-console
      console.log(`Loading default portal`);
      myLoadDefaultPortal('pega-root', []);
    } else {
      // This path of selecting a portal by enumerating entries within current user's access group's portals list
      // relies on Traditional DX APIs and should be avoided when the Constellation bootstrap supports
      // the loadDefaultPortal API
      SdkConfigAccess.selectPortal().then(() => {
        const selPortal = SdkConfigAccess.getSdkConfigServer().appPortal;
        myLoadPortal('pega-root', selPortal, []); // this is defined in bootstrap shell that's been loaded already
      });
    }
  }

  // One time (initialization)
  useEffect(() => {
    processQueryParams();

    // Login if needed, without doing an initial main window redirect
    loginIfNecessary('portal', false);

    document.addEventListener('SdkConstellationReady', () => {
      // start the portal
      startPortal();
    });
  }, []);

  return (
    <div>
      {/* <h4>React SDK: /portal</h4> */}
      <div id='pega-root'></div>
    </div>
  );
}

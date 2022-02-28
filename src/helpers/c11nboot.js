import { SdkConfigAccess } from './config_access';

/**
 * Initiate the process to get the Constellation bootstrap shell loaded and initialized
 * @param {Object} authConfig
 * @param {Object} tokenInfo
 */
export const constellationInit = (authConfig, tokenInfo, authTokenUpdated, authFullReauth) => {
  const constellationBootConfig = {};
  const sdkConfigServer = SdkConfigAccess.getSdkConfigServer();

  // Set up constellationConfig with data that bootstrapWithAuthHeader expects
  constellationBootConfig.customRendering = true;
  constellationBootConfig.restServerUrl = sdkConfigServer.infinityRestServerUrl;
  // NOTE: Needs a trailing slash! So add one if not provided
  constellationBootConfig.staticContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}/constellation/`;
  if (constellationBootConfig.staticContentServerUrl.slice(-1) !== '/') {
    constellationBootConfig.staticContentServerUrl = `${constellationBootConfig.staticContentServerUrl}/`;
  }
  // If appAlias specified, use it
  if( sdkConfigServer.appAlias ) {
    constellationBootConfig.appAlias = sdkConfigServer.appAlias;
  }

  // Pass in auth info to Constellation
  constellationBootConfig.authInfo = {
    authType: "OAuth2.0",
    tokenInfo,
    // Set whether we want constellation to try to do a full re-Auth or not ()
    // true doesn't seem to be working in SDK scenario so always passing false for now
    popupReauth: false /* !authIsEmbedded() */,
    client_id: authConfig.clientId,
    authentication_service: authConfig.authService,
    redirect_uri: authConfig.redirectUri,
    endPoints: {
        authorize: authConfig.authorizeUri,
        token: authConfig.tokenUri,
        revoke: authConfig.revokeUri
    },
    // TODO: setup callback so we can update own storage
    onTokenRetrieval: authTokenUpdated
  }

  // Turn off dynamic load components (should be able to do it here instead of after load?)
  constellationBootConfig.dynamicLoadComponents = false;

  // Note that staticContentServerUrl already ends with a slash (see above), so no slash added.
  // In order to have this import succeed and to have it done with the webpackIgnore magic comment tag.  See:  https://webpack.js.org/api/module-methods/
  import(
    /* webpackIgnore: true */ `${constellationBootConfig.staticContentServerUrl}bootstrap-shell.js`
  ).then((bootstrapShell) => {
    // NOTE: once this callback is done, we lose the ability to access loadMashup.
    //  So, create a reference to it
    window.myLoadMashup = bootstrapShell.loadMashup;

    // For experimentation, save a reference to loadPortal, too!
    window.myLoadPortal = bootstrapShell.loadPortal;

    bootstrapShell.bootstrapWithAuthHeader(constellationBootConfig, 'shell').then(() => {
      // eslint-disable-next-line no-console
      console.log('Bootstrap successful!');

      // Setup listener for the reauth event
      // eslint-disable-next-line no-undef
      PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_FULL_REAUTH, authFullReauth, "authFullReauth");

      const event = new CustomEvent('ConstellationReady', {});
      document.dispatchEvent(event);
    })
    .catch( e => {
      // Assume error caught is because token is not valid and attempt a full reauth
      // eslint-disable-next-line no-console
      console.log(e);
      authFullReauth();
    })
  });
  /* Ends here */
};

/**
 * Cleanup an Constellation bootstrap related stuff
 */
export const constellationTerm = () => {
  // TBD: Call to getPConnect().getActionsApi().logout gave a CORS error. Investigate
  // const pConnConfig = { "meta": { "config": {} }};
  // const pConn = PCore.createPConnect( pConnConfig);
  // if (pConn) {
  //     pConn.getPConnect().getActionsApi().logout();
  // }

  // Just reload the page to get the login button again
  window.location.reload();
};

// Code that sets up use of Constellation once it's been loaded and ready

document.addEventListener('ConstellationReady', () => {

  // Element with id="pega-here" is where the React SDK React entry point for
  //  the Pega embedded/portal will be placed.
  const replaceMe = document.getElementById('pega-here');

  if (replaceMe === null) {
    // eslint-disable-next-line no-console
    console.error(`No id="pega-here".`);

    // This code was taken from web-components-sdk and needs to be adapted for React SDK

    // shadow root
    // const startingComponent = window.sessionStorage.getItem("startingComponent");

    // const myShadowRoot = document.getElementsByTagName(startingComponent)[0].shadowRoot;
    // const replaceMe = myShadowRoot.getElementById("pega-here");
    // const elPrePegaHdr = myShadowRoot.getElementById("app-nopega");
    // if(elPrePegaHdr) elPrePegaHdr.style.display = "none";

    // let replacement = null;

    // switch (startingComponent) {
    //   case "full-portal-component" :
    //     replacement = document.createElement("app-entry");
    //     break;
    //   case "simple-portal-component":
    //     replacement = document.createElement("simple-main-component");
    //     break;
    //   case "mashup-portal-component":
    //     replacement = document.createElement("mashup-main-component");
    //     break;
    // }

    // if (replacement != null) {
    //   replacement.setAttribute("id", "pega-root");
    //   replaceMe.replaceWith(replacement);
    // }
  } else {
    // Hide the original prepega area
    const elPrePegaHdr = document.getElementById('app-nopega');
    if (elPrePegaHdr) elPrePegaHdr.style.display = 'none';

    // With Constellation Ready, replace <div id="pega-here"></div>
    //  with DOM node with id="pega-root". This element will be used
    //  as the React root in the initial React render

    const replacement = document.createElement('div');

    replacement.setAttribute('id', 'pega-root');
    // NOTE: Need to replace this WC app-entry with React equivalent
    replacement.innerHTML = 'Injecting React root here!';
    replaceMe.replaceWith(replacement);
  }
});

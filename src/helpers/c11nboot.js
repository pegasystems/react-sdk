import { SdkConfigAccess } from './config_access';

/**
 * Initiate the process to get the Constellation bootstrap shell loaded and initialized
 * @param {Object} authConfig
 * @param {Object} tokenInfo
 */
export const constellationInit = (authConfig, tokenInfo) => {
  // eslint-disable-next-line sonarjs/prefer-object-literal
  const constellationBootConfig = {};

  // Set up constellationConfig with data that bootstrapWithAuthHeader expects
  // constellationConfig.appAlias = "";
  constellationBootConfig.customRendering = true;
  constellationBootConfig.restServerUrl =
    SdkConfigAccess.getSdkConfigServer().infinityRestServerUrl;
  // NOTE: Needs a trailing slash! So add one if not provided
  constellationBootConfig.staticContentServerUrl = `${
    SdkConfigAccess.getSdkConfigServer().sdkContentServerUrl
  }/constellation/`;
  if (constellationBootConfig.staticContentServerUrl.slice(-1) !== '/') {
    constellationBootConfig.staticContentServerUrl = `${constellationBootConfig.staticContentServerUrl}/`;
  }

  // Pass in auth info to Constellation
  constellationBootConfig.authInfo = {
    authType: "OAuth2.0",
    tokenInfo: tokenInfo,
    popupReauth: true,
    client_id: authConfig.clientId,
    authentication_service: authConfig.authService,
    redirect_uri: authConfig.redirectUri,
    endPoints: {
        authorize: authConfig.authorizeUri,
        token: authConfig.tokenUri,
        revoke: authConfig.revokeUri
    },
    // TODO: setup callback so we can update own storage
    // onTokenRetrieval: this.#tokensUpdated.bind(this)
  }

  // This seems to be used by selectPortal.  Might be best to just have an internal event that publishes when a token has changed
  //  and then allow react sdk components to react to it...similar to the logged in event.
  window.sessionStorage.setItem('accessToken', tokenInfo.access_token);

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
      // If logging in via oauth...it creates its own window
      if (window.myWindow) {
        window.myWindow.close();
      }

      const event = new CustomEvent('ConstellationReady', {});
      document.dispatchEvent(event);
    });
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
  // With React, temporarily turn off dynamical load components.
  //  Seems to have issue with TypeScript
  // eslint-disable-next-line no-undef
  PCore.setBehaviorOverride('dynamicLoadComponents', false);

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

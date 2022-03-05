// This file wraps various calls related to logging in, logging out, etc.
//  that use the auth.html/auth.js to do the work of logging in.

// Migrating code from "early availability" index.html here so we can
//  better leverage info read in from sdk-config.json
//  For now, export all of the vars/functions so they can be used as needed.

import { SdkConfigAccess } from './config_access';
import PegaAuth from './auth';

// eslint-disable-next-line import/no-mutable-exports
export let gbLoggedIn = sessionStorage.getItem('accessToken') !== null;
// eslint-disable-next-line import/no-mutable-exports
export let gbLoginInProgress = sessionStorage.getItem("rsdk_loggingIn") !== null;
// other sessionStorage items: rsdk_appName

// will store the PegaAuth instance
let authMgr = null;
// Since this variable is loaded in a separate instance in the popup scenario, use storage to coordinate across the two
let usePopupForRestOfSession = sessionStorage.getItem("rsdk_popup") === "1";
let gbC11NBootstrapInProgress = false;

/*
 * Set to use popup experience for rest of session
 */
const forcePopupForReauths = ( bForce ) => {
  if( bForce ) {
      sessionStorage.setItem("rsdk_popup", "1");
      usePopupForRestOfSession = true;
  } else {
      sessionStorage.removeItem("rsdk_popup");
      usePopupForRestOfSession = false;
  }
};

const setIsEmbedded = (bEmbedded ) => {
  if( bEmbedded ) {
    forcePopupForReauths(true);
    sessionStorage.setItem("rsdk_embedded", "1");
  } else {
    sessionStorage.removeItem("rsdk_embedded");
  }
};

const isLoginExpired = () => {
  let bExpired = true;
  const sLoginStart = sessionStorage.getItem("rsdk_loggingIn");
  if( sLoginStart !== null ) {
    const currTime = Date.now();
    bExpired = currTime - parseInt(sLoginStart, 10) > 60000;
  }
  return bExpired;
};

/**
 * Clean up any web storage allocated for the user session.
 */
const clearAuthMgr = (bFullReauth=false) => {
  // Remove any local storage for the user
  sessionStorage.removeItem('accessToken');
  if( !bFullReauth ) {
    sessionStorage.removeItem("rsdk_CI");
  }
  sessionStorage.removeItem("rsdk_TI");
  sessionStorage.removeItem("rsdk_loggingIn");
  gbLoggedIn = false;
  gbLoginInProgress = false;
  forcePopupForReauths(bFullReauth);
  // Not removing the authMgr structure itself...as it can be leveraged on next login
};

export const authIsEmbedded = () => {
  return sessionStorage.getItem("rsdk_embedded") === "1";
};

/**
 * Initialize OAuth config structure members  and create authMgr instance
 * bInit - governs whether to create new sessionStorage or load existing one
 */
const initOAuth = (bInit) => {

  const sdkConfigAuth = SdkConfigAccess.getSdkConfigAuth();
  const sdkConfigServer = SdkConfigAccess.getSdkConfigServer();
  const pegaUrl = sdkConfigServer.infinityRestServerUrl;
  const bIsEmbedded = authIsEmbedded();

  // Construct default OAuth endpoints (if not explicitly specified)
  if (pegaUrl) {
    if (!sdkConfigAuth.authorize) {
      sdkConfigAuth.authorize = `${pegaUrl}/PRRestService/oauth2/v1/authorize`;
    }
    if (!sdkConfigAuth.token) {
      sdkConfigAuth.token = `${pegaUrl}/PRRestService/oauth2/v1/token`;
    }
    if (!sdkConfigAuth.revoke) {
      sdkConfigAuth.revoke = `${pegaUrl}/PRRestService/oauth2/v1/revoke`;
    }
  }
  // Auth service alias
  if( !sdkConfigAuth.authService) {
    sdkConfigAuth.authService = "pega";
  }

  const authConfig = {
    clientId: bIsEmbedded ? sdkConfigAuth.mashupClientId : sdkConfigAuth.portalClientId,
    authorizeUri: sdkConfigAuth.authorize,
    tokenUri: sdkConfigAuth.token,
    revokeUri: sdkConfigAuth.revoke,
    redirectUri: bIsEmbedded || usePopupForRestOfSession
        ? `${window.location.origin}/auth.html`
        : `${window.location.origin}${window.location.pathname}`,
    authService: sdkConfigAuth.authService,
    useLocking: true
  };
  if( sdkConfigServer.appAlias ) {
    authConfig.appAlias = sdkConfigServer.appAlias;
  }
  if( 'silentTimeout' in sdkConfigAuth ) {
    authConfig.silentTimeout = sdkConfigAuth.silentTimeout;
  }
  if( bIsEmbedded ) {
    authConfig.userIdentifier = sdkConfigAuth.mashupUserIdentifier;
    authConfig.password = sdkConfigAuth.mashupPassword;
  }

  // Check if sessionStorage exists (and if so if for same authorize endpoint).  Otherwise, assume
  //  sessionStorage is out of date (user just edited endpoints).  Else, logout required to clear
  //  sessionStorage and get other endpoints updates.
  // Doing this as sessionIndex might have been added to this storage structure
  let sSI = sessionStorage.getItem("rsdk_CI");
  if( sSI ) {
    try {
        const oSI = JSON.parse(sSI);
        if( oSI.authorizeUri !== authConfig.authorizeUri ||
            oSI.clientId !== authConfig.clientId ||
            oSI.userIdentifier !== authConfig.userIdentifier ||
            oSI.password !== authConfig.password) {
            clearAuthMgr();
            sSI = null;
        }
    } catch(e) {
      // do nothing
    }
  }

  if( !sSI || bInit ) {
    sessionStorage.setItem('rsdk_CI', JSON.stringify(authConfig));
  }
  authMgr = new PegaAuth('rsdk_CI');
};

// TODO: See if we still need such a solution to keep trying for stuff to be loaded
// Was needed when we were trying to invoke this as source file loaded (before SdkConfigAccessReady event)
const getAuthMgr = ( bInit ) => {
  return new Promise( (resolve) => {
    let idNextCheck = null;
    const fnCheckForAuthMgr = () => {
      if( PegaAuth && !authMgr ) {
        initOAuth( bInit );
      }
      if(authMgr) {
        if( idNextCheck ) {
          clearInterval(idNextCheck);
        }
        return resolve(authMgr);
      }
    }
    idNextCheck = setInterval(fnCheckForAuthMgr, 500);
  });
};

/**
 * Initiate the process to get the Constellation bootstrap shell loaded and initialized
 * @param {Object} authConfig
 * @param {Object} tokenInfo
 * @param {Function} authTokenUpdated - callback invoked when Constellation JS Engine silently updates
 *      an expired access_token
 * @param {Function} authFullReauth - callback invoked when a full reauth is needed
 */
 const constellationInit = (authConfig, tokenInfo, authTokenUpdated, authFullReauth) => {
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

  if( gbC11NBootstrapInProgress ) {
    return;
  } else {
    gbC11NBootstrapInProgress = true;
  }

  // Note that staticContentServerUrl already ends with a slash (see above), so no slash added.
  // In order to have this import succeed and to have it done with the webpackIgnore magic comment tag.
  // See:  https://webpack.js.org/api/module-methods/
  import(/* webpackIgnore: true */ `${constellationBootConfig.staticContentServerUrl}bootstrap-shell.js`).then((bootstrapShell) => {
    // NOTE: once this callback is done, we lose the ability to access loadMashup.
    //  So, create a reference to it
    window.myLoadMashup = bootstrapShell.loadMashup;

    // For experimentation, save a reference to loadPortal, too!
    window.myLoadPortal = bootstrapShell.loadPortal;

    bootstrapShell.bootstrapWithAuthHeader(constellationBootConfig, 'shell').then(() => {
      // eslint-disable-next-line no-console
      console.log('Bootstrap successful!');
      gbC11NBootstrapInProgress = false;

      // Setup listener for the reauth event
      // eslint-disable-next-line no-undef
      PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_FULL_REAUTH, authFullReauth, "authFullReauth");

      const event = new CustomEvent('ConstellationReady', {});
      document.dispatchEvent(event);
    })
    .catch( e => {
      // Assume error caught is because token is not valid and attempt a full reauth
      // eslint-disable-next-line no-console
      console.error(`Constellation JS Engine bootstrap failed. ${e}`);
      gbC11NBootstrapInProgress = false;
      authFullReauth();
    })
  });
  /* Ends here */
};


export const updateLoginStatus = () => {
  const sAuthHdr = sessionStorage.getItem('accessToken');
  gbLoggedIn = sAuthHdr && sAuthHdr.length > 0;
  const elBtnLogin = document.getElementById('btnLogin');
  if (elBtnLogin) {
    elBtnLogin.disabled = gbLoggedIn;
  }
  const elBtnLogout = document.getElementById('btnLogout');
  if (elBtnLogout) {
    elBtnLogout.disabled = !gbLoggedIn;
  }
};

const getCurrentTokens = () => {
  let tokens = null;
  const sTI = sessionStorage.getItem('rsdk_TI');
  if(sTI) {
    try {
      tokens = JSON.parse(sTI);
    } catch(e) {
      tokens = null;
    }
  }
  return tokens;
};

const fireTokenAvailable = (token, bLoadC11N=true) => {
  if( !token ) {
    // This is used on page reload to load the token from sessionStorage and carry on
    token = getCurrentTokens();
    if( !token ) {
      token = {access_token: sessionStorage.getItem('accessToken')};
    }
  }

  // accessToken being redundantly set in c11nboot as part of handling SdkLoggedIn event
  // TODO: Prehaps remove from
  sessionStorage.setItem('accessToken', token.access_token);
  updateLoginStatus();

  // gbLoggedIn is getting updated in updateLoginStatus
  gbLoggedIn = true;
  gbLoginInProgress = false;
  sessionStorage.removeItem("rsdk_loggingIn");
  forcePopupForReauths(true);

  const sSI = sessionStorage.getItem("rsdk_CI");
  let authConfig = null;
  if( sSI ) {
    try {
        authConfig = JSON.parse(sSI);
    } catch(e) {
      // do nothing
    }
  }

  if( !window.PCore && bLoadC11N ) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    constellationInit( authConfig, token, authTokenUpdated, authFullReauth );
  }

/*
  // Create and dispatch the SdkLoggedIn event to trigger constellationInit
  const event = new CustomEvent('SdkLoggedIn', { detail: { authConfig, tokenInfo: token } });
  document.dispatchEvent(event);
  */
};

const processTokenOnLogin = ( token, bLoadC11N=true ) => {
  sessionStorage.setItem("rsdk_TI", JSON.stringify(token));
  if( window.PCore ) {
    window.PCore.getAuthUtils().setTokens(token);
  } else {
    fireTokenAvailable(token, bLoadC11N);
  }
};

const updateRedirectUri = (aMgr, sRedirectUri) => {
  const sSI = sessionStorage.getItem("rsdk_CI");
  let authConfig = null;
  if( sSI ) {
    try {
        authConfig = JSON.parse(sSI);
    } catch(e) {
      // do nothing
    }
  }
  authConfig.redirectUri = sRedirectUri;
  sessionStorage.setItem("rsdk_CI", JSON.stringify(authConfig));
  aMgr.reloadConfig();
}


export const login = (bFullReauth=false) => {
  if (!SdkConfigAccess) {
    // eslint-disable-next-line no-console
    console.error(`Trying login before SdkConfigAccessReady!`);
    return;
  }

  gbLoginInProgress = true;
  // Needed so a redirect to login screen and back will know we are still in process of logging in
  sessionStorage.setItem("rsdk_loggingIn", `${Date.now()}`);

  getAuthMgr(!bFullReauth).then( (aMgr) => {
    const bPortalLogin = !authIsEmbedded();

    // If portal will redirect to main page, otherwise will authorize in a popup window
    if (bPortalLogin && !bFullReauth) {
      // update redirect uri to be the root
      updateRedirectUri(aMgr, `${window.location.origin}${window.location.pathname}`);
      aMgr.loginRedirect();
      // Don't have token til after the redirect
      return Promise.resolve(undefined);
    } else {
      // Set redirectUri to static auth.html
      updateRedirectUri(aMgr, `${window.location.origin}/auth.html`)
      return new Promise( (resolve, reject) => {
        aMgr.login().then(token => {
            processTokenOnLogin(token);
            resolve(token.access_token);
        }).catch( (e) => {
            gbLoginInProgress = false;
            sessionStorage.removeItem("rsdk_loggingIn");
            // eslint-disable-next-line no-console
            console.log(e);
            reject(e);
        })
      });
    }
  });
};

export const authRedirectCallback = ( href, fnLoggedInCB=null ) => {
  // Get code from href and swap for token
  const aHrefParts = href.split('?');
  const urlParams = new URLSearchParams(aHrefParts.length>1 ? `?${aHrefParts[1]}` : '');
  const code = urlParams.get("code");

  getAuthMgr(false).then( aMgr => {
    aMgr.getToken(code).then(token => {
      if( token && token.access_token ) {
          processTokenOnLogin(token, false);
          if( fnLoggedInCB ) {
              fnLoggedInCB( token.access_token );
          }
      }
    });

  });

};

/**
 * Silent or visible login based on login status
 */
export const loginIfNecessary = (appName, isEmbedded=false, deferLogin=false) => {
  // If embedded status of page changed...clearAuthMgr
  const currEmbedded = authIsEmbedded();
  const currAppName = sessionStorage.getItem("rsdk_appName");
  if( appName !== currAppName || isEmbedded !== currEmbedded) {
    clearAuthMgr();
    sessionStorage.setItem("rsdk_appName", appName);
  }
  setIsEmbedded(isEmbedded);
  if( window.location.href.indexOf("?code") !== -1 ) {
    // initialize authMgr
    initOAuth(false);
    authRedirectCallback(window.location.href, ()=> {
      window.location.href = window.location.pathname;
    });
    return;
  }
  if( !deferLogin && (!gbLoginInProgress || isLoginExpired()) ) {
    initOAuth(false);
    updateLoginStatus();
    if( gbLoggedIn ) {
      fireTokenAvailable(getCurrentTokens());
    } else {
      return login();
    }
  }
};

export const getHomeUrl = () => {
  return `${window.location.origin}/`;
};


export const authIsMainRedirect = () => {
  // Even with main redirect, we want to use it only for the first login (so it doesn't wipe out any state or the reload)
  return !authIsEmbedded() && !usePopupForRestOfSession;
};

// Passsive update where just session storage is updated so can be used on a window refresh
export const authTokenUpdated = (tokenInfo ) => {
  sessionStorage.setItem("rsdk_TI", JSON.stringify(tokenInfo));
};

export const authGetAccessToken = () => {
  const tokens = getCurrentTokens();
  return tokens.access_token;
};

export const logout = () => {
  return new Promise((resolve) => {
    const fnClearAndResolve = () => {
      clearAuthMgr();
      // VRS: Perhaps the DOM manipulations are better done elsewhere or by introducing a SDKLoggedOut
      //  event which might be fired here and an app page might do the below at that point
      // Remove the <div id="pega-root"> that was created (if it exists)
      //  with the original <div id="pega-here">
      const thePegaRoot = document.getElementById('pega-root');
      if (thePegaRoot) {
        const thePegaHere = document.createElement('div');
        thePegaHere.setAttribute('id', 'pega-here');
        thePegaRoot.replaceWith(thePegaHere);
        const theLogoutMsgDiv = document.createElement('div');
        theLogoutMsgDiv.setAttribute('style', 'margin: 5px;');
        theLogoutMsgDiv.innerHTML = `You are logged out. Refresh the page to log in again.`;
        thePegaHere.appendChild(theLogoutMsgDiv);
      }
      resolve();
    };
    const tokenInfo = getCurrentTokens();
    if( tokenInfo && tokenInfo.access_token ) {
        if( window.PCore ) {
            window.PCore.getAuthUtils().revokeTokens().then(() => {
                fnClearAndResolve();
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log("Error:",err?.message);
            });
        } else {
          getAuthMgr(false).then( aMgr => {
            aMgr.revokeTokens(tokenInfo.access_token, tokenInfo.refresh_token).then(() => {
              // Go to finally
            })
            .finally(() => {
              fnClearAndResolve();
            });

          });
        }
    } else {
        fnClearAndResolve();
    }
  });
};

// Callback routine for custom event to ask for updated tokens
export const authUpdateTokens = (token) => {
  processTokenOnLogin( token );
};


// Initiate a full OAuth re-authorization.  Assume for embedded we want to do an external reauth and for
//  non-Embedded we want to have constellation drive the re-auth UI experience
export const authFullReauth = () => {
  const bHandleHere = true; // Other alternative is to raise an event and have someone else handle it

  if( bHandleHere ) {
    // Don't want to do a full clear of authMgr as will loose sessionIndex.  Rather just clear the tokens
    clearAuthMgr(true);
    login(true);
  } else {
    // Fire the SdkFullReauth event to indicate a new token is needed (PCore.getAuthUtils.setTokens method
    //  should be used to communicate the new token to Constellation JS Engine.
    const event = new CustomEvent('SdkFullReauth', { detail: authUpdateTokens });
    document.dispatchEvent(event);
  }
};

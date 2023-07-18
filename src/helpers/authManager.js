// This file wraps various calls related to logging in, logging out, etc.
//  that use the auth.html/auth.js to do the work of logging in via OAuth 2.0.

import { getSdkConfig, SdkConfigAccess } from './config_access';
import PegaAuth from './auth';

// eslint-disable-next-line import/no-mutable-exports
export let gbLoggedIn = sessionStorage.getItem('rsdk_AH') !== null;
// eslint-disable-next-line import/no-mutable-exports
export let gbLoginInProgress = sessionStorage.getItem("rsdk_loggingIn") !== null;
// other sessionStorage items: rsdk_appName

// will store the PegaAuth instance
let authMgr = null;
// Since this variable is loaded in a separate instance in the popup scenario, use storage to coordinate across the two
let usePopupForRestOfSession = sessionStorage.getItem("rsdk_popup") === "1";
let gbC11NBootstrapInProgress = false;
// Some non Pega OAuth 2.0 Authentication in use (Basic or Custom for service package)
let gbCustomAuth = false;

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

const setNoInitialRedirect = (bNoInitialRedirect ) => {
  if( bNoInitialRedirect ) {
    forcePopupForReauths(true);
    sessionStorage.setItem("rsdk_noRedirect", "1");
  } else {
    sessionStorage.removeItem("rsdk_noRedirect");
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
  if( !gbCustomAuth ) {
    sessionStorage.removeItem('rsdk_AH');
  }
  if( !bFullReauth ) {
    sessionStorage.removeItem("rsdk_CI");
  }
  sessionStorage.removeItem("rsdk_TI");
  sessionStorage.removeItem("rsdk_UI");
  sessionStorage.removeItem("rsdk_loggingIn");
  sessionStorage.removeItem("rsdk_locale");
  gbLoggedIn = false;
  gbLoginInProgress = false;
  forcePopupForReauths(bFullReauth);
  // Not removing the authMgr structure itself...as it can be leveraged on next login
};

export const authNoRedirect = () => {
  return sessionStorage.getItem("rsdk_noRedirect") === "1";
};

/**
 * Initialize OAuth config structure members  and create authMgr instance
 * bInit - governs whether to create new sessionStorage or load existing one
 */
const initOAuth = (bInit) => {
  return getSdkConfig().then( sdkConfig => {
    const sdkConfigAuth = sdkConfig.authConfig;
    const sdkConfigServer = sdkConfig.serverConfig;
    let pegaUrl = sdkConfigServer.infinityRestServerUrl;
    const bNoInitialRedirect = authNoRedirect();

    // Construct default OAuth endpoints (if not explicitly specified)
    if (pegaUrl) {
      // Cope with trailing slash being present
      if (!pegaUrl.endsWith('/')) {
        pegaUrl += '/';
      }
      if (!sdkConfigAuth.authorize) {
        sdkConfigAuth.authorize = `${pegaUrl}PRRestService/oauth2/v1/authorize`;
      }
      if (!sdkConfigAuth.token) {
        sdkConfigAuth.token = `${pegaUrl}PRRestService/oauth2/v1/token`;
      }
      if (!sdkConfigAuth.revoke) {
        sdkConfigAuth.revoke = `${pegaUrl}PRRestService/oauth2/v1/revoke`;
      }
      if( !sdkConfigAuth.redirectUri ) {
        sdkConfigAuth.redirectUri = `${window.location.origin}${window.location.pathname}`;
      }
      if (!sdkConfigAuth.userinfo) {
        const appAliasSeg = sdkConfigServer.appAlias ? `app/${sdkConfigServer.appAlias}/` : '';
        sdkConfigAuth.userinfo = `${pegaUrl}${appAliasSeg}api/oauthclients/v1/userinfo/JSON`;
      }
    }
    // Auth service alias
    if( !sdkConfigAuth.authService) {
      sdkConfigAuth.authService = "pega";
    }

    // Construct path to auth.html (used for case when not doing a main window redirect)
    let sNoMainRedirectUri=sdkConfigAuth.redirectUri;
    const nLastPathSep = sNoMainRedirectUri.lastIndexOf("/");
    sNoMainRedirectUri = nLastPathSep !== -1 ? `${sNoMainRedirectUri.substring(0,nLastPathSep+1)}auth.html` : `${sNoMainRedirectUri}/auth.html`;

    const authConfig = {
      clientId: bNoInitialRedirect ? sdkConfigAuth.mashupClientId : sdkConfigAuth.portalClientId,
      authorizeUri: sdkConfigAuth.authorize,
      tokenUri: sdkConfigAuth.token,
      revokeUri: sdkConfigAuth.revoke,
      userinfoUri: sdkConfigAuth.userinfo,
      redirectUri: bNoInitialRedirect || usePopupForRestOfSession
          ? sNoMainRedirectUri
          : sdkConfigAuth.redirectUri,
      authService: sdkConfigAuth.authService,
      appAlias: sdkConfigServer.appAlias || '',
      useLocking: true
    };
    // If no clientId is specified assume not OAuth but custom auth
    if( !authConfig.clientId ) {
      gbCustomAuth = true;
      return;
    }
    if( 'silentTimeout' in sdkConfigAuth ) {
      authConfig.silentTimeout = sdkConfigAuth.silentTimeout;
    }
    if( bNoInitialRedirect ) {
      authConfig.userIdentifier = sdkConfigAuth.mashupUserIdentifier;
      authConfig.password = sdkConfigAuth.mashupPassword;
    }
    if( 'iframeLoginUI' in sdkConfigAuth ){
      authConfig.iframeLoginUI = sdkConfigAuth.iframeLoginUI.toString().toLowerCase() === 'true';
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
              oSI.appAlias !== authConfig.appAlias ||
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
  });
};

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
    fnCheckForAuthMgr();
    idNextCheck = setInterval(fnCheckForAuthMgr, 10);
  });
};

export const sdkGetAuthHeader = () => {
  return sessionStorage.getItem("rsdk_AH");
};

/**
 * Initiate the process to get the Constellation bootstrap shell loaded and initialized
 * @param {Object} authConfig
 * @param {Object} tokenInfo
 * @param {Function} authTokenUpdated - callback invoked when Constellation JS Engine silently updates
 *      an expired access_token
 * @param {Function} fnReauth - callback invoked when a full or custom reauth is needed
 */
const constellationInit = (authConfig, tokenInfo, authTokenUpdated, fnReauth) => {
  const constellationBootConfig = {};
  const sdkConfigServer = SdkConfigAccess.getSdkConfigServer();

  // Set up constellationConfig with data that bootstrapWithAuthHeader expects
  constellationBootConfig.customRendering = true;
  constellationBootConfig.restServerUrl = sdkConfigServer.infinityRestServerUrl;

  // NOTE: Needs a trailing slash! So add one if not provided
  if( !sdkConfigServer.sdkContentServerUrl.endsWith('/') ) {
    sdkConfigServer.sdkContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}/`;
  }
  constellationBootConfig.staticContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}constellation/`;
  if( !constellationBootConfig.staticContentServerUrl.endsWith('/') ) {
    constellationBootConfig.staticContentServerUrl = `${constellationBootConfig.staticContentServerUrl}/`;
  }
  // If appAlias specified, use it
  if( sdkConfigServer.appAlias ) {
    constellationBootConfig.appAlias = sdkConfigServer.appAlias;
  }

  if( tokenInfo ) {
    // Pass in auth info to Constellation
    constellationBootConfig.authInfo = {
      authType: "OAuth2.0",
      tokenInfo,
      // Set whether we want constellation to try to do a full re-Auth or not ()
      // true doesn't seem to be working in SDK scenario so always passing false for now
      popupReauth: false /* !authNoRedirect() */,
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
  } else {
    constellationBootConfig.authorizationHeader = sdkGetAuthHeader();
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
    window.myLoadPortal = bootstrapShell.loadPortal;
    window.myLoadDefaultPortal = bootstrapShell.loadDefaultPortal;
    window.myUpdateLocale = bootstrapShell.updateLocale;

    bootstrapShell
      .bootstrapWithAuthHeader(constellationBootConfig, 'shell')
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Bootstrap successful!');
        gbC11NBootstrapInProgress = false;

        const locale = sessionStorage.getItem('rsdk_locale') || 'en-GB';
        // eslint-disable-next-line no-undef
        window.PCore.getEnvironmentInfo().setLocale(locale);

        // Setup listener for the reauth event
        if (tokenInfo) {
          // eslint-disable-next-line no-undef
          PCore.getPubSubUtils().subscribe( PCore.getConstants().PUB_SUB_EVENTS.EVENT_FULL_REAUTH,
            fnReauth,
            'authFullReauth'
          );
        } else {
          // customReauth event introduced with 8.8
          // eslint-disable-next-line no-undef
          const sEvent = PCore.getConstants().PUB_SUB_EVENTS.EVENT_CUSTOM_REAUTH;
          if (sEvent) {
            // eslint-disable-next-line no-undef
            PCore.getPubSubUtils().subscribe(sEvent, fnReauth, 'doReauth');
          }
        }

        // Fire SdkConstellationReady event so bridge and app route can do expected post PCore initializations
        const event = new CustomEvent('SdkConstellationReady', {});
        document.dispatchEvent(event);
      })
      .catch(e => {
        // Assume error caught is because token is not valid and attempt a full reauth
        // eslint-disable-next-line no-console
        console.error(`Constellation JS Engine bootstrap failed. ${e}`);
        gbC11NBootstrapInProgress = false;
        fnReauth();
      });
  });
  /* Ends here */
};

export const updateLoginStatus = () => {
  const sAuthHdr = sdkGetAuthHeader();
  gbLoggedIn = sAuthHdr && sAuthHdr.length > 0;
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
      return;
    }
  }

  sessionStorage.setItem('rsdk_AH', `${token.token_type} ${token.access_token}`);
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
};


// TODO: Cope with 401 and refresh token if possible (or just hope that it succeeds during login)
/**
 * Retrieve UserInfo for current authentication service
 */
 export const getUserInfo = (bUseSS=true) => {
  const ssUserInfo = sessionStorage.getItem("rsdk_UI");
  let userInfo = null;
  if( bUseSS && ssUserInfo ) {
    try {
      userInfo = JSON.parse(ssUserInfo);
      return Promise.resolve(userInfo);
    } catch(e) {
      // do nothing
    }
  }
  getAuthMgr(false).then( (aMgr) => {
    const tokenInfo = getCurrentTokens();
    return aMgr.getUserinfo(tokenInfo.access_token).then( data => {
      userInfo = data;
      if( userInfo ) {
        sessionStorage.setItem("rsdk_UI", JSON.stringify(userInfo));
      } else {
        sessionStorage.removeItem("rsdk_UI");
      }
      return Promise.resolve(userInfo);
    });
  });

};

export const login = (bFullReauth=false) => {

  if( gbCustomAuth ) return;

  gbLoginInProgress = true;
  // Needed so a redirect to login screen and back will know we are still in process of logging in
  sessionStorage.setItem("rsdk_loggingIn", `${Date.now()}`);

  getAuthMgr(!bFullReauth).then( (aMgr) => {
    const bMainRedirect = !authNoRedirect();
    const sdkConfigAuth = SdkConfigAccess.getSdkConfigAuth();
    let sRedirectUri=sdkConfigAuth.redirectUri;

    // If initial main redirect is OK, redirect to main page, otherwise will authorize in a popup window
    if (bMainRedirect && !bFullReauth) {
      // update redirect uri to be the root
      updateRedirectUri(aMgr, sRedirectUri);
      aMgr.loginRedirect();
      // Don't have token til after the redirect
      return Promise.resolve(undefined);
    } else {
      // Construct path to redirect uri
      const nLastPathSep = sRedirectUri.lastIndexOf("/");
      sRedirectUri = nLastPathSep !== -1 ? `${sRedirectUri.substring(0,nLastPathSep+1)}auth.html` : `${sRedirectUri}/auth.html`;
      // Set redirectUri to static auth.html
      updateRedirectUri(aMgr, sRedirectUri);
      return new Promise( (resolve, reject) => {
        aMgr.login().then(token => {
            processTokenOnLogin(token);
            // getUserInfo();
            resolve(token.access_token);
        }).catch( (e) => {
            gbLoginInProgress = false;
            sessionStorage.removeItem("rsdk_loggingIn");
            // eslint-disable-next-line no-console
            console.log(e);
            reject(e);
        });
      });
    }
  });

};

export const authRedirectCallback = ( href, fnLoggedInCB=null ) => {
  // Get code from href and swap for token
  const aHrefParts = href.split('?');
  const urlParams = new URLSearchParams(aHrefParts.length>1 ? `?${aHrefParts[1]}` : '');
  const code = urlParams.get("code");

  getAuthMgr(false).then( (aMgr) => {
    aMgr.getToken(code).then(token => {
      if( token && token.access_token ) {
          processTokenOnLogin(token, false);
          // getUserInfo();
          if( fnLoggedInCB ) {
              fnLoggedInCB( token.access_token );
          }
      }
    });
  });
};

/**
 * Silent or visible login based on login status
 *  @param {string} appName - unique name for application route (will be used to clear an session storage for another route)
 *  @param {boolean} noMainRedirect - avoid the initial main window redirect that happens in scenarios where it is OK to transition
 *   away from the main page
 *  @param {boolean} deferLogin - defer logging in (if not already authenticated)
 */
export const loginIfNecessary = (appName, noMainRedirect=false, deferLogin=false) => {
  // If no initial redirect status of page changed...clearAuthMgr
  const currNoMainRedirect = authNoRedirect();
  const currAppName = sessionStorage.getItem("rsdk_appName");
  if( appName !== currAppName || noMainRedirect !== currNoMainRedirect) {
    clearAuthMgr();
    sessionStorage.setItem("rsdk_appName", appName);
  }
  setNoInitialRedirect(noMainRedirect);
  // If custom auth no need to do any OAuth logic
  if( gbCustomAuth ) {
    if( !window.PCore ) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      constellationInit( null, null, null, authCustomReauth );
    }
    return;
  }

  if( window.location.href.indexOf("?code") !== -1 ) {
    // initialize authMgr
    initOAuth(false);
    return getAuthMgr(false).then(() => {
      authRedirectCallback(window.location.href, ()=> {
        window.location.href = window.location.pathname;
      });
    });
  }
  if( !deferLogin && (!gbLoginInProgress || isLoginExpired()) ) {
    initOAuth(false);
    return getAuthMgr(false).then(() => {
      updateLoginStatus();
      if( gbLoggedIn ) {
        fireTokenAvailable(getCurrentTokens());
        // getUserInfo();
      } else {
        return login();
      }
    });
  }
};

export const getHomeUrl = () => {
  return `${window.location.origin}/`;
};


export const authIsMainRedirect = () => {
  // Even with main redirect, we want to use it only for the first login (so it doesn't wipe out any state or the reload)
  return !authNoRedirect() && !usePopupForRestOfSession;
};

// Passive update where just session storage is updated so can be used on a window refresh
export const authTokenUpdated = (tokenInfo ) => {
  sessionStorage.setItem("rsdk_TI", JSON.stringify(tokenInfo));
  // Set default language as english on login
  sessionStorage.setItem('rsdk_locale', "en-GB");
};

export const logout = () => {
  return new Promise((resolve) => {
    const fnClearAndResolve = () => {
      clearAuthMgr();

      const event = new Event('SdkLoggedOut');
      document.dispatchEvent(event);

      resolve();
    };
    if( gbCustomAuth ) {
      sessionStorage.removeItem("rsdk_AH");
      fnClearAndResolve();
      return;
    }
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
          getAuthMgr(false).then( (aMgr) => {
            aMgr.revokeTokens(tokenInfo.access_token, tokenInfo.refresh_token)
            .then(() => {
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

const signOutAndRedirect = () => {
  logout().then(()=> {
    window.location.href = 'https://www.gov.uk/government/organisations/hm-revenue-customs';
  })
}

const el = document.getElementById('signout-btn');
el.onclick = signOutAndRedirect;

// Callback routine for custom event to ask for updated tokens
export const authUpdateTokens = (token) => {
  processTokenOnLogin( token );
};


// Initiate a full OAuth re-authorization (any refresh token has also expired).
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

// Set the custom authorization header for the SDK (and Constellation JS Engine) to
// utilize for every DX API request
export const sdkSetAuthHeader = (authHeader) => {
  // set this within session storage so it survives a browser reload
  if( authHeader ) {
    sessionStorage.setItem("rsdk_AH", authHeader);
    // setAuthorizationHeader method not available til 8.8 so do safety check
    if( window.PCore?.getAuthUtils().setAuthorizationHeader ) {
      window.PCore.getAuthUtils().setAuthorizationHeader(authHeader);
    }
  } else {
    sessionStorage.removeItem("rsdk_AH");
  }
  gbCustomAuth = true;
};

// Initiate a custom re-authorization.
export const authCustomReauth = () => {
  // Fire the SdkCustomReauth event to indicate a new authHeader is needed. Event listener should invoke sdkSetAuthHeader
  //  to communicate the new token to sdk (and Constellation JS Engine)
  const event = new CustomEvent('SdkCustomReauth', { detail: sdkSetAuthHeader });
  document.dispatchEvent(event);
};

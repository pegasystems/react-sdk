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
export let gbLoginInProgress = sessionStorage.getItem("rsdk_loggingIn") === "1";

// will store the PegaAuth instance
let authMgr = null;
// Since this variable is loaded in a separate instance in the popup scenario, use storage to coordinate across the two
let usePopupForRestOfSession = sessionStorage.getItem("rsdk_popup") === "1";

/*
 * Set to use popup experience for rest of session
 */
const forcePopupForReauths = ( bForce ) => {
  if( bForce ) {
      sessionStorage.setItem("pega_react_popup", "1");
      usePopupForRestOfSession = true;
  } else {
      sessionStorage.removeItem("pega_react_popup");
      usePopupForRestOfSession = false;
  }
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

export const authSetEmbedded = (isEmbedded) => {
  if( isEmbedded ) {
    sessionStorage.setItem("rsdk_Embedded", "1");
  } else {
    sessionStorage.removeItem("rsdk_Embedded");
  }
};

export const authIsEmbedded = () => {
  return sessionStorage.getItem("rsdk_Embedded") === "1";
};

/**
 * Initialize OAuth config structure members  and create authMgr instance
 * bInit - governs whether to create new sessionStorage or load existing one
 */
const initOAuth = (bInit) => {

  const sdkConfigAuth = SdkConfigAccess.getSdkConfigAuth();
  const pegaUrl = SdkConfigAccess.getSdkConfigServer().infinityRestServerUrl;
  // eslint-disable-next-line no-restricted-globals
  const currPath = location.pathname;
  const bPortalLogin = currPath.includes("/portal");
  const bEmbeddedLogin = currPath.includes("/embedded");
  // Sometimes the pathname may be just "/"...in which case we want it to use what ever was previously set
  if( bPortalLogin) {
    authSetEmbedded(false);
  } else if( bEmbeddedLogin ) {
    authSetEmbedded(true);
  }

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
    clientId: bPortalLogin ? sdkConfigAuth.portalClientId : sdkConfigAuth.mashupClientId,
    authorizeUri: sdkConfigAuth.authorize,
    tokenUri: sdkConfigAuth.token,
    revokeUri: sdkConfigAuth.revoke,
    redirectUri: `${window.location.origin}/`,
    authService: sdkConfigAuth.authService,
    useLocking: true
  };
  if( 'silentTimeout' in sdkConfigAuth ) {
    authConfig.silentTimeout = sdkConfigAuth.silentTimeout;
  }
  if( authIsEmbedded() ) {
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
  if(!sTI) return;
  try {
    tokens = JSON.parse(sTI);
  } catch(e) {
    tokens = null;
  }
  return tokens;
};

const fireTokenAvailable = (token) => {
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

  // Create and dispatch the SdkLoggedIn event to trigger constellationInit
  const event = new CustomEvent('SdkLoggedIn', { detail: { authConfig, tokenInfo: token } });
  document.dispatchEvent(event);
};

const processTokenOnLogin = ( token ) => {
  sessionStorage.setItem("rsdk_TI", JSON.stringify(token));
  if( window.PCore ) {
    window.PCore.getAuthUtils().setTokens(token);
  } else {
    fireTokenAvailable(token);
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
  sessionStorage.setItem("rsdk_loggingIn", "1");

  getAuthMgr(!bFullReauth).then( (aMgr) => {
    const bPortalLogin = !authIsEmbedded();

    // If portal will redirect to main page, otherwise will authorize in a popup window
    if (bPortalLogin && !bFullReauth) {
      // update redirect uri to be the root
      updateRedirectUri(aMgr, `${window.location.origin}/`);
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


/**
 * Silent or visible login based on login status
 */
export const loginIfNecessary = () => {
  initOAuth(false);
  if( gbLoggedIn ) {
    fireTokenAvailable(null);
  } else {
    return login();
  }
};

export const getHomeUrl = () => {
  return `${window.location.origin}/`;
};


export const authIsMainRedirect = () => {
  // Even with main redirect, we want to use it only for the first login (so it doesn't wipe out any state or the reload)
  return !authIsEmbedded() && !usePopupForRestOfSession;
};

export const authRedirectCallback = ( href, fnLoggedInCB=null ) => {
  // Get code from href and swap for token
  const aHrefParts = href.split('?');
  const urlParams = new URLSearchParams(aHrefParts.length>1 ? `?${aHrefParts[1]}` : '');
  const code = urlParams.get("code");

  getAuthMgr(false).then( aMgr => {
    aMgr.getToken(code).then(token => {
      if( token && token.access_token ) {
          processTokenOnLogin(token);
          if( fnLoggedInCB ) {
              fnLoggedInCB( token.access_token );
          }
      }
    });

  });

};

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
    // Create and dispatch the SdkLoggedIn event to trigger constellationInit
    // detail will be callback function to call once a new token structure is obtained
    const event = new CustomEvent('SdkFullReauth', { detail: authUpdateTokens });
    document.dispatchEvent(event);
  }
};

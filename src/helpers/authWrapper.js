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
let authTokenExpired = false;
// Since this variable is loaded in a separate instance in the popup scenario, use storage to coordinate across the two
let usePopupForRestOfSession = sessionStorage.getItem("rsdk_popup") === "1";
// To have this work smoothly on a browser refresh, use storage
let userHasRefreshToken = sessionStorage.getItem("rsdk_hasrefresh") === "1";

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
}

/**
 * Clean up any web storage allocated for the user session.
 */
 const clearAuthMgr = () => {
  // Remove any local storage for the user
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem("rsdk_CI");
  sessionStorage.removeItem("rsdk_TI");
  sessionStorage.removeItem("rsdk_loggingIn");
  gbLoggedIn = false;
  gbLoginInProgress = false;
  forcePopupForReauths(true);
  // Not removing the authMgr structure itself...as it can be leveraged on next login
}


/**
 * Initialize OAuth config structure members  and create authMgr instance
 * bInit - governs whether to create new sessionStorage or load existing one
 */
const initOAuth = (bInit) => {

  const sdkConfigAuth = SdkConfigAccess.getSdkConfigAuth();
  const pegaUrl = SdkConfigAccess.getSdkConfigServer().infinityRestServerUrl;
  const bPortalLogin = -1 !== location.pathname.indexOf("/portal");
  const bEmbeddedLogin = -1 !== location.pathname.indexOf("/embedded");
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

  let authConfig = {
    clientId: bPortalLogin ? sdkConfigAuth.portalClientId : sdkConfigAuth.mashupClientId,
    authorizeUri: sdkConfigAuth.authorize,
    tokenUri: sdkConfigAuth.token,
    revokeUri: sdkConfigAuth.revoke,
    redirectUri: `${window.location.origin}/`,
    authService: sdkConfigAuth.authService
  };
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
            oSI.userIdentifier !== authConfig.userIdentifier ) {
            clearAuthMgr();
            sSI = null;
        }
    } catch(e) {
    }
  }

  if( !sSI || bInit ) {
    sessionStorage.setItem('rsdk_CI', JSON.stringify(authConfig));
  }
  authMgr = new PegaAuth('rsdk_CI');
};

function getAuthMgr( bInit ) {
  return new Promise( (resolve, reject) => {
    let toNextCheck = null;
    const fnCheckForAuthMgr = () => {
      if( PegaAuth && !authMgr ) {
        initOAuth( bInit );
      }
      if(authMgr) {
        if( toNextCheck ) {
          clearInterval(toNextCheck);
        }
        return resolve(authMgr);
      }
    }
    toNextCheck = setInterval(fnCheckForAuthMgr, 500);
  });
}


export function updateLoginStatus() {
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
}

export function login() {
  if (!SdkConfigAccess) {
    // eslint-disable-next-line no-console
    console.error(`Trying login before SdkConfigAccessReady!`);
    return;
  }

  gbLoginInProgress = true;
  // Needed so a redirect to login screen and back will know we are still in process of logging in
  sessionStorage.setItem("rsdk_loggingIn", "1");

  getAuthMgr(true).then( (aMgr) => {
    const sdkConfigAuth = SdkConfigAccess.getSdkConfigAuth();
    const bPortalLogin = !authIsEmbedded();

    // If portal will redirect to main page, otherwise will authorize in a popup window
    if (bPortalLogin) {
      authMgr.loginRedirect();
      // Don't have token til after the redirect
      return Promise.resolve(undefined);
    } else {
      return new Promise( (resolve, reject) => {
        aMgr.login().then(token => {
            processTokenOnLogin(token);
            resolve(token.access_token);
        }).catch( (e) => {
            gbLoginInProgress = false;
            sessionStorage.removeItem("rsdk_loggingIn");
            console.log(e);
            reject(e);
        })
      });
    }
  });
}

const fireTokenAvailable = (token) => {
  if( !token ) {
    // This is used on page reload to load the token from sessionStorage and carry on
    const sTI = sessionStorage.getItem('rsdk_TI');
    if(!sTI) return;
    try {
      token = JSON.parse(sTI);
    } catch(e) {
      token = {access_token: sessionStorage.getItem('accessToken')};
    }
  }

  // accessToken being redundantly set in c11nboot as part of handling SdkLoggedIn event
  // TODO: Prehaps remove from
  sessionStorage.setItem('accessToken', token.access_token);
  updateLoginStatus();

  // Create and dispatch the SdkLoggedIn event to trigger constellationInit
  const event = new CustomEvent('SdkLoggedIn', { detail: token.access_token });
  document.dispatchEvent(event);

  if( token.refresh_token ) {
      userHasRefreshToken = true;
      sessionStorage.setItem("rsdk_hasrefresh", "1");
    }
  // gbLoggedIn is getting updated in updateLoginStatus
  gbLoggedIn = true;
  gbLoginInProgress = false;
  sessionStorage.removeItem("rsdk_loggingIn");
  forcePopupForReauths(true);
}

const processTokenOnLogin = ( token ) => {
  sessionStorage.setItem("rsdk_TI", JSON.stringify(token));
  fireTokenAvailable(token);
}

/**
 * Silent or visible login based on login status
 */
export const loginIfNecessary = () => {
  initOAuth(true);
  if( gbLoggedIn ) {
    fireTokenAvailable(null);
  } else {
    return login();
  }
}

export const getHomeUrl = () => {
  return window.location.origin + "/";
}


export const authIsMainRedirect = () => {
  // Even with main redirect, we want to use it only for the first login (so it doesn't wipe out any state or the reload)
  return !authIsEmbedded() && !usePopupForRestOfSession;
}

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

}

export function logout() {
  clearAuthMgr();
  updateLoginStatus();

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
}

export function authSetEmbedded(isEmbedded) {
  if( isEmbedded ) {
    sessionStorage.setItem("rsdk_Embedded", "1");
  } else {
    sessionStorage.removeItem("rsdk_Embedded");
  }
}

export function authIsEmbedded() {
  return sessionStorage.getItem("rsdk_Embedded") === "1";
};

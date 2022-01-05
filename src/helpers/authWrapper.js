// This file wraps various calls related to logging in, logging out, etc.
//  that use the auth.html/auth.js to do the work of logging in.

// Migrating code from "early availability" index.html here so we can
//  better leverage info read in from sdk-config.json
//  For now, export all of the vars/functions so they can be used as needed.

import { SdkConfigAccess } from './config_access';

// eslint-disable-next-line import/no-mutable-exports
export let gbLoggedIn = false;

/**
 * getLoginType: looks at the page's pathname to determine whether we're trying
 * to log in to a portal or an embedded use case
 *  For now, look to see if the pathname includes "portal".
 *    If it does, assume a "portal" use case
 *    Otherwise, assume an "embedded" use case
 * @returns string either "portal" or embedded
 * @private
 */
function getLoginType() {
  const winLocPath = window.location.pathname.split('/')[1].toLowerCase(); // remove leading slash
  const strPortal = 'portal';
  const strEmbedded = 'embedded';

  if (winLocPath.includes(strPortal)) {
    return strPortal;
  } else {
    return strEmbedded;
  }
}

/**
 * isPortalLogin
 *  uses getLoginType() and returns true if the current
 *  pathname indicates a "portal" login type
 */
export function isPortalLogin() {
  let bRet = false;

  if (getLoginType() === 'portal') {
    bRet = true;
  }

  return bRet;
}

export function updateLoginStatus() {
  const sAuthHdr = sessionStorage.getItem('pega_authHdr');
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

  const sdkConfigAuth = SdkConfigAccess.getSdkConfigAuth();
  const bPortalLogin = isPortalLogin();

  const authConfig = {
    clientId: bPortalLogin ? sdkConfigAuth.portalClientId : sdkConfigAuth.mashupClientId,
    clientSecret: bPortalLogin ? '' : sdkConfigAuth.mashupClientSecret,
    tokenUri: `${sdkConfigAuth.accessTokenUri}`,
    authorizeUri: `${sdkConfigAuth.authorizationUri}`,
    redirectUri: `${window.location.protocol}//localhost:3502/auth.html`,
    authService: `${sdkConfigAuth.authQueryParams.authentication_service}`
  };
  sessionStorage.setItem('peConfig', JSON.stringify(authConfig));
  const myWindow = window.open('auth.html', '_blank', 'width=700,height=500,left=200,top=100');
  window.myWindow = myWindow;
  window.setToken = function setTokenFn(token) {
    const authorizationHeader = `Bearer ${token}`;
    sessionStorage.setItem('pega_authHdr', authorizationHeader);
    window.myWindow.close();
    updateLoginStatus();
    // Create and dispatch the SdkLoggedIn event to trigger constellationInit
    const event = new CustomEvent('SdkLoggedIn', { detail: token });
    document.dispatchEvent(event);
  };
}

export function logout() {
  sessionStorage.removeItem('pega_authHdr');
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

export function authEmbeddedLogin() {
  if (!SdkConfigAccess) {
    // eslint-disable-next-line no-console
    console.error(`Trying authEmbeddedLogin before SdkConfigAccessReady!`);
    return;
  }

  // Get authConfig block from the SDK Config
  const authConfig = SdkConfigAccess.getSdkConfigAuth();

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('client_id', authConfig.mashupClientId);
  if (authConfig.mashupClientSecret) {
    urlSearchParams.set('client_secret', authConfig.mashupClientSecret);
  }

  const grantType = authConfig.mashupGrantType;
  urlSearchParams.set('grant_type', grantType);

  fetch(authConfig.accessTokenUri, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json'
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: urlSearchParams
  })
    .then((response) => response.json())
    .then((data) => {
      gbLoggedIn = true;
      // Create and dispatch the SdkLoggedIn event to trigger constellationInit
      const event = new CustomEvent('SdkLoggedIn', { detail: data.access_token });
      document.dispatchEvent(event);
    });
}

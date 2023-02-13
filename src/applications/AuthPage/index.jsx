import React from 'react';
import { getHomeUrl, authIsMainRedirect, authRedirectCallback } from "../../helpers/authManager";

function getEmbedOriginFromState(state) {
  let embedOrigin = null;
  try {
      // Expect state to contain the embedding page's origin
      if( state ) {
          embedOrigin = window.atob(state);
      }
  // eslint-disable-next-line no-empty
  } catch(e) {
  }
  if( !embedOrigin ) {
      // eslint-disable-next-line no-restricted-globals
      embedOrigin = location.origin;
  }
  return embedOrigin;
}

export default function AuthPage() {

  if( authIsMainRedirect() ) {

    authRedirectCallback(window.location.href, () => {
      // eslint-disable-next-line no-restricted-globals
      location.href = `${getHomeUrl()}portal`;
    });
  } else {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const bTryOpenerLogging = false;
    // eslint-disable-next-line no-console
    const fnLog = bTryOpenerLogging ? window.opener.console.log : console.log;
    let bSuccess = false;

    if (code) {
        fnLog("Testing");
        try {
            window.opener.authCodeCallback(code);
            bSuccess = true;
        } catch(e) {
            fnLog("auth.html: Failed to directly access authCodeCallback.")
        }

        // Post messages require a targetDomain...trying to pass this via state
        const embedOrigin = getEmbedOriginFromState(state);
        if( !bSuccess ) {
            try {
                window.opener.postMessage({type:"PegaAuth", code}, embedOrigin);
                bSuccess = true;
            } catch(e) {
                fnLog("auth.html: Failed to directly post message to opener");
            }
        }

        if( !bSuccess ) {
            window.addEventListener("message", (event) => {
                if( event.data && event.data.type && event.data.type==="PegaAuth" ) {
                    event.source.postMessage({type:"PegaAuth", code}, embedOrigin);
                }
            });
        }

    }

  }

  return (
    <div />
  );
}

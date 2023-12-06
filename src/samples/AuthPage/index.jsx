import React from 'react';
import { getHomeUrl, authIsMainRedirect, authRedirectCallback } from '@pega/auth/lib/sdk-auth-manager';
import { authDone } from '@pega/auth/lib/auth-code-redirect';


export default function AuthPage() {

  if( authIsMainRedirect() ) {

    authRedirectCallback(window.location.href, () => {
      // eslint-disable-next-line no-restricted-globals
      location.href = `${getHomeUrl()}portal`;
    });
  } else {
    authDone();
  }

  return (
    <div />
  );
}

import React from 'react';
import AppSelector from '../AppSelector';
import { gbLoggedIn, gbLoggingIn, login } from '../../helpers/authWrapper';

const TopLevelApp = () => {

  // Handle SdkConfigAccessReady here so we can force a login before proceeding too far
  document.addEventListener("SdkConfigAccessReady", () => {
    // eslint-disable-next-line no-console
    console.log(`TopLevelApp: SdkConfigAccessReady`);
    if (typeof(login) === 'function') {
      // If not logged in, login.
      if (!gbLoggedIn && !gbLoggingIn) {
        login();
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`TopLevelApp: login undefined or already logged in!`);
    }
  });

  return (
    <div>
      <AppSelector />
    </div>
  );
}


export default TopLevelApp;

import React from 'react';
import AppSelector from '../AppSelector';
import { gbLoginInProgress, loginIfNecessary } from '../../helpers/authWrapper';

const TopLevelApp = () => {

  // Handle SdkConfigAccessReady here so we can force a login before proceeding too far
  document.addEventListener("SdkConfigAccessReady", () => {
    // eslint-disable-next-line no-console
    console.log(`TopLevelApp: SdkConfigAccessReady`);
    if (typeof(loginIfNecessary) === 'function') {
      // If not logged in, login.
      if (!gbLoginInProgress) {
        loginIfNecessary();
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

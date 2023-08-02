import React from 'react';
import AppSelector from '../AppSelector';
import { useTranslation } from 'react-i18next';

const TopLevelApp = () => {

  return (
    <div>
      <AppSelector />
    </div>
  );
}

document.addEventListener("SdkLoggedOut", () => {
  const thePegaRoot = document.getElementById('pega-root');
  const { t } = useTranslation();
  if (thePegaRoot) {
    // Clear any prior Pega content within pega root
    thePegaRoot.innerHTML = "";
    const theLogoutMsgDiv = document.createElement('div');
    theLogoutMsgDiv.setAttribute('style', 'margin: 5px;');
    theLogoutMsgDiv.innerHTML = `${t('YOU_ARE_LOGGED_OUT')}`;
    thePegaRoot.appendChild(theLogoutMsgDiv);
  }
});


export default TopLevelApp;

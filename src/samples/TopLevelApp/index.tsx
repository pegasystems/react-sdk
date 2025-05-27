import AppSelector from '../AppSelector';

const TopLevelApp = () => {
  return (
    <div>
      <AppSelector />
    </div>
  );
};

document.addEventListener('SdkLoggedOut', () => {
  const thePegaRoot = document.getElementById('pega-root');
  if (thePegaRoot) {
    // Clear any prior Pega content within pega root
    thePegaRoot.innerHTML = '';
    // const theLogoutMsgDiv = document.createElement('div');
    // theLogoutMsgDiv.setAttribute('style', 'margin: 5px;');
    // theLogoutMsgDiv.innerHTML = `You are logged out. Refresh the page to log in again.`;
    // thePegaRoot.appendChild(theLogoutMsgDiv);
    // eslint-disable-next-line no-restricted-globals
    location.href = `${window.location.origin}/SDK-R/portal.html`;
  }
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('redirected');
  sessionStorage.removeItem('rsdk_portalName');
  // window.location.href = `${window.location.origin}/portal`;
});

export default TopLevelApp;

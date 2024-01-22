import { logout } from '@pega/react-sdk-components/lib/components/helpers/authManager';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';

let milisecondsTilWarning = 10 * 1000;
let milisecondsTilSignout = 55 * 1000;

export const settingTimer = async () => {
  const sdkConfig = await getSdkConfig();
  if (sdkConfig.timeoutConfig.secondsTilWarning)
    milisecondsTilWarning = sdkConfig.timeoutConfig.secondsTilWarning * 1000;
  if (sdkConfig.timeoutConfig.secondsTilLogout)
    milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
};

let applicationTimeout = null;
let signoutTimeout = null;

export const initTimeout = (setShowTimeoutModal, isAuthorised) => {
  // console.log(isAuthorised);
  // Fetches timeout length config
  settingTimer();
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);

  // Clears any existing timeouts and starts the timeout for warning, after set time shows the modal and starts signout timer
  applicationTimeout = setTimeout(() => {
    setShowTimeoutModal(true);
    // TODO - unauth and sessiontimeout functionality to be implemented
    signoutTimeout = setTimeout(() => {
      if (isAuthorised) {
        logout();
      } else {
        setShowTimeoutModal(false);
        // session ends and deleteData() (pega)
      }
    }, milisecondsTilSignout);
  }, milisecondsTilWarning);
};

// Sends 'ping' to pega to keep session alive and then initiates the timeout
export function staySignedIn(
  setShowTimeoutModal,
  claimsListApi,
  isAuthorised,
  refreshSignin = true
) {
  if (refreshSignin) {
    PCore.getDataPageUtils().getDataAsync(claimsListApi, 'root');
  }
  setShowTimeoutModal(false);
  initTimeout(setShowTimeoutModal, isAuthorised);
}

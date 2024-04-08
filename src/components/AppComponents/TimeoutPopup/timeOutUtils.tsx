import { logout, getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';

let milisecondsTilWarning = 780 * 1000;
let milisecondsTilSignout = 115 * 1000;

export const settingTimer = async () => {
  const sdkConfig = await getSdkConfig();
  if (sdkConfig.timeoutConfig.secondsTilWarning)
    milisecondsTilWarning = sdkConfig.timeoutConfig.secondsTilWarning * 1000;
  if (sdkConfig.timeoutConfig.secondsTilLogout)
    milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
};

let applicationTimeout = null;
let signoutTimeout = null;

export function clearTimer() {
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);
}

export const initTimeout = (showTimeoutModal, deleteData, isAuthorised, isConfirmationPage) => {
  // TODO - isAuthorised to be replaced by caseType from pega
  // Fetches timeout length config
  settingTimer();
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);

  // Clears any existing timeouts and starts the timeout for warning, after set time shows the modal and starts signout timer
  applicationTimeout = setTimeout(() => {
    // TODO - unauth and sessiontimeout functionality to be implemented
    showTimeoutModal(true);
    signoutTimeout = setTimeout(() => {
      if (!isAuthorised && !isConfirmationPage) {
        // if the journey is not authorized or from confirmation page , the claim data gets deleted
        deleteData();
        clearTimer();
      } else {
        // the logout case executes when entire timeout occurs after confirmation page or user clicks
        // exit survey link in pop after confirmation page
        logout();
      }
    }, milisecondsTilSignout);
  }, milisecondsTilWarning);
};

// Sends 'ping' to pega to keep session alive and then initiates the timeout
export function staySignedIn(
  setShowTimeoutModal,
  claimsListApi,
  deleteData = null,
  isAuthorised = false,
  refreshSignin = true,
  isConfirmationPage = false
) {
  if (refreshSignin && !!claimsListApi) {
    // @ts-ignore
    PCore.getDataPageUtils().getDataAsync(claimsListApi, 'root');
  }
  setShowTimeoutModal(false);
  initTimeout(setShowTimeoutModal, deleteData, isAuthorised, isConfirmationPage);
}

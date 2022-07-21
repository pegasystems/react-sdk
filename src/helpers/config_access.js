// Helper singleton class to assist with loading and accessing
//  the SDK Config JSON
import {authGetAuthHeader} from './authManager';

// Create a singleton for this class (with async loading of config file) and export it
let SdkConfigAccess = null;
let SdkConfigAccessCreateInProgress = false;


class ConfigAccess {

  static sdkConfig = {};
  // isConfigLoaded will be updated to true after the async load is complete
  static isConfigLoaded = false;

  constructor() {
    // sdkConfig is the JSON object read from the sdk-config.json file

    // The "work" to load the config file is done (asynchronously) via the initialize
    //  (Factory function) below)
  }

  /**
   * Asynchronous initialization of the config file contents.
   * @returns Promise of config file fetch
   */
  initialize() {
    return fetch('./sdk-config.json')
      .then( response => response.json())
      .then( (data) => {
        this.sdkConfig = data;
        // console.log(`ConfigAccess.sdkConfig: ${JSON.stringify(ConfigAccess.sdkConfig)}`);
        this.isConfigLoaded = true;
        // Compute the SDK Content Server Url one we have the sdk-config.json data
        this.selectSdkContentServerUrl();
        // Note that we return the promise so the results are then-able
        return this;
      }).catch(err => {
        console.error( err );
      });
  }

  /**
   *
   * @returns the sdk-config JSON object
   */
  getSdkConfig = async () => {
    if( Object.keys(this.sdkConfig).length === 0 ) {
      await getSdkConfig();
    }
    return this.sdkConfig;
  }


  /**
   *
   * @returns the authConfig block in the SDK Config object
   */
  getSdkConfigAuth = () => {
    if( SdkConfigAccess === null ) {
      const config = this.getSdkConfig();
    }
    return SdkConfigAccess.sdkConfig.authConfig;
  }

  /**
   *
   * @returns the serverConfig bloc from the sdk-config.json file
   */
  getSdkConfigServer = () => {
    if( SdkConfigAccess === null ) {
      const config = this.getSdkConfig();
    }
    return SdkConfigAccess.sdkConfig.serverConfig;
  }


  /**
     * @param {String} key the key to be inserted/updated in serverConfig
     * @param {String} value the value to be assigned to the given key
     */
  setSdkConfigServer = (key, value) => {

    SdkConfigAccess.sdkConfig.serverConfig[key] = value;

  }

  /**
   * If ConfigAccess.sdkConfig.serverConfig.sdkContentServerUrl is set, leave it and the specified URL will be used.
   * If not set, set SdkConfigAccess.serverConfig.sdkContentServerUrl to window.location.origin
  */
  selectSdkContentServerUrl = () => {
    if ((this.sdkConfig.serverConfig.sdkContentServerUrl !== "") &&
        (this.sdkConfig.serverConfig.sdkContentServerUrl !== undefined)) {
      // use the specified Url as is
    } else {
      // Default to window.location.origin
      this.sdkConfig.serverConfig.sdkContentServerUrl = window.location.origin;
    }

    console.log(`Using sdkContentServerUrl: ${this.sdkConfig.serverConfig.sdkContentServerUrl}`);
  }

  /**
   * If ConfigAccess.sdkConfig.serverConfig.appPortal is set, leave it and the specified portal will be used.
   * If not set, set SdkConfigAccess.serverConfig.appPortal to default portal of currently logged in user
   */
   async selectPortal() {

    if ((this.sdkConfig.serverConfig.appPortal !== "") &&
        (this.sdkConfig.serverConfig.appPortal !== undefined) ) {
          // use the specified portal
          console.log(`Using appPortal: ${this.sdkConfig.serverConfig.appPortal}`);
          return;
    }

    const userAccessGroup = PCore.getEnvironmentInfo().getAccessGroup();
    const dataPageName = "D_OperatorAccessGroups";
    const serverUrl = this.getSdkConfigServer().infinityRestServerUrl;


    await fetch ( serverUrl + "/api/v1/data/" + dataPageName,
      {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : authGetAuthHeader()
        },
      })
      .then( response => response.json())
      .then( async (agData) => {

        let arAccessGroups = agData.pxResults;

        for (let ag of arAccessGroups) {
          if (ag.pyAccessGroup === userAccessGroup) {
            // Found operator's current access group. Use its portal
            SdkConfigAccess.setSdkConfigServer("appPortal", ag.pyPortal);
            console.log(`Using appPortal: ${this.sdkConfig.serverConfig.appPortal}`);
            break;
          }
        }
      })
      .catch( e => {
        if( e ) {
          // check specific error if 401, and wiped out if so stored token is stale.  Fetcch new tokens.
        }
      });

  }

  /**
   * Path to the BootstrapCSS
   * @returns the locBootstrapCSS from the serverConfig block of the sdk-config.json file
   */
   getSdkConfigBootstrapCSS = () => {
     const serverConfig = this.getSdkConfigServer();
     const locBootstrapCSS = serverConfig.locBootstrapCSS;
     if (locBootstrapCSS === undefined) {
       console.error(`locBootstrapCSS: ${locBootstrapCSS}`);
     }
    return locBootstrapCSS;
  }

}


// Implement Factory function to allow async load
//  See https://stackoverflow.com/questions/49905178/asynchronous-operations-in-constructor/49906064#49906064 for inspiration
async function createSdkConfigAccess() {
  // Note that our initialize function returns a promise...
  let singleton = new ConfigAccess();
  await singleton.initialize();
  return singleton;
}

// Acquire SdkConfigAccess structure
async function getSdkConfig() {
  return new Promise( (resolve) => {
    let idNextCheck = null;
    if( SdkConfigAccess === null && !SdkConfigAccessCreateInProgress ) {
      SdkConfigAccessCreateInProgress = true;
      createSdkConfigAccess().then( theConfigAccess => {
        SdkConfigAccess = theConfigAccess;
        SdkConfigAccessCreateInProgress = false;
        // console.log(`SdkConfigAccess: ${JSON.stringify(SdkConfigAccess)}`);
        // Create and dispatch the SdkConfigAccessReady event
        const event = new CustomEvent("SdkConfigAccessReady", { });
        document.dispatchEvent(event);
        return resolve( SdkConfigAccess.sdkConfig );
      });
    } else {
      const fnCheckForConfig = () => {
        if( SdkConfigAccess ) {
          if( idNextCheck ) {
            clearInterval(idNextCheck);
          }
          return resolve( SdkConfigAccess.sdkConfig );
        }
        idNextCheck = setInterval(fnCheckForConfig, 500);
      };
      if( SdkConfigAccess !== null ) {
        return resolve( SdkConfigAccess.sdkConfig );
      } else {
        idNextCheck = setInterval(fnCheckForConfig, 500);
      }
    }
  });
}

if( true ) {
  let ignore = getSdkConfig();
}

export {SdkConfigAccess, getSdkConfig};

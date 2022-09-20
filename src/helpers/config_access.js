// Helper singleton class to assist with loading and accessing
//  the SDK Config JSON
import {sdkGetAuthHeader} from './authManager';

// Create a singleton for this class (with async loading of config file) and export it
// Note: Initialzing SdkConfigAccess to null seems to cause lots of compile issues with references
//  within other components and the value potentially being null (so try to leave it undefined)
let SdkConfigAccess;
let SdkConfigAccessCreateInProgress = false;


class ConfigAccess {

  constructor() {
    // sdkConfig is the JSON object read from the sdk-config.json file
    this.sdkConfig = {};
    // isConfigLoaded will be updated to true after the async load is complete
    this.isConfigLoaded = false;

    // The "work" to load the config file is done (asynchronously) via the initialize
    //  (Factory function) below)
  }

  /**
   * Asynchronous initialization of the config file contents.
   * @returns Promise of config file fetch
   */
  async readSdkConfig() {
    if( Object.keys(this.sdkConfig).length === 0 ) {
      return  fetch("./sdk-config.json")
        .then ( (response) => {
          if( response.ok ) {
            return response.json();
          } else {
            throw new Error(`Failed with status:${response.status}`);
          }
        })
        .then ( (data) => {
            this.sdkConfig = data;
            this.fixupConfigSettings();
            return Promise.resolve(this.sdkConfig);
        }).catch(err => {
            console.error("Fetch for sdk-config.js failed.");
            console.error(err);
            return Promise.reject(err);
        });
    } else {
      return Promise.resolve(this.sdkConfig);
    }
  }

  // Adjust any settings like setting up defaults or making sure URIs have a trailing slash
  fixupConfigSettings() {
    const oServerConfig = this.sdkConfig["serverConfig"];
    // If not present, then use current root path
    oServerConfig.sdkContentServerUrl = oServerConfig.sdkContentServerUrl || window.location.origin;
    // Needs a trailing slash so add one if not there
    if( !oServerConfig.sdkContentServerUrl.endsWith('/') ) {
      oServerConfig.sdkContentServerUrl = `${oServerConfig.sdkContentServerUrl}/`;
    }
    console.log(`Using sdkContentServerUrl: ${this.sdkConfig["serverConfig"].sdkContentServerUrl}`);

    // Don't want a trailing slash for infinityRestServerUrl
    if( oServerConfig.infinityRestServerUrl.endsWith('/') ) {
      oServerConfig.infinityRestServerUrl = oServerConfig.infinityRestServerUrl.slice(0, -1)
    }
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
    if( Object.keys(this.sdkConfig).length === 0 ) {
      const config = this.getSdkConfig();
    }
    return this.sdkConfig["authConfig"];
  }

  /**
   *
   * @returns the serverConfig bloc from the sdk-config.json file
   */
  getSdkConfigServer = () => {
    if( Object.keys(this.sdkConfig).length === 0 ) {
      const config = this.getSdkConfig();
    }
    return this.sdkConfig["serverConfig"];
  }


  /**
     * @param {String} key the key to be inserted/updated in serverConfig
     * @param {String} value the value to be assigned to the given key
     */
  setSdkConfigServer = (key, value) => {

    this.sdkConfig.serverConfig[key] = value;

  }

  /**
   * If this.sdkConfig.serverConfig.appPortal is set, leave it and the specified portal will be used.
   * If not set, set this.sdkConfig.serverConfig.appPortal to default portal of currently logged in user
   */
   async selectPortal() {

    if( Object.keys(this.sdkConfig).length === 0 ) {
      await getSdkConfig();
    }

    if ((this.sdkConfig.serverConfig.appPortal !== "") &&
        (this.sdkConfig.serverConfig.appPortal !== undefined) ) {
          // use the specified portal
          console.log(`Using appPortal: ${this.sdkConfig.serverConfig.appPortal}`);
          return;
    }

    const userAccessGroup = PCore.getEnvironmentInfo().getAccessGroup();
    const dataPageName = "D_OperatorAccessGroups";
    const serverUrl = this.sdkConfig.serverConfig.infinityRestServerUrl;
    const appAlias = this.sdkConfig.serverConfig.appAlias;
    const appAliasPath = appAlias ? `/app/${appAlias}` : '';

    await fetch ( `${serverUrl}${appAliasPath}/api/v1/data/${dataPageName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : sdkGetAuthHeader()
        },
      })
      .then( response => response.json())
      .then( async (agData) => {

        let arAccessGroups = agData.pxResults;

        for (let ag of arAccessGroups) {
          if (ag.pyAccessGroup === userAccessGroup) {
            // Found operator's current access group. Use its portal
            this.setSdkConfigServer("appPortal", ag.pyPortal);
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
  await singleton.readSdkConfig();
  return singleton;
};

// Initialize exported SdkConfigAccess structure
async function getSdkConfig() {
  return new Promise( (resolve) => {
    let idNextCheck = null;
    if( !SdkConfigAccess && !SdkConfigAccessCreateInProgress ) {
      SdkConfigAccessCreateInProgress = true;
      createSdkConfigAccess().then( theConfigAccess => {
        // Key initialization of SdkConfigAccess
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
      if( SdkConfigAccess ) {
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

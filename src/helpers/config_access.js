// Helper singleton class to assist with loading and accessing
//  the SDK Config JSON
import {sdkGetAuthHeader} from './authManager';
import Utils from './utils';

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
    if(Utils.isEmptyObject(this.sdkConfig)) {
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
    oServerConfig.sdkContentServerUrl = oServerConfig.sdkContentServerUrl || window.location.origin + window.location.pathname;
    // Needs a trailing slash so add one if not there
    if( !oServerConfig.sdkContentServerUrl.endsWith('/') ) {
      oServerConfig.sdkContentServerUrl = `${oServerConfig.sdkContentServerUrl}/`;
    }
    console.log(`Using sdkContentServerUrl: ${this.sdkConfig["serverConfig"].sdkContentServerUrl}`);

    // Don't want a trailing slash for infinityRestServerUrl
    if( oServerConfig.infinityRestServerUrl.endsWith('/') ) {
      oServerConfig.infinityRestServerUrl = oServerConfig.infinityRestServerUrl.slice(0, -1)
    }

    // Specify our own internal list of well known portals to exclude (if one not specified)
    if( !oServerConfig.excludePortals ) {
      oServerConfig.excludePortals = ["pxExpress", "Developer", "pxPredictionStudio", "pxAdminStudio", "pyCaseWorker", "pyCaseManager7"];
      console.warn(`No exludePortals entry found within serverConfig section of sdk-config.json.  Using the following default list: ["pxExpress", "Developer", "pxPredictionStudio", "pxAdminStudio", "pyCaseWorker", "pyCaseManager7"]`);
    }
  }

  /**
   *
   * @returns the sdk-config JSON object
   */
  getSdkConfig = async () => {
    if(Utils.isEmptyObject(this.sdkConfig)) {
      await getSdkConfig();
    }
    return this.sdkConfig;
  }


  /**
   *
   * @returns the authConfig block in the SDK Config object
   */
  getSdkConfigAuth = () => {
    if(Utils.isEmptyObject(this.sdkConfig)) {
      const config = this.getSdkConfig();
    }
    return this.sdkConfig["authConfig"];
  }

  /**
   *
   * @returns the serverConfig bloc from the sdk-config.json file
   */
  getSdkConfigServer = () => {
    if(Utils.isEmptyObject(this.sdkConfig)) {
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

    if(Utils.isEmptyObject(this.sdkConfig)) {
      await getSdkConfig();
    }

    const serverConfig = this.sdkConfig.serverConfig;

    if ((serverConfig.appPortal !== "") &&
        (serverConfig.appPortal !== undefined) ) {
          // use the specified portal
          console.log(`Using appPortal: ${serverConfig.appPortal}`);
          return;
    }

    const userAccessGroup = PCore.getEnvironmentInfo().getAccessGroup();
    const dataPageName = "D_OperatorAccessGroups";
    const serverUrl = serverConfig.infinityRestServerUrl;
    const appAlias = serverConfig.appAlias;
    const appAliasPath = appAlias ? `/app/${appAlias}` : '';
    const arExcludedPortals = serverConfig["excludePortals"];

    // Using v1 API here as v2 data_views is not able to access same data page currently.  Should move to avoid having this logic to find
    //  a default portal or constellation portal and rather have Constellation JS Engine API just load the default portal
    await fetch ( `${serverUrl}${appAliasPath}/api/v1/data/${dataPageName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : sdkGetAuthHeader()
        }
      })
      .then( response => {
        if( response.ok && response.status === 200) {
          return response.json();
        } else {
          if( response.status === 401 ) {
            // Might be either a real token expiration or revoke, but more likely that the "api" service package is misconfigured
            throw( new Error(`Attempt to access ${dataPageName} failed.  The "api" service package is likely not configured to use "OAuth 2.0"`));
          };
          throw( new Error(`HTTP Error: ${response.status}`));
        }
      })
      .then( async (agData) => {

        let arAccessGroups = agData.pxResults;
        let selectedPortal = null;

        for (let ag of arAccessGroups) {
          if (ag.pyAccessGroup === userAccessGroup) {
            // Check if default portal works
            if( !arExcludedPortals.includes(ag.pyPortal) ) {
              selectedPortal = ag.pyPortal;
            } else {
              console.error(`Default portal for current operator (${ag.pyPortal}) is not compatible with SDK.\nConsider using a different operator, adjusting the default portal for this operator, or using "appPortal" setting within sdk-config.json to specify a specific portal to load.`);
              // Find first portal that is not excluded (might work)
              for (let portal of ag.pyUserPortals ) {
                if( !arExcludedPortals.includes(portal.pyPortalLayout) ) {
                  selectedPortal = portal.pyPortalLayout;
                  break;
                }
              }
            }
            break;
          }
        }
        if( selectedPortal ) {
          // Found operator's current access group. Use its portal
          this.setSdkConfigServer("appPortal", selectedPortal);
          console.log(`Using non-excluded portal: ${serverConfig.appPortal}`);
        }
      })
      .catch( e => {
        console.error(e.message);
        // check specific error if 401, and wiped out if so stored token is stale.  Fetch new tokens.
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

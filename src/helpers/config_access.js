// Helper singleton class to assist with loading and accessing
//  the SDK Config JSON

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
        ConfigAccess.sdkConfig = data;
        // console.log(`ConfigAccess.sdkConfig: ${JSON.stringify(ConfigAccess.sdkConfig)}`);
        this.isConfigLoaded = true;
        this.sdkConfig = data;
        // Compute the SDK Content Server Url one we have the sdk-config.json data
        ConfigAccess.selectSdkContentServerUrl();
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
  getSdkConfig = () => {
    return ConfigAccess.sdkConfig;
  }


  /**
   * 
   * @returns the authConfig block in the SDK Config object
   */
  getSdkConfigAuth = () => {
    return this.getSdkConfig().authConfig;
  }

  /**
   * 
   * @returns the serverConfig bloc from the sdk-config.json file
   */
  getSdkConfigServer = () => {
    return this.getSdkConfig().serverConfig;
  }


  /**
     * @param {String} key the key to be inserted/updated in serverConfig
     * @param {String} value the value to be assigned to the given key
     */
  setSdkConfigServer = (key, value) => {

    ConfigAccess.sdkConfig.serverConfig[key] = value;
    
  }

  /** 
   * If ConfigAccess.sdkConfig.serverConfig.sdkContentServerUrl is set, leave it and the specified URL will be used.
   * If not set, set SdkConfigAccess.serverConfig.sdkContentServerUrl to window.location.origin
  */
  static selectSdkContentServerUrl = () => {
    if ((ConfigAccess.sdkConfig.serverConfig.sdkContentServerUrl !== "") &&
        (ConfigAccess.sdkConfig.serverConfig.sdkContentServerUrl !== undefined)) {
      // use the specified Url as is
    } else {
      // Default to window.location.origin
      ConfigAccess.sdkConfig.serverConfig.sdkContentServerUrl = window.location.origin;
    }

    console.log(`Using sdkContentServerUrl: ${ConfigAccess.sdkConfig.serverConfig.sdkContentServerUrl}`);
  }

  /**
   * If ConfigAccess.sdkConfig.serverConfig.appPortal is set, leave it and the specified portal will be used.
   * If not set, set SdkConfigAccess.serverConfig.appPortal to default portal of currently logged in user
   */
   async selectPortal() {

    if ((ConfigAccess.sdkConfig.serverConfig.appPortal !== "") &&
        (ConfigAccess.sdkConfig.serverConfig.appPortal !== undefined) ) {
          // use the specified portal
          console.log(`Using appPortal: ${ConfigAccess.sdkConfig.serverConfig.appPortal}`);
          return;
    }

    const userAccessGroup = PCore.getEnvironmentInfo().getAccessGroup();
    const dataPageName = "D_OperatorAccessGroups";
    const serverUrl = SdkConfigAccess.getSdkConfigServer().infinityRestServerUrl;


    await fetch ( serverUrl + "/api/v1/data/" + dataPageName,
      {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + window.sessionStorage.getItem("accessToken"),
        },
      })
      .then( response => response.json())
      .then( async (agData) => {

        let arAccessGroups = agData.pxResults;

        for (let ag of arAccessGroups) {
          if (ag.pyAccessGroup === userAccessGroup) {
            // Found operator's current access group. Use its portal
            SdkConfigAccess.setSdkConfigServer("appPortal", ag.pyPortal);
            console.log(`Using appPortal: ${ConfigAccess.sdkConfig.serverConfig.appPortal}`);
            break;
          }
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
function createSdkConfigAccess() {
  // Note that our initialize function returns a promise...
  let theConfigAccess = new ConfigAccess();
  return theConfigAccess.initialize();
}


// Create a singleton for this class (with async loading of config file) and export it
let SdkConfigAccess = null;

createSdkConfigAccess().then( theConfigJson => {
  // assign the JSON to our exported object...
  SdkConfigAccess = theConfigJson;
  // console.log(`SdkConfigAccess: ${JSON.stringify(SdkConfigAccess)}`);
  // Create and dispatch the SdkConfigAccessReady event
  var event = new CustomEvent("SdkConfigAccessReady", { });
  document.dispatchEvent(event);
  
}).catch(err => {
  console.error( `createSdkConfigAccess error: ${err}` );
});

export { SdkConfigAccess }

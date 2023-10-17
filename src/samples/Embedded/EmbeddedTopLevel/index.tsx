/* eslint-disable react/button-has-type */
// @ts-nocheck - TypeScript type checking to be added soon
import React,{ useState, useEffect } from 'react';
import { render } from "react-dom";
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import StoreContext from "@pega/react-sdk-components/lib/bridge/Context/StoreContext";
import createPConnectComponent from "@pega/react-sdk-components/lib/bridge/react_pconnect";

import { gbLoggedIn, loginIfNecessary, sdkSetAuthHeader } from '@pega/react-sdk-components/lib/components/helpers/authManager';

import EmbeddedSwatch from '../EmbeddedSwatch';
import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../../sdk-local-component-map';

declare const myLoadMashup: any;


const useStyles = makeStyles((theme) => ({
  embedTopRibbon: {
    display: 'none',
    alignItems: 'center',
    height: '64px',
    padding: '0px 20px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  embedTopIcon: {
    width: '40px',
    filter: 'invert(100%)',
  },
  embedMainScreen: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  embedBanner: {
    textAlign: 'center',
    width: '100%',
    padding: '20px'
  },
  embedShoppingOptions: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  pegaPartInfo: {
    display: 'none',
    flexDirection: 'row',
  },
  pegaPartPega: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
  },
  pegaPartText: {
    paddingLeft: '50px'
  },
  pegaPartAccompaniment: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  pegaPartAccompanimentText: {
    fontSize: '30px' ,
    lineHeight: '40px',
    padding: '20px 20px',
    color: 'darkslategray'
  },
  pegaPartAccompanimentImage: {
    width: '700px',
    margin: '20px',
    borderRadius: '10px'
  },
  resolutionPart: {
    display: 'flex',
    flexDirection: 'row'
  },
  resolutionPartAccompanimentLeft: {
    width: '50%',
    alignItems: 'center'
  },
  resolutionPartAccompanimentRight: {
    width: '50%',
    alignItems: 'center',
    textAlign: 'center'
  },
  resolutionPartAccompanimentText: {
    fontSize: '28px' ,
    lineHeight: '40px',
    padding: '20px 20px',
    color: 'darkslategray'
  },
  resolutionButton: {
    color: 'white',
    backgroundColor: theme.palette.warning.main,
    fontSize: '25px',
    fontWeight: 'bold',
    borderRadius: '25px',
    border: '0px',
    margin: '20px',
    padding: '10px 30px'
  }

}));

export default function EmbeddedTopLevel() {
  const theme = createTheme({
    // palette: {
    //   primary: {
    //     main: '#2196f3',
    //   },
    //   secondary: {
    //     main: '#ff9800',
    //   },
    // },
  });

  // Array of 3 shopping options to display
  const shoppingOptions = [
    {
      "play" : "Triple Play",
      "level" : "Basic",
      "channels": "100+",
      "channels_full" : "100+ (Basic +)",
      "banner" : "Value package",
      "price": "99.00",
      "internetSpeed" : "100 Mbps",
      "calling": "",
    },
    {
      "play" : "Triple Play",
      "level" : "Silver",
      "channels" : "125+",
      "channels_full" : "125+ (Deluxe)",
      "banner" : "Most popular",
      "price": "120.00",
      "internetSpeed" : "300 Mbps",
      "calling": ""
    },
    {
      "play" : "Triple Play",
      "level" : "Gold",
      "channels" : "175+",
      "channels_full" : "175+ (Premium)",
      "banner" : "All the channels you want",
      "price": "150.00",
      "internetSpeed" : "1 Gbps",
      "calling": " & International"
    }
  ];

  const classes = useStyles();

  // const [pConn, setPConn] = useState<any>(null);

  const [bShowTriplePlayOptions, setShowTriplePlayOptions] = useState(false);
  const [bShowPega, setShowPega] = useState(false);
  const [bShowResolutionScreen, setShowResolutionScreen] = useState(false);
  const [bShowAppName, setShowAppName] = useState(false);


  useEffect( () => {
    // Update visibility of UI when bShowTriplePlayOptions changes

    // eslint-disable-next-line no-console
    console.log(`EmbeddedTopLevel: bShowTriplePlayOptions set to ${bShowTriplePlayOptions}`);
    const theTopLevelEl = document.getElementById("embedded-top-level-banner-buttons");
    const theTopLevelRibbon = document.getElementById("embedded-top-level-ribbon");

    if (theTopLevelEl) {
      if (bShowTriplePlayOptions && gbLoggedIn) {
        // Only show when user is logged in and we're supposed to show it
        theTopLevelEl.style.display = "block";
        if (theTopLevelRibbon) { theTopLevelRibbon.style.display = "flex"; }
      } else {
        theTopLevelEl.style.display = "none";
        if (theTopLevelRibbon) { theTopLevelRibbon.style.display = "none"; }
      }
    }
  }, [bShowTriplePlayOptions]);

  useEffect( () => {
    // Update visibility of UI when bShowPega changes
    // eslint-disable-next-line no-console
    console.log(`EmbeddedTopLevel: bShowPega set to ${bShowPega}`);

    const thePegaPartEl = document.getElementById("pega-part-of-page");
    const theTopLevelRibbon = document.getElementById("embedded-top-level-ribbon");

    if (thePegaPartEl) {
      if (bShowPega) {
        thePegaPartEl.style.display = "flex";
        if (theTopLevelRibbon) { theTopLevelRibbon.style.display = "flex"; }
  } else {
        thePegaPartEl.style.display = "none";
      }
    }
  }, [bShowPega]);

  useEffect( () => {
    // Update visibility of UI when bShowResolutionScreen changes
    // eslint-disable-next-line no-console
    console.log(`EmbeddedTopLevel: bShowPega set to ${bShowPega}`);

    const theTopLevelEl = document.getElementById("embedded-top-level-resolution");
    const theTopLevelRibbon = document.getElementById("embedded-top-level-ribbon");

    if (bShowResolutionScreen && gbLoggedIn) {
        // Only show when user is logged in and we're supposed to show it
        if (theTopLevelEl) { theTopLevelEl.style.display = "block" };
        if (theTopLevelRibbon) { theTopLevelRibbon.style.display = "flex"; }
      } else {
        if (theTopLevelEl) { theTopLevelEl.style.display = "none" };
        if (theTopLevelRibbon) { theTopLevelRibbon.style.display = "none"; }
      }
  }, [bShowResolutionScreen]);


  useEffect( () => {
    // Update when bShowAppName changes
    // If not logged in, we used to prompt for login. Now moved up to TopLevelApp
    // If logged in, make the Triple Play Options visible

    if (!gbLoggedIn) {
      // login();     // Login now handled at TopLevelApp
    } else {
      setShowTriplePlayOptions(true);
    }
  }, [bShowAppName]);

  //  const outlet = document.getElementById("outlet");

  function assignmentFinished() {
    setShowTriplePlayOptions(false);
    setShowPega(false);
    setShowResolutionScreen(true);
  }


  function cancelAssignment() {
    setShowTriplePlayOptions(true);
    setShowPega(false);
    setShowResolutionScreen(false);
  }


  function establishPCoreSubscriptions() {

    PCore.getPubSubUtils().subscribe(
      "assignmentFinished",
      () => { assignmentFinished() },
      "assignmentFinished"
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => { cancelAssignment() },
      "cancelAssignment"
    );

  }


  // from react_root.js with some modifications
  function RootComponent(props) {
    const PegaConnectObj = createPConnectComponent();

    // remove from Provider to work around compiler error for now: context={StoreContext}
    // return (
    //   <Provider store={PCore.getStore()} context={StoreContext} >
    //     <PegaConnectObj {...props} />
    //   </Provider>
    // );

    // const thePConnObj = <div>the RootComponent</div>;
    const thePConnObj = <PegaConnectObj {...props} />;

    // NOTE: For Embedded mode, we add in displayOnlyFA and isMashup to our React context
    //  so the values are available to any component that may need it.
    // VRS: Attempted to remove displayOnlyFA but it presently handles various components which
    //  SDK does not yet support, so all those need to be fixed up before it can be removed. To
    //  be done in a future sprint.
    const theComp =
      <StoreContext.Provider value={{store: PCore.getStore(), displayOnlyFA: true}} >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {thePConnObj}
          </ThemeProvider>
      </StoreContext.Provider>;

    return theComp;

  }


  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
   function initialRender(inRenderObj) {

    // loadMashup does its own thing so we don't need to do much/anything here

    // // modified from react_root.js render
    const {
      props,
      domContainerID = null,
      componentName,
      portalTarget,
      styleSheetTarget
    } = inRenderObj;

    const thePConn = props.getPConnect();
    // setPConn(thePConn);
    // eslint-disable-next-line no-console
    console.log(`EmbeddedTopLevel: initialRender got a PConnect with ${thePConn.getComponentName()}`);

    let target:any = null;

    if (domContainerID !== null) {
      target = document.getElementById(domContainerID);
    } else if (portalTarget !== null) {
      target = portalTarget;
    }

    // Note: RootComponent is just a function (declared below)
    const Component: any = RootComponent;

    if (componentName) {
      Component.displayName = componentName;
    }

    const theComponent = (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component
          {...props}
          portalTarget={portalTarget}
          styleSheetTarget={styleSheetTarget}
        />
      </ThemeProvider>
    );

    // Initial render of component passed in (which should be a RootContainer)
    render(
      <React.Fragment>
        {theComponent}
      </React.Fragment>,
      target
    )

    // Initial render to show that we have a PConnect and can render in the target location
    // render( <div>EmbeddedTopLevel initialRender in {domContainerID} with PConn of {componentName}</div>, target);

  }


  /**
   * kick off the application's portal that we're trying to serve up
   */
   function startMashup() {

    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // eslint-disable-next-line no-console
      console.log(`PCore ready!`);
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      establishPCoreSubscriptions();
      setShowAppName(true);

      // Initialize the SdkComponentMap (local and pega-provided)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      getSdkComponentMap(localSdkComponentMap).then( (theComponentMap: any) => {
        // eslint-disable-next-line no-console
        console.log(`SdkComponentMap initialized`);

        // Don't call initialRender until SdkComponentMap is fully initialized
        initialRender(renderObj);
      });

    });

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup("pega-root", false);   // this is defined in bootstrap shell that's been loaded already
  }


  // One time (initialization) subscriptions and related unsubscribe
  useEffect(() => {

    getSdkConfig().then( (sdkConfig:any) => {
      const sdkConfigAuth = sdkConfig.authConfig;

      if( !sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === "Basic" ) {
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
        sdkSetAuthHeader( `Basic ${sB64}`);
      }

      if( !sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === "BasicTO" ) {
        const now = new Date();
        const expTime = new Date( now.getTime() + 5*60*1000);
        let sISOTime = `${expTime.toISOString().split(".")[0]}Z`;
        const regex = /[-:]/g;
        sISOTime = sISOTime.replace(regex,"");
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
        sdkSetAuthHeader( `Basic ${sB64}`);
      }

      document.addEventListener("SdkConstellationReady", () => {
        // start the portal
        startMashup();
      });

      // Login if needed, without doing an initial main window redirect
      loginIfNecessary({appName:"embedded", mainRedirect:false});

    });

    // Subscriptions can't be done until onPCoreReady.
    //  So we subscribe there. But unsubscribe when this
    //  component is unmounted (in function returned from this effect)

    return function cleanupSubscriptions() {

      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
        "cancelAssignment"
      );

      PCore?.getPubSubUtils().unsubscribe(
        "assignmentFinished",
        "assignmentFinished"
      );

    }
  }, []);


  function onShopNow(optionClicked: string) {

    const sLevel = optionClicked;

    setShowTriplePlayOptions( false );
    setShowPega(true);

    getSdkConfig().then( sdkConfig => {
      let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;
      if( !mashupCaseType ) {
        const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
        mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
      }

      const options = {
        pageName: 'pyEmbedAssignment',
        startingFields: {
          Package: sLevel
        }
      };
      // @ts-ignore
      PCore.getMashupApi().createCase(mashupCaseType, PCore.getConstants().APP.APP, options).then(() => {
        // eslint-disable-next-line no-console
        console.log('createCase rendering is complete');
      });
    });

  }


  function getShowTriplePlayOptionsMarkup() {
    // return "Show Triple Play Options here!";
    const theBanner =
    <div className={classes.embedMainScreen}>
      <div className={classes.embedBanner}>
          <Typography variant='h5'>Combine TV, Internet, and Voice for the best deal</Typography>
      </div>
    </div>;

    const theOptions = shoppingOptions.map( (option, index) => {
      return <EmbeddedSwatch key={shoppingOptions[index].level}  pcore={bShowAppName ? PCore : null} {... shoppingOptions[index]} onClick={onShopNow} />
    });

    return (
      <React.Fragment>
        {theBanner}
        <div className={classes.embedShoppingOptions}>
          {theOptions}
        </div>
      </React.Fragment>
    )
  }


  function getResolutionScreenMarkup() {

    return (
      <div className={classes.resolutionPart}>
          <div className={classes.resolutionPartAccompanimentLeft}>
            <div className={classes.resolutionPartAccompanimentText}>
              <b>Welcome!</b>
              <br /><br />
              Thanks for selecting a package with us. <br /><br />
              A technician will contact you with in the next couple of days to schedule an installation.<br /><br />
              If you have any questions, you can contact us directly at <b>1-800-555-1234</b> or you can chat with us.
            </div>
          </div>
          <div className={classes.resolutionPartAccompanimentRight}>
            <img src="assets/img/cablechat.png" className={classes.pegaPartAccompanimentImage} />
            <br />
            <button className={classes.resolutionButton}>Chat Now</button>
          </div>
      </div>
    )

  }


  return (
    <div>
      {/* <h4>React SDK: /embedded</h4> */}
      <div className={classes.embedTopRibbon} id="embedded-top-level-ribbon">
        { bShowAppName ? <Typography variant='h4'>{PCore.getEnvironmentInfo().getApplicationLabel()}</Typography> : null }
        &nbsp;&nbsp;&nbsp;&nbsp;
        <img src="./assets/img/antenna.svg" className={classes.embedTopIcon} />
      </div>
      <div id="embedded-top-level-banner-buttons">
        { bShowTriplePlayOptions ? getShowTriplePlayOptionsMarkup() : null }
      </div>
      <div id="embedded-top-level-resolution">
        { bShowResolutionScreen ? getResolutionScreenMarkup(): null }
      </div>
      {/* The next div is the container for the Pega work and a corresponding image */}
      <div>
      <div className={classes.pegaPartInfo} id="pega-part-of-page">
            <div className={classes.pegaPartPega}>
                <div id="pega-root"></div>
                <br />
                <div className={classes.pegaPartText}> * - required fields</div>
            </div>
            <div className={classes.pegaPartAccompaniment}>
                <div className={classes.pegaPartAccompanimentText}>
                    We need to gather a little information about you.
                </div>
                <div>
                    <img src="assets/img/cableinfo.png" className={classes.pegaPartAccompanimentImage} />
                </div>

            </div>
        </div>
      </div>
    </div>
  )

}

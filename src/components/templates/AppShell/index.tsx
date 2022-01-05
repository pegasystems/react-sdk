import React, { useEffect, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';

// import {
//   Avatar,
//   Toaster,
//   Banner,
//   AppShell as CosmosAppShell
// } from "@pega/cosmos-react-core";

// import createPConnectComponent from "../../../bridge/react_pconnect";
// import { buildRecentList, onRecentClickHandler } from "./Recents/utils";
import './AppShell.css';

// AppShell can emit NavBar and ViewContainer
import NavBar from '../../NavBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

declare const PCore;


const NavContext = createContext({open: false, setOpen: f => f});
export const useNavBar = () => useContext(NavContext);

/*
 * The wrapper handles knowing how to take in just children and mapping
 * to the Cosmos template. This could be a combination of things but it knows...
 */
export default function AppShell(props) {
  const {
    pages,
    caseTypes,
    showAppName,
    children,
    getPConnect,
  } = props;
  const [open, setOpen] = useState(true);

  const pConn = getPConnect();
  // const actionsAPI = pConn.getActionsApi();
  const envInfo = PCore.getEnvironmentInfo();

  // const bannerRef = useRef(null);
  // const hasBanner = httpMessages && httpMessages.length ? httpMessages.length > 0 : false;

  const appNameToDisplay = showAppName ? envInfo.getApplicationLabel() : "";

  const classes = useStyles();
  // let banners = null;
  // banners = hasBanner && (
  //   <Banner
  //     ref={bannerRef}
  //     id="appShellBanner"
  //     variant="urgent"
  //     heading="Error"
  //     onDismiss={() =>
  //       pConn.clearErrorMessages({
  //         category: "HTTP",
  //         context: null
  //       })
  //     }
  //     messages={httpMessages}
  //   />
  // );

  // useEffect(() => {
  //   if (hasBanner && bannerRef.current) {
  //     bannerRef.current.focus();
  //     window.scrollTo(0, bannerRef.current.offsetTop);
  //   }
  // }, [hasBanner]);

  /**
   *
   * Function to dispatch a show page action for the page links in
   * the left nav of the app shell
   *
   * @param {string} searchString Name of view to show
   */
  // function showSearchResults(searchString) {
  //   if (searchString === "") {
  //     actionsAPI.showPage("pySearchPage", "Data-Portal");
  //     return;
  //   }
  //   const searchTerm = searchString.replace(/['"]+/g, "");
  //   PCore.getDataApiUtils()
  //     .getData(
  //       "D_pySearch",
  //       `{"dataViewParameters": {"SearchString": "${encodeURIComponent(
  //         searchTerm
  //       )}"}}`
  //     )
  //     .then((response) => {
  //       if (
  //         response.data.data !== null &&
  //         response.data.resultCount === 1 &&
  //         response.data.data[0].pyID === searchTerm
  //       ) {
  //         /* This is a match for a work item - then we will open it */
  //         pConn
  //           .getActionsApi()
  //           .openWorkByHandle(
  //             response.data.data[0].pzInsKey,
  //             response.data.data[0].pzCategoryActionKeys
  //           );
  //         return;
  //       }
  //       // window.searchResults = {
  //       //   searchString: searchTerm,
  //       //   results: response.data
  //       // };
  //       actionsAPI.showPage("pySearchPage", "Data-Portal");
  //     });
  // }

  /**
   *
   * Function to dispatch a show page action for the page links in
   * the left nav of the app shell
   *
   * @param {string} viewName Name of view to show
   * @param {string} className Pega Applies to class of the page
   */
  // function showPage(viewName, className) {
  //   actionsAPI.showPage(viewName, className);
  // }

  /**
   *
   * Function to dispatch a create work action
   * @param {string} className - placeholder string of case type being created
   */
  // function createWork(className) {
  //   actionsAPI
  //     .createWork(className)
  //     .catch((error) =>
  //       // eslint-disable-next-line no-console
  //       console.log("Error in case creation: ", error?.message)
  //     );
  // }

  /**
   * Returns the Custome Component for each active case
   */
  // const VisualComponent = useCallback(
  //   (context) => {
  //     if (activeCases && activeCases.length > 0) {
  //       const meta = PCore.getViewResources().fetchViewResources(
  //         "pyCaseVisual",
  //         getPConnect(),
  //         PCore.getStoreValue(".caseTypeID", "caseInfo", context)
  //       );
  //       if (meta?.config && !meta.config.defaultVisual) {
  //         const config = {
  //           meta,
  //           options: {
  //             context,
  //             pageReference: "caseInfo.content"
  //           }
  //         };
  //         const visualConfig = PCore.createPConnect(config);
  //         return React.createElement(createPConnectComponent(), visualConfig);
  //       }
  //     }
  //     return undefined;
  //   },
  //   [getPConnect, activeCases]
  // );

  /**
   * Transforms the active cases information into the model that cosmos expect.
   */
  // function getActiveCases() {
  //   if (activeCases) {
  //     const activeCaseLinks = [];
  //     activeCases.forEach((activeCase) => {
  //       const { caseID, className, workID, active, context } = activeCase;
  //       // activeCaseLinks.push({
  //       //   onDismiss: () => {
  //       //     PCore.getContainerUtils().closeContainerItem(
  //       //       activeCase.containerItemID
  //       //     );
  //       //   },
  //       //   key: caseID,
  //       //   name: caseID,
  //       //   onClick: () => {
  //       //     actionsAPI.openWorkByHandle(workID, className);
  //       //   },
  //       //   active,
  //       //   visual: VisualComponent(context)
  //       // });
  //     });
  //     return activeCaseLinks;
  //   }
  //   return activeCases;
  // }

  /**
   * Translate Pega Data Page into the model that Cosmos expects
   *
   * Example:
   *   pxPageViewIcon: "pi pi-home-solid"
   *   pxURLPath: "Home"
   *   pyClassName: "Data-Portal"
   *   pyLabel: "Home"
   *   pyRuleName: "pyHome"
   */
  // const links = !pages
  //   ? []
  //   : pages.map((page) => {
  //       return {
  //         name: page.pyLabel,
  //         icon: page.pxPageViewIcon.replace("pi pi-", ""),
  //         onClick: () => showPage(page.pyRuleName, page.pyClassName)
  //       };
  //     });

  // const userName = envInfo.getOperatorName();
  // const imageKey = envInfo.getOperatorImageInsKey();

  // const logOffAction = () => {
  //   actionsAPI.logout().then(() => window?.top?.location?.reload());
  // };

  // const getOperator = () => {
  //   const operatorActions = [
  //     [{ text: "Logoff", id: "1", onClick: logOffAction }]
  //   ];
  //   if (imageKey) {
  //     return {
  //       avatar: (
  //         <div id="AvatarWithImageKey">Avatar with image key</div>
  //         // <Avatar
  //         //   name={userName}
  //         //   imageSrc={getPConnect().getImagePath(imageKey)}
  //         // />
  //       ),
  //       actions: operatorActions,
  //       name: userName
  //     };
  //   }
  //   return {
  //     avatar: (
  //       <div id="Avatar">Avatar</div>
  //       // <Avatar name={userName}>
  //       //   {userName
  //       //     .split(" ")
  //       //     .map((i) => i.charAt(0))
  //       //     .join("")
  //       //     .toUpperCase()}
  //       // </Avatar>
  //     ),
  //     actions: operatorActions,
  //     name: userName
  //   };
  // };

  /**
   * Translate Case Types page into what is expected by Cosmos
   *
   * Example:
   *   pyClassName: ""
   *   pyFlowType: ""
   *   pyLabel: "No case types defined"
   */
  // const cases = !caseTypes
  //   ? []
  //   : caseTypes.map((caseType) => {
  //       let action = {};
  //       // Only add actions to entries with a class name to create so in case of empty message no action is added
  //       if (caseType.pyClassName) {
  //         action = { onClick: () => createWork(caseType.pyClassName) };
  //       }
  //       return {
  //         name: caseType.pyLabel,
  //         ...action
  //       };
  //     });

  // const [recents, setRecents] = useState([]);

  // const [searchVal, setSearchVal] = useState("");

  // // default the icon to be empty. This will cause the image to be initially broken.
  // const [iconURL, setIconURL] = useState("");
  // useEffect(() => {
  //   // using the default icon then fetch it from the static folder (not auth involved)
  //   if (
  //     !portalLogo ||
  //     portalLogo.toLowerCase().includes("pzpega-logo-mark") ||
  //     portalLogo.toLowerCase().includes("py-logo")
  //   ) {
  //     setIconURL(
  //       `${PCore.getAssetLoader().getStaticServerUrl()}static/py-logo.svg`
  //     );
  //   }
  //   // not using default icon to fetch it using the way which uses authentication
  //   else {
  //     PCore.getAssetLoader()
  //       .getSvcImage(portalLogo)
  //       .then((data) => {
  //         setIconURL(window.URL.createObjectURL(data));
  //       })
  //       .catch(() => {
  //         console.error(
  //           `Unable to load the image for the portal logo/icon with the insName:${portalLogo}`
  //         );
  //       });
  //   }
  // }, [portalLogo]);

  /**
   * To fetch recents and translate items into what Cosmos expects
   */
  // const fetchRecents = () => {
  //   actionsAPI.getRecents(15).then((response) => {
  //     const recentsitems = response.data.recents;
  //     // setRecents(buildRecentList(recentsitems));
  //   });
  // };

  /**
   * To handle on click of any recent item after the drawer is open
   *
   * @param {*} id : Recent item unique id
   */

  // const onItemClick = (id, e) => {
  //   e.preventDefault();
  //   // onRecentClickHandler(id, actionsAPI);
  // };

  // useState for appName and mapChildren - note these are ONLY updated once (on component mount!)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [appName, setAppName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [mapChildren, setMapChildren] = useState([]);

  // Initial setting of appName and mapChildren
  useEffect( () => {
    setAppName(PCore.getEnvironmentInfo().getApplicationName());

    const tempMap = pConn.getChildren().map((child, index) => {
      const theChildComp = child.getPConnect().getComponentName();
      const theKey = `.${index}`;
      return <div id={theChildComp} key={theKey} style={{border: "solid 1px silver", margin: "1px"}}>{theChildComp} will be here</div>
    });

    setMapChildren(tempMap)

  }, []);

  if (pConn.hasChildren()) {
    // const theChildren = pConn.getChildren();
    // const mapChildCompNames = theChildren.map((child) => { return child.getPConnect().getComponentName()});

    // debugging/investigation help
    // console.log(`AppShell has children: ${theChildren.length}`);
    // console.log(`--> ${mapChildCompNames.map((name) => {return name;})}`);
  }

  return (

    <NavContext.Provider value={{open, setOpen}}>
      <div id="AppShell" className={classes.root}>
        <NavBar pConn={getPConnect()} appName={appNameToDisplay} pages={pages} caseTypes={caseTypes}></NavBar>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    </NavContext.Provider>

    // <Toaster dismissAfter={3000}>
    //   <CosmosAppShell
    //     {...{
    //       appInfo: {
    //         imageSrc: `${iconURL}`,
    //         appName: `${appNameToDisplay}`,
    //         portalName
    //       },
    //       recents: {
    //         items: recents,
    //         onDrawerOpen: fetchRecents,
    //         onItemClick
    //       },
    //       searchInput: {
    //         onSearchChange: (value) => {
    //           setSearchVal(value);
    //         },
    //         onSearchSubmit: (value) => {
    //           showSearchResults(value.trim());
    //           setSearchVal("");
    //         },
    //         value: searchVal
    //       },
    //       caseTypes: cases,
    //       links,
    //       cases: getActiveCases(),
    //       operator: getOperator()
    //     }}
    //     main={[children]}
    //     banners={banners}
    //     className="app-shell"
    //   />
    // </Toaster>
  );
}
AppShell.defaultProps = {
  pages: [],
  caseTypes: [],
  children: [],
  // httpMessages: [],
  // activeCases: null
};
AppShell.propTypes = {
  // portalName: PropTypes.string/* .isRequired */,
  // portalLogo: PropTypes.string/* .isRequired */,
  showAppName: PropTypes.bool/* .isRequired */,
  pages: PropTypes.arrayOf(PropTypes.object),
  caseTypes: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.arrayOf(PropTypes.node),
  getPConnect: PropTypes.func.isRequired,
  // httpMessages: PropTypes.arrayOf(PropTypes.string),
  // activeCases: PropTypes.arrayOf(PropTypes.object)
};

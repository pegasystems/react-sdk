import React, { useState, useEffect, createElement } from "react";
import PropTypes from "prop-types";
import { Box, Card, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';


import createPConnectComponent from "../../bridge/react_pconnect";

declare const PCore;

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//


const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function DeferLoad(props) {
  const classes = useStyles();

  const { getPConnect, loadData } = props;
  const thePConn = getPConnect();

  let loadedPConn: any;
  let isComponentMounted = true;

  const [bShowDefer, setShowDefer] = useState(false);
  const [componentName, setComponentName] = useState("");
  const [createdPConnect, setCreatedPConnect] = useState({});
  const [currentlyLoadedName, setCurrentlyLoadedName] = useState(loadData.config.name);

  if (loadData.config.name !== currentlyLoadedName && isComponentMounted) {
    setCurrentlyLoadedName(loadData.config.name);
  }


  function loadActiveTab(data: any = []) {
    const { isModalAction } = data;

    if (loadData && loadData["config"] && !isModalAction) {
      const name = loadData["config"].name;
      const actionsAPI = thePConn.getActionsApi();
      const baseContext = thePConn.getContextName();
      const basePageReference = thePConn.getPageReference();
      const loadView = actionsAPI.loadView.bind(actionsAPI);

      if (isComponentMounted) {
        setShowDefer(false);
      }

      // Latest version in React uses value for CASE_INFO.CASE_INFO_ID is it exists
      //  and prefers that over PZINSKEY
      loadView(encodeURI(
        thePConn.getValue( PCore.getConstants().CASE_INFO.CASE_INFO_ID ) ||
        thePConn.getValue( PCore.getConstants().PZINSKEY)
        ), name)
        .then((theData) => {

          // Don't bother with any of this if the component has been unmounted
          if (isComponentMounted) {

            const config = {
              meta: theData,
              options: {
                context: baseContext,
                pageReference: basePageReference
              }
            };

            const configObject = PCore.createPConnect(config);

            // Add key to PConnect props to keep React happy
            configObject["key"] = theData.config.name;

            setShowDefer(true);
            setCreatedPConnect(configObject);

            // eslint-disable-next-line sonarjs/no-all-duplicated-branches
            if (loadData["config"].label === "Details") {
              // for now, prevent details from being drawn
              // setComponentName("Details");

              loadedPConn = configObject.getPConnect();
              setComponentName(loadedPConn.getComponentName());

            }
            // eslint-disable-next-line sonarjs/no-duplicated-branches
            else {
              loadedPConn = configObject.getPConnect();
              setComponentName(loadedPConn.getComponentName());
            }
          }

        });
    }
  }


  // useEffect to only update the active tab when the requested tab name changes
  useEffect(() => {

      loadActiveTab();

    return () => {
      // Inspired by https://juliangaramendy.dev/blog/use-promise-subscription
      // The useEffect closure lets us have access to isComponentMounted
      //  So, if this cleanup code gets run before the tab is loaded, we
      //  can indicate that the component has been unmounted and avoid
      //  any calls to setState functions in the code. (That would show warnings)
      isComponentMounted = false;
    }
  }, [currentlyLoadedName]);


  function getDeferLoadRender(): any {
    const arComponent: Array<any> = [];

    switch (componentName) {
      case "View": {
        const theViewAsReact = createElement(createPConnectComponent(), createdPConnect);
        arComponent.push(theViewAsReact);
        break;
      }

      case "reference":
      case "Reference": {
        const theReferenceAsReact = createElement(createPConnectComponent(), createdPConnect);
        arComponent.push(theReferenceAsReact);
        break;
      }

      case "":
        // Until loadActiveTab has loaded the View, it's normal for componentName to be blank.
        //  This means there's nothing to show yet.
        // console.log(`DeferLoad: componentName is blank`);
        break;

      default:
        // Report that we encountered and unexpected DeferLoad component
        // eslint-disable-next-line no-console
        console.log(`DeferLoad: skipping unhandled componentName: ${componentName}`);
        break;
    }

    return <Card id="DeferLoad" className={classes.root}>
      { bShowDefer ?
          <React.Fragment>{arComponent}</React.Fragment>
          :
          <Box textAlign="center"><CircularProgress /></Box>
      }
    </Card>;

  }

  return getDeferLoadRender();


}

DeferLoad.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  loadData: PropTypes.object.isRequired
};

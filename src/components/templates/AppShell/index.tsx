import React, { useEffect, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';

import './AppShell.css';

// AppShell can emit NavBar
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
  const envInfo = PCore.getEnvironmentInfo();

  const appNameToDisplay = showAppName ? envInfo.getApplicationLabel() : "";

  const classes = useStyles();

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
  );
}

AppShell.defaultProps = {
  pages: [],
  caseTypes: [],
  children: [],
};
AppShell.propTypes = {
  showAppName: PropTypes.bool/* .isRequired */,
  pages: PropTypes.arrayOf(PropTypes.object),
  caseTypes: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.arrayOf(PropTypes.node),
  getPConnect: PropTypes.func.isRequired,
};

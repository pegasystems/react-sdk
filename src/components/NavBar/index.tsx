import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from "prop-types";
import { Utils } from '../../helpers/utils';
import './NavBar.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core';

import PersonOutlineIcon from '@material-ui/icons/PersonOutlineOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useNavBar } from "../templates/AppShell";

import { logout } from '../../helpers/authManager';

declare const PCore;

const iconMap = {
  "pi pi-headline" : <HomeOutlinedIcon fontSize="large"/>,
  "pi pi-flag-solid": <FlagOutlinedIcon fontSize="large"/>
}

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: "100vh"
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(9),
    },
    height: "100vh"
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  appListItem: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  appListLogo: {
    marginRight: theme.spacing(2),
    width: "3.6rem",
  },
  appListIcon: {
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  appListDiv: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

export default function NavBar(props) {
  const {
    pConn,
    pages,
    caseTypes
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [navIcon, setNavIcon] = useState((PCore.getAssetLoader().getStaticServerUrl()).concat("pzpega-logo-mark.svg"));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [navExpandCollapse, setNavExpandCollapse] = useState(Utils.getImageSrc("plus", PCore.getAssetLoader().getStaticServerUrl()));
  const [navPages, setNavPages] = useState(JSON.parse(JSON.stringify(pages)));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [portalLogoImage, setPortalLogoImage] = useState(Utils.getIconPath(PCore.getAssetLoader().getStaticServerUrl()).concat("pzpega-logo-mark.svg"));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [portalOperator, setPortalOperator] = useState(PCore.getEnvironmentInfo().getOperatorName());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [portalOperatorInitials, setPortalOperatorInitials] = useState(Utils.getInitials(portalOperator));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [portalApp, setPortalApp] = useState(PCore.getEnvironmentInfo().getApplicationLabel());
  const [bShowCaseTypes, setBShowCaseTypes] = useState(true);
  const [bShowOperatorButtons, setBShowOperatorButtons] = useState(false)
  const {open, setOpen} = useNavBar();
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect( () => {
    setNavPages(JSON.parse(JSON.stringify(pages)));
  },
  [pages]);

  // const caseTypesMap = caseTypes.map((caseType, index) => {
  //   const theKey = `caseType.${index}`;
  //   return <li key={theKey}>{caseType.pyLabel}</li>;
  // });

  // const pagesMap = pages.map((page, index) => {
  //   const theKey = `page.${index}`;
  //   return <li key={theKey}>{page.pyLabel}</li>;
  // });

  function navPanelButtonClick(oPageData: any) {
    const {
      pyClassName,
      pyRuleName
    } = oPageData;

    pConn.getActionsApi().showPage(pyRuleName, pyClassName).then(() => {
      // eslint-disable-next-line no-console
      console.log(`showPage completed`);
    });
  }

  // function navPanelCreateButtonClick() {
  //   if (navExpandCollapse.indexOf("plus") > 0) {
  //    setNavExpandCollapse(Utils.getImageSrc("times", PCore.getAssetLoader().getStaticServerUrl()));
  //    setBShowCaseTypes(true);
  //   }
  //   else {
  //     setNavExpandCollapse(Utils.getImageSrc("plus", PCore.getAssetLoader().getStaticServerUrl()));
  //     setBShowCaseTypes(false);
  //   }
  // }

  function navPanelCreateCaseType(sCaseType: string, sFlowType: string) {
    setOpen(false);
    const actionInfo = {
      containerName: "primary",
      flowType: sFlowType || "pyStartCase"
    };

    pConn.getActionsApi().createWork(sCaseType, actionInfo).then(() => {
      // eslint-disable-next-line no-console
      console.log(`createWork completed`);
    });

  }

  // Toggle showing the Operator buttons
  function navPanelOperatorButtonClick(evt) {
    setBShowOperatorButtons(!bShowOperatorButtons);
    if (!bShowOperatorButtons) setAnchorEl(evt.currentTarget);
    else setAnchorEl(null);
  }

  function navPanelLogoutClick() {

    try {
      // eslint-disable-next-line no-console
      console.log(`--> navPanelLogoutClick clicked`);
      // Commenting out until revokeToken API is available
      // pConn.getActionsApi().logout().then(() => {
      //   // eslint-disable-next-line no-console
      //   console.log(`logout completed`);
      // },
      // error => {
      //   // eslint-disable-next-line no-console
      //   console.error(`onRejected function called: ${error.message}`);
      // })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`--> Attempt to call logout api failed: ${err}`);
    }
    finally {
      // authLogout();
      logout();
    }
  }

  // const theCaseTypeButtons = caseTypes.map((caseType) => <div style={{display: "flex"}}>
  //   <button className="btn btn-link text-white"
  //     onClick={() => { navPanelCreateCaseType(caseType.pyClassName, caseType.pyFlowType)}}>{caseType.pyLabel}</button></div>
  // );

  // const theOperatorButtons = <button className="btn btn-link text-white" style={{marginLeft: "-0.05rem"}} onClick={navPanelLogoutClick}>Logoff</button>;


  // return <div id="NavBar" style={{border: "solid 1px silver", margin: "1px"}} >
  //     NavBar for <strong>{appName}</strong>
  //     <br></br>
  //     caseTypes:
  //     <ul>
  //       {caseTypesMap}
  //     </ul>
  //     Pages:
  //     <ul>
  //       {pagesMap}
  //     </ul>
  //   </div>;


  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleCaseItemClick = () => {
    if (!open) {
      setOpen(true);
      setBShowCaseTypes(true);
    } else setBShowCaseTypes(!bShowCaseTypes);
  }

//  const handlePopoverOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

  // const handlePopoverClose = () => {
  //   setAnchorEl(null);
  // };


  useEffect(() => {
    if (!isDesktop) setOpen(false);
    else setOpen(true);
  }, [isDesktop])


  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open && isDesktop}
    >
      {
        open ? (
          <List className={classes.appListItem}>
            <ListItem onClick={handleDrawerOpen}>
              <ListItemIcon>
                  <img src={portalLogoImage} className={classes.appListLogo}/>
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="h6">{portalApp}</Typography>}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={handleDrawerOpen}>
                  <ChevronLeftIcon className={classes.appListIcon} />
                </IconButton>
                      </ListItemSecondaryAction>
            </ListItem>
          </List>
          ) : (
            <div className={classes.appListDiv} onClick={handleDrawerOpen} >
              <ChevronRightIcon className={classes.appListIcon} id="chevron-right-icon" fontSize="large" />
            </div>
          )
      }
      <List>
        <ListItem button onClick={handleCaseItemClick}>
          <ListItemIcon>
            {
              bShowCaseTypes && open ? <ClearOutlinedIcon fontSize="large" /> : <AddIcon fontSize="large" />
            }
          </ListItemIcon>
          <ListItemText primary="Create" />
          {bShowCaseTypes ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </List>
      <Collapse in={bShowCaseTypes && open} timeout="auto" unmountOnExit className='scrollable'>
        <List component="div" disablePadding>
          {
            caseTypes.map(caseType => (
              <ListItem
                button
                className={classes.nested}
                onClick={() => navPanelCreateCaseType(caseType.pyClassName, caseType.pyFlowType)}
                key={caseType.pyLabel}
              >
                <ListItemIcon>
                  <WorkOutlineIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary={caseType.pyLabel} />
              </ListItem>
            ))
          }
        </List>
      </Collapse>
      <List>
        {
          navPages.map(page => (
              <ListItem
                button
                onClick={() => navPanelButtonClick(page)}
                key={page.pyLabel}
              >
                <ListItemIcon>
                  {iconMap[page.pxPageViewIcon]}
                </ListItemIcon>
                <ListItemText primary={page.pyLabel} />
            </ListItem>
          ))
        }
      </List>
      <Divider />
      <List className='marginTopAuto'>
        <>
          <ListItem onClick={navPanelOperatorButtonClick}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary={portalOperator} />
            {
              open && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={navPanelOperatorButtonClick}>
                    <ChevronRightIcon/>
                  </IconButton>
                </ListItemSecondaryAction>
              )
            }

          </ListItem>
          <Menu
            anchorEl={anchorEl}
            keepMounted={bShowOperatorButtons}
            open={bShowOperatorButtons}
            onClick={navPanelOperatorButtonClick}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={navPanelLogoutClick}>
              <ListItemIcon>
                <ArrowBackIcon fontSize="large" />
              </ListItemIcon>
              <Typography variant="inherit">Logout</Typography>
            </MenuItem>
          </Menu>
        </>
      </List>
    </Drawer>
  );
}

NavBar.defaultProps = {
  pConn: null,
  appName: "",
  pages: [],
  caseTypes: [],
};

NavBar.propTypes = {
  pConn: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  appName: PropTypes.string,
  pages: PropTypes.arrayOf(PropTypes.object),
  caseTypes: PropTypes.arrayOf(PropTypes.object)
};

import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
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

import { useNavBar } from '../templates/AppShell';
import { logout } from '../../helpers/authManager';

declare const PCore;

const iconMap = {
  'pi pi-headline': <HomeOutlinedIcon fontSize='large' />,
  'pi pi-flag-solid': <FlagOutlinedIcon fontSize='large' />
};

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    height: '100vh'
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(9)
    },
    height: '100vh'
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  appListItem: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light)
  },
  appListLogo: {
    marginRight: theme.spacing(2),
    width: '3.6rem'
  },
  appListIcon: {
    color: theme.palette.getContrastText(theme.palette.primary.light)
  },
  appListDiv: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  applicationLabel: {
    whiteSpace: 'initial'
  }
}));

export default function NavBar(props) {
  const { pConn, pages, caseTypes } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { open, setOpen } = useNavBar();
  const [navPages, setNavPages] = useState(JSON.parse(JSON.stringify(pages)));
  const [bShowCaseTypes, setBShowCaseTypes] = useState(true);
  const [bShowOperatorButtons, setBShowOperatorButtons] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const portalLogoImage = Utils.getIconPath(Utils.getSDKStaticConentUrl()).concat(
    'pzpega-logo-mark.svg'
  );
  const portalOperator = PCore.getEnvironmentInfo().getOperatorName();
  const portalApp = PCore.getEnvironmentInfo().getApplicationLabel();

  useEffect(() => {
    setNavPages(JSON.parse(JSON.stringify(pages)));
  }, [pages]);

  function navPanelButtonClick(oPageData: any) {
    const { pyClassName, pyRuleName } = oPageData;

    pConn
      .getActionsApi()
      .showPage(pyRuleName, pyClassName)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(`showPage completed`);
      });
  }

  function navPanelCreateCaseType(sCaseType: string, sFlowType: string) {
    setOpen(false);
    const actionInfo = {
      containerName: 'primary',
      flowType: sFlowType || 'pyStartCase'
    };

    pConn
      .getActionsApi()
      .createWork(sCaseType, actionInfo)
      .then(() => {
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

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleCaseItemClick = () => {
    if (!open) {
      setOpen(true);
      setBShowCaseTypes(true);
    } else setBShowCaseTypes(!bShowCaseTypes);
  };

  useEffect(() => {
    if (!isDesktop) setOpen(false);
    else setOpen(true);
  }, [isDesktop]);

  return (
    <Drawer
      variant='permanent'
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
      }}
      open={open && isDesktop}
    >
      {open ? (
        <List className={classes.appListItem}>
          <ListItem onClick={handleDrawerOpen}>
            <ListItemIcon>
              <img src={portalLogoImage} className={classes.appListLogo} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant='h6' className={classes.applicationLabel}>
                  {portalApp}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge='end' onClick={handleDrawerOpen}>
                <ChevronLeftIcon className={classes.appListIcon} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      ) : (
        <div className={classes.appListDiv} onClick={handleDrawerOpen}>
          <ChevronRightIcon
            className={classes.appListIcon}
            id='chevron-right-icon'
            fontSize='large'
          />
        </div>
      )}
      <List>
        <ListItem button onClick={handleCaseItemClick}>
          <ListItemIcon>
            {bShowCaseTypes && open ? (
              <ClearOutlinedIcon fontSize='large' />
            ) : (
              <AddIcon fontSize='large' />
            )}
          </ListItemIcon>
          <ListItemText primary='Create' />
          {bShowCaseTypes ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </List>
      <Collapse in={bShowCaseTypes && open} timeout='auto' unmountOnExit className='scrollable'>
        <List component='div' disablePadding>
          {caseTypes.map(caseType => (
            <ListItem
              button
              className={classes.nested}
              onClick={() => navPanelCreateCaseType(caseType.pyClassName, caseType.pyFlowType)}
              key={caseType.pyLabel}
            >
              <ListItemIcon>
                <WorkOutlineIcon fontSize='large' />
              </ListItemIcon>
              <ListItemText primary={caseType.pyLabel} />
            </ListItem>
          ))}
        </List>
      </Collapse>
      <List>
        {navPages.map(page => (
          <ListItem button onClick={() => navPanelButtonClick(page)} key={page.pyLabel}>
            <ListItemIcon>{iconMap[page.pxPageViewIcon]}</ListItemIcon>
            <ListItemText primary={page.pyLabel} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List className='marginTopAuto'>
        <>
          <ListItem onClick={navPanelOperatorButtonClick}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize='large' />
            </ListItemIcon>
            <ListItemText primary={portalOperator} />
            {open && (
              <ListItemSecondaryAction>
                <IconButton edge='end' onClick={navPanelOperatorButtonClick}>
                  <ChevronRightIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
          <Menu
            anchorEl={anchorEl}
            keepMounted={bShowOperatorButtons}
            open={bShowOperatorButtons}
            onClick={navPanelOperatorButtonClick}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <ArrowBackIcon fontSize='large' />
              </ListItemIcon>
              <Typography variant='inherit'>Logout</Typography>
            </MenuItem>
          </Menu>
        </>
      </List>
    </Drawer>
  );
}

NavBar.defaultProps = {
  pConn: null,
  appName: '',
  pages: [],
  caseTypes: []
};

NavBar.propTypes = {
  pConn: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  appName: PropTypes.string,
  pages: PropTypes.arrayOf(PropTypes.object),
  caseTypes: PropTypes.arrayOf(PropTypes.object)
};

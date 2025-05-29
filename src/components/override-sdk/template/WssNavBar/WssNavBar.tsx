import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { logout } from '@pega/auth/lib/sdk-auth-manager';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import './WssNavBar.css';
import { localeUtils } from '@pega/pcore-pconnect-typedefs/locale/locale-utils';
import clsx from 'clsx';

interface WssNavBarProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  appInfo: any;
  navLinks: any[];
  operator: { currentUserInitials: string };
  navDisplayOptions: { alignment: string; position: string };

  portalName: string;
  imageSrc: string;

  fullImageSrc: string;
  appName: any;

  onChange: any;
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    height: '100vh'
  },
  caseViewIconImage: {},
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
    // backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light)
  },
  appListLogo: {
    marginRight: theme.spacing(2),
    width: '100%'
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
  },
  navContainer: {
    width: '17%',
    borderRight: 0,
    borderRadius: '0px 16px 16px 0px'
  }
}));

export default function WssNavBar(props: WssNavBarProps) {
  const { appInfo, navLinks, operator, navDisplayOptions } = props;
  const { alignment, position } = navDisplayOptions;
  const classes = useStyles();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const [activeNavLink, setActiveNavLink] = useState(0);

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'AppShell';

  // if (!navLinks?.length) {
  //   navLinks.push({ text: 'U+ Connect' }, { text: 'Trade in' }, { text: 'Profile' });
  // }

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // const navLinksContent = (
  //   <Box id='nav-links' sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} style={{ justifyContent: alignment }}>
  //     {navLinks.map(link => (
  //       <Button className='link-style' key={link.text} onClick={link.onClick}>
  //         {link.text}
  //       </Button>
  //     ))}
  //   </Box>
  // );

  function navLinkClickHandler(page, i) {
    setActiveNavLink(i);
    page.onClick();
  }

  return (
    <Drawer
      // style={{ marginRight: '300px' }}
      // style={{ width: '17%' }}
      variant='permanent'
      classes={{
        paper: clsx(classes.navContainer)
      }}
      open
    >
      <List className={classes.appListItem}>
        <ListItem>
          <ListItemIcon onClick={appInfo.onClick} style={{ cursor: 'pointer' }}>
            <img src='assets/img/u+-logo.svg' className={classes.appListLogo} />
          </ListItemIcon>
          {/* <ListItemText
            primary={
              <Typography variant='h6' className={classes.applicationLabel}>
                My App
              </Typography>
            }
          /> */}
          {/* <ListItemSecondaryAction>
      <IconButton edge='end' onClick={handleDrawerOpen}>
        <ChevronLeftIcon className={classes.appListIcon} />
      </IconButton>
    </ListItemSecondaryAction> */}
        </ListItem>
      </List>
      <List />
      <List>
        {navLinks.map((page, i) => (
          <ListItem
            button
            onClick={() => {
              setActiveNavLink(i);
              props.onChange(page.text);
              page?.onClick();
            }}
            key={page.text}
            className={`${activeNavLink === i ? 'active' : ''}`}
          >
            <ListItemText className='nav-link'> {page.text}</ListItemText>
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
      <List className='marginTopAuto'>
        {/* <ListItem onClick={navPanelOperatorButtonClick} style={{ cursor: 'pointer' }}>
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
    </ListItem> */}
        {/* <Menu
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
        <Typography variant='inherit'>{localizedVal('Log off', localeCategory)}</Typography>
      </MenuItem>
    </Menu> */}
        <Box sx={{ flexGrow: 0 }} style={{ position: 'fixed', right: '30px', top: '15px' }}>
          {/* <IconButton onClick={handleOpenUserMenu}> */}
          <Avatar onClick={handleOpenUserMenu}>
            <img src='assets/img/Ava.jpg' className={classes.caseViewIconImage} />
          </Avatar>
          {/* </IconButton> */}
          <Menu
            id='menu-appbar'
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorElUser)}
            onClick={handleCloseUserMenu}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={logout}>
              <Typography>{localizedVal('Log off', localeCategory)}</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </List>
      {/* <Avatar style={{ position: 'fixed', right: '10px', top: '10px' }} onClick={logout}>
        <img src='assets/img/Photo.jpg' className={classes.caseViewIconImage} />
      </Avatar> */}
    </Drawer>
  );

  // return (
  //   <div id='NavBar' className='nav-bar'>
  //     <AppBar position='static' color='primary'>
  //       <Container maxWidth='xl'>
  //         <Toolbar disableGutters style={{ justifyContent: 'space-between' }}>
  //           <Button id='appName' style={{ textTransform: 'capitalize' }} onClick={appInfo.onClick}>
  //             <img src={appInfo.imageSrc} className={classes.appListLogo} />
  //             <span className={classes.appName}>{appInfo.appName}</span>
  //           </Button>
  //           <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
  //             <IconButton
  //               size='small'
  //               aria-label='account of current user'
  //               aria-controls='menu-appbar'
  //               aria-haspopup='true'
  //               onClick={handleOpenNavMenu}
  //               color='inherit'
  //             >
  //               <MenuIcon />
  //             </IconButton>
  //             <Menu
  //               id='menu-appbar'
  //               anchorEl={anchorElNav}
  //               anchorOrigin={{
  //                 vertical: 'bottom',
  //                 horizontal: 'left'
  //               }}
  //               keepMounted
  //               transformOrigin={{
  //                 vertical: 'top',
  //                 horizontal: 'left'
  //               }}
  //               open={Boolean(anchorElNav)}
  //               onClose={handleCloseNavMenu}
  //             >
  //               {navLinks.map(link => (
  //                 <MenuItem key={link.text} onClick={link.onClick}>
  //                   <Typography>{link.text}</Typography>
  //                 </MenuItem>
  //               ))}
  //             </Menu>
  //           </Box>

  //           {position === 'inline' && <>{navLinksContent}</>}

  //           <Box sx={{ flexGrow: 0 }}>
  //             <IconButton onClick={handleOpenUserMenu}>
  //               <Avatar>{operator.currentUserInitials}</Avatar>
  //             </IconButton>
  //             <Menu
  //               id='menu-appbar'
  //               anchorEl={anchorElUser}
  //               anchorOrigin={{
  //                 vertical: 'top',
  //                 horizontal: 'right'
  //               }}
  //               keepMounted
  //               transformOrigin={{
  //                 vertical: 'top',
  //                 horizontal: 'right'
  //               }}
  //               open={Boolean(anchorElUser)}
  //               onClose={handleCloseUserMenu}
  //             >
  //               <MenuItem onClick={logout}>
  //                 <Typography>{localizedVal('Log off', localeCategory)}</Typography>
  //               </MenuItem>
  //             </Menu>
  //           </Box>
  //         </Toolbar>
  //         {position === 'below' && <>{navLinksContent}</>}
  //       </Container>
  //     </AppBar>
  //   </div>
  // );
}

/* Navigation Drawer */

/* Auto layout */
// display: flex;
// flex-direction: column;
// align-items: flex-start;
// padding: 12px;

// position: absolute;
// width: 360px;
// height: 1148px;
// left: 0px;
// top: 0px;

// background: #FFFFFF;
// border-radius: 0px 16px 16px 0px;

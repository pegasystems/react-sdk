import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { IconButton, Menu, MenuItem, Typography, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '@pega/auth/lib/sdk-auth-manager';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import './WssNavBar.css';

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
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  appListLogo: {
    maxWidth: '100%',
    height: '3rem'
  },
  appName: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
    fontSize: '1.5rem'
  }
}));

export default function WssNavBar(props: WssNavBarProps) {
  const { appInfo, navLinks, operator, navDisplayOptions } = props;
  const { alignment, position } = navDisplayOptions;
  const classes = useStyles();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'AppShell';

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

  const navLinksContent = (
    <Box id='nav-links' sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} style={{ justifyContent: alignment }}>
      {navLinks.map(link => (
        <Button className='link-style' key={link.text} onClick={link.onClick}>
          {link.text}
        </Button>
      ))}
    </Box>
  );

  return (
    <div id='NavBar' className='nav-bar'>
      <AppBar position='static' color='primary'>
        <Container maxWidth={false}>
          <Toolbar disableGutters style={{ justifyContent: 'space-between' }}>
            <Button id='appName' style={{ textTransform: 'capitalize' }} onClick={appInfo.onClick}>
              <img src={appInfo.imageSrc} className={classes.appListLogo} style={{ filter: 'brightness(0) invert(1)' }} />
              <span className={classes.appName}>{appInfo.appName}</span>
            </Button>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='small'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {navLinks.map(link => (
                  <MenuItem key={link.text} onClick={link.onClick}>
                    <Typography>{link.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {position === 'inline' && <>{navLinksContent}</>}

            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} size='large'>
                <Avatar style={{ color: 'black' }}>{operator.currentUserInitials}</Avatar>
              </IconButton>
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
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={logout}>
                  <Typography>{localizedVal('Log off', localeCategory)}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
          {position === 'below' && <>{navLinksContent}</>}
        </Container>
      </AppBar>
    </div>
  );
}

import { type PropsWithChildren, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logout } from '@pega/auth/lib/sdk-auth-manager';

import { getInitials } from '../utils/helpers';
import Footer from './Footer';

const COLLAPSED_WIDTH = '5rem';
const EXPANDED_WIDTH = '15rem';

interface WssNavBarProps {
  getPConnect: () => typeof PConnect;
  appName: string;
  pages: any[];
  caseTypes: any[];
  homePage: any;
  portalLogoImage: string;
}

export default function WssNavBar(props: PropsWithChildren<WssNavBarProps>) {
  const { getPConnect, appName, pages, homePage, portalLogoImage, children } = props;
  const pConn = getPConnect();
  const [collapsed, setCollapsed] = useState(true);
  const [activePage, setActivePage] = useState('Self-service Main page');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const actionsAPI = pConn.getActionsApi();
  const showPage = useMemo(() => actionsAPI.showPage.bind(actionsAPI), [actionsAPI]);
  const portalOperator = PCore.getEnvironmentInfo().getOperatorName();
  const portalOperatorInitials = getInitials(portalOperator ?? '');
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;

  const navPanelButtonClick = useCallback(
    (pageData: any) => {
      const { pyClassName, pyRuleName, pyLabel } = pageData;
      setActivePage(pyLabel);
      showPage(pyRuleName, pyClassName);
    },
    [showPage]
  );

  const navPanelLogoutClick = useCallback(() => {
    logout().then(() => {
      window.location.reload();
    });
  }, []);

  const navItemSx = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    flexDirection: collapsed ? 'column' : 'row',
    cursor: 'pointer',
    p: '8px',
    borderRadius: '16px',
    transition: 'all 0.2s ease-in-out',
    ...(isActive && {
      backgroundColor: 'rgba(63, 81, 181, 0.1)',
      color: '#6750a4',
      '& .MuiSvgIcon-root': { color: '#6750a4' }
    }),
    '&:hover': {
      backgroundColor: 'rgba(63, 81, 181, 0.1)',
      borderRadius: '16px'
    }
  });

  const circleIconSx = {
    background: 'linear-gradient(135deg, rgb(255, 179, 217) 0%, rgb(255, 196, 232) 100%)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333',
    mr: 1
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Side Drawer */}
      <Drawer
        variant='permanent'
        sx={{
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          flexShrink: 0,
          transition: 'width 0.2s ease-in-out',
          '& .MuiDrawer-paper': {
            width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
            transition: 'width 0.2s ease-in-out',
            overflowX: 'hidden',
            backgroundColor: '#fef7ff',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            pt: '2rem',
            px: collapsed ? '3.5px' : '0.75rem'
          }
        }}
      >
        {/* Toggle Button */}
        <Box
          onClick={() => setCollapsed(prev => !prev)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 56,
            height: 56,
            borderRadius: '16px',
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            cursor: 'pointer',
            mx: collapsed ? '0.75rem' : 0,
            alignSelf: collapsed ? 'center' : 'flex-start'
          }}
        >
          <IconButton disableRipple>{collapsed ? <MenuIcon /> : <CloseIcon />}</IconButton>
        </Box>

        {/* Home Button */}
        <Box onClick={() => navPanelButtonClick(homePage)} sx={navItemSx(activePage === 'Self-service Main page')}>
          <IconButton disableRipple>
            <HomeIcon />
          </IconButton>
          <Typography
            sx={{
              fontSize: collapsed ? 12 : 14,
              mt: collapsed ? '4px' : 0,
              ml: collapsed ? 0 : 0,
              whiteSpace: collapsed ? 'normal' : 'nowrap',
              textAlign: 'center',
              maxWidth: '100%'
            }}
          >
            Home
          </Typography>
        </Box>

        {/* Dynamic Pages */}
        {pages?.map((page: any, idx: number) => (
          <Box key={idx} onClick={() => navPanelButtonClick(page)} sx={navItemSx(activePage === page.pyLabel)}>
            <IconButton disableRipple>
              <DashboardIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: collapsed ? 12 : 14,
                mt: collapsed ? '4px' : 0,
                whiteSpace: collapsed ? 'normal' : 'nowrap',
                textAlign: 'center',
                maxWidth: '100%'
              }}
            >
              {page.pyDefaultHeading}
            </Typography>
          </Box>
        ))}
      </Drawer>

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease-in-out'
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position='sticky'
          elevation={0}
          sx={{
            backgroundColor: '#fff',
            color: '#333',
            zIndex: 10,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo + App Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navPanelButtonClick(homePage)}>
              {portalLogoImage && <Box component='img' src={portalLogoImage} sx={{ height: 32, mr: 1.5 }} />}
              <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                {appName}
              </Typography>
            </Box>

            {/* Right side: profile + notifications */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={circleIconSx} onClick={e => setAnchorEl(e.currentTarget)} style={{ cursor: 'pointer' }}>
                <PersonIcon />
              </Box>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} sx={{ '& .MuiMenu-paper': { p: 0 } }}>
                <MenuItem onClick={navPanelLogoutClick}>{localizedVal('Log off', 'AppShell')}</MenuItem>
              </Menu>
              <Box sx={circleIconSx}>
                <NotificationsIcon />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* View Container Children */}
        <Box sx={{ flex: 1, backgroundColor: '#fff', width: '100%' }}>
          {children}
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

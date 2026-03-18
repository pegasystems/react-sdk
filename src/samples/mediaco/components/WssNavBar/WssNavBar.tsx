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
import './WssNavBar.scss';
import Footer from '../Footer/Footer';

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

  const getNavItemClass = (isActive: boolean) => {
    const stateClass = isActive ? 'mc-wss-nav-item-active' : 'mc-wss-nav-item-default';
    const sizeClass = collapsed ? 'mc-wss-nav-item-collapsed' : 'mc-wss-nav-item-expanded';
    return `mc-wss-nav-item ${stateClass} ${sizeClass}`;
  };

  const drawerPaperClass = collapsed ? 'mc-wss-drawer-paper mc-wss-drawer-paper-collapsed' : 'mc-wss-drawer-paper mc-wss-drawer-paper-expanded';

  return (
    <Box className='mc-wss-layout'>
      {/* Side Drawer */}
      <Drawer variant='permanent' className='mc-wss-drawer-root' PaperProps={{ className: drawerPaperClass }}>
        {/* Toggle Button */}
        <Box
          onClick={() => setCollapsed(prev => !prev)}
          className={`mc-wss-toggle ${collapsed ? 'mc-wss-toggle-collapsed' : 'mc-wss-toggle-expanded'}`}
        >
          <IconButton disableRipple className='mc-wss-toggle-icon'>
            {collapsed ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        </Box>

        {/* Home Button */}
        <Box onClick={() => navPanelButtonClick(homePage)} className={getNavItemClass(activePage === 'Self-service Main page')}>
          <IconButton disableRipple className='mc-wss-nav-icon-button'>
            <HomeIcon className='mc-wss-nav-icon' />
          </IconButton>
          <Typography className='mc-wss-nav-label'>Home</Typography>
        </Box>

        {/* Dynamic Pages */}
        {pages?.map((page: any, idx: number) => (
          <Box key={idx} onClick={() => navPanelButtonClick(page)} className={getNavItemClass(activePage === page.pyLabel)}>
            <IconButton disableRipple className='mc-wss-nav-icon-button'>
              <DashboardIcon className='mc-wss-nav-icon' />
            </IconButton>
            <Typography className='mc-wss-nav-label'>{page.pyDefaultHeading}</Typography>
          </Box>
        ))}
      </Drawer>

      {/* Main content area */}
      <Box className='mc-wss-main'>
        {/* Top AppBar */}
        <AppBar position='sticky' elevation={0} className='mc-wss-appbar'>
          <Toolbar className='mc-wss-toolbar'>
            {/* Logo + App Name */}
            <Box className='mc-wss-brand' onClick={() => navPanelButtonClick(homePage)}>
              {portalLogoImage && <Box component='img' src={portalLogoImage} className='mc-wss-brand-logo' />}
              <Typography variant='subtitle1' className='mc-wss-brand-name'>
                {appName}
              </Typography>
            </Box>

            {/* Right side: profile + notifications */}
            <Box className='mc-wss-actions'>
              <Box className='mc-wss-circle-icon mc-wss-circle-icon-clickable' onClick={e => setAnchorEl(e.currentTarget)}>
                <PersonIcon />
              </Box>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ className: 'mc-wss-menu-paper' }}>
                <MenuItem onClick={navPanelLogoutClick}>{localizedVal('Log off', 'AppShell')}</MenuItem>
              </Menu>
              <Box className='mc-wss-circle-icon'>
                <NotificationsIcon />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* View Container Children */}
        <Box className='mc-wss-content'>{children}</Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

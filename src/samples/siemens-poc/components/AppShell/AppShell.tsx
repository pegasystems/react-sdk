import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { logout } from '@pega/auth/lib/sdk-auth-manager';
import SdkAppShell from '@pega/react-sdk-components/lib/components/template/AppShell';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import { CockpitProvider, localize } from '../../context/CockpitContext';
import { getPiIcon } from '../../utils/icons';
import { createCockpitTheme, type CockpitMode } from '../../styles/cockpitTheme';
import { setCockpitState } from '../../context/cockpitStore';
import '../../styles/cockpit.scss';

interface NavPage {
  pxPageViewIcon?: string;
  pyClassName: string;
  pyLabel: string;
  pyRuleName: string;
  pyURLContent?: string;
  pyLocalizationReference?: string;
}

interface AppShellProps {
  getPConnect: () => typeof PConnect;
  pages?: NavPage[];
  caseTypes?: object[];
  showAppName?: boolean;
  portalTemplate?: string;
  portalName?: string;
  portalLogo?: string;
  httpMessages?: string[];
  pageMessages?: string[];
  navDisplayOptions?: object;
}

const NOTIFICATIONS_COUNT_DP = 'D_pyGetCurrentUserNotificationsCount';
const THEME_STORAGE_KEY = 'ck-theme-mode';

function getInitialMode(appMode: string): CockpitMode {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  // Default to the app theme configured in sdk-config.json ("theme": "dark" | "light").
  return appMode === 'light' ? 'light' : 'dark';
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');
}

function isDefaultLogo(logo?: string) {
  const value = logo?.toLowerCase() ?? '';
  return !value || value.includes('pzpega-logo-mark') || value.includes('py-logo') || value.includes('py-full-logo');
}

export default function CockpitAppShell(props: PropsWithChildren<AppShellProps>) {
  const { portalTemplate } = props;

  // Only the new (WSS) portal gets the Cockpit chrome; everything else keeps the SDK AppShell.
  if (portalTemplate !== 'wss') {
    return <SdkAppShell {...(props as any)} />;
  }

  return <CockpitShell {...props} />;
}

function CockpitShell(props: PropsWithChildren<AppShellProps>) {
  const { getPConnect, pages = [], portalLogo, children, httpMessages = [], pageMessages = [] } = props;
  const AlertBanner = getComponentFromMap('AlertBanner');
  const outerTheme = useTheme();
  const [mode, setMode] = useState<CockpitMode>(() => getInitialMode(outerTheme.palette.mode));
  const cockpitTheme = useMemo(() => createCockpitTheme(outerTheme, mode), [outerTheme, mode]);
  const nextMode: CockpitMode = mode === 'dark' ? 'light' : 'dark';

  const toggleMode = () => {
    localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    setMode(nextMode);
  };

  useEffect(() => {
    // Lets the modal container (rendered outside this tree) use the same Cockpit theme.
    setCockpitState({ active: true, mode });
    return () => setCockpitState({ active: false, mode });
  }, [mode]);

  const pConn = getPConnect();
  const envInfo = PCore.getEnvironmentInfo();
  const operatorName = envInfo.getOperatorName() || '';
  const appLabel = envInfo.getApplicationLabel() || envInfo.getApplicationName() || '';
  const portalClass = pConn.getValue('.classID', '');
  const portalLocaleRef = `${portalClass}!PORTAL!${envInfo.getPortalName()}`.toUpperCase();
  const localeReference = pConn.getValue('.pyLocaleReference', '') || portalLocaleRef;
  const appName = localize(appLabel, portalLocaleRef);
  const portalSubtitle = localize(pConn.getValue('.pyLabel', ''), localeReference);

  const [activePage, setActivePage] = useState(pages[0]?.pyRuleName);
  const [logoUrl, setLogoUrl] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

  const messages = [...httpMessages, ...pageMessages];

  useEffect(() => {
    // Mirrors the SDK AppShell: CoreJS doesn't yet set the portal template for WSS portals.
    envInfo.setEnvironmentInfo({ ...(envInfo as any).environmentInfoObject, pyPortalTemplate: 'wss' } as any);
  }, []);

  useEffect(() => {
    if (isDefaultLogo(portalLogo)) return;
    PCore.getAssetLoader()
      .getSvcImageUrl(portalLogo as string)
      .then(url => setLogoUrl(typeof url === 'string' ? url : URL.createObjectURL(url)))
      .catch(() => setLogoUrl(''));
  }, [portalLogo]);

  useEffect(() => {
    PCore.getDataPageUtils()
      .getDataAsync(NOTIFICATIONS_COUNT_DP, pConn.getContextName())
      .then((response: any) => {
        const count = response?.data?.[0]?.pySummaryCount?.[0];
        setNotificationCount(Number(count) || 0);
      })
      .catch(() => setNotificationCount(0));
  }, []);

  function showPage(page: NavPage) {
    if (page.pyURLContent) {
      window.open(page.pyURLContent, '_blank', 'noopener');
      return;
    }
    setActivePage(page.pyRuleName);
    pConn.getActionsApi().showPage(page.pyRuleName, page.pyClassName);
  }

  function onLogout() {
    setUserMenuAnchor(null);
    logout().then(() => window.location.reload());
  }

  return (
    <ThemeProvider theme={cockpitTheme}>
      <CockpitProvider>
        <div className={`ck-root ${mode === 'light' ? 'ck-light' : ''}`}>
          <header className='ck-header'>
            <button type='button' className='ck-brand' aria-label={`${appName} home`} onClick={() => pages[0] && showPage(pages[0])}>
              <span className='ck-brand-mark'>{logoUrl ? <img src={logoUrl} alt='' /> : appName.charAt(0).toUpperCase()}</span>
              <span>
                <span className='ck-brand-name'>{appName}</span>
                {portalSubtitle && <span className='ck-brand-sub'>{portalSubtitle}</span>}
              </span>
            </button>

            <nav className='ck-nav' aria-label={localize('Primary navigation')}>
              {pages.map(page => (
                <button
                  key={page.pyRuleName || page.pyLabel}
                  type='button'
                  className={`ck-nav-item ${page.pyRuleName === activePage ? 'ck-nav-item-active' : ''}`}
                  aria-current={page.pyRuleName === activePage ? 'page' : undefined}
                  onClick={() => showPage(page)}
                >
                  {getPiIcon(page.pxPageViewIcon)}
                  {localize((page as any).pyDefaultHeading || page.pyLabel, page.pyLocalizationReference || localeReference)}
                </button>
              ))}
            </nav>

            <div className='ck-actions'>
              <Tooltip title={localize(nextMode === 'light' ? 'Switch to light theme' : 'Switch to dark theme')}>
                <IconButton aria-label={localize(nextMode === 'light' ? 'Switch to light theme' : 'Switch to dark theme')} onClick={toggleMode}>
                  {nextMode === 'light' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title={localize('Notifications')}>
                <IconButton aria-label={`${localize('Notifications')}, ${notificationCount} ${localize('unread')}`}>
                  <Badge badgeContent={notificationCount} color='secondary'>
                    <NotificationsNoneOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <button
                type='button'
                className='ck-user'
                aria-haspopup='menu'
                aria-label={operatorName}
                onClick={event => setUserMenuAnchor(event.currentTarget)}
              >
                <span className='ck-avatar'>{getInitials(operatorName)}</span>
                <span className='ck-user-name'>{operatorName}</span>
              </button>
              <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={() => setUserMenuAnchor(null)}>
                <MenuItem onClick={onLogout}>{localize('Log off')}</MenuItem>
              </Menu>
            </div>
          </header>

          <main className='ck-main'>
            {messages.length > 0 && <AlertBanner id='AppShell' variant='urgent' messages={messages} />}
            {children}
          </main>
        </div>
      </CockpitProvider>
    </ThemeProvider>
  );
}

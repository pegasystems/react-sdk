import { type PropsWithChildren, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { getSDKStaticContentUrl } from '../utils/helpers';
import { PortalProvider } from '../context/PortalContext';
import WssNavBar from './WssNavBar';

interface IPage {
  classID: string;
  pxPageViewIcon: string;
  pyClassName: string;
  pyLabel: string;
  pyRuleName: string;
  pyURLContent: string;
}

interface AppShellProps {
  getPConnect: () => typeof PConnect;
  showAppName?: boolean;
  pages?: IPage[];
  caseTypes?: object[];
  portalTemplate?: string;
  portalName?: string;
  portalLogo?: string;
}

export default function AppShell(props: PropsWithChildren<AppShellProps>) {
  const {
    pages = [],
    caseTypes = [],
    showAppName,
    children,
    getPConnect,
    portalTemplate = '',
    portalLogo
  } = props;

  const pConn = getPConnect();
  const [imageURL, setImageURL] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const envInfo = PCore.getEnvironmentInfo();
  const appNameToDisplay = showAppName ? envInfo.getApplicationLabel() : '';
  const portalClass = pConn.getValue('.classID', '');
  const envPortalName = envInfo.getPortalName();
  const appName = localizedVal(appNameToDisplay || '', '', `${portalClass}!PORTAL!${envPortalName}`.toUpperCase());

  const bShowAppShell = pages.length > 0;
  const links = pages.filter((_page, index) => index !== 0);
  const homePage = pages[0];

  // Set pyPortalTemplate for WSS mode
  useEffect(() => {
    if (portalTemplate === 'wss') {
      PCore.getEnvironmentInfo().setEnvironmentInfo({
        ...(PCore.getEnvironmentInfo() as any).environmentInfoObject,
        pyPortalTemplate: 'wss'
      } as any);
    }
  }, [portalTemplate]);

  // Fetch case types available to create
  useEffect(() => {
    const ei: any = PCore.getEnvironmentInfo();
    const caseTypesAvailableToCreateDP = ei.environmentInfoObject?.pxApplication?.pyCaseTypesAvailableToCreateDP;
    if (caseTypesAvailableToCreateDP) {
      const portalID = pConn.getValue('.pyOwner');
      PCore.getDataPageUtils()
        .getPageDataAsync(caseTypesAvailableToCreateDP, pConn.getContextName(), {
          PortalName: portalID
        })
        .then((response: any) => {
          if (response?.pyCaseTypesAvailableToCreate) {
            pConn.replaceState('.pyCaseTypesAvailableToCreate', response.pyCaseTypesAvailableToCreate, {
              skipDirtyValidation: true
            });
          }
        });
    }
  }, []);

  // Resolve portal logo
  useEffect(() => {
    if (
      !portalLogo ||
      portalLogo.toLowerCase().includes('pzpega-logo-mark') ||
      portalLogo.toLowerCase().includes('py-logo') ||
      portalLogo.toLowerCase().includes('py-full-logo')
    ) {
      setImageURL(`${getSDKStaticContentUrl()}icons/pzpega-logo-mark.svg`);
    } else {
      PCore.getAssetLoader()
        .getSvcImageUrl(portalLogo)
        .then((data: any) => setImageURL(data))
        .catch(() => {
          console.error(`${localizedVal('Unable to load the image for the portal logo/icon with the insName', 'AppShell')}:${portalLogo}`);
        });
    }
  }, [portalLogo]);

  return (
    <PortalProvider>
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#fff' }}>
      {bShowAppShell && portalTemplate === 'wss' && (
        <WssNavBar
          getPConnect={getPConnect}
          appName={appName}
          pages={links}
          caseTypes={caseTypes}
          homePage={homePage}
          portalLogoImage={imageURL}
        >
          {children}
        </WssNavBar>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={errorMessage}
        action={
          <Button color='inherit' size='small' onClick={() => setSnackOpen(false)}>
            Ok
          </Button>
        }
      />
    </div>
    </PortalProvider>
  );
}

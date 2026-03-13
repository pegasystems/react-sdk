import { type PropsWithChildren, useEffect, useState } from 'react';
import AppShell from '@pega/react-sdk-components/lib/components/template/AppShell';
import { getSDKStaticContentUrl } from '../../utils/helpers';
import { TodoPortalProvider } from '../../utils/TodoPortalContext';
import WssNavBar from '../wss-nav-bar';

interface IPage {
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
  navDisplayOptions?: {
    alignment: string;
    position: string;
  };
  httpMessages?: string[];
  pageMessages?: string[];
}

export default function MediaCoAppShell(props: PropsWithChildren<AppShellProps>) {
  const { pages = [], caseTypes = [], showAppName, children, getPConnect, portalTemplate = '', portalLogo } = props;

  const pConn = getPConnect();
  const [imageURL, setImageURL] = useState('');

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const envInfo = PCore.getEnvironmentInfo();
  const appNameToDisplay = showAppName ? envInfo.getApplicationLabel() : '';
  const portalClass = pConn.getValue('.classID', '');
  const envPortalName = envInfo.getPortalName();
  const appName = localizedVal(appNameToDisplay || '', '', `${portalClass}!PORTAL!${envPortalName}`.toUpperCase());

  // If not WSS portal, delegate to the SDK AppShell
  if (portalTemplate !== 'wss') {
    return <AppShell {...(props as any)} />;
  }

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
    <div className='mc-app-shell'>
      {bShowAppShell && portalTemplate === 'wss' && (
        <TodoPortalProvider>
          <WssNavBar getPConnect={getPConnect} appName={appName} pages={links} caseTypes={caseTypes} homePage={homePage} portalLogoImage={imageURL}>
            {children}
          </WssNavBar>
        </TodoPortalProvider>
      )}
    </div>
  );
}

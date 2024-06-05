import { PropsWithChildren, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';
import { NavContext } from '@pega/react-sdk-components/lib/components/helpers/reactContextHelpers';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './AppShell.css';
import { Grid } from '@material-ui/core';

interface AppShellProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  showAppName: boolean;
  pages: {
    pxPageViewIcon: string;
    pyClassName: string;
    pyLabel: string;
    pyRuleName: string;
    pyURLContent: string;
  }[];
  caseTypes?: object[];
  portalTemplate: string;
  portalName: string;
  portalLogo: string;
  navDisplayOptions: { alignment: string; position: string };
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  wsscontent: {
    flexGrow: 1,
    height: '110vh',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function AppShell(props: PropsWithChildren<AppShellProps>) {
  // Get emitted components from map (so we can get any override that may exist)
  const NavBar = getComponentFromMap('NavBar');
  const WssNavBar = getComponentFromMap('WssNavBar');

  const { pages = [], caseTypes = [], showAppName, children = [], getPConnect, portalTemplate, portalName, portalLogo, navDisplayOptions } = props;

  const [open, setOpen] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState(!pages ? null : pages[0]?.pyRuleName);
  const pConn = getPConnect();
  const envInfo = PCore.getEnvironmentInfo();
  const imageKey = envInfo.getOperatorImageInsKey();
  const userName = envInfo.getOperatorName();
  const currentUserInitials = Utils.getInitials(userName);
  const appNameToDisplay = showAppName ? envInfo.getApplicationLabel() : '';
  const portalClass = pConn.getValue('.classID', ''); // 2nd arg empty string until typedef marked correctly
  const envPortalName = envInfo.getPortalName();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;

  const classes = useStyles();
  const actionsAPI = pConn.getActionsApi();
  const localeReference = pConn.getValue('.pyLocaleReference', ''); // 2nd arg empty string until typedef marked correctly
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  // useState for appName and mapChildren - note these are ONLY updated once (on component mount!)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [appName, setAppName] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapChildren, setMapChildren] = useState([]);

  // Initial setting of appName and mapChildren
  useEffect(() => {
    setAppName(PCore.getEnvironmentInfo().getApplicationName());

    const tempMap: any = (pConn.getChildren() as any)?.map((child: any, index) => {
      const theChildComp = child.getPConnect().getComponentName();
      const theKey = `.${index}`;
      return (
        <div id={theChildComp} key={theKey} style={{ border: 'solid 1px silver', margin: '1px' }}>
          {theChildComp} will be here
        </div>
      );
    });

    setMapChildren(tempMap);
  }, []);

  const [iconURL, setIconURL] = useState('');
  const [fullIconURL, setFullIconURL] = useState('');
  useEffect(() => {
    // using the default icon then fetch it from the static folder (not auth involved)
    if (
      !portalLogo ||
      portalLogo.toLowerCase().includes('pzpega-logo-mark') ||
      portalLogo.toLowerCase().includes('py-logo') ||
      portalLogo.toLowerCase().includes('py-full-logo')
    ) {
      const portalLogoImage = Utils.getIconPath(Utils.getSDKStaticConentUrl()).concat('pzpega-logo-mark.svg');
      setIconURL(portalLogoImage);
      setFullIconURL(`${Utils.getSDKStaticConentUrl()}static/py-full-logo.svg`);
    }
    // not using default icon to fetch it using the way which uses authentication
    else {
      PCore.getAssetLoader()
        .getSvcImage(portalLogo)
        .then(blob => window.URL.createObjectURL(blob))
        .then(data => {
          setIconURL(data);
          setFullIconURL(data);
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.error(`${localizedVal('Unable to load the image for the portal logo/icon with the insName', 'AppShell')}:${portalLogo}`);
        });
    }
  }, [portalLogo]);

  useEffect(() => {
    if (imageKey && portalTemplate === 'wss') {
      PCore.getAssetLoader()
        .getSvcImage(imageKey)
        .then(blob => window.URL.createObjectURL(blob))
        .then(imagePath => setImageBlobUrl(imagePath));
    }
  }, []);

  const getOperator = () => {
    return {
      avatar: portalTemplate !== 'wss' ? <Avatar /> : { name: userName, imageSrc: imageBlobUrl },
      name: userName,
      currentUserInitials
    };
  };

  function showPage(viewName, className) {
    actionsAPI.showPage(viewName, className);
  }

  function openURL(URL) {
    window.open(URL, '_blank');
  }

  const links = !pages
    ? []
    : pages.map(page => {
        const name = localizedVal(page.pyLabel, '', localeReference);
        return {
          text: name,
          name,
          icon: page.pxPageViewIcon.replace('pi pi-', ''),
          active: page.pyRuleName === activeTab,
          onClick: () => (!page.pyURLContent || page.pyURLContent === '' ? showPage(page.pyRuleName, page.pyClassName) : openURL(page.pyURLContent))
        };
      });

  const [backImage, setBackImage] = useState('back.svg');

  const handleBackgroundChange = landingPage => {
    if (landingPage === 'Trade in') {
      setBackImage('tradeInBack.svg');
    } else if (landingPage === 'Profile') {
      setBackImage('profileBack.svg');
    } else {
      setBackImage('back.svg');
    }
  };

  if (portalTemplate === 'wss') {
    return (
      <div id='AppShell'>
        <Grid container xs={12}>
          <Grid item xs={2}>
            <WssNavBar
              portalName={portalName}
              imageSrc={iconURL}
              fullImageSrc={fullIconURL}
              appName={localizedVal(appNameToDisplay, '', `${portalClass}!PORTAL!${envPortalName}`.toUpperCase())}
              appInfo={{
                imageSrc: iconURL,
                appName: localizedVal(appNameToDisplay, '', `${portalClass}!PORTAL!${envPortalName}`.toUpperCase()),
                onClick: links[0] && /* links[0].onClick ? */ links[0].onClick /* : undefined */
              }}
              navLinks={links.filter((link, index) => {
                return index !== 0;
              })}
              operator={getOperator()}
              navDisplayOptions={navDisplayOptions}
              onChange={handleBackgroundChange}
            />
          </Grid>
          <Grid item xs={10}>
            <div style={{ background: `url(assets/img/${backImage}) 100% 100%` }} className={classes.wsscontent}>
              {children}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <NavContext.Provider value={{ open, setOpen }}>
      <div id='AppShell' className={classes.root}>
        <NavBar
          getPConnect={getPConnect}
          pConn={getPConnect()}
          appName={localizedVal(appNameToDisplay, '', `${portalClass}!PORTAL!${envPortalName}`.toUpperCase())}
          pages={pages}
          caseTypes={caseTypes}
        />
        <div className={classes.content}>{children}</div>
      </div>
    </NavContext.Provider>
  );
}

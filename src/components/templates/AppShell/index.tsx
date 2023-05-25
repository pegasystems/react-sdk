import React, { useEffect, useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import WssNavBar from '../WssNavBar';
import { Utils } from '../../../helpers/utils';
import Avatar from '@material-ui/core/Avatar';
import './AppShell.css';

// AppShell can emit NavBar
import NavBar from '../../NavBar';

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
    height: '100vh',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

declare const PCore;


const NavContext = createContext({ open: false, setOpen: f => f });
export const useNavBar = () => useContext(NavContext);

export default function AppShell(props) {
  const {
    pages,
    caseTypes,
    showAppName,
    children,
    getPConnect,
    portalTemplate,
    portalName,
    portalLogo,
    navDisplayOptions
  } = props;
  const [open, setOpen] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [activeTab, setActiveTab] = useState(!pages ? null : pages[0]?.pyRuleName);
  const pConn = getPConnect();
  const envInfo = PCore.getEnvironmentInfo();
  const imageKey = envInfo.getOperatorImageInsKey();
  const userName = envInfo.getOperatorName();
  const currentUserInitials = Utils.getInitials(userName);
  const appNameToDisplay = showAppName ? envInfo.getApplicationLabel() : '';
  const portalClass = pConn.getValue('.classID');
  const envPortalName = envInfo.getPortalName();
  const localeUtils = PCore.getLocaleUtils();
  const classes = useStyles();
  const actionsAPI = pConn.getActionsApi();
  const localeReference = pConn.getValue('.pyLocaleReference');
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  // useState for appName and mapChildren - note these are ONLY updated once (on component mount!)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [appName, setAppName] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [mapChildren, setMapChildren] = useState([]);

  // Initial setting of appName and mapChildren
  useEffect(() => {
    setAppName(PCore.getEnvironmentInfo().getApplicationName());

    const tempMap = pConn.getChildren().map((child, index) => {
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
      const portalLogoImage = Utils.getIconPath(Utils.getSDKStaticConentUrl()).concat(
        'pzpega-logo-mark.svg'
      );
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
          console.error(
            `Unable to load the image for the portal logo/icon with the insName:${portalLogo}`
          );
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
        const name = localeUtils.getLocaleValue(page.pyLabel, '', localeReference);
        return {
          text: name,
          name,
          icon: page.pxPageViewIcon.replace('pi pi-', ''),
          active: page.pyRuleName === activeTab,
          onClick: () =>
            !page.pyURLContent || page.pyURLContent === ''
              ? showPage(page.pyRuleName, page.pyClassName)
              : openURL(page.pyURLContent)
        };
      });

  if (pConn.hasChildren()) {
    // const theChildren = pConn.getChildren();
    // const mapChildCompNames = theChildren.map((child) => { return child.getPConnect().getComponentName()});
    // debugging/investigation help
    // console.log(`AppShell has children: ${theChildren.length}`);
    // console.log(`--> ${mapChildCompNames.map((name) => {return name;})}`);
  }

  if (portalTemplate === 'wss') {
    return (
      <div id='AppShell'>
        <WssNavBar
          portalName={portalName}
          imageSrc={iconURL}
          fullImageSrc={fullIconURL}
          appName={localeUtils.getLocaleValue(
            appNameToDisplay,
            '',
            `${portalClass}!PORTAL!${envPortalName}`.toUpperCase()
          )}
          appInfo={{
            imageSrc: iconURL,
            appName: localeUtils.getLocaleValue(
              appNameToDisplay,
              '',
              `${portalClass}!PORTAL!${envPortalName}`.toUpperCase()
            ),
            onClick: links[0] && links[0].onClick ? links[0].onClick : undefined
          }}
          navLinks={links.filter((link, index) => {
            return index !== 0;
          })}
          operator={getOperator()}
          navDisplayOptions={navDisplayOptions}
        />
        <div className={classes.wsscontent}>{children}</div>
      </div>

    );
  }

  return (
    <NavContext.Provider value={{ open, setOpen }}>
      <div id='AppShell' className={classes.root}>
        <NavBar
          pConn={getPConnect()}
          appName={appNameToDisplay}
          pages={pages}
          caseTypes={caseTypes}
        ></NavBar>
        <div className={classes.content}>{children}</div>
      </div>
    </NavContext.Provider>
  );
}

AppShell.defaultProps = {
  pages: [],
  caseTypes: [],
  children: []
};
AppShell.propTypes = {
  showAppName: PropTypes.bool /* .isRequired */,
  pages: PropTypes.arrayOf(PropTypes.object),
  caseTypes: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.arrayOf(PropTypes.node),
  getPConnect: PropTypes.func.isRequired
};

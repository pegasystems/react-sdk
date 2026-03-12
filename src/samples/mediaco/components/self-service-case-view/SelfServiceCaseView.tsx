import { Avatar, Card, CardHeader, Divider, Typography, Button, Menu, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useState, type MouseEvent } from 'react';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import OOTBSelfServiceCaseView from '@pega/react-sdk-components/lib/components/template/SelfServiceCaseView';
import { prepareCaseSummaryData, filterUtilities } from '@pega/react-sdk-components/lib/components/template/utils';
import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  caseViewHeader: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.getContrastText(theme.palette.info.light),
    borderRadius: 'inherit'
  },
  caseViewIconBox: {
    backgroundColor: theme.palette.info.dark,
    width: theme.spacing(8),
    height: theme.spacing(8),
    padding: theme.spacing(1)
  },
  caseViewIconImage: {
    filter: 'var(--svg-color)'
  }
}));

interface SelfServiceCaseViewProps {
  icon?: string;
  getPConnect: () => typeof PConnect;
  header: string;
  subheader: string;
  showCaseLifecycle?: boolean | string;
  showSummaryRegion?: boolean | string;
  showUtilitiesRegion?: boolean | string;
  showCaseActions?: boolean | string;
  children: any[];
  caseClass: string;
  caseInfo: {
    availableActions?: any[];
    availableProcesses?: any[];
    caseTypeID?: string;
    caseTypeName?: string;
  };
}

export default function SelfServiceCaseView(props: SelfServiceCaseViewProps) {
  //Delegate to OOTB SelfServiceCaseView when not on the WSS portal
  const isWssPortal = (PCore.getEnvironmentInfo() as any).environmentInfoObject?.pyPortalTemplate === 'wss';
  if (!isWssPortal) {
    return <OOTBSelfServiceCaseView {...(props as any)} />;
  }

  const classes = useStyles();
  const CaseSummary = getComponentFromMap('CaseSummary');

  const {
    icon = '',
    getPConnect,
    header,
    subheader,
    showCaseLifecycle = true,
    showSummaryRegion = true,
    showUtilitiesRegion = true,
    showCaseActions = true,
    children,
    caseClass,
    caseInfo: { availableActions = [], availableProcesses = [] }
  } = props;

  const pConnect = getPConnect();

  const [bShowCaseLifecycle, bShowSummaryRegion, bShowUtilitiesRegion, bShowCaseActions] = [
    showCaseLifecycle,
    showSummaryRegion,
    showUtilitiesRegion,
    showCaseActions
  ].map((prop: any) => prop === true || prop === 'true');

  const isObjectType = PCore.getCaseUtils().isObjectCaseType(caseClass);
  const localeKey = pConnect?.getCaseLocaleReference?.();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const svgCase = Utils.getImageSrc(icon, Utils.getSDKStaticConentUrl());

  const renderedRegions: any = isObjectType
    ? {
        caseSummary: children[0],
        utilities: filterUtilities(children[2])
      }
    : {
        caseSummary: children[0],
        stages: children[1],
        todo: children[2],
        utilities: filterUtilities(children[4])
      };

  const { primarySummaryFields, secondarySummaryFields } = prepareCaseSummaryData(
    renderedRegions.caseSummary,
    (config: any) => config?.availableInChannel?.selfService === true
  );

  const isUtilitiesRegionNotEmpty = () => {
    const utilitiesElement = renderedRegions.utilities;
    if (utilitiesElement?.props?.getPConnect()?.getChildren()?.length > 0) {
      return utilitiesElement.props
        .getPConnect()
        .getChildren()
        .some((prop: any) => prop.getPConnect().getConfigProps().visibility !== false);
    }
    return false;
  };

  const hasSummaryData = bShowSummaryRegion && (primarySummaryFields?.length > 0 || secondarySummaryFields?.length > 0);
  const hasUtilities = bShowUtilitiesRegion && isUtilitiesRegionNotEmpty();

  // Actions menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleActionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: any) => {
    handleMenuClose();
    const actionsAPI = pConnect.getActionsApi();
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);
    openLocalAction(action.ID, { ...action, containerName: 'modal', type: 'express' });
  };

  const handleProcessClick = (process: any) => {
    handleMenuClose();
    const actionsAPI = pConnect.getActionsApi();
    const openProcessAction = actionsAPI.openProcessAction.bind(actionsAPI);
    openProcessAction(process.ID, { ...process });
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header bar with heading + actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem 0.5rem 2rem'
        }}
      >
        <Typography
          variant='h4'
          sx={{
            color: '#46185a',
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3
          }}
        >
          {localizedVal(header, '', localeKey)}
        </Typography>
        {bShowCaseActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button variant='contained' color='secondary' onClick={handleActionsClick}>
              {localizedVal('Actions...', 'CaseView')}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {availableActions.map((action: any) => (
                <MenuItem key={action.ID} onClick={() => handleActionClick(action)}>
                  {localizedVal(action.name, '', localeKey)}
                </MenuItem>
              ))}
              {availableProcesses.map((process: any) => (
                <MenuItem key={process.ID} onClick={() => handleProcessClick(process)}>
                  {process.name}
                </MenuItem>
              ))}
            </Menu>
          </div>
        )}
      </div>

      {/* Main case view with flex layout (matching Angular SDK) */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          width: '100%',
          flex: 1,
          padding: '0 1rem'
        }}
      >
        {/* Left sidebar: Case Summary */}
        {hasSummaryData && (
          <div
            style={{
              flex: '0 0 auto',
              width: '25rem',
              backgroundColor: '#f5f5f5',
              height: '100%'
            }}
          >
            <Card className={classes.root}>
              <CardHeader
                className={classes.caseViewHeader}
                title={
                  <Typography variant='h6' component='div' id='case-name'>
                    {localizedVal(header, '', localeKey)}
                  </Typography>
                }
                subheader={
                  <Typography variant='body1' component='div' id='caseId'>
                    {subheader}
                  </Typography>
                }
                avatar={
                  <Avatar className={classes.caseViewIconBox} variant='square'>
                    <img src={svgCase} className={classes.caseViewIconImage} />
                  </Avatar>
                }
              />
              <Divider />
              <CaseSummary arPrimaryFields={primarySummaryFields} arSecondaryFields={secondarySummaryFields} />
              <Divider />
            </Card>
          </div>
        )}

        {/* Center: Stages + Todo — flex-grow to fill all remaining space */}
        <div
          style={{
            flexGrow: 1,
            minWidth: 0,
            width: '100%'
          }}
        >
          {bShowCaseLifecycle && renderedRegions.stages}
          {renderedRegions.todo}
        </div>

        {/* Right sidebar: Utilities */}
        {hasUtilities && (
          <div
            style={{
              backgroundColor: '#f5f5f5',
              width: '21.875rem',
              flex: '0 0 auto',
              padding: '0 0.3125rem'
            }}
          >
            {renderedRegions.utilities}
          </div>
        )}
      </div>
    </div>
  );
}

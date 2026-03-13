import { Avatar, Card, CardHeader, Divider, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useState, type MouseEvent } from 'react';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import SelfServiceCaseView from '@pega/react-sdk-components/lib/components/template/SelfServiceCaseView';
import { prepareCaseSummaryData, filterUtilities } from '@pega/react-sdk-components/lib/components/template/utils';
import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';

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

export default function MediaCoSelfServiceCaseView(props: SelfServiceCaseViewProps) {
  // Delegate to SDK SelfServiceCaseView when not on the WSS portal
  const isWssPortal = (PCore.getEnvironmentInfo() as any).environmentInfoObject?.pyPortalTemplate === 'wss';
  if (!isWssPortal) {
    return <SelfServiceCaseView {...(props as any)} />;
  }

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
    <div className='mc-case-view-root'>
      {/* Header bar with heading + actions */}
      <div className='mc-case-view-header'>
        <Typography variant='h4' className='mc-case-view-header-title'>
          {localizedVal(header, '', localeKey)}
        </Typography>
        {bShowCaseActions && (
          <div className='mc-case-view-header-actions'>
            <Button variant='contained' color='secondary' onClick={handleActionsClick} className='mc-case-view-actions-button'>
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

      {/* Main case view with flex layout */}
      <div className='mc-case-view-main'>
        {/* Left sidebar: Case Summary */}
        {hasSummaryData && (
          <div className='mc-case-view-left'>
            <Card className='mc-case-view-card'>
              <CardHeader
                className='mc-case-view-card-header'
                title={
                  <Typography variant='h6' component='div' id='case-name' className='mc-case-view-card-title'>
                    {localizedVal(header, '', localeKey)}
                  </Typography>
                }
                subheader={
                  <Typography variant='body1' component='div' id='caseId' className='mc-case-view-card-subheader'>
                    {subheader}
                  </Typography>
                }
                avatar={
                  <Avatar className='mc-case-view-icon-box' variant='square'>
                    <img src={svgCase} className='mc-case-view-icon-image' />
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
        <div className='mc-case-view-center'>
          {bShowCaseLifecycle && renderedRegions.stages}
          {renderedRegions.todo}
        </div>

        {/* Right sidebar: Utilities */}
        {hasUtilities && <div className='mc-case-view-right'>{renderedRegions.utilities}</div>}
      </div>
    </div>
  );
}

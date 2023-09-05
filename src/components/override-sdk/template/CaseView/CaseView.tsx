/* eslint-disable react/jsx-boolean-value */
// @ts-nocheck - TypeScript type checking to be added soon
import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';
import { Card, CardHeader, Avatar, Typography, Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import StoreContext from "@pega/react-sdk-components/lib/bridge/Context/StoreContext";
import CaseViewActionsMenu from "@pega/react-sdk-components/lib/components/template/CaseViewActionsMenu";
import VerticalTabs from '@pega/react-sdk-components/lib/components/infra/VerticalTabs/VerticalTabs';
import DeferLoad from '@pega/react-sdk-components/lib/components/infra/DeferLoad';


declare const PCore;

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  caseViewHeader: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.getContrastText(theme.palette.info.light),
    borderRadius: "inherit",
  },
  caseViewIconBox: {
    backgroundColor: theme.palette.info.dark,
    width: theme.spacing(8),
    height: theme.spacing(8),
    padding: theme.spacing(1),
  },
  caseViewIconImage: {
    filter: 'invert(100%)'
  }
}));

export default function CaseView(props) {
  const {
    getPConnect,
    icon,
    header,
    subheader,
    children,
    caseInfo: {
      availableActions = [],
      availableProcesses = [],
      hasNewAttachments,
      caseTypeID = '',
      caseTypeName = ''
    }
  } = props;
  const currentCaseID = props.caseInfo.ID;
  let isComponentMounted = true;

  const { displayOnlyFA } = useContext<any>(StoreContext);

  const thePConn = getPConnect();

  const classes = useStyles();

  const editAction = availableActions.find((action) => action.ID === 'pyUpdateCaseDetails');
  const localeKey = `${caseTypeID}!CASE!${caseTypeName}`.toUpperCase();
  /**
   *
   * @param inName the metadata <em>name</em> that will cause a region to be returned
   */
  function getChildRegionByName(inName: string): any {

    for (const child of children) {
      const theMetadataType: string = child.props.getPConnect().getRawMetadata()['type'].toLowerCase();
      const theMetadataName: string = child.props.getPConnect().getRawMetadata()['name'].toLowerCase();

      if ((theMetadataType === "region") && (theMetadataName === inName )) {
        return child;
      }
    }

    return null;
  }


  const theSummaryRegion = getChildRegionByName("summary");
  const theStagesRegion = getChildRegionByName("stages");
  const theTodoRegion = getChildRegionByName("todo");
  const theUtilitiesRegion = getChildRegionByName("utilities");
  const theTabsRegion = getChildRegionByName("tabs");

  const svgCase = Utils.getImageSrc(icon, PCore.getAssetLoader().getStaticServerUrl());

  const [activeVertTab, setActiveVertTab] = useState(0);

  // const tmpLoadData1 = { config: { label: "Details", name: "pyDetailsTabContent" }, type: "DeferLoad" };
  // const tmpLoadData2 = { config: { label: "Case History", name: "CaseHistory" }, type: "DeferLoad" };

  // Extract the tabs we need to display from theTabsRegion (one tab per entry in theTabsRegionChildren)
  const theTabsRegionChildren = theTabsRegion.props.getPConnect().getChildren();

  // vertTabInfo is sent to VerticalTabs component
  const vertTabInfo: Array<Object> = [];

  // deferLoadInfo is sent to DeferLoad component (currently selected entry)
  const deferLoadInfo: Array<any> = [];

  if (theTabsRegionChildren) {
    // populate vertTabInfo and deferLoadInfo
    theTabsRegionChildren.forEach((tabComp, index) => {
      const theTabCompConfig = tabComp.getPConnect().getConfigProps();
      // eslint-disable-next-line prefer-const
      let { label, inheritedProps } = theTabCompConfig;
      // For some tabs, "label" property is not avaialable in theTabCompConfig, so will get them from inheritedProps
      if (!label) {
        inheritedProps.forEach(inheritedProp => {
          if (inheritedProp.prop === 'label') {
            label = inheritedProp.value;
          }
        });
      }
      // We'll display the tabs when either visibility property doesn't exist or is true(if exists)
      if (theTabCompConfig.visibility === undefined || theTabCompConfig.visibility === true) {
        vertTabInfo.push({ name: label, id: index });
        deferLoadInfo.push({ type: 'DeferLoad', config: theTabCompConfig });
      }
    });
  }



  function handleVerticalTabClick(eventDetail: any) {
    const theItem = parseInt(eventDetail.additionalData.itemClicked, 10);

    // only call useEffectSetter if the component is mounted
    if (isComponentMounted) {
      setActiveVertTab(theItem);
    }
  }


  // Add and Remove event listener for VerticalTabClick only at startup and teardown
  useEffect(() => {
    document.addEventListener('VerticalTabClick', (event: any) => {
      handleVerticalTabClick(event.detail);
    });

    return ():void => {
      // inform that the component is unmounted so other code can
      //  know not to try to call useState setters (to avoid console warnings)
      isComponentMounted = false;

      document.removeEventListener('VerticalTabClick', (event: any) => {
        handleVerticalTabClick(event.detail);
      });
    }
  }, [])

  useEffect(() => {
    if (hasNewAttachments) {
      PCore.getPubSubUtils().publish(PCore.getEvents().getCaseEvent().CASE_ATTACHMENTS_UPDATED_FROM_CASEVIEW, true);
    }
  }, [hasNewAttachments]);

  function _editClick() {

    const actionsAPI = thePConn.getActionsApi();
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);

    openLocalAction( editAction.ID, { ...editAction});
  }


  function getActionButtonsHtml(): any {

    const aBHtml = <Box>
            {editAction && (<Button onClick={() => {_editClick()}}>Edit</Button>)}
            <CaseViewActionsMenu getPConnect={getPConnect} availableActions={availableActions} availableProcesses={availableProcesses} />
        </Box>;


    return aBHtml;

  }


  function getContainerContents() {

    if (!displayOnlyFA) {
      // show full portal
      return (
        <Grid container>
          <Grid item xs={3}>
          <div hidden={true} id="current-caseID">{currentCaseID}</div>
          <Card className={classes.root} >
            <CardHeader className={classes.caseViewHeader}
              title={<Typography variant="h6" component="div">{PCore.getLocaleUtils().getLocaleValue(header, '', localeKey)}</Typography>}
              subheader={<Typography variant="body1" component="div" id="caseId">{subheader}</Typography>}
              avatar={
                <Avatar className={classes.caseViewIconBox} variant="square">
                  <img src={svgCase} className={classes.caseViewIconImage}/>
                </Avatar>
              }
            />
            {getActionButtonsHtml()}
            <Divider />
            {theSummaryRegion}
            <Divider />
            { vertTabInfo.length > 1 && <VerticalTabs tabconfig={vertTabInfo} />}
          </Card>
        </Grid>

        <Grid item xs={6}>
          {theStagesRegion}
          {theTodoRegion}
          { deferLoadInfo.length > 0 && <DeferLoad getPConnect={getPConnect} name={deferLoadInfo[activeVertTab].config.name } isTab />}
        </Grid>

        <Grid item xs={3}>
          {theUtilitiesRegion}
        </Grid>
      </Grid>
      )
    } else {
      // displayOnlyFA - only show the "todo" region
      return (
        <>{theTodoRegion}</>
      )
    }
  }


  return (
      getContainerContents()
  );
}

CaseView.defaultProps = {
  icon: "",
  children: [],
  caseInfo: {},
  showIconInHeader: true,
  getPConnect: null
};

CaseView.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node),
  subheader: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  showIconInHeader: PropTypes.bool,
  caseInfo: PropTypes.objectOf(PropTypes.any),
  getPConnect: PropTypes.func
};

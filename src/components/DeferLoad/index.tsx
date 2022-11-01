import React, { useState, useEffect, createElement } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import createPConnectComponent from '../../bridge/react_pconnect';

declare const PCore;

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

const useStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

export default function DeferLoad(props) {
  const { getPConnect, name, deferLoadId, isTab } = props;
  const [content, setContent] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  const classes = useStyles();

  const pConnect = getPConnect();
  const constants = PCore.getConstants();
  const { CASE, PAGE, DATA } = constants.RESOURCE_TYPES;
  const loadViewCaseID =
    pConnect.getValue(constants.PZINSKEY) || pConnect.getValue(constants.CASE_INFO.CASE_INFO_ID);
  let containerName;
  let containerItemData;
  const targetName = pConnect.getTarget();
  if (targetName) {
    containerName = PCore.getContainerUtils().getActiveContainerItemName(targetName);

    containerItemData = PCore.getContainerUtils().getContainerItemData(targetName, containerName);
  }

  const { resourceType = CASE } = containerItemData || {
    resourceType: loadViewCaseID ? CASE : PAGE
  };
  const isContainerPreview = /preview_[0-9]*/g.test(pConnect.getContextName());

  const getViewOptions = () => ({
    viewContext: resourceType,
    pageClass: loadViewCaseID ? '' : pConnect.getDataObject().pyPortal.classID,
    container: isContainerPreview ? 'preview' : null,
    containerName: isContainerPreview ? 'preview' : null,
    updateData: isContainerPreview
  });

  const onResponse = data => {
    setLoading(false);
    if (deferLoadId) {
      PCore.getDeferLoadManager().start(
        name,
        getPConnect().getCaseInfo().getKey(),
        getPConnect().getPageReference().replace('caseInfo.content', ''),
        getPConnect().getContextName(),
        deferLoadId
      );
    }

    if (data && !(data.type && data.type === 'error')) {
      const config = {
        meta: data,
        options: {
          context: pConnect.getContextName(),
          pageReference: pConnect.getPageReference()
        }
      };
      const configObject = PCore.createPConnect(config);
      configObject.getPConnect().setInheritedProp('displayMode', 'LABELS_LEFT');
      setContent(createElement(createPConnectComponent(), configObject));
      if (deferLoadId) {
        PCore.getDeferLoadManager().stop(deferLoadId, getPConnect().getContextName());
      }
    }
  };

  useEffect(() => {
    if (resourceType === DATA) {
      // Rendering defer loaded tabs in data context
      if (containerName) {
        const dataContext = PCore.getStoreValue('.dataContext', 'dataInfo', containerName);
        const dataContextParameters = PCore.getStoreValue(
          '.dataContextParameters',
          'dataInfo',
          containerName
        );

        getPConnect()
          .getActionsApi()
          .showData(name, dataContext, dataContextParameters, {
            skipSemanticUrl: true,
            isDeferLoaded: true
          })
          .then(data => {
            onResponse(data);
          });
      } else {
        // eslint-disable-next-line no-console
        console.error('Cannot load the defer loaded view without container information');
      }
    } else if (resourceType === PAGE) {
      // Rendering defer loaded tabs in case/ page context
      getPConnect()
        .getActionsApi()
        .loadView(encodeURI(loadViewCaseID), name, getViewOptions())
        .then(data => {
          onResponse(data);
        });
    } else {
      getPConnect()
        .getActionsApi()
        .refreshCaseView(encodeURI(loadViewCaseID), name)
        .then(data => {
          onResponse(data.root);
        });
    }
  }, [name, getPConnect]);
  /* TODO Cosmos need to handle for now added a wrapper div with pos relative */
  let deferLoadContent;
  if (isLoading) {
    deferLoadContent = (
      <div style={{ position: 'relative', height: '100px' }}>
        <Box textAlign='center'>
          <CircularProgress />
        </Box>
      </div>
    );
  } else {
    deferLoadContent = !isTab ? (
      <div className={classes.root}>
        <React.Fragment>{content}</React.Fragment>
      </div>
    ) : (
      <Card id='DeferLoad' className={classes.root}>
        <React.Fragment>{content}</React.Fragment>
      </Card>
    );
  }

  return deferLoadContent;
}

DeferLoad.defaultProps = {
  isChildDeferLoad: false
};

DeferLoad.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isChildDeferLoad: PropTypes.bool,
  isTab: PropTypes.bool
};

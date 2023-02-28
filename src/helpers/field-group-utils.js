import { createElement } from 'react';

import createPConnectComponent from '../../src/bridge/react_pconnect';

/**
 *
 * @param {*} pConn - pConnect object of the view
 * @returns {string} - returns the name of referenceList
 */

export const getReferenceList = pConn => {
  let resolvePage = pConn.getComponentConfig().referenceList.replace('@P ', '');
  if (resolvePage.includes('D_')) {
    resolvePage = pConn.resolveDatasourceReference(resolvePage);
    if (resolvePage?.pxResults) {
      resolvePage = resolvePage?.pxResults;
    } else if (resolvePage.startsWith('D_') && !resolvePage.endsWith('.pxResults')) {
      resolvePage = `${resolvePage}.pxResults`;
    }
  }
  return resolvePage;
};

/**
 * creates and returns react element of the view
 * @param {*} pConn - pConnect object of the view
 * @param {*} index - index of the fieldGroup item
 * @param {*} viewConfigPath - boolean value to check for children in config
 * @returns {*} - return the react element of the view
 */
export const buildView = (pConn, index, viewConfigPath) => {
  const context = pConn.getContextName();
  const referenceList = getReferenceList(pConn);

  const isDatapage = referenceList.startsWith('D_');
  const pageReference = isDatapage
    ? `${referenceList}[${index}]`
    : `${pConn.getPageReference()}${referenceList.substring(
        referenceList.lastIndexOf('.')
      )}[${index}]`;
  const meta = viewConfigPath
    ? pConn.getRawMetadata().children[0].children[0]
    : pConn.getRawMetadata().children[0];
  const config = {
    meta,
    options: {
      context,
      pageReference,
      referenceList,
      hasForm: true
    }
  };
  // eslint-disable-next-line no-undef
  const view = PCore.createPConnect(config);
  if (pConn.getConfigProps()?.displayMode === 'LABELS_LEFT') {
    view.getPConnect()?.setInheritedProp('displayMode', 'LABELS_LEFT');
  }
  return createElement(createPConnectComponent(), view);
};

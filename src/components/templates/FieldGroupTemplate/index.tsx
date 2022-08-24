/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import FieldGroup from '../../designSystemExtensions/FieldGroup';
import FieldGroupList from '../../designSystemExtensions/FieldGroupList';
import { getReferenceList, buildView } from '../../../helpers/field-group-utils';

export default function FieldGroupTemplate(props) {
  const {
    referenceList,
    renderMode,
    contextClass,
    getPConnect,
    lookForChildInConfig,
    heading,
    displayMode
  } = props;
  const pConn = getPConnect();
  const isReadonlyMode = renderMode === 'ReadOnly' || displayMode === 'LABELS_LEFT';
  const HEADING = heading ?? 'Row';

  if (!isReadonlyMode) {
    const resolvedList = getReferenceList(pConn);
    const pageReference = `${pConn.getPageReference()}${resolvedList}`;
    pConn.setReferenceList(resolvedList);
    const addFieldGroupItem = () => {
      pConn.getListActions().insert({ classID: contextClass }, referenceList.length, pageReference);
    };
    const deleteFieldGroupItem = index => {
      pConn.getListActions().deleteEntry(index, pageReference);
    };
    if (referenceList.length === 0) {
      pConn.getListActions().insert({ classID: contextClass }, referenceList.length, pageReference);
    }

    const MemoisedChildren = useMemo(() => {
      return referenceList.map((item, index) => ({
        id: index,
        name: `${HEADING} ${index + 1}`,
        children: buildView(pConn, index, lookForChildInConfig)
      }));
    }, [referenceList?.length]);

    return (
      <FieldGroupList
        items={MemoisedChildren}
        onAdd={addFieldGroupItem}
        onDelete={deleteFieldGroupItem}
      />
    );
  }
  pConn.setInheritedProp('displayMode', 'LABELS_LEFT');
  const memoisedReadOnlyList = useMemo(() => {
    return referenceList.map((item, index) => (
      <FieldGroup
        item={item}
        key={item[heading]}
        name={`${HEADING} ${index + 1}`}
      />
    ));
  }, []);

  return <div>{memoisedReadOnlyList}</div>;
}

FieldGroupTemplate.defaultProps = {
  referenceList: [],
  heading: undefined,
  contextClass: null,
  displayMode: undefined
};

FieldGroupTemplate.propTypes = {
  referenceList: PropTypes.arrayOf(Object),
  contextClass: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  renderMode: PropTypes.string.isRequired,
  heading: PropTypes.string,
  lookForChildInConfig: PropTypes.bool.isRequired,
  displayMode: PropTypes.string
};

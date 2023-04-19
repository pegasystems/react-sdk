/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import FieldGroup from '../../designSystemExtensions/FieldGroup';
import FieldGroupList from '../../designSystemExtensions/FieldGroupList';
import { getReferenceList, buildView } from '../../../helpers/field-group-utils';

declare const PCore: any;

export default function FieldGroupTemplate(props) {
  const {
    referenceList,
    renderMode,
    contextClass,
    getPConnect,
    lookForChildInConfig,
    heading,
    displayMode,
    fieldHeader,
    allowTableEdit: allowAddEdit
  } = props;
  const pConn = getPConnect();
  const resolvedList = getReferenceList(pConn);
  pConn.setReferenceList(resolvedList);
  const pageReference = `${pConn.getPageReference()}${resolvedList}`;
  const isReadonlyMode = renderMode === 'ReadOnly' || displayMode === 'LABELS_LEFT';
  const HEADING = heading ?? 'Row';

  const getDynamicHeaderProp = (item, index) => {
    if (fieldHeader === 'propertyRef' && heading && item[heading.substring(1)]) {
      return item[heading.substring(1)];
    }
    return `Row ${index + 1}`;
  };

  const addRecord = () => {
    if (PCore.getPCoreVersion()?.includes('8.7')) {
      pConn.getListActions().insert({ classID: contextClass }, referenceList.length, pageReference);
    } else {
      pConn.getListActions().insert({ classID: contextClass }, referenceList.length);
    }
  };

  if (!isReadonlyMode) {
    const addFieldGroupItem = () => {
      addRecord();
    };
    const deleteFieldGroupItem = index => {
      if (PCore.getPCoreVersion()?.includes('8.7')) {
        pConn.getListActions().deleteEntry(index, pageReference);
      } else {
        pConn.getListActions().deleteEntry(index);
      }
    };
    if (referenceList.length === 0 && allowAddEdit !== false) {
      addFieldGroupItem();
    }

    const MemoisedChildren = useMemo(() => {
      return referenceList.map((item, index) => ({
        id: index,
        name:
          fieldHeader === 'propertyRef'
            ? getDynamicHeaderProp(item, index)
            : `${HEADING} ${index + 1}`,
        children: buildView(pConn, index, lookForChildInConfig)
      }));
    }, [referenceList?.length]);

    return (
      <FieldGroupList
        items={MemoisedChildren}
        onAdd={allowAddEdit !== false ? addFieldGroupItem : undefined}
        onDelete={allowAddEdit !== false ? deleteFieldGroupItem : undefined}
      />
    );
  }

  pConn.setInheritedProp('displayMode', 'LABELS_LEFT');
  const memoisedReadOnlyList = useMemo(() => {
    return referenceList.map((item, index) => {
      const key = item[heading] || `field-group-row-${index}`;
      return (
        <FieldGroup
          key={key}
          name={fieldHeader === 'propertyRef' ? getDynamicHeaderProp(item, index) : `${HEADING} ${index + 1}`}
        >
          {buildView(pConn, index, lookForChildInConfig)}
        </FieldGroup>
      );
    });
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
  lookForChildInConfig: PropTypes.bool,
  displayMode: PropTypes.string
};

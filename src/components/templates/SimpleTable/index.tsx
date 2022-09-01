import React from 'react';
import FieldGroupTemplate from '../FieldGroupTemplate';
import SimpleTableManual from './SimpleTableManual';

declare const PCore: any;

export default function SimpleTable(props) {
  const { getPConnect, multiRecordDisplayAs, allowTableEdit } = props;

  let { contextClass } = props;
  if (!contextClass) {
    let listName = getPConnect().getComponentConfig().referenceList;
    listName = PCore.getAnnotationUtils().getPropertyName(listName);
    contextClass = getPConnect().getFieldMetadata(listName)?.pageClass;
  }
  if (multiRecordDisplayAs === 'fieldGroup') {
    const fieldGroupProps = { ...props, contextClass };
    return <FieldGroupTemplate {...fieldGroupProps} />;
  } else {
    const simpleTableManualProps = {...props, contextClass};
    if (allowTableEdit === false) {
      simpleTableManualProps.hideAddRow = true;
      simpleTableManualProps.hideDeleteRow = true;
      simpleTableManualProps.disableDragDrop = true;
    }
    return <SimpleTableManual {...simpleTableManualProps} />;
  }
}

import PropTypes from 'prop-types';
import React from "react";
import ListView from '../ListView';
// import SimpleTableManual from '../SimpleTable/SimpleTableManual';

import PromotedFilters from '../PromotedFilters';

const isSelfReferencedProperty = (param, referenceProp) => {
  const [, parentPropName] = param.split('.');
  return parentPropName === referenceProp;
};
declare const PCore;
/**
 * SimpleTable react component
 * @param {*} props - props
 */
export default function SimpleTableSelect(props) {
  const { label, getPConnect, renderMode, showLabel, viewName, parameters, dataRelationshipContext } = props;

  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };
  if (propsToUse.showLabel === false) {
    propsToUse.label = '';
  }

  const pConn = getPConnect();
  const { MULTI } = PCore.getConstants().LIST_SELECTION_MODE;
  const { selectionMode, selectionList } = pConn.getConfigProps();
  const isMultiSelectMode = selectionMode === MULTI;

  if (isMultiSelectMode && renderMode === 'ReadOnly') {
    // return <SimpleTableManual {...props} showLabel={propsToUse.showLabel} />;
    return <div>This is SimpleTableManual</div>;
  }

  const pageReference = pConn.getPageReference();
  let referenceProp = isMultiSelectMode ? selectionList.substring(1) : pageReference.substring(pageReference.lastIndexOf('.') + 1);
  // Replace here to use the context name instead
  let contextPageReference = null;
  if (props.dataRelationshipContext !== null && selectionMode === 'single') {
    referenceProp = dataRelationshipContext;
    contextPageReference = pageReference.concat('.').concat(referenceProp);
  }

  const { datasource: { parameters: fieldParameters = {} } = {}, pageClass } = isMultiSelectMode
    ? pConn.getFieldMetadata(`@P .${referenceProp}`)
    : pConn.getCurrentPageFieldMetadata(contextPageReference);

  const compositeKeys: Array<any> = [];
  Object.values(fieldParameters).forEach((param: any) => {
    if (isSelfReferencedProperty(param, referenceProp)) {
     compositeKeys.push(param.substring(param.lastIndexOf('.') + 1));
    }
  });

  // setting default row height for select table
  const defaultRowHeight = '2';

  const additionalTableConfig = {
    rowDensity: false,
    enableFreezeColumns: false,
    autoSizeColumns: false,
    resetColumnWidths: false,
    defaultFieldDef: {
      showMenu: false,
      noContextMenu: true,
      grouping: false
    },
    itemKey: '$key',
    defaultRowHeight
  };

  const listViewProps = {
    ...props,
    title: propsToUse.label,
    personalization: false,
    grouping: false,
    expandGroups: false,
    reorderFields: false,
    showHeaderIcons: false,
    editing: false,
    globalSearch: true,
    toggleFieldVisibility: false,
    basicMode: true,
    additionalTableConfig,
    compositeKeys,
    viewName,
    parameters
  };

  const filters = getPConnect().getRawMetadata().config.promotedFilters ?? [];

  const isSearchable = filters.length > 0;

  if (isSearchable) {
    return (
      <PromotedFilters
        getPConnect={getPConnect}
        viewName={viewName}
        filters={filters}
        listViewProps={listViewProps}
        pageClass={pageClass}
      />
    );
  }
  return <ListView {...listViewProps} />;
}

SimpleTableSelect.defaultProps = {
  label: undefined,
  renderMode: '',
  showLabel: true,
  promptedFilters: [],
  viewName: '',
  parameters: undefined,
  readonlyContextList: [],
  dataRelationshipContext: null
};

SimpleTableSelect.propTypes = {
  label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  referenceList: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]).isRequired,
  renderMode: PropTypes.string,
  showLabel: PropTypes.bool,
  promptedFilters: PropTypes.arrayOf(PropTypes.object),
  viewName: PropTypes.string,
  parameters: PropTypes.objectOf(PropTypes.any),
  readonlyContextList: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]),
  dataRelationshipContext: PropTypes.string
};

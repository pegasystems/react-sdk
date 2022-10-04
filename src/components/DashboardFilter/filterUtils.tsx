/* eslint-disable prefer-template */
/** This file contains various utility methods to generate filter components, regionLayout data, filter expressions, etc.  */

import { Grid, Link } from '@material-ui/core';
import React from 'react';
import DashboardFilter from './index';

declare const PCore: any;

export const createFilter = (value, fieldId, comparator = 'EQ') => {
  return {
    condition: {
      lhs: {
        field: fieldId
      },
      comparator,
      rhs: {
        value
      }
    }
  };
};

export const combineFilters = (filterList, existingFilters) => {
  if (filterList && filterList.length) {
    // Need to combine them
    if (existingFilters) {
      return { AND: [existingFilters, ...filterList] };
    }

    // No existing, just return the one(s) from the list
    if (filterList.length > 1) {
      return { AND: [...filterList] };
    }

    return filterList[0];
  }

  // No filter list,
  return existingFilters;
};

export const createFilterComponent = (getPConnect, filterMeta, index) => {
  const name = filterMeta.config.value.substring(4);
  let cleanedName = name;
  if (name.indexOf('.') !== -1) {
    cleanedName = name.substring(name.indexOf('.') + 1);
  }
  let propInfo = PCore.getMetadataUtils().getPropertyMetadata(
    cleanedName,
    filterMeta.config.ruleClass
  );
  if (!propInfo) {
    propInfo = PCore.getMetadataUtils().getPropertyMetadata(cleanedName);
  }
  const { type: propertyType } = propInfo || { type: 'Text' };
  const isNumber = propertyType && (propertyType === 'Decimal' || propertyType === 'Integer');
  filterMeta.isNumber = isNumber;
  const { filterType, datasource } = filterMeta.config;
  const type = filterType || filterMeta.type;
  const filterProp = `.pyDashboardFilter${index}`;
  if (type === 'DateTime') {
    return (
      <DashboardFilter
        key={name}
        getPConnect={getPConnect}
        name={name}
        filterProp={filterProp}
        metadata={filterMeta}
        type={filterMeta.type}
      ></DashboardFilter>
    );
  }
  if (datasource && datasource.fields) {
    datasource.fields.key = datasource.fields.value;
  }
  if (filterMeta.config.listType === 'associated' && propInfo && propInfo.datasource) {
    filterMeta.config.datasource = propInfo.datasource.records;
  }
  filterMeta.config.value = `@P ${filterProp}`;
  filterMeta.type = filterMeta.config.displayAs || type;
  filterMeta.config.placeholder = 'ALL';
  return (
    <DashboardFilter
      key={name}
      getPConnect={getPConnect}
      name={name}
      filterProp={filterProp}
      metadata={filterMeta}
      type={filterMeta.type}
    >
      {getPConnect().createComponent(filterMeta)}
    </DashboardFilter>
  );
};

export const buildFilterComponents = (getPConnect, allFilters) => {
  const filterComponents = allFilters.children.map((filter, index) =>
    createFilterComponent(getPConnect, filter, index)
  );
  if (filterComponents && filterComponents.length > 0) {
    filterComponents.push(
      <Grid>
        <Link
          style={{ cursor: 'pointer' }}
          onClick={() => {
            PCore.getPubSubUtils().publish(
              PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CLEAR_ALL
            );
          }}
        >
          Clear All
        </Link>
      </Grid>
    );
  }
  return filterComponents;
};

export const convertDateToGMT = value => {
  const { valueAsISOString: date } = value;
  return date ? date.substring(0, date.indexOf('T')) : date;
};

export const getFilterExpression = (filterValue, name, metadata) => {
  if (filterValue === '') {
    return null;
  }
  let comparator = 'EQ';
  if (metadata.type === 'TextInput' && !metadata.isNumber) {
    comparator = 'CONTAINS';
  }

  if (metadata.config.filterType && metadata.config.filterType === 'RelativeDates') {
    const fieldSource = metadata.config.datasource.filter(source => source.key === filterValue)[0];
    const relativeDateExpression = JSON.parse(fieldSource.json);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const fields = [
      {
        name: relativeDateExpression.condition.lhs.field,
        type: 'DATE_TIME'
      }
    ];
    return '';
  }

  return createFilter(filterValue, name, comparator);
};

/**
 * Returns ConfigurableLayout mapped content. With pre-populated default layout configs.
 * @returns {object[]} ConfigurableLayout content.
 */
export function getLayoutDataFromRegion(regionData) {
  const defaultLayoutConfig = {
    width: 'full',
    fillAvailable: true,
    minWidth: [300, 'px']
  };

  return regionData.props
    ?.getPConnect()
    ?.getChildren()
    ?.map((item, index) => {
      const itemPConnect = item?.getPConnect();

      return {
        id: itemPConnect?.getComponentName()
          ? `${itemPConnect.getComponentName()}--${index}`
          : `item--${index}`,
        content: itemPConnect?.getComponent(),
        layoutConfig: {
          ...defaultLayoutConfig,
          ...itemPConnect?.getConfigProps().layoutConfig
        }
      };
    });
}

export const getFormattedDate = date => {
  if (!date) {
    return date;
  }
  const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
    '0' + date.getDate()
  ).slice(-2)}`;
  return formattedDate;
};

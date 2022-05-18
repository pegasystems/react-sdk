import { useCallback, useMemo, useState, createElement, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Grid } from "@material-ui/core";
import createPConnectComponent from "../../../bridge/react_pconnect";
import ListView from '../ListView';
import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  colStyles: {
    display: "grid",
    // gap: "1rem",
    // alignContent: "baseline",
    cols: 'repeat(3, minmax(0, 1fr))',
    colGap: 2,
    rowGap: 2,
    alignItems: 'start'
  },
}));
declare const PCore;
const localeCategory = 'SimpleTable';
const SUPPORTED_TYPES_IN_PROMOTED_FILTERS = [
  'TextInput',
  'Percentage',
  'Email',
  'Integer',
  'Decimal',
  'Checkbox',
  'DateTime',
  'Date',
  'Time',
  'Text',
  'TextArea',
  'Currency',
  'URL',
  'RichText'
];

function Filters({ filters, transientItemID, localeReference }) {
  return filters.map((filter) => {
    const filterClone = { ...filter };
    // convert any field which is not supported to TextInput and delete the placeholder as it may contain placeholder specific to original type.
    if (!SUPPORTED_TYPES_IN_PROMOTED_FILTERS.includes(filterClone.type)) {
      filterClone.type = 'TextInput';
      delete filterClone.config.placeholder;
    }
    filterClone.config.contextName = transientItemID;
    filterClone.config.readOnly = false;
    filterClone.config.context = transientItemID;
    filterClone.config.localeReference = localeReference;
    const c11nEnv = PCore.createPConnect({
      meta: filterClone,
      options: {
        hasForm: true,
        contextName: transientItemID
      }
    });

    return createElement(createPConnectComponent(), c11nEnv);
  });
}

function isValidInput(input) {
  return Object.values(input).findIndex((v) => v) >= 0;
}

export default function PromotedFilters(props) {
  const classes = useStyles();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const { getPConnect, viewName, filters, listViewProps, pageClass } = props;
  const [initTable, setInitTable] = useState(false);
  const filtersProperties = {};
  console.log('listViewProps', listViewProps);
  filters.forEach((filter) => {
    filtersProperties[PCore.getAnnotationUtils().getPropertyName(filter.config.value)] = '';
  });

  const transientItemID = useMemo(() => {
    const filtersWithClassID = {
      ...filtersProperties,
      classID: pageClass
    };
    return getPConnect().getContainerManager().addTransientItem({
      id: viewName,
      data: filtersWithClassID
    });
  }, []);

  const getFilterData = useCallback(
    (e) => {
      e.preventDefault(); // to prevent un-intended forms submission.

      const changes = PCore.getFormUtils().getChanges(transientItemID);
      const formValues = {};
      Object.keys(changes).forEach((key) => {
        // getChanges is returning context_data and messages as well.
        if (key !== 'context_data') {
          formValues[key] = changes[key];
        }
      });

      if (PCore.getFormUtils().isFormValid(transientItemID) && isValidInput(formValues)) {
        setInitTable(true);

        PCore.getPubSubUtils().publish(PCore.getEvents().getTransientEvent().UPDATE_PROMOTED_FILTERS, {
          payload: formValues,
          viewName
        });
      }
    },
    [transientItemID]
  );

  const clearFilterData = useCallback(() => {
    PCore.getContainerUtils().clearTransientData(transientItemID);
    setInitTable(false);
    getPConnect()?.getListActions?.()?.setSelectedRows([]); // Clear the selection (if any made by user)
  }, [transientItemID]);

  console.log('transientItemID', transientItemID)
  return (
    <Fragment>
      <div>{listViewProps.title}</div>
      <Filters filters={filters} transientItemID={transientItemID} localeReference={listViewProps.localeReference}/>
      <div>
        <Button key='1' type='button' onClick={clearFilterData} data-testid='clear' variant='contained' color='primary'>
            {localizedVal('Clear', localeCategory)}
        </Button>
        <Button style={{float: 'right'}} key='2' type='submit' onClick={getFilterData} data-testid='search' variant='contained' color='primary'>
            {localizedVal('Search', localeCategory)}
        </Button>
      </div>
      <ListView {...listViewProps} title=''
         isSearchable
         tableDisplay={{
           show: initTable
         }}
       />
    </Fragment>
  );
}

PromotedFilters.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  viewName: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  listViewProps: PropTypes.objectOf(PropTypes.any).isRequired,
  pageClass: PropTypes.string.isRequired
};

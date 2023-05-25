import React, { useCallback, useMemo, useState, createElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import createPConnectComponent from "../../../bridge/react_pconnect";
import ListView from '../ListView';
import { isEmptyObject } from '../../../helpers/common-utils';
import './PromotedFilters.css';

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
  return filters.map((filter, index) => {
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

    // eslint-disable-next-line react/no-array-index-key
    return <React.Fragment key={index}>{createElement(createPConnectComponent(), c11nEnv)}</React.Fragment>;
  });
}

function isValidInput(input) {
  return Object.values(input).findIndex((v) => v) >= 0;
}

export default function PromotedFilters(props) {
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const { getPConnect, viewName, filters, listViewProps, pageClass, parameters } = props;
  const [initTable, setInitTable] = useState(false);
  const [payload, setPayload] = useState({});
  const filtersProperties = {};

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

  function formatPromotedFilters(promotedFilters) {
    return Object.entries(promotedFilters).reduce((acc, [field, value]) => {
      if (value) {
        acc[field] = {
          lhs: {
            field
          },
          comparator: "EQ",
          rhs: {
            value
          }
        };
      }
      return acc;
    }, {});
  }

  const getFilterData = useCallback(
    (e) => {
      e.preventDefault(); // to prevent un-intended forms submission.

      const changes = PCore.getFormUtils().getChanges(transientItemID);
      const formValues = {};
      Object.keys(changes).forEach((key) => {
        if (!['context_data', 'pageInstructions'].includes(key)) {
          formValues[key] = changes[key];
        }
      });
      const promotedFilters = formatPromotedFilters(formValues);
      if (PCore.getFormUtils().isFormValid(transientItemID) && isValidInput(formValues)) {
        setInitTable(true);
        const Query: any = {
          dataViewParameters: parameters
        };

        if (!isEmptyObject(promotedFilters)) {
          Query.query = { filter: { filterConditions: promotedFilters } };
        }
        setPayload(Query);
      }
    },
    [transientItemID]
  );

  const clearFilterData = useCallback(() => {
    PCore.getContainerUtils().clearTransientData(transientItemID);
    setInitTable(false);
    getPConnect()?.getListActions?.()?.setSelectedRows([]); // Clear the selection (if any made by user)
  }, [transientItemID]);

  return (
    <Fragment>
      <div>{listViewProps.title}</div>
      <div className="psdk-grid-filter">
        <Filters filters={filters} transientItemID={transientItemID} localeReference={listViewProps.localeReference}/>
      </div>
      <div>
        <Button key='1' type='button' onClick={clearFilterData} data-testid='clear' variant='contained' color='primary'>
          {localizedVal('Clear', localeCategory)}
        </Button>
        <Button style={{float: 'right'}} key='2' type='submit' onClick={getFilterData} data-testid='search' variant='contained' color='primary'>
          {localizedVal('Search', localeCategory)}
        </Button>
      </div>
      {initTable && <ListView {...listViewProps} title='' payload={payload}
         isSearchable
         tableDisplay={{
           show: initTable
         }}
       />}
    </Fragment>
  );
}

PromotedFilters.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  viewName: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  listViewProps: PropTypes.objectOf(PropTypes.any).isRequired,
  pageClass: PropTypes.string.isRequired,
  parameters: PropTypes.object
};

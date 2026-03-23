/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import type { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import MoreIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import SubjectIcon from '@mui/icons-material/Subject';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Grid2 from '@mui/material/Grid2';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Radio } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { filterData } from '@pega/react-sdk-components/lib/components/helpers/simpleTableHelpers';

import './ListView.css';
import { getDateFormatInfo } from '@pega/react-sdk-components/lib/components/helpers/date-format-utils';
import { getCurrencyOptions } from '@pega/react-sdk-components/lib/components/field/Currency/currency-utils';
import { getGenericFieldsLocalizedValue } from '@pega/react-sdk-components/lib/components/helpers/common-utils';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';

import useInit from './hooks';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// ── NWM Luna design tokens ────────────────────────────────────────────────────
const NM = {
  navy: '#1f2d46',
  border: '#c8ced8',
  focusBlue: '#2d4dc5',
  labelColor: '#5c697f',
  textColor: '#1f2d46',
  surface: '#ffffff',
  headerBg: '#f4f6f9',
  rowHover: '#f7f9fc',
  font: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif"
};

const NMTableWrapper = styled.div`
  width: 100%;
  border: 1px solid ${NM.border};
  border-radius: 6px;
  overflow: hidden;
  background: ${NM.surface};
  font-family: ${NM.font};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const NMStyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${NM.font};
  font-size: 0.875rem;
`;

const NMTHead = styled.thead`
  background: ${NM.headerBg};
`;

const NMTH = styled.th`
  padding: 10px 14px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${NM.labelColor};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid ${NM.border};
  white-space: nowrap;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: ${NM.navy};
  }
`;

const NMTBody = styled.tbody``;

const NMTR = styled.tr`
  border-bottom: 1px solid ${NM.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${NM.rowHover};
  }
`;

const NMTD = styled.td`
  padding: 10px 14px;
  color: ${NM.textColor};
  font-size: 0.875rem;
  white-space: nowrap;
  vertical-align: middle;
`;

const NMSortIcon = styled.span<{ $active?: boolean; $dir?: 'asc' | 'desc' }>`
  display: inline-block;
  margin-left: 4px;
  font-size: 0.65rem;
  opacity: ${({ $active }) => ($active ? 1 : 0.35)};
  color: ${({ $active }) => ($active ? NM.navy : NM.labelColor)};
  transform: ${({ $dir }) => ($dir === 'desc' ? 'scaleY(-1)' : 'none')};
`;

// ─────────────────────────────────────────────────────────────────────────────

interface ListViewProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  bInForm?: boolean;
  globalSearch?: boolean;
  referenceList?: any[];
  // rowClickAction?: any;
  selectionMode?: string;
  referenceType?: string;
  payload?: any;
  parameters?: any;
  compositeKeys?: any;
  showDynamicFields?: boolean;
  readonlyContextList?: any;
  value: any;
  viewName?: string;
  showRecords?: boolean;
  displayAs?: string;
}

const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };

let myRows: any[];

let menuColumnId = '';
let menuColumnType = '';
let menuColumnLabel = '';

let sortColumnId: any;

const filterByColumns: any[] = [];

export default function ListView(props: ListViewProps) {
  const { getPConnect, bInForm = true } = props;
  const {
    globalSearch,
    referenceList,
    /* rowClickAction, */
    selectionMode,
    referenceType,
    payload,
    parameters,
    compositeKeys,
    showDynamicFields,
    viewName,
    readonlyContextList: selectedValues,
    value,
    displayAs
  } = props;
  let { showRecords } = props;
  const ref = useRef({}).current;
  const cosmosTableRef = useRef();
  // List component context
  const [listContext, setListContext] = useState<any>({});
  const { meta } = listContext;
  const { current: uniqueId } = useRef(crypto.randomUUID());

  useInit({
    ...props,
    setListContext,
    ref,
    showDynamicFields,
    cosmosTableRef
  });

  useClearSelectionsAndUpdateTable({ getPConnect, uniqueId, viewName });

  const thePConn = getPConnect();
  const componentConfig = thePConn.getComponentConfig();
  const resolvedConfigProps: any = thePConn.getConfigProps() as ListViewProps;

  /** By default, pyGUID is used for Data classes and pyID is for Work classes as row-id/key */
  const defRowID = referenceType === 'Case' ? 'pyID' : 'pyGUID';

  /** If compositeKeys is defined, use dynamic value, else fallback to pyID or pyGUID. */
  const rowID = compositeKeys && compositeKeys?.length === 1 ? compositeKeys[0] : defRowID;

  const [arRows, setRows] = useState<any[]>([]);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [arColumns, setColumns] = useState<any[]>([]);
  const [response, setResponse] = useState<any[]>([]);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [selectedValue, setSelectedValue] = useState(value);

  // This basically will hold the list of all current filters
  const filters = useRef({});

  // Will contain the list of columns specific for an instance
  const columnList: any = useRef([]);
  const filterPayload: any = useRef();
  // Will be sent in the dashboardFilterPayload
  let selectParam: any[] = [];

  // dataview parameters coming from the ListPage
  // This constant will also be used for parameters coming from from other components/utility functions in future
  const dataViewParameters = parameters;

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: '100%'
      },
      paper: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'grid',
        borderRadius: 16,
        padding: 20
      },
      table: {
        minWidth: 750
      },
      tableInForm: {
        minWidth: 750,
        maxHeight: 550,
        overflow: 'auto'
      },
      moreIcon: {
        verticalAlign: 'bottom'
      },
      filteredIcon: {
        verticalAlign: 'bottom'
      },
      cell: {
        whiteSpace: 'nowrap'
      },
      visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
      }
    })
  );

  const classes = useStyles();

  // Hook to clear the selections and update table in AdvancedSearch template when switching between search views
  function useClearSelectionsAndUpdateTable({ getPConnect, uniqueId, viewName }) {
    const clearSelectionsAndRefreshList = useCallback(
      ({ viewName: name, clearSelections }) => {
        if (name === viewName) {
          const { selectionMode } = getPConnect().getRawConfigProps();
          if (!selectionMode) {
            return;
          }
          if (clearSelections) {
            if (selectionMode === 'single') {
              getPConnect().getListActions().setSelectedRows({});
            } else {
              getPConnect().getListActions().clearSelectedRows();
            }
          }
        }
      },
      [getPConnect, viewName]
    );

    useEffect(() => {
      const identifier = `clear-and-update-advanced-search-selections-${uniqueId}`;
      PCore.getPubSubUtils().subscribe('update-advanced-search-selections', clearSelectionsAndRefreshList, identifier);

      return () => {
        PCore.getPubSubUtils().unsubscribe('update-advanced-search-selections', identifier);
      };
    }, [uniqueId, clearSelectionsAndRefreshList]);
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property: keyof any) => (event: React.MouseEvent<unknown>) => {
    sortColumnId = property;
    handleRequestSort(event, property);
  };

  function descendingComparator<T>(a: T, b: T, orderedBy: keyof T) {
    if (!b[orderedBy] || b[orderedBy] < a[orderedBy]) {
      return -1;
    }
    if (!a[orderedBy] || b[orderedBy] > a[orderedBy]) {
      return 1;
    }
    return 0;
  }

  type Order = 'asc' | 'desc';

  interface Comparator<T> {
    (a: T, b: T): number;
  }

  function getComparator<T, Key extends keyof T>(theOrder: Order, orderedBy: Key): Comparator<T> {
    return theOrder === 'desc' ? (a: T, b: T) => descendingComparator(a, b, orderedBy) : (a: T, b: T) => -descendingComparator(a, b, orderedBy);
  }

  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const LOAD_STEP = 10;
  const [visibleCount, setVisibleCount] = useState(LOAD_STEP);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const AssignDashObjects = ['Assign-Worklist', 'Assign-WorkBasket'];
  function getHeaderCells(colFields, fields) {
    return colFields.map((field: any, index) => {
      let theField = field.config.value.substring(field.config.value.indexOf(' ') + 1);
      if (theField.indexOf('.') === 0) {
        theField = theField.substring(1);
      }
      const colIndex = fields.findIndex(ele => ele.name === theField);
      // const displayAsLink = field.config.displayAsLink;
      const { additionalDetails = {} } = field.config;
      let shouldDisplayAsSemanticLink = additionalDetails.type === 'DISPLAY_LINK';
      // TODO: This "if" check has been added for backward compatibility, to be removed once the users are notified about the changes in view metadata of US-517164
      if (!shouldDisplayAsSemanticLink) {
        shouldDisplayAsSemanticLink = 'displayAsLink' in field.config && field.config.displayAsLink;
      }
      const headerRow: any = {};
      headerRow.id = fields[index].id;
      headerRow.type = field.type;
      headerRow.displayAsLink = shouldDisplayAsSemanticLink;
      headerRow.numeric = field.type === 'Decimal' || field.type === 'Integer' || field.type === 'Percentage' || field.type === 'Currency' || false;
      headerRow.disablePadding = false;
      headerRow.label = fields[index].label;
      if (colIndex > -1) {
        headerRow.classID = fields[colIndex].classID;
      }
      if (shouldDisplayAsSemanticLink) {
        headerRow.isAssignmentLink = AssignDashObjects.includes(headerRow.classID);
        if (field.config.value?.startsWith('@CA')) {
          headerRow.isAssociation = true;
        }
      }
      return headerRow;
    });
  }

  function getUsingData(arTableData): any[] {
    if (selectionMode === SELECTION_MODE.SINGLE || selectionMode === SELECTION_MODE.MULTI) {
      const record = arTableData?.length > 0 ? arTableData[0] : '';
      if (typeof record === 'object' && !('pyGUID' in record) && !('pyID' in record)) {
        console.error('pyGUID or pyID values are mandatory to select the required row from the list');
      }
    }
    return arTableData?.map((data: any) => {
      return data;
    });
  }

  /** Will return field from a filter expression */
  function getFieldFromFilter(filter, dateRange = false) {
    let fieldValue;
    if (dateRange) {
      fieldValue = filter?.AND[0]?.condition.lhs.field;
    } else {
      fieldValue = filter?.condition.lhs.field;
    }
    return fieldValue;
  }

  // Will be triggered when EVENT_DASHBOARD_FILTER_CHANGE fires
  function processFilterChange(data) {
    let filterId;
    let filterExpression;
    let isDateRange;
    let field;
    let dashboardFilterPayload: any = {
      query: {
        filter: {},
        select: []
      }
    };
    if (displayAs === 'advancedSearch') {
      Object.entries(data).reduce((acc, [item, value]) => {
        const { filterId, filterExpression } = value as any;
        filters.current[filterId] = filterExpression;
        return acc; // Ensure the accumulator is returned
      }, {});
    } else {
      ({ filterId, filterExpression } = data);
      filters.current[filterId] = filterExpression;
      isDateRange = data.filterExpression?.AND;
      field = getFieldFromFilter(filterExpression, isDateRange);
      selectParam = [];
      // Constructing the select parameters list (will be sent in dashboardFilterPayload)
      columnList.current.forEach(col => {
        selectParam.push({
          field: col
        });
      });

      // Checking if the triggered filter is applicable for this list
      if (data.filterExpression !== null && !(columnList.current?.length && columnList.current?.includes(field))) {
        return;
      }
    }
    // Will be AND by default but making it dynamic in case we support dynamic relational ops in future
    const relationalOp = 'AND';
    // This is a flag which will be used to reset dashboardFilterPayload in case we don't find any valid filters
    let validFilter = false;

    let index = 1;
    // Iterating over the current filters list to create filter data which will be POSTed
    for (const filterExp of Object.keys(filters.current)) {
      const filter = filters.current[filterExp];
      // If the filter is null then we can skip this iteration
      if (filter === null) {
        continue;
      }

      // Checking if the filter is of type- Date Range
      isDateRange = filter?.AND;
      field = getFieldFromFilter(filter, isDateRange);

      if (!(columnList.current.length && columnList.current.includes(field))) {
        continue;
      }
      // If we reach here that implies we've at least one valid filter, hence setting the flag
      validFilter = true;
      /** Below are the 2 cases for- Text & Date-Range filter types where we'll construct filter data which will be sent in the dashboardFilterPayload
       * In Constellation DX Components, through Repeating Structures they might be using several APIs to do it. We're doing it here
       */
      if (isDateRange) {
        const dateRelationalOp = filter?.AND ? 'AND' : 'OR';
        dashboardFilterPayload.query.filter.filterConditions = {
          ...dashboardFilterPayload.query.filter.filterConditions,
          [`T${index++}`]: { ...filter[relationalOp][0].condition },
          [`T${index++}`]: { ...filter[relationalOp][1].condition }
        };
        if (dashboardFilterPayload.query.filter.logic) {
          dashboardFilterPayload.query.filter.logic = `${dashboardFilterPayload.query.filter.logic} ${relationalOp} (T${
            index - 2
          } ${dateRelationalOp} T${index - 1})`;
        } else {
          dashboardFilterPayload.query.filter.logic = `(T${index - 2} ${relationalOp} T${index - 1})`;
        }

        dashboardFilterPayload.query.select = selectParam;
      } else {
        dashboardFilterPayload.query.filter.filterConditions = {
          ...dashboardFilterPayload.query.filter.filterConditions,
          [`T${index++}`]: { ...filter.condition, ...(filter.condition.comparator === 'CONTAINS' ? { ignoreCase: true } : {}) }
        };

        if (dashboardFilterPayload.query.filter.logic) {
          dashboardFilterPayload.query.filter.logic = `${dashboardFilterPayload.query.filter.logic} ${relationalOp} T${index - 1}`;
        } else {
          dashboardFilterPayload.query.filter.logic = `T${index - 1}`;
        }

        dashboardFilterPayload.query.select = selectParam;
      }
    }

    // Reset the dashboardFilterPayload if we end up with no valid filters for the list
    if (!validFilter) {
      dashboardFilterPayload = undefined;
    }
    filterPayload.current = dashboardFilterPayload;
    fetchDataFromServer();
  }

  // Will be triggered when EVENT_DASHBOARD_FILTER_CLEAR_ALL fires
  function processFilterClear() {
    filterPayload.current = undefined;
    fetchDataFromServer();
  }

  function fetchAllData(fields): any {
    if (displayAs === 'advancedSearch' && !showRecords) {
      return Promise.resolve({ data: null });
    }
    let query: any = null;
    if (payload) {
      query = payload.query;
    } else if (fields?.length && meta.isQueryable) {
      if (filterPayload.current) {
        query = {
          select: fields,
          filter: filterPayload.current?.query?.filter
        };
      } else {
        query = { select: fields };
      }
    } else if (filterPayload.current) {
      query = filterPayload.current?.query;
    }
    const context = getPConnect().getContextName();
    // getDataAsync isn't returning correct data for the Page(i.e. ListView within a page) case
    return !bInForm
      ? // @ts-ignore - 3rd parameter "context" should be optional in getData method
        PCore.getDataApiUtils().getData(referenceList, payload)
      : // @ts-ignore - Argument of type 'null' is not assignable to parameter of type 'object'
        PCore.getDataPageUtils().getDataAsync(referenceList, context, payload ? payload.dataViewParameters : dataViewParameters, null, query);
  }

  const buildSelect = (fieldDefs, colId, patchQueryFields = [], compositeKeys = []) => {
    const listFields: any = [];
    if (colId) {
      const field = getField(fieldDefs, colId);
      listFields.push({
        field: field.name
      });
    } else {
      // NOTE: If we ever decide to not set up all the `fieldDefs` on select, ensure that the fields
      //  corresponding to `state.groups` are set up. Needed in Client-mode grouping/pagination.
      fieldDefs.forEach(field => {
        if (!listFields.find(f => f.field === field.name)) {
          listFields.push({
            field: field.name
          });
        }
      });
      patchQueryFields.forEach(k => {
        if (!listFields.find(f => f.field === k)) {
          listFields.push({
            field: k
          });
        }
      });
    }

    compositeKeys.forEach(k => {
      if (!listFields.find(f => f.field === k)) {
        listFields.push({
          field: k
        });
      }
    });
    return listFields;
  };

  const addItemKeyInSelect = (fieldDefs, itemKey, select, compositeKeys) => {
    const elementFound = getField(fieldDefs, itemKey);

    if (
      itemKey &&
      !elementFound &&
      Array.isArray(select) &&
      !(compositeKeys !== null && compositeKeys?.length) &&
      !select.find(sel => sel.field === itemKey)
    ) {
      return [
        ...select,
        {
          field: itemKey
        }
      ];
    }

    return select;
  };

  const getField = (fieldDefs, columnId) => {
    const fieldsMap = getFieldsMap(fieldDefs);
    return fieldsMap.get(columnId);
  };

  const getFieldsMap = fieldDefs => {
    const fieldsMap = new Map();
    fieldDefs.forEach(element => {
      fieldsMap.set(element.id, element);
    });
    return fieldsMap;
  };

  async function fetchDataFromServer() {
    let bCallSetRowsColumns = true;
    const { fieldDefs, itemKey, patchQueryFields } = meta;
    let listFields = fieldDefs ? buildSelect(fieldDefs, undefined, patchQueryFields, compositeKeys) : [];
    listFields = addItemKeyInSelect(fieldDefs, itemKey, listFields, compositeKeys);
    const workListJSON = await fetchAllData(listFields);

    // this is an unresovled version of this.fields$, need unresolved, so can get the property reference
    const columnFields = componentConfig.presets[0].children[0].children;

    const tableDataResults = !bInForm ? workListJSON.data.data : workListJSON.data;

    const myColumns = getHeaderCells(columnFields, fieldDefs);

    const selectParams: any = [];

    myColumns.forEach(column => {
      selectParams.push({
        field: column.id
      });
    });

    const colList: any = [];

    selectParams.forEach(col => {
      colList.push(col.field);
    });

    columnList.current = colList;

    setResponse(tableDataResults);

    const usingDataResults = getUsingData(tableDataResults);

    // store globally, so can be searched, filtered, etc.
    myRows = usingDataResults;

    setRowsData(myRows);
    // At this point, if we have data ready to render and haven't been asked
    //  to NOT call setRows and setColumns, call them
    if (bCallSetRowsColumns) {
      setRows(myRows);
      setColumns(myColumns);
    }

    return () => {
      // Inspired by https://juliangaramendy.dev/blog/use-promise-subscription
      // The useEffect closure lets us have access to the bCallSetRowsColumns
      //  variable inside the useEffect and inside the "then" clause of the
      //  workListData promise
      //  So, if this cleanup code gets run before the promise .then is called,
      //  we can avoid calling the useState setters which would otherwise show a warning
      bCallSetRowsColumns = false;
    };
  }

  function prepareFilters(data) {
    return Object.entries(data.payload).reduce((acc, [field, value]) => {
      if (value) {
        let comparator = 'EQ';
        const filterRecord = listContext.meta.fieldDefs.filter(item => item.id === field);
        if (filterRecord?.[0]?.meta.type === 'TextInput') {
          comparator = 'CONTAINS';
        }
        acc[field] = {
          filterExpression: {
            condition: {
              lhs: {
                field
              },
              comparator,
              rhs: {
                value
              }
            }
          },
          filterId: field
        };
      }
      return acc;
    }, {});
  }

  useEffect(() => {
    if (listContext.meta) {
      const identifier = `promoted-filters-queryable-${uniqueId}`;
      fetchDataFromServer();
      setTimeout(() => {
        PCore.getPubSubUtils().subscribe(
          PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CHANGE,
          data => {
            processFilterChange(data);
          },
          `dashboard-component-${'id'}`,
          false,
          getPConnect().getContextName()
        );
        PCore.getPubSubUtils().subscribe(
          PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CLEAR_ALL,
          () => {
            filters.current = {};
            processFilterClear();
          },
          `dashboard-component-${'id'}`,
          false,
          getPConnect().getContextName()
        );
        PCore.getPubSubUtils().subscribe(
          PCore.getEvents().getTransientEvent().UPDATE_PROMOTED_FILTERS,
          data => {
            showRecords = data.showRecords;
            const filterData = prepareFilters(data);
            processFilterChange(filterData);
          },
          identifier
        );
      }, 0);

      return function cleanupSubscriptions() {
        PCore.getPubSubUtils().unsubscribe(
          PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CHANGE,
          `dashboard-component-${'id'}`,
          getPConnect().getContextName()
        );
        PCore.getPubSubUtils().unsubscribe(
          PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CLEAR_ALL,
          `dashboard-component-${'id'}`,
          getPConnect().getContextName()
        );
        PCore.getPubSubUtils().unsubscribe(PCore.getEvents().getTransientEvent().UPDATE_PROMOTED_FILTERS, identifier);
      };
    }
  }, [listContext]);

  function searchFilter(value: string, rows: any[]) {
    const cols = arColumns.map(ele => {
      return ele.id;
    });

    function filterArray(el: any): boolean {
      return Object.keys(el).some(key => {
        // only search columns that are displayed (pzInsKey and pxRefObjectClass are added and may or may not be displayed)
        if (cols.includes(key)) {
          const myVal = el[key];
          if (myVal !== null && typeof myVal !== 'undefined') {
            const strVal = String(myVal); // Ensure myVal is a string
            return strVal.toLowerCase().includes(value.toLowerCase());
          }
        }
        return false;
      });
    }

    rows = rows.filter(filterArray);

    return rows;
  }

  function _onSearch(event: any) {
    const searchValue = event.target.value;
    const filteredRows = searchFilter(searchValue, rowsData?.slice());

    setRows(filteredRows);
  }

  function showToast(message: string) {
    const theMessage = `Assignment: ${message}`;

    console.error(theMessage);
    setSnackbarMessage(message);
    setShowSnackbar(true);
  }

  function openAssignment(row) {
    const { pxRefObjectClass, pzInsKey } = row;
    const sTarget = thePConn.getContainerName();

    const options = { containerName: sTarget, channelName: '' };

    thePConn
      .getActionsApi()
      .openAssignment(pzInsKey, pxRefObjectClass, options)
      .then(() => {
        // console.log("openAssignment successful");
      })
      .catch(() => {
        showToast(`openAssignment failed!`);
      });
  }

  // function _rowClick(row: any) {
  //   // eslint-disable-next-line sonarjs/no-small-switch
  //   switch (rowClickAction) {
  //     case 'openAssignment':
  //       openAssignment(row);
  //       break;

  //     default:
  //       break;
  //   }
  // }

  function openWork(row) {
    const { pxRefObjectKey } = row;
    const pxRefObjectClass = row.pxRefObjectClass || row.pxObjClass;
    if (pxRefObjectClass !== '' && pxRefObjectKey !== '') {
      thePConn.getActionsApi().openWorkByHandle(pxRefObjectKey, pxRefObjectClass);
    }
  }

  function handleSnackbarClose(event: React.SyntheticEvent<any> | Event, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  }

  function _menuClick(event, columnId: string, columnType: string, label: string) {
    menuColumnId = columnId;
    menuColumnType = columnType;
    menuColumnLabel = label;

    setAnchorEl(event.currentTarget);
  }

  function _menuClose() {
    setAnchorEl(null);
  }

  const [filterBy, setFilterBy] = useState<string>();
  const [containsDateOrTime, setContainsDateOrTime] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('string');

  const [displayDialogFilterName, setDisplayDialogFilterName] = useState<string>('');
  const [displayDialogContainsFilter, setDisplayDialogContainsFilter] = useState<string>('contains');
  const [displayDialogContainsValue, setDisplayDialogContainsValue] = useState<string>('');
  const [displayDialogDateFilter, setDisplayDialogDateFilter] = useState<string>('notequal');
  const [displayDialogDateValue, setDisplayDialogDateValue] = useState<string>('');

  function _filterMenu() {
    setAnchorEl(null);

    let bFound = false;

    for (const filterObj of filterByColumns) {
      if (filterObj.ref === menuColumnId) {
        setFilterBy(menuColumnLabel);
        if (filterObj.type === 'Date' || filterObj.type === 'DateTime' || filterObj.type === 'Time') {
          setContainsDateOrTime(true);
          setFilterType(filterObj.type);
          setDisplayDialogDateFilter(filterObj.containsFilter);
          setDisplayDialogDateValue(filterObj.containsFilterValue);
        } else {
          setContainsDateOrTime(false);
          setFilterType('string');
          setDisplayDialogContainsFilter(filterObj.containsFilter);
          setDisplayDialogContainsValue(filterObj.containsFilterValue);
        }
        bFound = true;
        break;
      }
    }

    if (!bFound) {
      setFilterBy(menuColumnLabel);
      setDisplayDialogFilterName(menuColumnId);
      setDisplayDialogContainsValue('');

      switch (menuColumnType) {
        case 'Date':
        case 'DateTime':
        case 'Time':
          setContainsDateOrTime(true);
          setFilterType(menuColumnType);
          break;
        default:
          setContainsDateOrTime(false);
          setFilterType('string');
          break;
      }
    }

    // open dialog
    setOpen(true);
  }

  function _groupMenu() {
    setAnchorEl(null);
  }

  function _closeDialog() {
    setOpen(false);
  }

  function _showFilteredIcon(columnId) {
    for (const filterObj of filterByColumns) {
      if (filterObj.ref === columnId) {
        if (filterObj.containsFilterValue !== '') {
          return true;
        }
        return false;
      }
    }

    return false;
  }

  function updateFilterWithInfo() {
    let bFound = false;
    for (const filterObj of filterByColumns) {
      if (filterObj.ref === menuColumnId) {
        filterObj.type = filterType;
        if (containsDateOrTime) {
          filterObj.containsFilter = displayDialogDateFilter;
          filterObj.containsFilterValue = displayDialogDateValue;
        } else {
          filterObj.containsFilter = displayDialogContainsFilter;
          filterObj.containsFilterValue = displayDialogContainsValue;
        }
        bFound = true;
        break;
      }
    }

    if (!bFound) {
      // add in
      const filterObj: any = {};
      filterObj.ref = menuColumnId;
      filterObj.type = filterType;
      if (containsDateOrTime) {
        filterObj.containsFilter = displayDialogDateFilter;
        filterObj.containsFilterValue = displayDialogDateValue;
      } else {
        filterObj.containsFilter = displayDialogContainsFilter;
        filterObj.containsFilterValue = displayDialogContainsValue;
      }

      filterByColumns.push(filterObj);
    }
  }

  function filterSortGroupBy() {
    // get original data set
    let theData = myRows.slice();

    // last filter config data is global
    theData = theData.filter(filterData(filterByColumns));

    // move data to array and then sort
    setRows(theData);
    createSortHandler(sortColumnId);
  }

  function _dialogContainsFilter(event) {
    // dialogContainsFilter = event.target.value;
    setDisplayDialogContainsFilter(event.target.value);
  }

  function _dialogContainsValue(event) {
    // dialogContainsValue = event.target.value;
    setDisplayDialogContainsValue(event.target.value);
  }

  function _dialogDateFilter(event) {
    // dialogDateFilter = event.target.value;
    setDisplayDialogDateFilter(event.target.value);
  }

  function _dialogDateValue(event) {
    setDisplayDialogDateValue(event.target.value);
  }

  function _submitFilter() {
    updateFilterWithInfo();
    filterSortGroupBy();

    setOpen(false);
  }

  function _showButton(name, row) {
    let bReturn = false;
    const { pxRefObjectClass, pzInsKey, pxRefObjectKey } = row;
    switch (name) {
      case 'pxTaskLabel':
        if (pxRefObjectClass !== '' && pzInsKey !== '') {
          bReturn = true;
        }
        break;

      case 'pxRefObjectInsName':
        if (pxRefObjectClass !== '' && pxRefObjectKey !== '') {
          bReturn = true;
        }
        break;

      default:
        break;
    }

    return bReturn;
  }

  function _listViewClick(row, column) {
    const name = column.id;
    if (column.displayAsLink) {
      const { pxObjClass } = row;
      let { pzInsKey } = row;
      if (column.isAssociation) {
        const associationCategory = name.split(':')[0];
        pzInsKey = row[`${associationCategory}:pzInsKey`];
      }
      if (column.isAssignmentLink) {
        thePConn.getActionsApi().openAssignment(pzInsKey, pxObjClass, {
          containerName: 'primary',
          channelName: ''
        });
      } else {
        thePConn.getActionsApi().openWorkByHandle(pzInsKey, pxObjClass);
      }
    } else {
      switch (name) {
        case 'pxTaskLabel':
          openAssignment(row);
          break;

        case 'pxRefObjectInsName':
          openWork(row);
          break;

        default:
          break;
      }
    }
  }

  function _listTitle() {
    const defaultTitle = 'List';
    let title = resolvedConfigProps.title || resolvedConfigProps?.label || defaultTitle;
    const inheritedProps = resolvedConfigProps?.inheritedProps;

    // Let any title in resolvedConfigProps that isn't the default take precedence
    //  but only look in inheritedProps if they exist
    if (title === defaultTitle && inheritedProps) {
      for (const inheritedProp of inheritedProps) {
        if (inheritedProp?.prop === 'label') {
          title = inheritedProp?.value;
          break;
        }
      }
    }

    return title;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const reqObj = {};
    if (compositeKeys?.length > 1) {
      const index = response.findIndex(element => element[rowID] === value);
      const selectedRow = response[index];
      compositeKeys.forEach(element => {
        reqObj[element] = selectedRow[element];
      });
    } else {
      reqObj[rowID] = value;
    }
    getPConnect()?.getListActions?.()?.setSelectedRows([reqObj]);
    setSelectedValue(value);
  };

  const onCheckboxClick = event => {
    const value = event?.target?.value;
    const checked = event?.target?.checked;
    const reqObj: any = {};
    if (compositeKeys?.length > 1) {
      const index = response.findIndex(element => element[rowID] === value);
      const selectedRow = response[index];
      compositeKeys.forEach(element => {
        reqObj[element] = selectedRow[element];
      });
      reqObj.$selected = checked;
    } else {
      reqObj[rowID] = value;
      reqObj.$selected = checked;
    }
    getPConnect()?.getListActions()?.setSelectedRows([reqObj]);
  };

  const processColumnValue = (column, value) => {
    let val;
    const type = column.type;
    let theDateFormatInfo;
    let theFormat;
    let theCurrencyOptions;
    switch (type) {
      case 'Date':
      case 'DateTime':
        theDateFormatInfo = getDateFormatInfo();
        theFormat = type === 'DateTime' ? `${theDateFormatInfo.dateFormatStringLong} hh:mm a` : theDateFormatInfo.dateFormatStringLong;
        val = format(value, column.type, { format: theFormat });
        break;

      case 'Currency':
        theCurrencyOptions = getCurrencyOptions(PCore?.getEnvironmentInfo()?.getLocale() as string);
        val = format(value, column.type, theCurrencyOptions);
        break;

      default:
        val = column.format && typeof value === 'number' ? column.format(value) : value || '---';
    }
    return val;
  };

  return (
    <>
      {arColumns && arColumns.length > 0 && (
        <NMTableWrapper>
          {!bInForm ? (
            <div style={{ overflowX: 'auto', maxHeight: 550 }}>
              <NMStyledTable aria-label='list view table'>
                <NMTHead>
                  <tr>
                    {arColumns.map(column => (
                      <NMTH key={column.id} onClick={createSortHandler(column.id)}>
                        {column.label}
                        {_showFilteredIcon(column.id) && <FilterListIcon style={{ fontSize: '0.85rem', marginLeft: 4, verticalAlign: 'middle' }} />}
                        <NMSortIcon $active={orderBy === column.id} $dir={orderBy === column.id ? order : 'asc'}>
                          ▲
                        </NMSortIcon>
                        <MoreIcon
                          style={{ fontSize: '1rem', verticalAlign: 'middle', marginLeft: 4, color: NM.labelColor }}
                          onClick={event => {
                            event.stopPropagation();
                            _menuClick(event, column.id, column.type, column.label);
                          }}
                        />
                        {orderBy === column.id && (
                          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </span>
                        )}
                      </NMTH>
                    ))}
                  </tr>
                </NMTHead>
                <NMTBody>
                  {arRows &&
                    stableSort(arRows, getComparator(order, orderBy))
                      .slice(0, visibleCount)
                      .map(row => (
                        <NMTR key={row.pxRefObjectInsName || row.pyID}>
                          {arColumns.map(column => {
                            const value = row[column.id];
                            return (
                              <NMTD key={column.id}>
                                {_showButton(column.id, row) || column.displayAsLink ? (
                                  <button
                                    onClick={() => _listViewClick(row, column)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: 0,
                                      color: NM.focusBlue,
                                      cursor: 'pointer',
                                      fontFamily: NM.font,
                                      fontSize: '0.875rem',
                                      textDecoration: 'underline'
                                    }}
                                  >
                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                  </button>
                                ) : (
                                  <>{column.format && typeof value === 'number' ? column.format(value) : value || '---'}</>
                                )}
                              </NMTD>
                            );
                          })}
                        </NMTR>
                      ))}
                </NMTBody>
              </NMStyledTable>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <NMStyledTable>
                <NMTHead>
                  <tr>
                    {(selectionMode === SELECTION_MODE.SINGLE || selectionMode === SELECTION_MODE.MULTI) && <NMTH style={{ width: 40 }} />}
                    {arColumns.map(column => (
                      <NMTH key={column.id} onClick={createSortHandler(column.id)}>
                        {column.label}
                        <NMSortIcon $active={orderBy === column.id} $dir={orderBy === column.id ? order : 'asc'}>
                          ▲
                        </NMSortIcon>
                        {orderBy === column.id && (
                          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </span>
                        )}
                      </NMTH>
                    ))}
                  </tr>
                </NMTHead>
                <NMTBody>
                  {arRows &&
                    arRows.length > 0 &&
                    stableSort(arRows, getComparator(order, orderBy))
                      .slice(0, visibleCount)
                      .map(row => (
                        <NMTR key={row[rowID]}>
                          {selectionMode === SELECTION_MODE.SINGLE && (
                            <NMTD style={{ width: 40, paddingRight: 0 }}>
                              <Radio
                                onChange={handleChange}
                                value={row[rowID]}
                                name='radio-buttons'
                                inputProps={{ 'aria-label': 'A' }}
                                checked={selectedValue === row[rowID]}
                              />
                            </NMTD>
                          )}
                          {selectionMode === SELECTION_MODE.MULTI && (
                            <NMTD style={{ width: 40, paddingRight: 0 }}>
                              <Checkbox
                                onChange={onCheckboxClick}
                                checked={selectedValues.some(selectedValue => selectedValue[rowID] === row[rowID])}
                                value={row[rowID]}
                              />
                            </NMTD>
                          )}
                          {arColumns.map(column => {
                            const value = row[column.id];
                            return <NMTD key={column.id}>{processColumnValue(column, value)}</NMTD>;
                          })}
                        </NMTR>
                      ))}
                </NMTBody>
              </NMStyledTable>
              {(!arRows || arRows.length === 0) && (
                <div className='no-records'>{getGenericFieldsLocalizedValue('COSMOSFIELDS.lists', 'No records found.')}</div>
              )}
            </div>
          )}
          {arRows && arRows.length > visibleCount && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.75rem 0', borderTop: `1px solid ${NM.border}` }}>
              <button
                onClick={() => setVisibleCount(c => c + LOAD_STEP)}
                style={{
                  fontFamily: NM.font,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: NM.navy,
                  background: 'transparent',
                  border: `1px solid ${NM.border}`,
                  borderRadius: '4px',
                  padding: '0.4rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, background 0.15s ease'
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.borderColor = NM.navy;
                  (e.target as HTMLButtonElement).style.background = NM.rowHover;
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.borderColor = NM.border;
                  (e.target as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                Load more ({Math.min(LOAD_STEP, arRows.length - visibleCount)} of {arRows.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </NMTableWrapper>
      )}
      <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={_menuClose}>
        <MenuItem onClick={_filterMenu}>
          <FilterListIcon /> Filter
        </MenuItem>
        <MenuItem onClick={_groupMenu}>
          <SubjectIcon /> Group
        </MenuItem>
      </Menu>
      <Dialog open={open} onClose={_closeDialog} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Filter: {filterBy}</DialogTitle>
        <DialogContent>
          {containsDateOrTime ? (
            <>
              <Select variant='standard' value={displayDialogDateFilter} onChange={_dialogDateFilter} fullWidth>
                <MenuItem value='notequal'>is not equal to</MenuItem>
                <MenuItem value='after'>after</MenuItem>
                <MenuItem value='before'>before</MenuItem>
                <MenuItem value='null'>is null</MenuItem>
                <MenuItem value='notnull'>is not null</MenuItem>
              </Select>
              {filterType === 'Date' && (
                <TextField
                  variant='standard'
                  autoFocus
                  margin='dense'
                  id='containsFilter'
                  type='date'
                  fullWidth
                  value={displayDialogDateValue}
                  onChange={_dialogDateValue}
                />
              )}
              {filterType === 'DateTime' && (
                <TextField
                  variant='standard'
                  autoFocus
                  margin='dense'
                  id='containsFilter'
                  type='datetime-local'
                  fullWidth
                  value={displayDialogDateValue}
                  onChange={_dialogDateValue}
                />
              )}
              {filterType === 'Time' && (
                <TextField
                  variant='standard'
                  autoFocus
                  margin='dense'
                  id='containsFilter'
                  type='time'
                  fullWidth
                  value={displayDialogDateValue}
                  onChange={_dialogDateValue}
                />
              )}
            </>
          ) : (
            <>
              <Select variant='standard' fullWidth onChange={_dialogContainsFilter} value={displayDialogContainsFilter}>
                <MenuItem value='contains'>Contains</MenuItem>
                <MenuItem value='equals'>Equals</MenuItem>
                <MenuItem value='startswith'>Starts with</MenuItem>
              </Select>
              <TextField
                variant='standard'
                autoFocus
                margin='dense'
                id='containsFilter'
                type='text'
                fullWidth
                value={displayDialogContainsValue}
                onChange={_dialogContainsValue}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={_closeDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={_submitFilter} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      />
    </>
  );
}

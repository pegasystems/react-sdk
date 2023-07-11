/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Utils } from '../../../helpers/utils';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import MoreIcon from '@material-ui/icons/MoreVert';
import FilterListIcon from '@material-ui/icons/FilterList';
import SubjectIcon from '@material-ui/icons/Subject';
import SearcIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Radio } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { filterData } from '../../templates/SimpleTable/helpers';
import './ListView.css';

const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };
declare const PCore: any;

let myRows: Array<any>;
let myDisplayColmnnList: Array<any>;

let menuColumnId = '';
let menuColumnType = '';
let menuColumnLabel = '';

let sortColumnId: any;

// let dialogContainsFilter: string = "contains";
// let dialogContainsValue: string = "";
// let dialogDateFilter: string = "notequal";
// let dialogDateValue: string = "";

const filterByColumns: Array<any> = [];

export default function ListView(props) {
  const { getPConnect, bInForm } = props;
  const { globalSearch, presets, referenceList, rowClickAction, selectionMode, referenceType, payload, parameters, compositeKeys } = props;

  const thePConn = getPConnect();
  const componentConfig = thePConn.getComponentConfig();
  const resolvedConfigProps = thePConn.getConfigProps();

  /** By default, pyGUID is used for Data classes and pyID is for Work classes as row-id/key */
  const defRowID = referenceType === 'Case' ? 'pyID' : 'pyGUID';

  /** If compositeKeys is defined, use dynamic value, else fallback to pyID or pyGUID. */
  const rowID = compositeKeys && compositeKeys[0] ? compositeKeys[0] : defRowID;

  const [arRows, setRows] = useState<Array<any>>([]);
  const [arColumns, setColumns] = useState<Array<any>>([]);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [selectedValue, setSelectedValue] = useState('');

  // This basically will hold the list of all current filters
  const filters = useRef({});

  // Will contain the list of columns specific for an instance
  let columnList: any = useRef([]);
  let dashboardFilterPayload: any ;
  // Will be sent in the dashboardFilterPayload
  let selectParam: Array<any> = [];

  // dataview parameters coming from the ListPage
  // This constant will also be used for parameters coming from from other components/utility fnctions in future
  const dataViewParameters = parameters;

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: '100%'
      },
      paper: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
      },
      search: {
        padding: '5px 5px'
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
      },
      title: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1)
      }
    })
  );

  const classes = useStyles();

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
    if (b[orderedBy] < a[orderedBy]) {
      return -1;
    }
    if (b[orderedBy] > a[orderedBy]) {
      return 1;
    }
    return 0;
  }

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof any>(
    theOrder: Order,
    orderedBy: Key
    // eslint-disable-next-line no-unused-vars
  ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return theOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, orderedBy)
      : (a, b) => -descendingComparator(a, b, orderedBy);
  }

  // eslint-disable-next-line no-unused-vars
  function stableSort<T>(array: Array<T>, comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow, no-shadow
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // function getDisplayColumns(fields = []) {
  //   let arReturn = fields.map(( field: any, colIndex) => {
  //     let theField = field.config.value.substring(field.config.value.indexOf(" ")+1);
  //     if (theField.indexOf(".") == 0) {
  //       theField = theField.substring(1);
  //     }

  //     return theField;
  //   });
  //   return arReturn;

  // }

  function getHeaderCells(colFields, fields) {
    const arReturn = colFields.map((field: any, colIndex) => {
      let theField = field.config.value.substring(field.config.value.indexOf(' ') + 1);
      if (theField.indexOf('.') === 0) {
        theField = theField.substring(1);
      }

      const headerRow: any = {};
      headerRow.id = theField;
      headerRow.type = field.type;
      headerRow.numeric =
        field.type === 'Decimal' ||
        field.type === 'Integer' ||
        field.type === 'Percentage' ||
        field.type === 'Currency' ||
        false;
      headerRow.disablePadding = false;
      headerRow.label = fields[colIndex].config.label;

      return headerRow;
    });
    return arReturn;
  }

  function updateFields(arFields, theColumns): Array<any> {
    const arReturn = arFields;
    arFields.forEach((field, index) => {
      arReturn[index].config.name = theColumns[index].id;
    });

    return arReturn;
  }

  function getUsingData(arTableData, theColumns): Array<any> {
    if (selectionMode === SELECTION_MODE.SINGLE || selectionMode === SELECTION_MODE.MULTI) {
      const record = arTableData?.length > 0 ? arTableData[0] : '';
      if (typeof record === 'object' && !('pyGUID' in record) && !('pyID' in record)) {
        // eslint-disable-next-line no-console
        console.error('pyGUID or pyID values are mandatory to select the required row from the list');
      }
    }
    const arReturn = arTableData?.map((data: any) => {
      const row: any = {};

      theColumns.forEach(col => {
        row[col.id] = data[col.id];
      });
      row[rowID] = data[rowID];
      // for (const field of theColumns) {
      //   row[field.id] = data[field.id];
      // }

      // add in pxRefObjectClass and pzInsKey
      if (data['pxRefObjectClass']) {
        row['pxRefObjectClass'] = data['pxRefObjectClass'];
      }

      if (data['pzInsKey']) {
        row['pzInsKey'] = data['pzInsKey'];
      }

      return row;
    });

    return arReturn;
  }

  function updateData(listData: Array<any>, fieldData: Array<any>): Array<any> {
    const returnList: Array<any> = new Array<any>();
    listData?.forEach(row => {
      // copy
      const rowData = JSON.parse(JSON.stringify(row));

      fieldData.forEach(field => {
        const config = field.config;
        let fieldName;
        let formattedDate;
        let myFormat;

        switch (field.type) {
          case 'Date':
            fieldName = config.name;
            myFormat = config.formatter;
            if (!myFormat) {
              myFormat = 'Date';
            }
            if(rowData[fieldName]){
              formattedDate = Utils.generateDate(rowData[fieldName], myFormat);
            }

            rowData[fieldName] = formattedDate;
            break;

          case 'DateTime':
            fieldName = config.name;
            myFormat = config.formatter;
            if (!myFormat) {
              myFormat = 'DateTime-Long';
            }
            formattedDate = Utils.generateDateTime(rowData[fieldName], myFormat);

            rowData[fieldName] = formattedDate;
            break;

          default:
            break;
        }
      });

      returnList.push(rowData);
    });

    return returnList;
  }

  function getMyColumnList(arCols: Array<any>): Array<string> {
    const myColList: Array<string> = [];

    arCols.forEach(col => {
      myColList.push(col.id);
    });

    // for (const col of arCols) {
    //   myColList.push(col.id);
    // }

    return myColList;
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
    const { filterId, filterExpression } = data;
    dashboardFilterPayload = {
      query: {
        filter: {},
        select: []
      }
    };

    filters.current[filterId] = filterExpression;
    // eslint-disable-next-line no-unneeded-ternary
    let isDateRange = data.filterExpression?.AND ? true : false;
    // Will be AND by default but making it dynamic in case we support dynamic relational ops in future
    const relationalOp = 'AND';

    let field = getFieldFromFilter(filterExpression, isDateRange);
    selectParam = [];
    // Constructing the select parameters list( will be sent in dashboardFilterPayload)
    columnList.forEach(col => {
      selectParam.push({
        field: col
      });
    });

    // Checking if the triggered filter is applicable for this list
    if (data.filterExpression !== null && !(columnList.length && columnList.includes(field))) {
      return;
    }
    // This is a flag which will be used to reset dashboardFilterPayload in case we don't find any valid filters
    let validFilter = false;

    let index = 1;
    // Iterating over the current filters list to create filter data which will be POSTed
    for (const filterExp in filters.current) {
      const filter = filters.current[filterExp];
      // If the filter is null then we can skip this iteration
      if (filter === null) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Checking if the filter is of type- Date Range
      // eslint-disable-next-line no-unneeded-ternary
      isDateRange = filter?.AND ? true : false;
      field = getFieldFromFilter(filter, isDateRange);

      if (!(columnList.length && columnList.includes(field))) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // If we reach here that implies we've at least one valid filter, hence setting the flag
      validFilter = true;
      /** Below are the 2 cases for- Text & Date-Range filter types where we'll construct filter data which will be sent in the dashboardFilterPayload
       * In Nebula, through Repeating Structures they might be using several APIs to do it, we're doing it here
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
          [`T${index++}`]: { ...filter.condition, ignoreCase: true }
        };

        if (dashboardFilterPayload.query.filter.logic) {
          dashboardFilterPayload.query.filter.logic = `${dashboardFilterPayload.query.filter.logic} ${relationalOp} T${
            index - 1
          }`;
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

    fetchDataFromServer();
  }

  // Will be triggered when EVENT_DASHBOARD_FILTER_CLEAR_ALL fires
  function processFilterClear() {
    dashboardFilterPayload = undefined;
    fetchDataFromServer();
  }

  useEffect(() => {
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
    }, 0);
  }, []);

  function fetchAllData() {
    const context = getPConnect().getContextName();
    return PCore.getDataPageUtils().getDataAsync(
      referenceList,
      context,
      payload ? payload.dataViewParameters : dataViewParameters,
      null,
      payload ? payload.query : dashboardFilterPayload && dashboardFilterPayload.query
    );
  }

  async function fetchDataFromServer() {
    let bCallSetRowsColumns = true;
    const workListJSON = await fetchAllData();

    // don't update these fields until we return from promise
    let fields = presets[0].children[0].children;

    // this is an unresovled version of this.fields$, need unresolved, so can get the property reference
    const columnFields = componentConfig.presets[0].children[0].children;

    const tableDataResults = workListJSON['data'];

    const myColumns = getHeaderCells(columnFields, fields);

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

    columnList = colList;

    fields = updateFields(fields, myColumns);

    const usingDataResults = getUsingData(tableDataResults, myColumns);

    // store globally, so can be searched, filtered, etc.
    myRows = updateData(usingDataResults, fields);
    myDisplayColmnnList = getMyColumnList(myColumns);

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

  useEffect(() => {
    fetchDataFromServer();
  }, []);

  function searchFilter(value: string, rows: Array<any>) {
    function filterArray(el: any): boolean {
      const bReturn = false;
      for (const key in el) {
        // only search columsn that are displayed (pzInsKey and pxRefObjectClass are added and may or may not be displayed)
        if (myDisplayColmnnList.includes(key)) {
          let myVal = el[key];
          if (myVal !== null) {
            if (typeof myVal !== 'string') {
              myVal = myVal.toString();
            }
            if (myVal.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
              return true;
            }
          }
        }
      }

      return bReturn;
    }

    rows = rows.filter(filterArray);

    return rows;
  }

  function _onSearch(event: any) {
    const searchValue = event.target.value;

    const filteredRows = searchFilter(searchValue, myRows.slice());

    setRows(filteredRows);
  }

  function showToast(message: string) {
    const theMessage = `Assignment: ${message}`;
    // eslint-disable-next-line no-console
    console.error(theMessage);
    setSnackbarMessage(message);
    setShowSnackbar(true);
  }

  function openAssignment(row) {
    const { pxRefObjectClass, pzInsKey } = row;
    const sTarget = thePConn.getContainerName();

    const options = { containerName: sTarget };

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

  function _rowClick(row: any) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (rowClickAction) {
      case 'openAssignment':
        openAssignment(row);
        break;

      default:
        break;
    }
  }

  function openWork(row) {
    const { pxRefObjectClass, pxRefObjectKey } = row;

    if (pxRefObjectClass !== '' && pxRefObjectKey !== '') {
      thePConn.getActionsApi().openWorkByHandle(pxRefObjectKey, pxRefObjectClass);
    }
  }

  function handleSnackbarClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [displayDialogFilterName, setDisplayDialogFilterName] = useState<string>('');
  const [displayDialogContainsFilter, setDisplayDialogContainsFilter] =
    useState<string>('contains');
  const [displayDialogContainsValue, setDisplayDialogContainsValue] = useState<string>('');
  const [displayDialogDateFilter, setDisplayDialogDateFilter] = useState<string>('notequal');
  const [displayDialogDateValue, setDisplayDialogDateValue] = useState<string>('');

  function _filterMenu() {
    setAnchorEl(null);

    let bFound = false;

    for (const filterObj of filterByColumns) {
      if (filterObj.ref === menuColumnId) {
        setFilterBy(menuColumnLabel);
        if (
          filterObj.type === 'Date' ||
          filterObj.type === 'DateTime' ||
          filterObj.type === 'Time'
        ) {
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
      if (filterObj['ref'] === columnId) {
        // eslint-disable-next-line sonarjs/prefer-single-boolean-return
        if (filterObj['containsFilterValue'] !== '') {
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
      if (filterObj['ref'] === menuColumnId) {
        filterObj['type'] = filterType;
        if (containsDateOrTime) {
          filterObj['containsFilter'] = displayDialogDateFilter;
          filterObj['containsFilterValue'] = displayDialogDateValue;
        } else {
          filterObj['containsFilter'] = displayDialogContainsFilter;
          filterObj['containsFilterValue'] = displayDialogContainsValue;
        }
        bFound = true;
        break;
      }
    }

    if (!bFound) {
      // add in
      const filterObj: any = {};
      filterObj.ref = menuColumnId;
      filterObj['type'] = filterType;
      if (containsDateOrTime) {
        filterObj['containsFilter'] = displayDialogDateFilter;
        filterObj['containsFilterValue'] = displayDialogDateValue;
      } else {
        filterObj['containsFilter'] = displayDialogContainsFilter;
        filterObj['containsFilterValue'] = displayDialogContainsValue;
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

    // grouping here

    // let reGroupData = this.addGroups(theData, this.groupByColumns$);

    // this.repeatList$.data = [];
    // this.repeatList$.data.push( ...reGroupData);

    // if (this.searchFilter && this.searchFilter != "") {
    //   this.repeatList$.filter = this.searchFilter;
    // }
    // else {
    //   this.perfFilter = performance.now().toString();
    //   this.repeatList$.filter = this.perfFilter;
    // }
    // this.repeatList$.filter = "";

    // if (this.repeatList$.paginator) {
    //   this.repeatList$.paginator.firstPage();
    // }
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

  function _listViewClick(name, row) {
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

  function _listTitle() {
    const defaultTitle = 'List';
    let title = resolvedConfigProps.title ? resolvedConfigProps.title : defaultTitle;
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
    getPConnect()
      ?.getListActions?.()
      ?.setSelectedRows([{ [rowID]: value }]);
    setSelectedValue(value);
  };

  const onCheckboxClick = event => {
    const value = event?.target?.value;
    const checked = event?.target?.checked;
    getPConnect()
      ?.getListActions()
      ?.setSelectedRows([{ [rowID]: value, $selected: checked }]);
  };

  return (
    <>
      {arColumns && arColumns.length > 0 && (
        <Paper className={classes.paper}>
          <Typography className={classes.title} variant='h6' color='textPrimary' gutterBottom>
            {_listTitle()}
          </Typography>
          {globalSearch && (
            <Grid container spacing={1} alignItems='flex-end' className={classes.search}>
              <Grid item>
                <SearcIcon />
              </Grid>
              <Grid item>
                <TextField
                  label='Search'
                  fullWidth
                  variant='outlined'
                  placeholder=''
                  size='small'
                  onChange={_onSearch}
                />
              </Grid>
            </Grid>
          )}
          <>
            {bInForm ? (
              <TableContainer className={classes.tableInForm}>
                <Table stickyHeader aria-label='sticky table'>
                  <TableHead>
                    <TableRow>
                      {arColumns.map(column => {
                        return (
                          <TableCell
                            className={classes.cell}
                            key={column.id}
                            sortDirection={orderBy === column.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === column.id}
                              direction={orderBy === column.id ? order : 'asc'}
                              onClick={createSortHandler(column.id)}
                            >
                              {column.label}
                              {_showFilteredIcon(column.id) && (
                                <FilterListIcon className={classes.filteredIcon} />
                              )}
                              {orderBy === column.id ? (
                                <span className={classes.visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                              ) : null}
                            </TableSortLabel>
                            <MoreIcon
                              className={classes.moreIcon}
                              onClick={event => {
                                _menuClick(event, column.id, column.type, column.label);
                              }}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stableSort(arRows, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(row => {
                        return (
                          <TableRow
                            key={row.pxRefObjectInsName || row.pyID}
                            onClick={() => {
                              _rowClick(row);
                            }}
                          >
                            {arColumns.map(column => {
                              const value = row[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  className={classes.cell}
                                >
                                  {_showButton(column.id, row) ? (
                                    <Link
                                      component='button'
                                      onClick={() => {
                                        _listViewClick(column.id, row);
                                      }}
                                    >
                                      {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </Link>
                                  ) : (
                                    <>
                                      {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {(selectionMode === SELECTION_MODE.SINGLE ||
                        selectionMode === SELECTION_MODE.MULTI) && <TableCell></TableCell>}
                      {arColumns.map(column => {
                        return (
                          <TableCell
                            className={classes.cell}
                            key={column.id}
                            sortDirection={orderBy === column.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === column.id}
                              direction={orderBy === column.id ? order : 'asc'}
                              onClick={createSortHandler(column.id)}
                            >
                              {column.label}
                              {orderBy === column.id ? (
                                <span className={classes.visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {arRows &&
                      arRows.length > 0 &&
                      stableSort(arRows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(row => {
                          return (
                            <TableRow
                              key={row[rowID]}
                              onClick={() => {
                                _rowClick(row);
                              }}
                            >
                              {selectionMode === SELECTION_MODE.SINGLE && (
                                <TableCell>
                                  <Radio
                                    onChange={handleChange}
                                    value={row[rowID]}
                                    name='radio-buttons'
                                    inputProps={{ 'aria-label': 'A' }}
                                    checked={selectedValue === row[rowID]}
                                  ></Radio>
                                </TableCell>
                              )}
                              {selectionMode === SELECTION_MODE.MULTI && (
                                <TableCell>
                                  <Checkbox
                                    onChange={onCheckboxClick}
                                    value={row[rowID]}
                                  ></Checkbox>
                                </TableCell>
                              )}
                              {arColumns.map(column => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    className={classes.cell}
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format && typeof value === 'number'
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
                {arRows && arRows.length === 0 && (
                  <div className='no-records'>No records found.</div>
                )}
              </TableContainer>
            )}
          </>
          {arRows && arRows.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component='div'
              count={arRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      )}
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={_menuClose}
      >
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
              <Select value={displayDialogDateFilter} onChange={_dialogDateFilter} fullWidth>
                <MenuItem value='notequal'>is not equal to</MenuItem>
                <MenuItem value='after'>after</MenuItem>
                <MenuItem value='before'>before</MenuItem>
                <MenuItem value='null'>is null</MenuItem>
                <MenuItem value='notnull'>is not null</MenuItem>
              </Select>
              {filterType === 'Date' && (
                <TextField
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
              <Select
                fullWidth
                onChange={_dialogContainsFilter}
                value={displayDialogContainsFilter}
              >
                <MenuItem value='contains'>Contains</MenuItem>
                <MenuItem value='equals'>Equals</MenuItem>
                <MenuItem value='startswith'>Starts with</MenuItem>
              </Select>
              <TextField
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

ListView.defaultProps = {
  // parameters: undefined
};

ListView.propTypes = {
  getPConnect: PropTypes.func.isRequired
  // parameters: PropTypes.objectOf(PropTypes.any)
};

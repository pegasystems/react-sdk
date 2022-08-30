/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { buildFieldsForTable } from './helpers';
import { getDataPage } from '../../../helpers/data_page';
import Link from '@material-ui/core/Link';
import { getReferenceList } from '../../../helpers/field-group-utils';
import { Utils } from '../../../helpers/utils';
import { createElement } from 'react';
import createPConnectComponent from '../../../../src/bridge/react_pconnect';

const useStyles = makeStyles((/* theme */) => ({
  label: {
    margin: '8px 16px'
  },
  header: {
    background: "#f5f5f5"
  },
  tableCell: {
    borderRight: "1px solid lightgray",
    padding: "8px"
  },
}));

declare const PCore: any;

export default function SimpleTableManual(props) {
  const classes = useStyles();
  const {
    getPConnect,
    referenceList = [], // if referenceList not in configProps$, default to empy list
    children,
    renderMode,
    presets,
    label,
    dataPageName,
    contextClass,
    hideAddRow,
    hideDeleteRow
  } = props;
  const pConn = getPConnect();
  const [rowData, setRowData] = useState([]);
  const [elements, setElementsData] = useState([]);

  // Getting current context
  const context = getPConnect().getContextName();
  const resolvedList = getReferenceList(pConn);
  const pageReference = `${pConn.getPageReference()}${resolvedList}`;
  pConn.setReferenceList(resolvedList);
  const menuIconOverride$ = Utils.getImageSrc('trash', PCore.getAssetLoader().getStaticServerUrl());

  const resolvedFields = children?.[0]?.children || presets?.[0].children?.[0].children;
  // NOTE: props has each child.config with datasource and value undefined
  //  but getRawMetadata() has each child.config with datasource and value showing their unresolved values (ex: "@P thePropName")
  //  We need to use the prop name as the "glue" to tie the table dataSource, displayColumns and data together.
  //  So, in the code below, we'll use the unresolved config.value (but replacing the space with an underscore to keep things happy)
  const rawMetadata = getPConnect().getRawMetadata();

  // get raw config since @P and other annotations are processed and don't appear in the resolved config.
  //  Destructure "raw" children into array var: "rawFields"
  //  NOTE: when config.listType == "associated", the property can be found in either
  //    config.value (ex: "@P .DeclarantChoice") or
  //    config.datasource (ex: "@ASSOCIATED .DeclarantChoice")
  //  Neither of these appear in the resolved props

  const rawConfig = rawMetadata?.config;
  const rawFields = rawConfig?.children?.[0]?.children || rawConfig?.presets?.[0].children?.[0]?.children;

  const readOnlyMode = renderMode === 'ReadOnly';
  const editableMode = renderMode === 'Editable';
  const showAddRowButton = !readOnlyMode && !hideAddRow;
  const showDeleteButton = !readOnlyMode && !hideDeleteRow;
  useEffect(() => {
    if (editableMode) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      buildElementsForTable();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      generateRowsData();
    }
  }, [referenceList.length]);


  // Nebula has other handling for isReadOnlyMode but has Cosmos-specific code
  //  so ignoring that for now...
  // fieldDefs will be an array where each entry will have a "name" which will be the
  //  "resolved" property name (that we can use as the colId) though it's not really
  //  resolved. The buildFieldsForTable helper just removes the "@P " (which is what
  //  Nebula does). It will also have the "label", and "meta" contains the original,
  //  unchanged config info. For now, much of the info here is carried over from
  //  Nebula and we may not end up using it all.
  const fieldDefs = buildFieldsForTable(rawFields, resolvedFields, showDeleteButton);

  const displayedColumns = fieldDefs.map(field => {
    return field.name ? field.name : field.cellRenderer;
  });

  // console.log(`SimpleTable displayedColumns:`);
  // console.log(displayedColumns);

  // And now we can process the resolvedFields to add in the "name"
  //  from from the fieldDefs. This "name" is the value that
  //  we'll share to connect things together in the table.

  // const processedFields = resolvedFields.map((field, i) => {
  //   field.config['name'] = displayedColumns[i]; // .config["value"].replace(/ ./g,"_");   // replace space dot with underscore
  //   return field;
  // });

  // console.log("SimpleTable processedFields:");
  // console.log(processedFields);

  // return the value that should be shown as the contents for the given row data
  //  of the given row field
  function getRowValue(inRowData: Object, inColKey: string): any {
    // See what data (if any) we have to display
    const refKeys: Array<string> = inColKey.split('.');
    let valBuilder = inRowData;
    for (const key of refKeys) {
      valBuilder = valBuilder[key];
    }
    return valBuilder;
  }

  const formatRowsData = data => {
    return data.map(item => {
      return displayedColumns.reduce((dataForRow, colKey) => {
        dataForRow[colKey] = getRowValue(item, colKey);
        return dataForRow;
      }, {});
    });
  };

  function generateRowsData() {
    // if dataPageName property value exists then make a datapage fetch call and get the list of data.
    if (dataPageName) {
      getDataPage(dataPageName, context).then(listData => {
        const data = formatRowsData(listData);
        setRowData(data);
      });
    } else {
      // The referenceList prop has the JSON data for each row to be displayed
      //  in the table. So, iterate over referenceList to create the dataRows that
      //  we're using as the table's dataSource
      const data: any = [];
      for (const row of referenceList) {
        const dataForRow: Object = {};
        for ( const col of displayedColumns ) {
          const colKey: string = col;
          const theVal = getRowValue(row, colKey);
          dataForRow[colKey] = theVal || "";
        }
        data.push(dataForRow);
      }
      setRowData(data);
    }
  }

  // These are the data structures referred to in the html file.
  //  These are the relationships that make the table work
  //  displayedColumns: key/value pairs where key is order of column and
  //    value is the property shown in that column. Ex: 1: "FirstName"
  //  processedFields: key/value pairs where each key is order of column
  //    and each value is an object of more detailed information about that
  //    column.
  //  rowData: array of each row's key/value pairs. Inside each row,
  //    each key is an entry in displayedColumns: ex: "FirstName": "Charles"
  //    Ex: { 1: {config: {label: "First Name", readOnly: true: name: "FirstName"}}, type: "TextInput" }
  //    The "type" indicates the type of component that should be used for editing (when editing is enabled)
  //
  //  Note that the "property" shown in the column ("FirstName" in the above examples) is what
  //  ties the 3 data structures together.

  // console.log("SimpleTable displayedColumns:");
  // console.log(displayedColumns);
  // console.log("SimpleTable processedFields:");
  // console.log(processedFields);
  // console.log(`SimpleTable rowData (${rowData.length} row(s)):`);
  // console.log(JSON.stringify(rowData));

  const addRecord = () => {
    pConn.getListActions().insert({ classID: contextClass }, referenceList.length, pageReference);
  };

  const deleteRecord = index => {
    pConn.getListActions().deleteEntry(index, pageReference);
  };

  function buildElementsForTable() {
    const eleData: any = []
    referenceList.forEach((element, index) => {
      const data: any = [];
      rawFields.forEach(item => {
        const referenceListData = getReferenceList(pConn);
        const isDatapage = referenceListData.startsWith('D_');
        const pageReferenceValue = isDatapage ? `${referenceListData}[${index}]` : `${pConn.getPageReference()}${referenceListData.substring(referenceListData.lastIndexOf('.'))}[${index}]`;
        const config = {
          meta: item,
          options: {
            context,
            pageReference: pageReferenceValue,
            referenceList: referenceListData,
            hasForm: true
          }
        };
        const view = PCore.createPConnect(config);
        data.push(createElement(createPConnectComponent(), view));
      });
      eleData.push(data);
    });
    setElementsData(eleData);
  }

  return (
    <React.Fragment>
      <TableContainer component={Paper} style={{ margin: '4px 0px' }}>
        {label && <h3 className={classes.label}>{label}</h3>}
        <Table>
          <TableHead className={classes.header}>
            <TableRow>
              {fieldDefs.map((field: any, index) => {
                return (
                  <TableCell key={`head-${displayedColumns[index]}`} className={classes.tableCell}>
                    {field.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {editableMode && elements.map((row: any, index) => {
              const theKey = `row-${index}`;
              return (
                <TableRow key={theKey}>
                  {row.map((item, childIndex) => {
                    const theColKey = `data-${index}-${childIndex}`;
                    return <TableCell key={theColKey} className={classes.tableCell}>
                      {item}
                    </TableCell>
                  })}
                  {showDeleteButton && <TableCell>
                    <button type='button' className='psdk-utility-button' onClick={() => deleteRecord(index)}>
                      <img className='psdk-utility-card-action-svg-icon' src={menuIconOverride$}></img>
                    </button>
                  </TableCell>}
                </TableRow>
              )
            })}
            {readOnlyMode && rowData.map((row, index) => {
              const theKey = `row-${index}`;
              return (
                <TableRow key={theKey}>
                  {displayedColumns.map(colKey => {
                    const theColKey = `data-${index}-${colKey}`;
                    return <TableCell key={theColKey} className={classes.tableCell}>
                      {typeof row[colKey] === 'boolean' && !row[colKey] ? 'False' : typeof row[colKey] === 'boolean' && row[colKey] ? 'True' : row[colKey]}
                    </TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {readOnlyMode && rowData && rowData.length === 0 && <div className='no-records'>No records found.</div>}
        {editableMode && referenceList && referenceList.length === 0 && <div className='no-records'>No records found.</div>}
      </TableContainer>
      {showAddRowButton && (
        <div style={{fontSize: '1rem'}}>
          <Link style={{ cursor: 'pointer' }} onClick={addRecord}>
            + Add
          </Link>
        </div>
      )}
    </React.Fragment>
  );
}

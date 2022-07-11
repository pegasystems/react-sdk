import React from 'react';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { buildFieldsForTable } from './helpers';


export default function SimpleTable(props) {
  const {
    getPConnect,
    referenceList = [], // if referenceList not in configProps$, default to empy list
    children,
    renderMode,
    presets
  } = props;

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
  const rawFields =  rawConfig?.children?.[0]?.children || rawConfig?.presets?.[0].children?.[0]?.children;
  // At this point, fields has resolvedFields and rawFields we can use

  // console.log("SimpleTable resolvedFields:");
  // console.log( resolvedFields );
  // console.log("SimpleTable rawFields:");
  // console.log( rawFields );

  // start of from Nebula
  // get context name and referenceList which will be used to prepare config of PConnect

  // const { contextName, referenceListStr, pageReferenceForRows } = getContext(
  //   getPConnect()
  // );

  const requestedReadOnlyMode = renderMode === 'ReadOnly';
  let readOnlyMode = renderMode === 'ReadOnly';

  // TEMPORARILY show all tables as read only
  if (!readOnlyMode) {
    // eslint-disable-next-line no-console
    console.warn(
      `SimpleTable: currently not editable. Displaying requested editable table as READ ONLY!`
    );
    readOnlyMode = true;
  }

  // Nebula has other handling for isReadOnlyMode but has Cosmos-specific code
  //  so ignoring that for now...
  // fieldDefs will be an array where each entry will have a "name" which will be the
  //  "resolved" property name (that we can use as the colId) though it's not really
  //  resolved. The buildFieldsForTable helper just removes the "@P " (which is what
  //  Nebula does). It will also have the "label", and "meta" contains the original,
  //  unchanged config info. For now, much of the info here is carried over from
  //  Nebula and we may not end up using it all.
  const fieldDefs = buildFieldsForTable(rawFields, resolvedFields, readOnlyMode);

  // end of from Nebula

  const displayedColumns = fieldDefs.map( (field) => {
    return field.name ? field.name : field.cellRenderer;
  });

  // console.log(`SimpleTable displayedColumns:`);
  // console.log(displayedColumns);

  // And now we can process the resolvedFields to add in the "name"
  //  from from the fieldDefs. This "name" is the value that
  //  we'll share to connect things together in the table.

  let processedFields = [];

  processedFields = resolvedFields.map( (field, i) => {
    field.config["name"] = displayedColumns[i];  // .config["value"].replace(/ ./g,"_");   // replace space dot with underscore
    return field;
  })

  // console.log("SimpleTable processedFields:");
  // console.log(processedFields);


  // return the value that should be shown as the contents for the given row data
  //  of the given row field
  function getRowValue( inRowData: Object, inColKey: string, inRowField: any  ): any {

    // See what data (if any) we have to display
    const refKeys: Array<string> = inColKey.split('.');
    let valBuilder = inRowData;
    for ( const key of refKeys) {
      valBuilder = valBuilder[key];
    }

    if (requestedReadOnlyMode || inRowField?.config?.readOnly) {
      // Show the requested data as a readOnly entry in the table.
      return valBuilder;
    } else {
      const thePlaceholder = inRowField?.config?.placeholder ? inRowField.config.placeholder : "";
      const theEditComponent = inRowField.type ? inRowField.type : "not specified";
      // For, display (readonly), the initial value (if there is one - otherwise, try placeholder)
      //  and which component should be used for editing
      return `${ (valBuilder !== "") ? valBuilder: thePlaceholder} (edit with ${theEditComponent})`;
    }
  }


  // return the field from the incoming fields array that has "name" of
  //  requested field
  function getFieldFromFieldArray ( inFieldName: string, inFieldArray: Array<any>) : Object {
    let objRet = {};

    for (const field of inFieldArray) {
      if ( field?.config?.name === inFieldName) {
        objRet = field;
        break;
      }
    }

    return objRet;
  }


  // The referenceList prop has the JSON data for each row to be displayed
  //  in the table. So, iterate over referenceList to create the dataRows that
  //  we're using as the table's dataSource

  // re-initialize rowData each time we re-build it
  const rowData: Array<Object> = [];

  for (const row of referenceList) {
    const dataForRow: Object = {};

    for ( const col of displayedColumns ) {
      const colKey: string = col;

      const theProcessedField = getFieldFromFieldArray(colKey, processedFields);

      const theVal = getRowValue(row, colKey, theProcessedField);

      dataForRow[colKey] = theVal;
    }

    rowData.push(dataForRow);
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

  // Using string literal to force the line break
  const tempPreamble = `SimpleTable component not complete in the React SDK. This is a work in progress...
    ${ requestedReadOnlyMode ? 'Table is readOnly' : 'You have requested an editable table which is not yet supported. Displaying in a modified readOnly mode.' }`;


  return (
    <React.Fragment>
      {!requestedReadOnlyMode && <Typography variant='body1' style={{whiteSpace: 'pre-line'}}>
        {tempPreamble}
      </Typography>}
      <TableContainer component={Paper} style={{margin: "4px 0px"}}>
        <Table>
          <TableHead>
            <TableRow>
              {processedFields.map((field: any, index) => {
                return <TableCell key={`head-${displayedColumns[index]}`}>{field.config.label}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData.map((row, index) => {
              const theKey = `row-${index}`;
              return <TableRow key={theKey}>
                {displayedColumns.map((colKey) => {
                  const theColKey = `data-${index}-${colKey}`;
                  return <TableCell key={theColKey}>
                    {row[colKey]}
                  </TableCell>
                })}
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>

    </React.Fragment>
  );
}

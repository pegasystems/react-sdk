import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import isDeepEqual from 'fast-deep-equal/react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Operator from '../Operator';

import './CaseSummaryFields.css';

import { format } from '../../../helpers/formatters/';

export default function CaseSummaryFields(props) {
  const { status, showStatus, theFields } = props;

  const [theFieldsToRender, setFieldsToRender] = useState([]);
  const [theFieldsAsGridItems, setFieldsAsGridItems] = useState<Array<any>>([]);


  function getFieldValue(field: any): any {
    const fieldTypeLower = field.type.toLowerCase();

    if (field.config.value === null || field.config.value === "") {
      // Special handling for missing value
      // eslint-disable-next-line sonarjs/no-small-switch
      switch(fieldTypeLower) {
        case "caseoperator" :
          return <Operator caseOpConfig={field.config} />;
          break;

        default:
          return <TextField
            value="---"
            label={field.config.label}
            InputProps={{
              readOnly: true
            }} />;
      }
    }

    switch(fieldTypeLower) {
      case "textinput" :
        return <TextField
          value={field.config.value}
          label={field.config.label}
          InputProps={{
            readOnly: true
          }} />;

      case "status" :
        return <TextField
        className="psdk-csf-status-style"
        value={field.config.value}
        label={field.config.label}
        InputProps={{
          readOnly: true
          }} />;

      case "phone":
        {
          const displayPhone = (field.config.value !== "") ? field.config.value : "---";
          return <a href={`tel:${displayPhone}`}>
            <TextField
                  value={field.config.value}
                  label={field.config.label}
                  InputProps={{
                    readOnly: true,
                    inputProps: {style: {cursor: 'pointer'}}
                  }}
              />
          </a>;
        }

      case "email":
        {
          const displayEmail = format(field.config.value, field.type);
          return <a href={`mailto:${displayEmail}`}>
            <TextField
                  value={field.config.value}
                  label={field.config.label}
                  InputProps={{
                    readOnly: true,
                    inputProps: {style: {cursor: 'pointer'}}
                  }}
              />
          </a>;

        }

      case "date":
        return <TextField
              value={format(field.config.value, field.type)}
              label={field.config.label}
              InputProps={{
                readOnly: true
              }} />;

      case "caseoperator":
        return <Operator caseOpConfig={field.config} />;
        break;

        default:
        return (
        <span>{field.type.toLowerCase()} {field.config.value}</span>
        );

    }

  }


  // Whenever theFieldsToRender changes, update theFieldsAsGridItems that's used during render
  useEffect(() => {
      const arGridItems = theFieldsToRender.map((field: any) => {
        return ( <Grid item xs={6} key={field.config.label}>{getFieldValue(field)}</Grid> );
      });
      setFieldsAsGridItems(arGridItems);
    },
    [theFieldsToRender]);


  const theFieldsModifiable = theFields;

  // Special Case: if showStatus is true, splice the status value to be 2nd in theFields
  //  if it's not already there
  if (showStatus && theFields?.[1].type !== "status") {
    const oStatus = { type: "status", config: { value: status, label: "Status" }};

    const count = theFieldsModifiable.length;
    if (count < 2) {
      theFieldsModifiable.push(oStatus);
    }
    else {
      theFieldsModifiable.splice(1, 0, oStatus);
    }
  }

  // At this point, we know what fields we want to render...
  //  So, update our state if it's changed
  if (!isDeepEqual(theFieldsToRender, theFieldsModifiable)) {
    setFieldsToRender(theFieldsModifiable);
  }


  return <React.Fragment>
    <Grid container className="psdk-case-summary-fields">
      {theFieldsAsGridItems}
    </Grid>
  </React.Fragment>;
}

CaseSummaryFields.propTypes = {
  status: PropTypes.string,
  showStatus: PropTypes.bool,
  theFields: PropTypes.arrayOf(PropTypes.object)
};

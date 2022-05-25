import React from "react";
import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { green } from "@material-ui/core/colors";

import { format } from '../../../helpers/formatters/';


const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    // borderLeft: "6px solid",
    // borderLeftColor: green[300]
  },
  fieldMargin: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  fieldLabel: {
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  fieldValue: {
    fontWeight: 400,
    color: theme.palette.text.primary
  }
}));

export default function DetailsFields(props) {
  // const componentName = "DetailsFields";
  const { fields } = props;
  const classes = useStyles();

  const fieldComponents: Array<any> = [];

  for (const field of fields) {
    const thePConn = field.getPConnect();
    const theCompType = thePConn.getComponentName().toLowerCase();
    const { label, value } = thePConn.getConfigProps();
    if (theCompType === 'view') {
      const children = thePConn.getChildren();
      for (const child of children) {
        const theChildPConn = child.getPConnect();
        const theChildrenOfChild = theChildPConn.getChildren();
        for (const childrenOfChild of theChildrenOfChild) {
          const pconChild = childrenOfChild.getPConnect();
          const childCompType = pconChild.getComponentName().toLowerCase();
          const { label, value } = pconChild.getConfigProps();
          fieldComponents.push({
            'type': childCompType,
            'value': value,
            'label': label
          });
        }
      }
    } else {
      fieldComponents.push({
        'type': theCompType,
        'value': value,
        'label': label
      });
    }

  }


  function getGridItemLabel(field: any, keyVal: string) {
    const dispValue = field.label;

    return <Grid item xs={6} key={keyVal}>
      <Typography variant="body2" component="span" className={`${classes.fieldLabel} ${classes.fieldMargin}`}>{dispValue}</Typography>
    </Grid>
  }


  function formatItemValue(inField: any) {
    const { type, value } = inField;
    let formattedVal = value;

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case "date":
        formattedVal = format(value, type);
        break;

      default:
        // No match means we return the value as we received it
        break;
    }

    // Finally, if the value is an empty string, we want to display it as "---"
    if (formattedVal === "") {
      formattedVal = "---";
    }

    return formattedVal;
  }


  function getGridItemValue(field: any, keyVal: string) {
    const formattedValue = formatItemValue(field);

    return <Grid item xs={6} key={keyVal}>
      <Typography variant="body2" component="span" className={classes.fieldValue}>{formattedValue}</Typography>
    </Grid>
  }


  function getGridItems() {
    const gridItems: Array<any> = fieldComponents.map( (field, index) => {
      return [ getGridItemLabel(field, `${index}-label`),
        getGridItemValue(field, `${index}-value`)
     ];
    })

    return gridItems;
  }


  return (
      <Grid container spacing={1}>
        {getGridItems()}
      </Grid>
    );
}

DetailsFields.defaultProps = {
  fields: []
}

DetailsFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.any),
};

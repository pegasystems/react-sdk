/* eslint-disable react/no-array-index-key */
import React, { createElement, isValidElement } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters/index';

import createPConnectComponent from './react_pconnect';

const useStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  fieldLabel: {
    display: 'block',
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
  const { fields = [] } = props;
  const classes = useStyles();
  const fieldComponents = [];

  fields?.forEach((field, index) => {
    const thePConn = field.getPConnect();
    const theCompType = thePConn.getComponentName().toLowerCase();
    const { label } = thePConn.getConfigProps();
    const configObj = thePConn?.getReferencedView();
    configObj.config.readOnly = true;
    configObj.config.displayMode = 'LABELS_LEFT';
    const propToUse = { ...thePConn.getInheritedProps() };
    configObj.config.label = theCompType === 'reference' ? propToUse?.label : label;
    fieldComponents.push({
      type: theCompType,
      label,
      value: <React.Fragment key={index}>{createElement(createPConnectComponent(), thePConn.getReferencedViewPConnect())}</React.Fragment>
    });
  });

  function getGridItemLabel(field, keyVal) {
    const dispValue = field.label;

    return (
      <Grid item xs={6} key={keyVal}>
        <Typography variant='body2' component='span' className={`${classes.fieldLabel}`}>
          {dispValue}
        </Typography>
      </Grid>
    );
  }

  function formatItemValue(inField) {
    const { type, value } = inField;
    let formattedVal = value;

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case 'date':
        formattedVal = format(value, type);
        break;

      default:
        // No match means we return the value as we received it
        break;
    }

    // Finally, if the value is undefined or an empty string, we want to display it as "---"
    if (formattedVal === undefined || formattedVal === '') {
      formattedVal = '---';
    }

    return formattedVal;
  }

  function getGridItemValue(field, keyVal) {
    const formattedValue = formatItemValue(field);

    return (
      <Grid item xs={6} key={keyVal}>
        <Typography variant='body2' component='span' className={classes.fieldValue}>
          {formattedValue}
        </Typography>
      </Grid>
    );
  }

  function getGridItem(field, keyVal) {
    return (
      <Grid item xs={12} key={keyVal}>
        <Typography variant='body2' component='span' className={classes.fieldValue}>
          {field?.value}
        </Typography>
      </Grid>
    );
  }

  function getGridItems() {
    return fieldComponents.map((field, index) => {
      if (field?.type === 'reference') {
        return field?.value;
      }
      if (isValidElement(field?.value)) {
        return (
          <Grid container spacing={1} style={{ padding: '4px 0px' }} key={index}>
            {getGridItem(field, `${index}-item`)}
          </Grid>
        );
      }
      return (
        <Grid container spacing={1} style={{ padding: '4px 0px' }} key={index}>
          {getGridItemLabel(field, `${index}-label`)}
          {getGridItemValue(field, `${index}-value`)}
        </Grid>
      );
    });
  }

  return <>{getGridItems()}</>;
}

export function decorator(story) {
  return story();
}

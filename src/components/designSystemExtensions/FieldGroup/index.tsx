import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  fieldMargin: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
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

const FieldGroup = props => {
  const classes = useStyles();

  const fields: any = [];

  for (const label in props.item) {
    if (label !== 'classID') {
      fields.push({ label, value: props.item[label] });
    }
  }

  function getGridItemLabel(label) {
    const dispValue = label;

    return (
      <Grid item xs={6}>
        <Typography
          variant='body2'
          component='span'
          className={`${classes.fieldLabel} ${classes.fieldMargin}`}
        >
          {dispValue}
        </Typography>
      </Grid>
    );
  }

  function formatItemValue(value) {
    let formattedVal = value;

    // if the value is an empty string, we want to display it as "---"
    if (formattedVal === '') {
      formattedVal = '---';
    }

    return formattedVal;
  }

  function getGridItemValue(value) {
    const formattedValue = formatItemValue(value);

    return (
      <Grid item xs={6}>
        <Typography variant='body2' component='span' className={classes.fieldValue}>
          {formattedValue}
        </Typography>
      </Grid>
    );
  }

  function getGridItems() {
    const gridItems = fields.map(item => {
      return (
        <Grid container spacing={1}>
          {getGridItemLabel(item.label)}
          {getGridItemValue(item.value)}
        </Grid>
      );
    });
    return gridItems;
  }

  return (
    <React.Fragment>
      <Grid container spacing={4} justifyContent='space-between'>
        <Grid item style={{ width: '100%' }}>
          {fields.length > 0 && (
            <div className={classes.fieldMargin}>
              <b>{props.name}</b>
            </div>
          )}
          {getGridItems()}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default FieldGroup;

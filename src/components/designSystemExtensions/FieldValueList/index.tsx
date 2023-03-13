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
  fieldLabel: {
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  fieldValue: {
    color: theme.palette.text.primary
  },
  noPaddingTop: {
    paddingTop: '0 !important'
  },
  noPaddingBottom: {
    paddingBottom: '0 !important'
  }
}));

function formatItemValue(value) {
  let formattedVal = value;

  // if the value is undefined or an empty string, we want to display it as "---"
  if (formattedVal === undefined || formattedVal === '') {
    formattedVal = '---';
  }

  return formattedVal;
}

const FieldValueList = props => {
  const { name, value, variant = 'inline' } = props;
  const classes = useStyles();

  function getGridItemLabel() {
    return (
      <Grid
        item
        xs={variant === 'stacked' ? 12 : 6}
        className={variant === 'stacked' ? classes.noPaddingBottom : ''}
      >
        <Typography variant='body2' component='span' className={`${classes.fieldLabel}`}>
          {name}
        </Typography>
      </Grid>
    );
  }

  function getGridItemValue() {
    const formattedValue = formatItemValue(value);

    return (
      <Grid
        item
        xs={variant === 'stacked' ? 12 : 6}
        className={variant === 'stacked' ? classes.noPaddingTop : ''}
      >
        <Typography
          variant={variant === 'stacked' ? 'h6' : 'body2'}
          component='span'
          className={classes.fieldValue}
        >
          {formattedValue}
        </Typography>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid container spacing={4} justifyContent='space-between'>
        {getGridItemLabel()}
        {getGridItemValue()}
      </Grid>
    </React.Fragment>
  );
};

export default FieldValueList;

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((/* theme */) => ({
  headerStyles: {
    fontWeight: 500,
    fontSize: '1.25rem'
  },
  containerStyles: {
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  colStyles: {
    display: 'grid',
    gap: '1rem',
    alignContent: 'baseline'
  },
  filterContainerStyles: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(7, 1fr);'
  }
}));

export default function InlineDashboard(props) {
  const classes = useStyles();

  const { children, title } = props;

  return (
    <>
      <Typography variant='h4' className={classes.headerStyles}>
        {title}
      </Typography>
      <Grid container spacing={2} direction='column-reverse' className={classes.containerStyles}>
        <Grid item xs={12} className={classes.colStyles}>
          {children[0]}
        </Grid>
        <Grid item xs={12} className={classes.filterContainerStyles}>
          {children[1]}
        </Grid>
      </Grid>
    </>
  );
}

InlineDashboard.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired
  // template: PropTypes.string.isRequired
};

import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((/* theme */) => ({
  colStyles: {
    display: "grid",
    gap: "1rem",
    alignContent: "baseline",
  },
}));


export default function OneColumn(props) {
  const classes = useStyles();

  const { children} = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} className={classes.colStyles}>
        {children.map(child => { return child; } )}
      </Grid>
    </Grid>
  )
}

OneColumn.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  // template: PropTypes.string.isRequired
};

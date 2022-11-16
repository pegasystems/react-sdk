import React from "react";
import PropTypes from "prop-types";
import { Grid, GridSize } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  colStyles: {
    display: "grid",
    gap: "1rem",
    alignContent: "baseline",
  },
}));

export default function TwoColumnTab(props) {
  const classes = useStyles();

 const {children, templateCol} = props;

 if (children.length !== 2) {
  // eslint-disable-next-line no-console
  console.error( `TwoColumn template sees more than 2 columns: ${children.length}`);
 }

  // Calculate the size
  //  Default to assume the 2 columns are evenly split. However, override if templateCol
  //  (example value: "1fr 1fr")
  let aSize: GridSize = 6;
  let bSize: GridSize = 6;

  const colAArray = templateCol.replaceAll(/[a-z]+/g, "").split(/\s/).map(itm => Number(itm));
  const totalCols = colAArray.reduce((v, itm) => itm + v, 0);
  const ratio = 12 / totalCols;
  aSize = (ratio * colAArray[0]) as GridSize;
  bSize = (ratio * colAArray[1]) as GridSize;

 return (
   <Grid container spacing={1}>
     <Grid item xs={12} md={aSize} className={classes.colStyles}>
       {children[0]}
     </Grid>
     <Grid item xs={12} md={bSize} className={classes.colStyles}>
       {children[1]}
     </Grid>
   </Grid>
 )
}

TwoColumnTab.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  templateCol: PropTypes.string,
};

TwoColumnTab.defaultProps = {
  templateCol: "1fr 1fr",
};

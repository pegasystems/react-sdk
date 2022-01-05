import React from "react";
// import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderLeft: "6px solid",
    borderLeftColor: theme.palette.primary.light
  },
}));

export default function Pulse(/* props */) {
  // const { children } = props;
  const classes = useStyles();

  return (
      <Card className={classes.root}>
        <CardHeader title={<Typography variant="h6">Pulse</Typography>} />
        <CardContent>
          <Typography>Pulse</Typography>
        </CardContent>
      </Card>
    );
}

// Pulse.propTypes = {
//   children: PropTypes.arrayOf(PropTypes.node).isRequired
// };

import React from "react";
// import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

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
  },
}));

export default function Details(/* props */) {
  const componentName = "Details";
  const classes = useStyles();

  return (
      <Card className={classes.root}>
        <CardHeader title={<Typography variant="h6" component="div">{componentName}</Typography>} />
        <CardContent>
          <Typography>{componentName} content</Typography>
        </CardContent>
      </Card>
    );
}

Details.defaultProps = {
  // children: []
}

Details.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};

import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
// import { green } from "@material-ui/core/colors";

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
}));

export default function SubTabs() {
  const componentName = "SubTabs";
  // const { children } = props;
  const classes = useStyles();

  return (
      <Card className={classes.root}>
        <CardHeader title={<Typography variant="h6" component="div">{componentName} - <em>unsupported</em></Typography>} />
        <CardContent>
          <Typography>{componentName} content</Typography>
        </CardContent>
      </Card>
    );
}

SubTabs.defaultProps = {
  // children: []
}

SubTabs.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};

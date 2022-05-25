import React from "react";
// import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DetailsFields from '../../designSystemExtensions/DetailsFields';

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

export default function Details(props) {
  const componentName = "Details";
  const classes = useStyles();
  const { children } = props;
  const arFields: Array<any> = [];

  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  return (
      // <Card className={classes.root}>
      //   <CardHeader title={<Typography variant="h6" component="div">{componentName}</Typography>} />
      //   <CardContent>
      //     <Typography>{componentName} content</Typography>
      //   </CardContent>
      // </Card>

      <div id="DetailsOneColumn">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DetailsFields fields={arFields[0]} />
          </Grid>
        </Grid>
      </div>
    );
}

Details.defaultProps = {
  // children: []
}

Details.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};

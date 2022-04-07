import React from "react";
import PropTypes from "prop-types";
import { Card } from "@material-ui/core";
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


export default function FileUtility(props) {
  const classes = useStyles();

  const { label } = props;

  return (
    <Card id="FileUtility" className={classes.root} >
      FileUtility<br />
      name: {label}
    </Card>
  )
}

FileUtility.defaultProps = {
  // lastRefreshTime: ""
};

FileUtility.propTypes = {
  label: PropTypes.string.isRequired,
  // getPConnect: PropTypes.func.isRequired,
  // lastRefreshTime: PropTypes.string
};

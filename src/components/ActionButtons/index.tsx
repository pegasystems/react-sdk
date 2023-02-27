import React from "react";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import { Grid } from "@material-ui/core";

export default function ActionButtons(props) {
  const { arMainButtons, arSecondaryButtons, onButtonPress } = props;

  function _onButtonPress(sAction: string, sButtonType: string) {

    onButtonPress(sAction, sButtonType);
  }

  return (
    <React.Fragment>
      <Grid container spacing={4} justifyContent="space-between">
        <Grid item>
          <Grid container spacing={1}>
          {arSecondaryButtons.map((sButton) => (
                  <Grid item key={sButton.name}>
                    <Button variant="contained" color="secondary" onClick={() => { _onButtonPress(sButton.jsAction, "secondary")}} >{sButton.name}</Button>
                  </Grid>
                ))}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
          {arMainButtons.map((mButton) => (
                  <Grid item key={mButton.name}>
                    <Button variant="contained" color="primary" onClick={() => { _onButtonPress(mButton.jsAction, "primary")}} >{mButton.name}</Button>
                  </Grid>
                ))}
          </Grid>
        </Grid>
      </Grid>

    </React.Fragment>

  )
}

ActionButtons.propTypes = {
  arMainButtons: PropTypes.array,
  arSecondaryButtons: PropTypes.array,
  onButtonPress: PropTypes.func
  // buildName: PropTypes.string
};

ActionButtons.defaultProps = {
  arMainButtons: [],
  arSecondaryButtons: []
  // buildName: null
};

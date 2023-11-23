import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { Grid, Divider } from '@material-ui/core';

// a change

declare const PCore: any;

const useStyles = makeStyles((/* theme */) => ({
  button: {
    padding: '0px 5px'
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  }
}));

export default function ActionButtons(props) {
  const { arMainButtons, arSecondaryButtons, onButtonPress } = props;
  const classes = useStyles();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';

  function _onButtonPress(sAction: string, sButtonType: string) {
    onButtonPress(sAction, sButtonType);
  }

  return (
    <React.Fragment>
      <Divider className={classes.divider} />
      <Grid container spacing={4} justifyContent='space-between'>
        <Grid item>
          <Grid container spacing={1}>
            {arSecondaryButtons.map(sButton => (
              <Grid item key={sButton.name}>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    _onButtonPress(sButton.jsAction, 'secondary');
                  }}
                >
                  {localizedVal(sButton.name, localeCategory)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            {arMainButtons.map(mButton => (
              <Grid item key={mButton.name}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    _onButtonPress(mButton.jsAction, 'primary');
                  }}
                >
                  {localizedVal(mButton.name, localeCategory)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
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

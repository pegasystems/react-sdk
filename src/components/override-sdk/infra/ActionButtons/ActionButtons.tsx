import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Grid, Divider } from '@material-ui/core';

// ActionButtons does NOT have getPConnect. So, no need to extend from PConnProps
interface ActionButtonsProps {
  // If any, enter additional props that only exist on this component
  arMainButtons?: any[];
  arSecondaryButtons?: any[];
  onButtonPress: any;
}

const useStyles = makeStyles((/* theme */) => ({
  primaryButton: {
    padding: '0px 5px',
    background: '#CE2525',
    borderRadius: '100px',
    margin: '0 auto',
    width: '78px',
    height: '40px',
    textTransform: 'none'
  },
  secondaryButton: {
    padding: '0px 5px',
    // background: '#CE2525',
    borderRadius: '100px',
    margin: '0 auto',
    // width: '78px',
    height: '40px',
    textTransform: 'none'
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  }
}));

export default function ActionButtons(props: ActionButtonsProps) {
  const { arMainButtons = [], arSecondaryButtons = [], onButtonPress } = props;
  const classes = useStyles();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';

  function _onButtonPress(sAction: string, sButtonType: string) {
    onButtonPress(sAction, sButtonType);
  }

  return (
    <Grid container spacing={4} justifyContent='space-between' style={{ marginTop: '1em' }}>
      <Grid item>
        <Grid container spacing={1}>
          {arSecondaryButtons.map(
            sButton =>
              sButton?.jsAction !== 'saveAssignment' && (
                <Grid item key={sButton.name}>
                  <Button
                    variant='outlined'
                    color='secondary'
                    className={classes.secondaryButton}
                    onClick={() => {
                      _onButtonPress(sButton.jsAction, 'secondary');
                    }}
                  >
                    {localizedVal(sButton.name, localeCategory)}
                  </Button>
                </Grid>
              )
          )}
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          {arMainButtons.map(mButton => (
            <Grid item key={mButton.name}>
              <Button
                className={classes.primaryButton}
                variant='contained'
                color='secondary'
                // className='btn-primary'
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
  );
}

import makeStyles from '@mui/styles/makeStyles';
import { Grid, Divider } from '@mui/material';
import Button from '../../../BaseComponents/Button/Button';

// ActionButtons does NOT have getPConnect. So, no need to extend from PConnProps
interface ActionButtonsProps {
  // If any, enter additional props that only exist on this component
  arMainButtons?: any[];
  arSecondaryButtons?: any[];
  onButtonPress: any;
}

const useStyles = makeStyles((/* theme */) => ({
  button: {
    padding: '0px 5px'
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
    <>
      <Divider className={classes.divider} />
      <Grid container spacing={4} justifyContent='space-between'>
        <Grid item>
          <Grid container spacing={1}>
            {arSecondaryButtons.map(sButton => (
              <Grid item key={sButton.name}>
                <Button
                  variant='backlink'
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
    </>
  );
}

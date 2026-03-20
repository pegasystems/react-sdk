import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import { Grid2, Divider } from '@mui/material';

// ActionButtons does NOT have getPConnect. So, no need to extend from PConnProps
interface ActionButtonsProps {
  // If any, enter additional props that only exist on this component
  arMainButtons?: any[];
  arSecondaryButtons?: any[];
  onButtonPress: any;
}

const useStyles = makeStyles(() => ({
  divider: {
    marginTop: '0.75rem',
    marginBottom: '0.875rem'
  },
  actionsRow: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.875rem'
  },
  buttonBase: {
    minWidth: '10rem',
    height: '2.5rem',
    borderRadius: '1.5em',
    fontFamily: 'Graphik, Helvetica Neue, Helvetica, sans-serif',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '1.125rem',
    letterSpacing: '0.005em',
    boxShadow: 'none'
  },
  secondaryButton: {
    backgroundColor: '#fff',
    color: '#6f7db2',
    border: '2px solid #9da3ad',
    '&:hover': {
      backgroundColor: '#f6f8fc',
      borderColor: '#7e8797',
      boxShadow: 'none'
    }
  },
  primaryButton: {
    backgroundColor: '#3c5eea',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2d4dc5',
      boxShadow: 'none'
    }
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
      <Grid2 container className={classes.actionsRow}>
        <Grid2>
          <Grid2 container spacing={1.5}>
            {arSecondaryButtons.map(sButton => (
              <Grid2 key={sButton.name}>
                <Button
                  className={`${classes.buttonBase} ${classes.secondaryButton}`}
                  color='secondary'
                  variant='outlined'
                  onClick={() => {
                    _onButtonPress(sButton.jsAction, 'secondary');
                  }}
                >
                  {localizedVal(sButton.name, localeCategory)}
                </Button>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
        <Grid2>
          <Grid2 container spacing={1.5}>
            {arMainButtons.map(mButton => (
              <Grid2 key={mButton.name}>
                <Button
                  className={`${classes.buttonBase} ${classes.primaryButton}`}
                  color='primary'
                  variant='contained'
                  onClick={() => {
                    _onButtonPress(mButton.jsAction, 'primary');
                  }}
                >
                  {localizedVal(mButton.name, localeCategory)}
                </Button>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
}

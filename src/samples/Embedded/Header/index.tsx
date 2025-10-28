import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { usePega } from '../context/PegaReadyContext';

const useStyles = makeStyles(theme => ({
  embeddedHeader: {
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    padding: '0px 20px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  embedTopIcon: {
    width: '40px',
    filter: 'invert(100%)'
  }
}));

export default function Header() {
  const classes = useStyles();
  const { isPegaReady, PegaContainer } = usePega();

  return (
    <div className={classes.embeddedHeader}>
      {isPegaReady && <Typography variant='h4'>{PCore.getEnvironmentInfo().getApplicationLabel()}</Typography>}
      &nbsp;&nbsp;&nbsp;&nbsp;
      <img src='./assets/img/antenna.svg' className={classes.embedTopIcon} />
      <PegaContainer />
    </div>
  );
}

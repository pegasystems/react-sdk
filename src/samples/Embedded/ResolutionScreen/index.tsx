import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  resolutionPart: {
    display: 'flex',
    flexDirection: 'row'
  },
  resolutionPartAccompanimentLeft: {
    width: '50%',
    alignItems: 'center'
  },
  resolutionPartAccompanimentRight: {
    width: '50%',
    alignItems: 'center',
    textAlign: 'center'
  },
  resolutionPartAccompanimentText: {
    fontSize: '28px',
    lineHeight: '40px',
    padding: '20px 20px',
    color: 'darkslategray'
  },
  pegaPartAccompanimentImage: {
    width: '700px',
    margin: '20px',
    borderRadius: '10px'
  },
  resolutionButton: {
    color: 'white',
    backgroundColor: theme.palette.warning.main,
    fontSize: '25px',
    fontWeight: 'bold',
    borderRadius: '25px',
    border: '0px',
    margin: '20px',
    padding: '10px 30px'
  }
}));

export default function ResolutionScreen() {
  const classes = useStyles();

  return (
    <div id='embedded-top-level-resolution'>
      <div className={classes.resolutionPart}>
        <div className={classes.resolutionPartAccompanimentLeft}>
          <div className={classes.resolutionPartAccompanimentText}>
            <b>Welcome!</b>
            <br />
            <br />
            Thanks for selecting a package with us. <br />
            <br />
            A technician will contact you with in the next couple of days to schedule an installation.
            <br />
            <br />
            If you have any questions, you can contact us directly at <b>1-800-555-1234</b> or you can chat with us.
          </div>
        </div>
        <div className={classes.resolutionPartAccompanimentRight}>
          <img src='assets/img/cablechat.jpg' className={classes.pegaPartAccompanimentImage} />
          <br />
          <button type='button' className={classes.resolutionButton}>
            Chat Now
          </button>
        </div>
      </div>
    </div>
  );
}

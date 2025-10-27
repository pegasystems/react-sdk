import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  resolutionPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 81px)',
    padding: '2rem'
  },
  resolutionCard: {
    backgroundColor: 'var(--utility-background-color)',
    borderRadius: '16px',
    padding: '3rem',
    maxWidth: '600px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    color: theme.palette.text.primary,
    position: 'relative',
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '16px',
      border: '2px solid transparent',
      background: `linear-gradient(to bottom, ${theme.actionButtons.secondary.backgroundColor}, ${theme.actionButtons.primary.backgroundColor}) border-box`,
      '-webkit-mask': 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      '-webkit-mask-composite': 'destination-out',
      maskComposite: 'exclude',
      pointerEvents: 'none'
    }
  },
  successImage: {
    height: '4rem',
    width: 'auto',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '2rem',
    color: theme.palette.text.primary,
    marginBottom: '1rem',
    fontWeight: 700,
    margin: 0
  },
  message: {
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '2rem',
    color: theme.palette.text.secondary,
    margin: 0
  },
  doneButton: {
    display: 'inline-block',
    background: `linear-gradient(90deg, ${theme.actionButtons.primary.backgroundColor}, ${theme.palette.primary.dark}, ${theme.actionButtons.primary.backgroundColor})`,
    backgroundSize: '200% auto',
    color: `${theme.actionButtons.primary.color} !important`,
    padding: '0.75rem 1.5rem',
    borderRadius: '50px',
    textAlign: 'center',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-position 0.4s ease-in-out, transform 0.3s ease',
    '&:hover': {
      backgroundPosition: 'right center',
      transform: 'scale(1.05)',
      color: theme.actionButtons.primary.color
    }
  }
}));

export default function ResolutionScreen() {
  const classes = useStyles();

  const primaryContainer = PCore.getContainerUtils().getActiveContainerItemName('app/primary') || 'app/primary_1';
  const workareaContainer = PCore.getContainerUtils().getActiveContainerItemName(primaryContainer + '/workarea') || 'app/primary_1/workarea_1';

  const ModelName = PCore.getStoreValue('.PhoneModelss.ModelName', 'caseInfo.content', workareaContainer);
  const Address = PCore.getStoreValue('.BillingAddress.Apartment', 'caseInfo.content', workareaContainer);
  const Email = PCore.getStoreValue('.CustomerProfile.EmailAddress', 'caseInfo.content', workareaContainer);

  return (
    <div className={classes.resolutionPage}>
      <div className={classes.resolutionCard}>
        <img src='./assets/img/SuccessIcon.png' alt='Success Checkmark' className={classes.successImage} />

        <h2 className={classes.title}>Get excited for your new phone!</h2>
        <p className={classes.message}>
          We have received your order of a {ModelName}. It will ship out within 1 business day to {Address}. Your tracking information will be sent to{' '}
          {Email}.
          <br />
          <br />
          Thank you for your business!
        </p>

        <a href='/' className={classes.doneButton} role='button'>
          Done
        </a>
      </div>
    </div>
  );
}

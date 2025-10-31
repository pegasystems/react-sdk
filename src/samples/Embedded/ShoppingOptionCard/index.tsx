import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  planCard: {
    backgroundColor: 'var(--utility-background-color)',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
    },
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
      pointerEvents: 'none'
    }
  },
  phoneImage: {
    marginBottom: '1.5rem',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      maxHeight: '100%',
      width: 'auto'
    }
  },
  planName: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: theme.palette.text.primary,
    margin: 0
  },
  saveAmount: {
    color: '#34d399',
    fontWeight: 600,
    marginBottom: '1rem',
    margin: 0
  },
  monthlyPrice: {
    fontSize: '1rem',
    color: theme.palette.text.primary,
    margin: 0
  },
  tenure: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    marginBottom: '1rem',
    margin: 0
  },
  retailPrice: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    marginBottom: '1.5rem',
    flexGrow: 1,
    margin: 0
  },
  buyButton: {
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

export default function ShoppingOptionCard(props) {
  const classes = useStyles();
  const { name, imageSrc, saveAmount, monthlyPrice, tenure, retailPrice, level, onClick } = props;

  return (
    <div className={classes.planCard}>
      <div className={classes.phoneImage}>
        <img src={imageSrc} alt={name} />
      </div>

      <h3 className={classes.planName}>{name}</h3>

      <p className={classes.saveAmount}>{saveAmount}</p>
      <p className={classes.monthlyPrice}>{monthlyPrice}</p>
      <p className={classes.tenure}>{tenure}</p>
      <p className={classes.retailPrice}>{retailPrice}</p>

      <button type='button' className={classes.buyButton} onClick={() => onClick(level)}>
        Buy now
      </button>
    </div>
  );
}

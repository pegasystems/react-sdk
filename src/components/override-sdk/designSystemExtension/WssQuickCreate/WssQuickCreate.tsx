import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Typography, makeStyles } from '@material-ui/core';
import './WssQuickCreate.css';

// WssQuickCreate is one of the few components that does NOT have getPConnect.
//  So, no need to extend PConnProps
interface WssQuickCreateProps {
  // If any, enter additional props that only exist on this component
  heading: string;
  actions?: any[];
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  caseViewHeader: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.getContrastText(theme.palette.info.light)
    // borderRadius: 'inherit'
  },
  caseViewIconBox: {
    backgroundColor: theme.palette.info.dark,
    width: theme.spacing(8),
    height: theme.spacing(8),
    padding: theme.spacing(1)
  },
  caseViewIconImage: {
    // filter: 'invert(100%)'
  },
  primaryButton: {
    padding: '0px 5px',
    background: '#CE2525',
    borderRadius: '100px',
    // margin: '0 auto',
    width: '119px',
    height: '40px',
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      background: '#fa2c2551',
      color: '#333'
    }
  }
}));

export default function WssQuickCreate(props: WssQuickCreateProps) {
  const { heading, actions } = props;

  const classes = useStyles();

  const quickLinkImages = {
    'Schedule Service Appointment': 'media.jpg',
    'Download Users Manual': 'media 2.jpg',
    'Troubleshoot Infotainment Issue': 'media2.jpg'
  };

  const defaultQuickLinkImage = 'media.jpg';

  return (
    <ul
      id='quick-links'
      className='quick-link-ul-list'
      style={{ gridTemplateColumns: `repeat(${actions?.length || 3}, 1fr)`, justifyItems: 'center', gap: '70px', padding: '0 8px' }}
    >
      {actions &&
        actions.map((element, i) => {
          return (
            <li className='quick-link-list' key={element.label}>
              <Card className={classes.root} style={{ width: 'auto' }}>
                <img src={`assets/img/${quickLinkImages[element?.label] || defaultQuickLinkImage}`} height={180} width='100%' />
                <CardHeader style={{ paddingTop: 0, paddingBottom: 0 }} title={<Typography variant='h6'>{element.label}</Typography>} />
                <CardContent>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    Whether you need to get a simple oil change or need to repair extensive damages, we’ve got you covered.
                  </Typography>
                </CardContent>
                <CardActions style={{ justifyContent: 'end' }}>
                  <Button className={classes.primaryButton} onClick={element.onClick}>
                    Get started
                  </Button>
                </CardActions>
              </Card>
            </li>
          );
        })}
    </ul>
  );
}

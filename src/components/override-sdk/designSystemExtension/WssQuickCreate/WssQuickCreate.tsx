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
    textTransform: 'none'
  }
}));

export default function WssQuickCreate(props: WssQuickCreateProps) {
  const { heading, actions } = props;

  // const caseTypes = actions;

  // if (actions?.length) {
  //   caseTypes?.push(actions?.[0]);
  //   caseTypes?.push(actions?.[0]);
  // }

  const classes = useStyles();

  const operatorDetails = [
    { name: 'Amy Billings', profile: 'Service Advisor' },
    { name: 'Luca Lopez', profile: 'Service Teachnician' }
  ];

  const uConnectQuickLinkImages = ['media.jpg', 'media 2.jpg', 'media2.jpg'];
  const tradeInQuickLinkImages = ['media.png'];

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
              {/* <Button className='quick-link-button' onClick={element.onClick}>
                  <span className='quick-link-button-span'>
                    {element.icon && <img className='quick-link-icon' src={element.icon} />}
                    <span>{element.label}</span>
                  </span>
                </Button> */}

              <Card className={classes.root} style={{ width: 'auto' }}>
                <img
                  src={`assets/img/${actions?.length === 3 ? uConnectQuickLinkImages?.[i] : tradeInQuickLinkImages?.[i]}`}
                  height={180}
                  width='100%'
                />
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

/* Primary button

Buttons communicate actions that users can take. They are typically placed throughout your UI, in places like Dialogs, Modal windows, Forms, Cards and Toolbars

Filled buttons are high-emphasis buttons.
They have the most visual impact after the FAB, and should be used for important, final actions that complete a flow, like &quot;Save&quot;, &quot;Join now&quot;, or &quot;Confirm&quot;.
*/

/* Auto layout */
// display: flex;
// flex-direction: column;
// justify-content: center;
// align-items: center;
// padding: 0px;
// gap: 8px;

// width: 119px;
// height: 40px;

// background: #CE2525;
// border-radius: 100px;

// /* Inside auto layout */
// flex: none;
// order: 1;
// flex-grow: 0;

/* Stacked card */

// box-sizing: border-box;

// /* Auto layout */
// display: flex;
// flex-direction: row;
// align-items: flex-start;
// padding: 0px;

// width: 415px;
// height: 420px;

// background: rgba(255, 255, 255, 0.6);
// border: 1px solid #CFCFCF;
// border-radius: 12px;

/* Inside auto layout */
// flex: none;
// order: 0;
// flex-grow: 0;

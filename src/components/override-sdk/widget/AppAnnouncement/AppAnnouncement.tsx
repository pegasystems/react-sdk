import { Card, CardContent, CardHeader, Typography, CardActions, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface AppAnnouncementProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  header?: string;
  description?: string;
  datasource?: any;
  whatsnewlink?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)

    // borderLeft: '6px solid',
    // borderLeftColor: theme.palette.primary.light
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

export default function AppAnnouncement(props: AppAnnouncementProps) {
  const { header = '', description = '', datasource = [], whatsnewlink = '' } = props;
  let details = [];
  if (datasource && datasource.source) {
    details = datasource.source.map(item => {
      return item.name;
    });
  }

  const classes = useStyles();

  const handleClick = () => {
    window.open(whatsnewlink);
  };

  return (
    <Card title='AppAnnouncement' className={classes.root}>
      <CardHeader style={{ padding: '0 1em' }} title={<Typography variant='h6'>{header}</Typography>} />
      <CardContent style={{ padding: '0.5em 1em' }}>
        <Typography variant='body1' gutterBottom>
          {description}
        </Typography>
        {details.map((itm, idx) => {
          const theKey = `AppAnn-item-${idx}`;
          return (
            <Typography key={theKey} variant='body2'>
              - {itm}
            </Typography>
          );
        })}
      </CardContent>
      <CardActions style={{ paddingLeft: '15px' }}>
        <Button className={classes.primaryButton} onClick={handleClick} size='small'>
          See what&apos;s new
        </Button>
      </CardActions>
    </Card>
  );
}

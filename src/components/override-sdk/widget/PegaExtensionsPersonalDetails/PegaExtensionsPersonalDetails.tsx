import { validate } from 'webpack';
import useGetDataAsync from './useDataAsync';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, Icon, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import './PegaExtensionsPersonalDetails.css';
import { icons } from '@pega/cosmos-react-core';

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
    marginRight: '0.5em'
  },
  editProfileButton: {
    padding: '0px 5px',
    background: '#CE2525',
    borderRadius: '100px',
    // margin: '0 auto',
    width: '8em',
    height: '3em',
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      background: '#fa2c2551',
      color: '#333'
    }
  },
  editButton: {
    // padding: '0px 5px',
    background: '#CE2525',
    borderRadius: '8em',
    // margin: '0 auto',
    width: '5em',
    height: '3em',
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      background: '#fa2c2551',
      color: '#333'
    }
  },
  headerText: {
    paddingLeft: '1.8em',
    fontSize: '1.8em',
    fontWeight: 600
  }
}));

export default function PegaExtensionsPersonalDetails(props) {
  const { dtPage, label = 'General information' } = props;

  const { data } = useGetDataAsync({ dataPageName: dtPage.trim() });

  const classes = useStyles();

  const {
    FullName = 'Lorem Ipsum',
    UserName = 'Lorem Ipsum',
    Email = 'Lorem Ipsum',
    Phone = 'Lorem Ipsum',
    Address = 'Lorem Ipsum',
    pyGUID = ''
  } = data || ({} as any);

  const itemsToRender = [
    {
      header: 'General',
      items: [
        {
          label: 'Name',
          value: FullName
        },
        {
          label: 'Username',
          value: UserName
        },
        {
          label: 'Password',
          value: '****************'
        }
      ]
    },
    {
      header: 'Contact Information',
      items: [
        {
          label: 'Phone',
          values: [
            { text: Phone, icon: 'mobile-phone.png' },
            { text: Phone, icon: 'home-alt.png' }
          ]
        },
        {
          label: 'Email',
          values: [
            { text: Email, icon: 'home-alt.png' },
            { text: Email, icon: 'building-2.png' }
          ]
        },
        {
          label: 'Address',
          values: [
            { text: Address, icon: 'home-alt.png' },
            { text: Address, icon: 'building-2.png' }
          ]
        }
      ]
    }
  ];

  return (
    <div style={{ marginTop: '6em' }}>
      <div style={{ display: 'grid', gap: '3rem' }}>
        <div style={{ display: 'grid', justifyContent: 'center', gap: '1.5em' }}>
          <Avatar style={{ width: 'auto', height: 'auto' }}>
            <img src='assets/img/profilePage.png' />
          </Avatar>
          <Button className={classes.editProfileButton}>Edit Photo</Button>
        </div>

        <div style={{ display: 'grid', gap: '2em' }}>
          <div>
            <Typography className={classes.headerText}>{itemsToRender[0].header}</Typography>
            <ul
              id='quick-links'
              className='quick-link-ul-list'
              style={{
                gridTemplateColumns: `repeat(${itemsToRender[1]?.items.length || 3}, 1fr)`,
                justifyItems: 'center',
                gap: '5em',
                padding: '0 8px'
              }}
            >
              {itemsToRender[0].items.map((element, i) => {
                return (
                  <li className='quick-link-list' style={{ width: '30em' }}>
                    <Card className={classes.root}>
                      <CardHeader style={{ paddingTop: 0, paddingBottom: 0 }} title={<Typography variant='h6'>{element.label}</Typography>} />
                      <CardContent>
                        <Typography variant='body2' color='textSecondary' component='p'>
                          {element.value}
                        </Typography>
                      </CardContent>
                      {/* <CardActions style={{ justifyContent: 'end' }}>
                        <Button className={classes.editButton}>Edit</Button>
                      </CardActions> */}
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <Typography className={classes.headerText}>{itemsToRender[1].header}</Typography>

            <ul
              id='quick-links'
              className='quick-link-ul-list'
              style={{
                gridTemplateColumns: `repeat(${itemsToRender[1]?.items.length || 3}, 1fr)`,
                justifyItems: 'center',
                gap: '5em',
                padding: '0 8px'
              }}
            >
              {itemsToRender[1].items.map((element, i) => {
                return (
                  <li className='quick-link-list' style={{ width: '30em' }}>
                    <Card className={classes.root} style={{ width: 'auto' }}>
                      <CardHeader style={{ paddingTop: 0, paddingBottom: 0 }} title={<Typography variant='h6'>{element.label}</Typography>} />
                      <CardContent>
                        {/* <div style={{ display: 'grid', gap: '0.5rem' }}> */}
                        {/* {element.values.map(item => { */}

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={`assets/img/${element.values[0].icon}`} className={classes.caseViewIconImage} />
                          <span>{element.values[0].text}</span>
                        </div>

                        {/* })} */}
                        {/* </div> */}
                      </CardContent>
                      {/* <CardActions style={{ justifyContent: 'end' }}>
                        <Button className={classes.editButton}>Edit</Button>
                      </CardActions> */}
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

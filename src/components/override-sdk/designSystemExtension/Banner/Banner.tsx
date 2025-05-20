import Grid from '@mui/material/Grid';
import './Banner.css';
import { Avatar, Button, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import React, { Children, useState } from 'react';

// AlertBanner is one of the few components that does NOT have getPConnect.
//  So, no need to extend PConnProps

interface BannerProps {
  // If any, enter additional props that only exist on this component
  a: any;
  b: any;
  banner: {
    variant: any;
    backgroundColor: any;
    title: any;
    message: any;
    backgroundImage: any;
    tintImage: any;
  };
  variant: any;
}

export default function Banner(props: BannerProps) {
  const { a, b, banner, variant } = props;
  const { title, message, backgroundImage } = banner;
  const variantMap = {
    'two-column': [6, 6],
    'narrow-wide': [4, 8],
    'wide-narrow': [12, 0],
    'one-column': [12, 0]
  };
  const serviceTeam = [
    { name: 'Emily Davis', profile: 'Service Advisor', picture: 'Amy.jpg' },
    { name: 'Mike Brown', profile: 'Service Technician', picture: 'Luca.jpg' }
  ];

  const driverProfiles = [
    { name: 'Alice Johnson', profile: 'Primary driver', picture: 'Ava.jpg' },
    { name: 'Bob Smith', profile: 'Additional driver', picture: 'Jeffrey.jpg' }
  ];

  const VehicleList = [
    { make: 'Mahinrda', model: 'XUV700', picture: 'Ava.jpg' },
    { make: 'BMW', model: 'X5', picture: 'Jeffrey.jpg' }
  ];

  const middleContainer = [
    { icon: 'assets/img/handshake.png', text: 'Get your instant online guaranteed offer' },
    { icon: 'assets/img/tow-truck.png', text: 'We will pick up your car at your convenience' },
    { icon: 'assets/img/help.png', text: 'Get a check or credit toward a new purchase' }
  ];

  const viewName = a?.length ? a[0].props.getPConnect().viewName : a.props.getPConnect().viewName;

  if (viewName === 'CustomerSelfserviceHomePage') {
    return (
      <div style={{ marginBottom: '1rem', height: '110vh' }}>
        <div className='welcome-text' style={{ marginLeft: '25px' }}>
          <div className='welcome-inside'>
            <Typography className='hi-text'>Hi Ava,</Typography>
            <Typography className='help-text'>How can we help you today?</Typography>
          </div>
        </div>
        <Grid container item xs={12} className='banner-layout' spacing={1}>
          <Grid item xs={variantMap[variant][0]} style={{ padding: '0 1em', width: '100%', maxWidth: 'none', flexBasis: 'auto' }}>
            {a}
          </Grid>
          <Card>
            <CardHeader title={<Typography variant='h6'>Your Driver Profiles</Typography>} style={{ paddingBottom: 0 }} />
            <CardContent style={{ padding: '1em 2em' }}>
              {driverProfiles.map((operator, i) => (
                <div className='service-operator-container'>
                  <Avatar src={`assets/img/${operator.picture}`} />
                  <div>
                    <Typography className='operator-name'>{operator.name}</Typography>
                    <Typography className='operator-profile'>{operator.profile}</Typography>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Grid container item xs={12} style={{ padding: '0 1em', width: '100%' }}>
            <Grid item xs={9} style={{ padding: '0 1em' }}>
              {b}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
  if (viewName === 'UConnect_new') {
    return (
      <div style={{ marginBottom: '1rem', height: '110vh' }}>
        <div className='welcome-text' style={{ marginLeft: '25px' }}>
          <div className='welcome-inside'>
            <Typography className='hi-text'>Welcome, Ava!</Typography>
          </div>
        </div>

        <Grid container item xs={12} className='banner-layout' spacing={1}>
          <Grid item xs={variantMap[variant][0]} style={{ padding: '0 1em', width: '100%', maxWidth: 'none', flexBasis: 'auto' }}>
            {/* {a} */}
          </Grid>
        </Grid>
        <Grid container item xs={12} style={{ padding: '0 1em', width: '100%' }}>
          <Grid item xs={12} style={{ padding: '0 1em' }}>
            {b[0]}
          </Grid>
          <Grid container item xs={12} style={{ padding: '0 1em', width: '100%' }}>
            <Grid item xs={9} style={{ padding: '0 1em' }}>
              {b[1]}
            </Grid>
            <Grid item xs={3} style={{ padding: '0.5em 1em' }} />
            <Card>
              <CardHeader title={<Typography variant='h6'>Your Service team</Typography>} style={{ paddingBottom: 0 }} />
              <CardContent style={{ padding: '1em 2em' }}>
                {serviceTeam.map(operator => (
                  <div className='service-operator-container'>
                    <Avatar src={`assets/img/${operator.picture}`} />
                    <div className='service-operator-details'>
                      <Typography className='operator-name'>{operator.name}</Typography>
                      <Typography className='operator-profile'>{operator.profile}</Typography>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader title={<Typography variant='h6'>Vehicle List</Typography>} style={{ paddingBottom: 0 }} />
              <CardContent style={{ padding: '1em 2em' }}>
                {VehicleList.map(vehicle => (
                  <div className='service-operator-container'>
                    <Avatar src={`assets/img/${vehicle.picture}`} />
                    <div className='service-operator-details'>
                      <Typography className='operator-name'>{vehicle.make}</Typography>
                      <Typography className='operator-profile'>{vehicle.model}</Typography>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
  if (variant === 'narrow-wide') {
    return (
      <div style={{ marginBottom: '1rem', height: '110vh' }}>
        <div className='welcome-text' style={{ marginLeft: '25px' }}>
          <div className='welcome-inside'>
            <Typography className='hi-text'>Hi Ava,</Typography>
            <Typography className='help-text'>How can we help you today?</Typography>
          </div>
        </div>
        <Grid container item xs={12} className='banner-layout' spacing={1}>
          <Grid item xs={variantMap[variant][0]} style={{ padding: '0 1em', width: '100%', maxWidth: 'none', flexBasis: 'auto' }}>
            {a}
          </Grid>
          <Grid container item xs={12} style={{ padding: '0 1em', width: '100%' }}>
            <Grid item xs={9} style={{ padding: '0 1em' }}>
              {b}
            </Grid>
            <Grid item xs={3} style={{ padding: '0.5em 1em' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                <Card>
                  <CardHeader title={<Typography variant='h6'>Your Service team</Typography>} style={{ paddingBottom: 0 }} />
                  <CardContent style={{ padding: '1em 2em' }}>
                    {serviceTeam.map(operator => (
                      <div className='service-operator-container'>
                        <Avatar src={`assets/img/${operator.picture}`} />
                        <div className='service-operator-details'>
                          <Typography className='operator-name'>{operator.name}</Typography>
                          <Typography className='operator-profile'>{operator.profile}</Typography>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title={<Typography variant='h6'>Your Driver Profiles</Typography>} style={{ paddingBottom: 0 }} />
                  <CardContent style={{ padding: '1em 2em' }}>
                    {driverProfiles.map((operator, i) => (
                      <div className='service-operator-container'>
                        <Avatar src={`assets/img/${operator.picture}`} />
                        <div>
                          <Typography className='operator-name'>{operator.name}</Typography>
                          <Typography className='operator-profile'>{operator.profile}</Typography>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: '1rem', height: '110vh' }}>
      <div className='welcome-text' style={{ paddingTop: '6em', justifyContent: 'center' }}>
        <div className='welcome-inside'>
          <Typography className='interest-text'>We’re interested in your car!</Typography>
          <Typography className='sub-heading' style={{ marginTop: '0.7em', width: '25em' }}>
            With our quick and easy trade in process, you will get an instant offer that is good for 30 days.
          </Typography>
        </div>
      </div>

      <div className='middle-card' style={{ marginTop: '1.2em' }}>
        <Typography className='middle-card-heading-text'>How it works</Typography>
        <div>
          <ul style={{ display: 'flex', margin: '0 10em', gap: '4em', listStyle: 'none' }}>
            {middleContainer.map(item => {
              return (
                <>
                  <li>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton>
                        <img src={item.icon} />
                      </IconButton>
                    </div>
                    <Typography className='sub-heading'>{item.text}</Typography>
                  </li>
                  <div className='separator' />
                </>
              );
            })}
          </ul>
        </div>
      </div>

      <Grid container item xs={12} className='banner-layout' spacing={1} style={{ justifyContent: 'center', marginTop: '2em' }}>
        <Grid item xs={4} style={{ padding: '0 1em', width: '100%', flexBasis: 'auto', marginRight: '2.5em' }}>
          {a}
        </Grid>
        <Grid container item xs={12} style={{ padding: '1em', width: '100%' }}>
          <Grid item xs={9} style={{ padding: '0 1em' }}>
            {b}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Banner.css';

export default function Banner(props) {
  const { a, b, banner, variant} = props;
  const { title, message, backgroundImage } = banner;
  const variantMap = {
    'two-column': [6, 6],
    'narrow-wide': [4, 8],
    'wide-narrow': [8, 4]
  };
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        className='background-image-style'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className='background-style content'>
          <div>
            <h1 className='title'>{title}</h1>
            <p className='message'>{message}</p>
          </div>
        </div>
      </div>
      <Grid container item xs={12} className='banner-layout' spacing={1}>
        <Grid item xs={variantMap[variant][0]} style={{ padding: '1em' }}>
          {a}
        </Grid>
        <Grid item xs={variantMap[variant][1]} style={{ padding: '1em' }}>
          {b}
        </Grid>
      </Grid>
    </div>
  );
}

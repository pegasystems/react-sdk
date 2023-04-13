import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Banner.css';

export default function Banner(props) {
  const { a, b, banner } = props;
  const { title, message, backgroundImage } = banner;
  return (
    <div>
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
      <div style={{ padding: '1rem' }}>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={8} style={{ padding: '1em' }}>
            {a}
          </Grid>
          <Grid item xs={4} style={{ padding: '1em' }}>
            {b}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

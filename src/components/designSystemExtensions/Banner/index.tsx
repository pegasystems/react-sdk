import React from 'react';
import './Banner.css';

export default function Banner(props) {
  const { a, b, banner, variant} = props;
  const { title, message, backgroundImage } = banner;
  const variantMap = {
    'two-column': '1fr 1fr',
    'narrow-wide': '3fr 7fr',
    'wide-narrow': '7fr 3fr'
  };
  const gridCols = variantMap[variant];
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
      <div className='banner-layout' style={{gridTemplateColumns: b ? `${gridCols}` : '1fr'}}>
        <div style={{ padding: '1em' }}>
          {a}
        </div>
        <div style={{ padding: '1em' }}>
          {b}
        </div>
      </div>
    </div>
  );
}

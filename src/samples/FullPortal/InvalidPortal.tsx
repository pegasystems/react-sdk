import React from 'react';
import { logout } from '../../helpers/authManager';

export default function InvalidPortal({ name }) {
  const logOff = () => {
    logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  };

  return (
    <div className='portal-load-error'>
      <div>
        Unable to open portal: <span className='portal-name'>{name}</span> <br />
        Please authenticate as an end user operator, rather than a developer or an administrator.
      </div>
      <button type='button' className='logout-btn' onClick={logOff}>
        Logout
      </button>
    </div>
  );
}

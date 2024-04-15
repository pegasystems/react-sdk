import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import AppSelector from '../AppSelector';


// declare let __webpack_public_path__; // eslint-disable-line

const TopLevelApp = () => {
  const [basepath, setBasepath] = useState('');  
  useEffect(() => {
    getSdkConfig().then(sdkConfig => {
      const url = new URL(sdkConfig.serverConfig.sdkContentServerUrl);
      setBasepath(url.pathname);      
      
      
      /* if(url){
        // eslint-disable-next-line
        __webpack_public_path__ = url;
      } else {
        // eslint-disable-next-line
        __webpack_public_path__ = '/';
      } */
    });
  }, []);

  return ( basepath &&
    <BrowserRouter basename={basepath}>
      <AppSelector/>
    </BrowserRouter>
  );
}

export default TopLevelApp;

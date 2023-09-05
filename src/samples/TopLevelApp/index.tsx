import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';
import AppSelector from '../AppSelector';

const TopLevelApp = () => {
  const [basepath, setBasepath] = useState('');
  useEffect(() => {
    getSdkConfig().then(sdkConfig => {
      const url = new URL(sdkConfig.serverConfig.sdkContentServerUrl);
      setBasepath(url.pathname);
    });
  }, []);

  return ( basepath &&
    <BrowserRouter basename={basepath}>
      <AppSelector/>
    </BrowserRouter>
  );
}

export default TopLevelApp;

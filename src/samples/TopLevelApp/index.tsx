import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';
import AppSelector from '../AppSelector';
import { AppContext } from '../HighIncomeCase/reuseables/AppContext';


// declare let __webpack_public_path__; // eslint-disable-line

const TopLevelApp = () => {
  const [basepath, setBasepath] = useState('');  
  
  const [backlinkAction, setBacklinkAction] = useState<Function>(() => {});
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
      <AppContext.Provider value={{appBacklinkAction: backlinkAction, setAppBacklinkAction: setBacklinkAction}}>
        <AppSelector/>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default TopLevelApp;

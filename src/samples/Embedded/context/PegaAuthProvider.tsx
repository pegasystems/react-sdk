import { createContext, useContext, useEffect, useState } from 'react';
import { getSdkConfig, loginIfNecessary, sdkSetAuthHeader, sdkSetCustomTokenParamsCB } from '@pega/auth/lib/sdk-auth-manager';

interface AuthContextType {
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

const PegaAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const initialize = async () => {
    try {
      // Add event listener for when logged in and constellation bootstrap is loaded
      document.addEventListener('SdkConstellationReady', () => {
        setIsAuthenticated(true);
      });

      // Initialize authentication settings
      await initializeAuthentication();

      // this function will handle login process, and SdkConstellationReady event will be fired once PCore is ready
      loginIfNecessary({ appName: 'embedded', mainRedirect: false });
    } catch (error) {
      console.error('Something went wrong while login', error);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return <UserAuthContext.Provider value={{ isAuthenticated }}>{children}</UserAuthContext.Provider>;
};

export default PegaAuthProvider;

export const usePegaAuth = (): AuthContextType => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

async function initializeAuthentication() {
  const { authConfig } = await getSdkConfig();

  if ((authConfig.mashupGrantType === 'none' || !authConfig.mashupClientId) && authConfig.customAuthType === 'Basic') {
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${authConfig.mashupUserIdentifier}:${window.atob(authConfig.mashupPassword)}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if ((authConfig.mashupGrantType === 'none' || !authConfig.mashupClientId) && authConfig.customAuthType === 'BasicTO') {
    const now = new Date();
    const expTime = new Date(now.getTime() + 5 * 60 * 1000);
    let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
    const regex = /[-:]/g;
    sISOTime = sISOTime.replace(regex, '');
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${authConfig.mashupUserIdentifier}:${window.atob(authConfig.mashupPassword)}:${sISOTime}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if (authConfig.mashupGrantType === 'customBearer' && authConfig.customAuthType === 'CustomIdentifier') {
    // Use custom bearer with specific custom parameter to set the desired operator via
    //  a userIdentifier property.  (Caution: highly insecure...being used for simple demonstration)
    sdkSetCustomTokenParamsCB(() => {
      return { userIdentifier: authConfig.mashupUserIdentifier };
    });
  }
}

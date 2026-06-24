import { createContext, useContext, useEffect, useState } from 'react';
import { getNormalizedSdkConfig, loginIfNecessary, sdkSetAuthHeader, sdkSetCustomTokenParamsCB } from '@pega/auth/lib/sdk-auth-manager';

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

      // Retrieve the normalized sdk config (for mashup by specifying false)
      const sdkConfig = await getNormalizedSdkConfig(false);

      // Initialize authentication settings
      initializeAuthentication(sdkConfig);

      // this function will handle login process, and SdkConstellationReady event will be fired once PCore is ready
      loginIfNecessary({ appName: 'embedded', mainRedirect: false, sdkConfig });
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

function initializeAuthentication(sdkConfig: any) {
  const { authConfig } = sdkConfig;

  if ((authConfig.grantType === 'none' || !authConfig.clientId) && authConfig.customAuthType === 'Basic') {
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${authConfig.userIdentifier}:${window.atob(authConfig.password)}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if ((authConfig.grantType === 'none' || !authConfig.clientId) && authConfig.customAuthType === 'BasicTO') {
    const now = new Date();
    const expTime = new Date(now.getTime() + 5 * 60 * 1000);
    let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
    const regex = /[-:]/g;
    sISOTime = sISOTime.replace(regex, '');
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${authConfig.userIdentifier}:${window.atob(authConfig.password)}:${sISOTime}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if (authConfig.grantType === 'customBearer' && authConfig.customAuthType === 'CustomIdentifier') {
    // Use custom bearer with specific custom parameter to set the desired operator via
    //  a userIdentifier property.  (Caution: highly insecure...being used for simple demonstration)
    sdkSetCustomTokenParamsCB(() => {
      return { userIdentifier: authConfig.userIdentifier };
    });
  }
}

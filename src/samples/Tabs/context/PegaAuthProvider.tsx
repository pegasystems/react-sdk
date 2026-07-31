import { createContext, useContext, useEffect, useState } from 'react';
import { getSdkConfig, loginIfNecessary, sdkSetAuthHeader, sdkSetCustomTokenParamsCB } from '@pega/auth/lib/sdk-auth-manager';

interface AuthContextType {
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

const PegaAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initialize = async () => {
    try {
      // SdkConstellationReady fires once logged in and the constellation bootstrap is loaded.
      document.addEventListener('SdkConstellationReady', () => setIsAuthenticated(true));

      await initializeAuthentication();

      loginIfNecessary({ appName: 'tabs', mainRedirect: false });
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
    throw new Error('usePegaAuth must be used within a PegaAuthProvider');
  }
  return context;
};

async function initializeAuthentication() {
  const { authConfig } = await getSdkConfig();

  if ((authConfig.mashupGrantType === 'none' || !authConfig.mashupClientId) && authConfig.customAuthType === 'Basic') {
    const sB64 = window.btoa(`${authConfig.mashupUserIdentifier}:${window.atob(authConfig.mashupPassword)}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if ((authConfig.mashupGrantType === 'none' || !authConfig.mashupClientId) && authConfig.customAuthType === 'BasicTO') {
    const now = new Date();
    const expTime = new Date(now.getTime() + 5 * 60 * 1000);
    let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
    sISOTime = sISOTime.replace(/[-:]/g, '');
    const sB64 = window.btoa(`${authConfig.mashupUserIdentifier}:${window.atob(authConfig.mashupPassword)}:${sISOTime}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if (authConfig.mashupGrantType === 'customBearer' && authConfig.customAuthType === 'CustomIdentifier') {
    sdkSetCustomTokenParamsCB(() => ({ userIdentifier: authConfig.mashupUserIdentifier }));
  }
}

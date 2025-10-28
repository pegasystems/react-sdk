'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

const PegaAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const initialize = async () => {
    try {
      const { getSdkConfig, loginIfNecessary } = await import('@pega/auth/lib/sdk-auth-manager');

      // Add event listener for when logged in and constellation bootstrap is loaded
      document.addEventListener('SdkConstellationReady', () => {
        // handleSdkConstellationReady()
        console.log('SdkConstellationReady event fired');
        setIsAuthenticated(true);
      });

      const { authConfig } = await getSdkConfig();
      await initializeAuthentication(authConfig);

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

async function initializeAuthentication(sdkConfigAuth: any) {
  const { sdkSetAuthHeader, sdkSetCustomTokenParamsCB } = await import('@pega/auth/lib/sdk-auth-manager');
  if ((sdkConfigAuth.mashupGrantType === 'none' || !sdkConfigAuth.mashupClientId) && sdkConfigAuth.customAuthType === 'Basic') {
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if ((sdkConfigAuth.mashupGrantType === 'none' || !sdkConfigAuth.mashupClientId) && sdkConfigAuth.customAuthType === 'BasicTO') {
    const now = new Date();
    const expTime = new Date(now.getTime() + 5 * 60 * 1000);
    let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
    const regex = /[-:]/g;
    sISOTime = sISOTime.replace(regex, '');
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if (sdkConfigAuth.mashupGrantType === 'customBearer' && sdkConfigAuth.customAuthType === 'CustomIdentifier') {
    // Use custom bearer with specific custom parameter to set the desired operator via
    //  a userIdentifier property.  (Caution: highly insecure...being used for simple demonstration)
    sdkSetCustomTokenParamsCB(() => {
      return { userIdentifier: sdkConfigAuth.mashupUserIdentifier };
    });
  }
}

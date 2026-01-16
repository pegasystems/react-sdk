import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import type { CaseOptions } from '@pega/pcore-pconnect-typedefs/mashup/types';

import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import localSdkComponentMap from '../../../../sdk-local-component-map';

import { usePegaAuth } from './PegaAuthProvider';

function RootComponent(props) {
  const PegaConnectObj = createPConnectComponent();
  const thePConnObj = <PegaConnectObj {...props} />;

  /**
   * NOTE: For Embedded mode, we add in displayOnlyFA to our React context
   * so it is available to any component that may need it.
   * VRS: Attempted to remove displayOnlyFA but it presently handles various components which
   * SDK does not yet support, so all those need to be fixed up before it can be removed.
   * To be done in a future sprint.
   */
  const contextValue = useMemo(() => {
    return { store: PCore.getStore(), displayOnlyFA: true };
  }, [PCore.getStore()]);

  return <StoreContext.Provider value={contextValue}>{thePConnObj}</StoreContext.Provider>;
}

interface PegaContextProps {
  isPegaReady: boolean;
  rootPConnect?: typeof PConnect; // Function to get Pega Connect object, if available
  createCase: (mashupCaseType: string, options: CaseOptions) => Promise<void>;
  PegaContainer: React.FC;
}

declare const myLoadMashup: any;

const PegaContext = createContext<PegaContextProps | undefined>(undefined);

interface PegaReadyProviderProps {
  theme: any;
}

export const PegaReadyProvider: React.FC<React.PropsWithChildren<PegaReadyProviderProps>> = ({ children, theme }) => {
  const { isAuthenticated } = usePegaAuth();
  const [isPegaReady, setIsPegaReady] = useState<boolean>(false);
  const [rootProps, setRootProps] = useState<{
    getPConnect?: () => typeof PConnect;
    [key: string]: any;
  }>({});

  const [loading, setLoading] = useState<boolean>(false);

  const startMashup = async () => {
    try {
      PCore.onPCoreReady(async renderObj => {
        console.log(`PCore ready!`);

        const theComponentMap = await getSdkComponentMap(localSdkComponentMap);
        console.log(`SdkComponentMap initialized`, theComponentMap);

        const { props } = renderObj;
        setRootProps(props);
        setIsPegaReady(true);
      });

      // load the Mashup and handle the onPCoreEntry response that establishes the
      // top level Pega root element (likely a RootContainer)
      myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
    } catch (error) {
      console.error('Error loading pega:', error);
    }
  };

  /**
   * Start the mashup once authenticated
   * This ensures that the Pega environment is ready for use
   */
  useEffect(() => {
    if (isAuthenticated) {
      startMashup();
    }
  }, [isAuthenticated]);

  // Memoize the root PConnect function to avoid unnecessary re-renders
  const rootPConnect = useMemo(() => {
    if (rootProps && rootProps?.getPConnect) {
      return rootProps.getPConnect();
    }

    return undefined;
  }, [rootProps]);

  const createCase = (mashupCaseType: string, options: CaseOptions) => {
    if (!isPegaReady) {
      console.error('Pega is not ready. Cannot create case.');
      return Promise.reject('Pega is not ready');
    }

    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      // If mashupCaseType is null or undefined, get the first case type from the environment info
      if (!mashupCaseType) {
        const caseTypes = PCore.getEnvironmentInfo()?.environmentInfoObject?.pyCaseTypeList;
        if (caseTypes && caseTypes.length > 0) {
          mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
        }
      }

      PCore.getMashupApi()
        .createCase(mashupCaseType, PCore.getConstants().APP.APP, options)
        .then(() => {
          resolve();
        })
        .catch(error => {
          console.error('Error creating case:', error);
          reject(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const PegaContainer = () => {
    if (loading) return <div style={{ textAlign: 'center' }}>Loading...</div>;

    return isPegaReady ? <RootComponent {...rootProps} /> : null;
  };

  return (
    <PegaContext.Provider value={{ isPegaReady, rootPConnect, createCase, PegaContainer }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </PegaContext.Provider>
  );
};

export const usePega = () => {
  const context = useContext(PegaContext);
  if (!context) {
    throw new Error('usePega must be used within a PegaProvider');
  }
  return context;
};

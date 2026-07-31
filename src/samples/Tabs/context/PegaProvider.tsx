import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CaseOptions } from '@pega/pcore-pconnect-typedefs/mashup/types';

import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import localSdkComponentMap from '../../../../sdk-local-component-map';

import { usePegaAuth } from './PegaAuthProvider';

/** Wraps the root PConnect in the store context, mirroring the Embedded sample's RootComponent. */
function RootComponent(props) {
  const PegaConnectObj = createPConnectComponent();
  const thePConnObj = <PegaConnectObj {...props} />;

  // displayOnlyFA is required by mashup/Embedded mode for components the SDK does not yet fully support.
  const contextValue = useMemo(() => {
    return { store: PCore.getStore(), displayOnlyFA: true };
  }, [PCore.getStore()]);

  return <StoreContext.Provider value={contextValue}>{thePConnObj}</StoreContext.Provider>;
}

// All cases live simultaneously as items of a single "multiple" mode primary container.
const APP_CONTEXT = 'app';
const PRIMARY_TARGET = 'app/primary';

export interface CaseReference {
  /** Container item that holds this case, e.g. "app/primary_1". Used to activate/close it. */
  containerItemID: string;
  /** Friendly business id (pyID) shown to the user, e.g. "R-1001". */
  businessID: string;
}

export interface CaseTypeInfo {
  /** Case class name used to create the case, e.g. "DIXL-MediaCo-Work-PurchasePhone". */
  id: string;
  /** Display name of the case type, e.g. "Purchase Phone". */
  name: string;
}

interface PegaContextProps {
  isPegaReady: boolean;
  /** Case types available to create, sourced from the environment info. */
  caseTypes: CaseTypeInfo[];
  createCase: (caseTypeID: string) => Promise<CaseReference>;
  /** Brings an already-open case to the front with no server reload. */
  activateCase: (containerItemID: string) => Promise<unknown>;
  /** Removes a case's container item from the store. */
  closeCase: (containerItemID: string) => Promise<unknown>;
  /** Shared, always-mounted render surface hosting every open case. */
  PegaContainer: React.FC;
}

declare const myLoadMashup: any;

const PegaContext = createContext<PegaContextProps | undefined>(undefined);

/** A ContainerManager bound to the primary container, used to activate/close case items. */
function getPrimaryContainerManager() {
  return PCore.createPConnect({
    meta: { type: 'ViewContainer', config: { name: 'primary' } },
    options: { context: APP_CONTEXT }
  })
    .getPConnect()
    .getContainerManager();
}

/** Reads the newly active case's identifiers from the primary container after create. */
function readActiveCaseReference(): CaseReference {
  const containerItemID = PCore.getContainerUtils().getActiveContainerItemName(PRIMARY_TARGET) || `${PRIMARY_TARGET}_1`;
  const businessID = PCore.getStoreValue('.pyID', 'caseInfo.content', containerItemID) || '';
  return { containerItemID, businessID };
}

/** Reads the case types available to create from the environment info. */
function readCaseTypes(): CaseTypeInfo[] {
  const list = (PCore.getEnvironmentInfo()?.environmentInfoObject?.pyCaseTypeList as any[]) || [];
  return list
    .filter(caseType => caseType?.pyWorkTypeName && caseType?.pyWorkTypeImplementationClassName)
    .map(caseType => ({ id: caseType.pyWorkTypeImplementationClassName, name: caseType.pyWorkTypeName }));
}

export const PegaProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = usePegaAuth();
  const [isPegaReady, setIsPegaReady] = useState(false);
  const [rootProps, setRootProps] = useState<Record<string, any> | null>(null);
  const [caseTypes, setCaseTypes] = useState<CaseTypeInfo[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    PCore.onPCoreReady(async renderObj => {
      await getSdkComponentMap(localSdkComponentMap);
      // Switch the primary container to "multiple" mode before its ViewContainer mounts so every
      // created case stays live. INIT_CONTAINERS is a no-op once initialized, so ours must win first.
      getPrimaryContainerManager().initializeContainers({ type: 'multiple' });
      setRootProps(renderObj.props);
      setCaseTypes(readCaseTypes());
      setIsPegaReady(true);
    });

    // Loads the mashup shell that establishes the top-level Pega root (defined by the bootstrap shell).
    myLoadMashup('pega-root', false);
  }, [isAuthenticated]);

  const contextValue = useMemo<PegaContextProps>(() => {
    const createCase = async (caseTypeID: string): Promise<CaseReference> => {
      const options: CaseOptions = { pageName: 'pyEmbedAssignment', startingFields: {} };

      await PCore.getMashupApi().createCase(caseTypeID, PCore.getConstants().APP.APP, options);
      return readActiveCaseReference();
    };

    const activateCase = (containerItemID: string): Promise<unknown> =>
      getPrimaryContainerManager().activateContainerItem({ target: PRIMARY_TARGET, containerItemID });

    const closeCase = (containerItemID: string): Promise<unknown> =>
      getPrimaryContainerManager().removeContainerItem({ target: PRIMARY_TARGET, containerItemID });

    const PegaContainer: React.FC = () => (rootProps ? <RootComponent {...rootProps} /> : null);

    return { isPegaReady, caseTypes, createCase, activateCase, closeCase, PegaContainer };
  }, [isPegaReady, caseTypes, rootProps]);

  return <PegaContext.Provider value={contextValue}>{children}</PegaContext.Provider>;
};

export const usePega = (): PegaContextProps => {
  const context = useContext(PegaContext);
  if (!context) {
    throw new Error('usePega must be used within a PegaProvider');
  }
  return context;
};

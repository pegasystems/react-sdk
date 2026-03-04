import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface PortalContextProps {
  portalContent: ReactNode | null;
  setPortalContent: (content: ReactNode | null) => void;
  clearPortal: () => void;
}

const PortalContext = createContext<PortalContextProps | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [portalContent, setPortalContentState] = useState<ReactNode | null>(null);

  const setPortalContent = useCallback((content: ReactNode | null) => {
    setPortalContentState(content);
  }, []);

  const clearPortal = useCallback(() => {
    setPortalContentState(null);
  }, []);

  return <PortalContext.Provider value={{ portalContent, setPortalContent, clearPortal }}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}

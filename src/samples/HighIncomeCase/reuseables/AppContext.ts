import { createContext } from 'react';

export interface AppContextValues {
  appBacklinkProps?: {
    appBacklinkAction?: Function | null;
    appBacklinkText?: String | null;
  };
  showLanguageToggle?: boolean;
}

const AppContext = createContext<AppContextValues>({
  appBacklinkProps: {
    appBacklinkAction: null,
    appBacklinkText: null
  },
  showLanguageToggle: false
});

export { AppContext as default };

import { createContext } from 'react';


export interface AppContextValues {
  appBacklinkProps: {
    appBacklinkAction?: Function | null;
    appBacklinkText?: String | null;
  };
  showLanguageToggle?: boolean;
  serviceParam?: string;
}
// TODO: Once this code exposed to common folder, we will refer AppContext from reuseable components
const AppContextEducation = createContext<AppContextValues>({  
  appBacklinkProps: {
    appBacklinkAction: null,
    appBacklinkText: null
  },
  showLanguageToggle: false,
  serviceParam: ''
});

export { AppContextEducation as default };


import { createContext } from 'react';


export interface AppContextValues {
    appBacklinkProps:{
        appBacklinkAction?:Function,
        appBacklinkText?:String
    },
    showLanguageToggle?: boolean
}

const AppContext =  createContext<AppContextValues>(
                                {
                                    appBacklinkProps:{
                                        appBacklinkAction: null,
                                        appBacklinkText: null  
                                    },
                                    showLanguageToggle: false
                                });

export { AppContext as default }
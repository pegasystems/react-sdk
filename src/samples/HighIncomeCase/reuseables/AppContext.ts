
import { createContext } from 'react';


export interface AppContextValues {
    appBacklinkProps:{
        appBacklinkAction?:Function,
        appBacklinkText?:String
    }
}

const AppContext =  createContext<AppContextValues>(
                                {
                                    appBacklinkProps:{
                                        appBacklinkAction: null,
                                        appBacklinkText: null  
                                    }                                  
                                });

export { AppContext as default }

import { createContext } from 'react';

const AppContext =  createContext<{appBacklinkAction?:Function}>({
                                    appBacklinkAction: null
                                    });

export { AppContext as default }
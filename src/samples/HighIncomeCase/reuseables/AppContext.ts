
import { useState, createContext } from 'react';

const AppContext =  createContext<{appBacklinkAction:any, setAppBacklinkAction:any}>({appBacklinkAction: ()=>{}, setAppBacklinkAction: ()=>{}});

export { AppContext }
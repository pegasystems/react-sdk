import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';


export default function ProofOfEntitlement(){

    const history = useHistory();

    const onRedirectDone = ()=>{
        history.push('/view-proof-entitlement');
        // appName and mainRedirect params have to be same as earlier invocation
        loginIfNecessary({ appName: 'embedded', mainRedirect: true });   
    }

    useEffect( () => {
        if(!sdkIsLoggedIn()){
            loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: onRedirectDone });
        }  
    }, [])


    return <>Proof of Entitlement</>
}


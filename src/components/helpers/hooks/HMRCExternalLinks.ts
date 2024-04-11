import { useEffect, useState } from 'react';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';

export default function useHMRCExternalLinks(){
    const [referrerURL, setReferrerURL] = useState<string>(null);
    const [hmrcURL, setHmrcURL] = useState<string>(null);
    useEffect(() => {
    const getReferrerURL = async () => {
        const { serverConfig: { sdkContentServerUrl, sdkHmrcURL } } = await getSdkConfig();
        setReferrerURL(sdkContentServerUrl);
        setHmrcURL(sdkHmrcURL);
    }
    getReferrerURL();
    }, []);
    

    return {referrerURL, hmrcURL};
}
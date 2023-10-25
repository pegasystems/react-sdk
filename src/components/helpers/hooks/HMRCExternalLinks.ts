import { useEffect, useState } from 'react';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';

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
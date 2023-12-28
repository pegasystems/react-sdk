import { useEffect, useState } from 'react';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';

interface ResponseType {
  data: { Shuttered: boolean };
}

export default function ServiceShuttered() {
  const [serviceShuttered, setServiceShuttered] = useState(false);

  function isServiceShuttered(shutterPageUrl: string) {
    const featureID = 'ChB';
    const featureType = 'Service';

    const parameters = new URLSearchParams(
      `{FeatureID: ${featureID}, FeatureType: ${featureType}}`
    );

    const url = `${shutterPageUrl}?dataViewParameters=${parameters}`;

    const { invokeCustomRestApi } = PCore.getRestClient();
    invokeCustomRestApi(url, {
      method: 'GET'
    })
      .then((resp: ResponseType) => {
        const isShuttered = resp.data.Shuttered;
        setServiceShuttered(isShuttered);
      })
      .catch((err: Error) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }
  // }

  // Runs the is service shuttered function and sets the shutter rest api url when the view changes
  useEffect(() => {
    getSdkConfig().then(sdkConfig => {
      const url = new URL(
        `${sdkConfig.serverConfig.infinityRestServerUrl}/app/${sdkConfig.serverConfig.appAlias}/api/application/v2/data_views/D_ShutterLookup`
      );
      isServiceShuttered(url.href);
    });
  }, []);

  return { serviceShuttered };
}

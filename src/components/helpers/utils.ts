import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';

export const scrollToTop = () => {
  const position = document.getElementById('#main-content')?.offsetTop || 0;
  document.body.scrollTop = position;
  document.documentElement.scrollTop = position;
};

export const GBdate = date => {
  const d = String(date).split('-');
  return d.length > 1 ? `${d[2]}/${d[1]}/${d[0]}` : date;
};

export const checkErrorMsgs = (errorMsgs = [], fieldIdentity = '', fieldElement = '') => {
  return errorMsgs.find(
    element =>
      element.message.fieldId === fieldIdentity || element.message.fieldId.startsWith(fieldElement)
  );
};

export const shouldRemoveFormTagForReadOnly = (pageName: string) => {
  const arrContainerNamesFormNotRequired = ['Your date of birth'];
  return arrContainerNamesFormNotRequired.includes(pageName);
};

export const getServiceShutteredStatus = async (): Promise<boolean> => {
  interface ResponseType {
    data: { Shuttered: boolean };
  }
  try {
    const sdkConfig = await getSdkConfig();
    const urlConfig = new URL(
      `${sdkConfig.serverConfig.infinityRestServerUrl}/app/${sdkConfig.serverConfig.appAlias}/api/application/v2/data_views/D_ShutterLookup`
    ).href;
    const featureID = 'ChB';
    const featureType = 'Service';

    const parameters = new URLSearchParams(
      `{FeatureID: ${featureID}, FeatureType: ${featureType}}`
    );

    const url = `${urlConfig}?dataViewParameters=${parameters}`;
    const { invokeCustomRestApi } = PCore.getRestClient();
    // eslint-disable-next-line @typescript-eslint/return-await
    return await invokeCustomRestApi(url, {
      method: 'GET'
    })
      .then((response: ResponseType) => {
        return response.data.Shuttered;
      })
      .catch((error: Error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
      });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return false;
  }
};

export const isFieldSetReqiredForSelectComponent = (label: string) => {
  const arrFieldSetNotRequiredForSelectComponent = ['name of building society'];
  return !arrFieldSetNotRequiredForSelectComponent.includes(label.toLocaleLowerCase());
};

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
    /* eslint-disable */
    return invokeCustomRestApi(
      url,
      {
        method: 'GET',
        body: '',
        headers: '',
        withoutDefaultHeaders: false
      },
      ''
    )
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

export const isUnAuthJourney = () => {
  const containername = PCore.getContainerUtils().getActiveContainerItemName(
    `${PCore.getConstants().APP.APP}/primary`
  );
  const context = PCore.getContainerUtils().getActiveContainerItemName(`${containername}/workarea`);
  const caseType = PCore.getStoreValue('.CaseType', 'caseInfo.content', context);
  return caseType === 'Unauth';
};

export const isSingleEntity = (propReference: string, getPConnect) => {
  const containerName = getPConnect().getContainerName();
  const context = PCore.getContainerUtils().getActiveContainerItemContext(
    `${PCore.getConstants().APP.APP}/${containerName}`
  );

  const count = PCore.getStoreValue(
    propReference.split('[')[0],
    'caseInfo.content',
    context
  )?.length;

  if (typeof count !== 'undefined' && count === 1) return true;
};

// This method will remove redundant string separated by seperatorexport
export const removeRedundantString = (redundantString: string, separator: string = '.') => {
  const list = redundantString.split(separator);
  const newList = [];
  let uniqueString = '';
  if (list.length > 0) {
    list.forEach(item => {
      if (!newList.includes(item.trim())) {
        newList.push(item);
      }
    });
    if (newList.length > 0) {
      newList.forEach(element => {
        uniqueString = uniqueString + (uniqueString.length > 0 ? '. ' : '') + element.trim();
      });
    }
  }
  return uniqueString;
};

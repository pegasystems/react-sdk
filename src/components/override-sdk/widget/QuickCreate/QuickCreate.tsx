import { useEffect, useState } from 'react';
import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface QuickCreateProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  heading: string;
  showCaseIcons: boolean;
  classFilter: any[];
}

export default function QuickCreate(props: QuickCreateProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const WssQuickCreate = getComponentFromMap('WssQuickCreate');

  const { getPConnect, heading, showCaseIcons, classFilter } = props;
  const pConn = getPConnect();
  const createCase = className => {
    pConn
      .getActionsApi()
      .createWork(className, {} as any)
      .catch(error => {
        console.log('Error in case creation: ', error?.message);
      });
  };

  const [quickCreatecases, setCases] = useState([]);

  /* If the classFilter is empty and has no entries - we will default to the default set of case types
     It will usually come from the envInfo but for Launchpad, this is not populated - instead get the list of cases from the store */
  useEffect(() => {
    const cases: any = [];
    const defaultCases: any = [];
    const envInfo = PCore.getEnvironmentInfo();
    if (envInfo?.environmentInfoObject?.pyCaseTypeList) {
      envInfo.environmentInfoObject.pyCaseTypeList.forEach(casetype => {
        if (casetype.pyWorkTypeName && casetype.pyWorkTypeImplementationClassName) {
          defaultCases.push({
            classname: casetype.pyWorkTypeImplementationClassName,
            onClick: () => {
              createCase(casetype.pyWorkTypeImplementationClassName);
            },
            ...(showCaseIcons && { icon: Utils.getImageSrc(casetype?.pxIcon, Utils.getSDKStaticConentUrl()) }),
            label: casetype.pyWorkTypeName
          });
        }
      });
    } else {
      const pConnectInAppContext = PCore.createPConnect({
        options: { context: PCore.getConstants().APP.APP }
      }).getPConnect();
      const pyPortalInAppContext = pConnectInAppContext.getValue('pyPortal') as any;
      pyPortalInAppContext?.pyCaseTypesAvailableToCreate?.forEach(casetype => {
        if (casetype.pyClassName && casetype.pyLabel) {
          defaultCases.push({
            classname: casetype.pyClassName,
            onClick: () => {
              createCase(casetype.pyClassName);
            },
            ...(showCaseIcons && { icon: Utils.getImageSrc(casetype?.pxIcon, Utils.getSDKStaticConentUrl()) }),
            label: casetype.pyLabel
          });
        }
      });
    }

    /* If classFilter is not empty - filter from the list of defaultCases */
    if (classFilter?.length > 0) {
      classFilter.forEach(item => {
        defaultCases.forEach(casetype => {
          if (casetype.classname === item) {
            cases.push(casetype);
          }
        });
      });
      setCases(cases);
    } else {
      setCases(defaultCases);
    }
  }, []);

  return (
    <div>
      <WssQuickCreate heading={heading} actions={quickCreatecases} />
    </div>
  );
}

import React from "react";
import WssQuickCreate from '../../designSystemExtensions/WssQuickCreate';
import { Utils } from '../../../helpers/utils';

declare const PCore: any;

export default function QuickCreate(props) {
  const { getPConnect, heading, showCaseIcons, classFilter } = props;
  const pConn = getPConnect();
  const createCase = (className) => {
    pConn
      .getActionsApi()
      .createWork(className, {})
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error in case creation: ', error?.message)
      });
  };

  const cases: any = [];
  const envInfo = PCore.getEnvironmentInfo();
  if (
    classFilter &&
    envInfo.environmentInfoObject &&
    envInfo.environmentInfoObject.pyCaseTypeList &&
    envInfo.environmentInfoObject.pyCaseTypeList.length > 0
  ) {
    classFilter.forEach((item) => {
      let icon = Utils.getImageSrc('polaris-solid', Utils.getSDKStaticConentUrl());
      let label = '';
      envInfo.environmentInfoObject.pyCaseTypeList.forEach((casetype) => {
        if (casetype.pyWorkTypeImplementationClassName === item) {
          icon = casetype.pxIcon && Utils.getImageSrc(casetype?.pxIcon, Utils.getSDKStaticConentUrl());
          label = casetype.pyWorkTypeName ?? '';
        }
      });
      if (label !== '') {
        cases.push({
          label,
          onClick: () => {
            createCase(item);
          },
          ...(showCaseIcons && { icon })
        });
      }
    });
  }

  return (
      <div>
        <WssQuickCreate heading={heading} actions={cases}></WssQuickCreate>
      </div>
    );
}

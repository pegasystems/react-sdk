import type { ReactNode } from 'react';

import { prepareComponentInCaseSummary as prepareFieldValueList } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const resolveReferenceFields = (
  item: {
    [key: string]: unknown;
  },
  hideFieldLabels: boolean,
  recordKey: string,
  pConnect: typeof PConnect
) => {
  const presets: {
    children?: {
      children?: {
        config: object;
        type: string;
      }[];
      config?: object;
    }[];
  }[] = (pConnect.getRawMetadata()?.config as any).presets ?? [];

  const presetChildren = presets[0]?.children?.[0]?.children ?? [];

  const maxFields = 5;
  return presetChildren.slice(0, maxFields).map((preset, index) => {
    const fieldMeta = {
      meta: {
        ...preset,
        config: {
          ...preset.config,
          displayMode: 'DISPLAY_ONLY'
        }
      },
      useCustomContext: item
    };
    const configObj = PCore.createPConnect(fieldMeta);
    const meta = configObj.getPConnect().getMetadata();
    const fieldInfo: {
      name?: string;
      value?: ReactNode;
    } = meta ? prepareFieldValueList(meta, configObj.getPConnect) : {};
    return hideFieldLabels
      ? { id: `${item[recordKey] as string} - ${index}`, value: fieldInfo.value }
      : {
          id: `${item[recordKey] as string} - ${index}`,
          name: fieldInfo.name,
          value: fieldInfo.value
        };
  });
};

import { Link } from '@mui/material';

import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';

export const resolveReferencedPConnect = pConnect => {
  if (!pConnect || !pConnect.meta) return undefined;
  const type = pConnect?._type ?? undefined;
  const referencedPConnect = type === 'reference' && pConnect.getReferencedViewPConnect().getPConnect();
  return referencedPConnect || pConnect;
};

/**
 * A helper function to create an object consisting react component as per the type.
 * This is used by CaseSummary template.
 * @param {object} pConnectMeta Object containing meta information for the particular field authored
 * @param {Function} getPConnect PConnect function passed along to other components.
 * @param {string} displayMode displayMode string contains information about the layout of component in review mode.
 */
export function prepareComponentInCaseSummary(pConnectMeta: any, getPConnect: Function) {
  const { config, children } = pConnectMeta;

  const noValueComponent = <div>No Value</div>;
  const placeholder = '...';
  const pConnect = getPConnect();

  const caseSummaryComponentObject: any = {};

  let { type } = pConnectMeta;
  let showAddressLabel = true;

  if (config && config.value === `@P .${Utils.getMappedKey('pyStatusWork')}`) {
    config.displayAsStatus = true;
    type = 'TextInput'; // force the type to be TextInput for status field.
    // As TextInput is loaded forcefully sometimes, TextInput component might not be available in lazy map.
    // Load TextInput if it is not available.
    if (!PCore.getComponentsRegistry().getLazyComponent(type)) {
      PCore.getAssetLoader().getLoader('component-loader')([type]);
    }
  }

  caseSummaryComponentObject.name = pConnect.resolveConfigProps({ label: config.label }).label;

  if (config.inheritedProps) {
    const labelInInheritedProp = config.inheritedProps.find(inheritedProp => inheritedProp.prop === 'label');
    if (labelInInheritedProp) {
      labelInInheritedProp.value = pConnect.resolveConfigProps({ label: labelInInheritedProp.value }).label;
    }
  }

  switch (type) {
    case 'CaseOperator': {
      if (config.label.includes('Create operator')) {
        caseSummaryComponentObject.name = pConnect.resolveConfigProps({
          createLabel: config.createLabel
        }).createLabel;
      } else if (config.label.includes('Update operator')) {
        caseSummaryComponentObject.name = pConnect.resolveConfigProps({
          updateLabel: config.updateLabel
        }).updateLabel;
      } else {
        caseSummaryComponentObject.name = pConnect.resolveConfigProps({
          resolveLabel: config.resolveLabel
        }).resolveLabel;
      }

      break;
    }
    case 'Checkbox': {
      caseSummaryComponentObject.name = pConnect.resolveConfigProps({
        label: config.caption
      }).label;

      break;
    }
    case 'Pega_UI_PercentageWidget': {
      const rawValue = pConnect.resolveConfigProps({
        value: config.value
      }).value;

      caseSummaryComponentObject.simpleValue = rawValue || rawValue === 0 ? `${rawValue}%` : noValueComponent;
      break;
    }
    case 'Address': {
      showAddressLabel = false;

      caseSummaryComponentObject.variant = 'stacked';
      break;
    }
    case 'Location':
    case 'RichText': {
      const rawValue = pConnect.resolveConfigProps({
        value: config.value
      }).value;

      caseSummaryComponentObject.variant = 'stacked';
      caseSummaryComponentObject.simpleValue = rawValue?.length ? rawValue : noValueComponent;
      break;
    }
    case 'TextArea': {
      const rawValue = pConnect.resolveConfigProps({
        value: config.value
      }).value;

      if (rawValue?.length > 22) {
        caseSummaryComponentObject.variant = 'stacked';
      }

      caseSummaryComponentObject.simpleValue = rawValue?.length ? rawValue : noValueComponent;
      break;
    }
    case 'URL': {
      if (config.displayAs === 'Image') {
        const rawValue = pConnect.resolveConfigProps({
          value: config.value
        }).value;

        caseSummaryComponentObject.variant = 'stacked';
        caseSummaryComponentObject.simpleValue = rawValue?.length ? <Link href={rawValue}>{rawValue}</Link> : noValueComponent;
      }
      break;
    }
    case 'reference': {
      const referencedPConnect = resolveReferencedPConnect(pConnect);
      const viewType = referencedPConnect?.meta?.config.type;
      const viewTemplate = referencedPConnect?.meta?.config.template;
      const isTable = ['multirecordlist'].includes(viewType);
      const isDataReference = viewTemplate === 'DataReference';

      if (isTable || !isDataReference) {
        caseSummaryComponentObject.variant = 'stacked';
        caseSummaryComponentObject.simpleValue = placeholder;
      }
      break;
    }
    case 'view': {
      caseSummaryComponentObject.variant = 'stacked';
      caseSummaryComponentObject.simpleValue = placeholder;
      break;
    }
    default:
      break;
  }

  const createdComponent = pConnect.createComponent({
    type,
    children: children ? [...children] : [],
    showAddressLabel,
    config: {
      ...config,
      // Need a unique key for each summary component which helps in creating new component based on visibility
      // Also a consistent key helps in rerendering summary components instead of remounting
      key: config
    }
  });

  createdComponent.props.getPConnect().setInheritedProp('displayMode', 'DISPLAY_ONLY');
  createdComponent.props.getPConnect().setInheritedProp('readOnly', true);

  if (type === 'Address') {
    createdComponent.props.getPConnect().setInheritedProp('showAddressLabel', showAddressLabel);
  }
  // Add field label for reference summary item when not Embedded data
  if (type === 'reference') {
    const isEmbeddedData = config.context && config.displayAs === 'Form';
    if (!isEmbeddedData) {
      caseSummaryComponentObject.name = createdComponent.props.getPConnect().getInheritedProps().label;
    }
  }

  caseSummaryComponentObject.value = createdComponent;

  return caseSummaryComponentObject;
}

export function resolveReferenceFields(
  item: {
    [key: string]: unknown;
  },
  hideFieldLabels: boolean,
  recordKey: string,
  pConnect: typeof PConnect
) {
  const presets: {
    children?: {
      children?: {
        config;
        type;
      };
      config?;
    };
  } = (pConnect.getRawMetadata()?.config as any).presets ?? [];

  const presetChildren = presets[0]?.children?.[0]?.children ?? [];

  const maxFields = 5;
  return presetChildren.slice(0, maxFields).map((preset, index) => {
    const fieldMeta = {
      meta: {
        ...preset,
        config: {
          ...preset.config,
          displayMode: 'DISPLAY_ONLY',
          contextName: pConnect.getContextName()
        }
      },
      useCustomContext: item
    };
    const configObj = PCore.createPConnect(fieldMeta);
    const meta = configObj.getPConnect().getMetadata();
    const fieldInfo: {
      name?: string;
      value?: React.ReactNode;
    } = meta ? prepareComponentInCaseSummary(meta, configObj.getPConnect) : {};
    return hideFieldLabels
      ? { id: `${item[recordKey]} - ${index}`, value: fieldInfo.value }
      : {
          id: `${item[recordKey]} - ${index}`,
          name: fieldInfo.name,
          value: fieldInfo.value,
          type: preset.type
        };
  });
}

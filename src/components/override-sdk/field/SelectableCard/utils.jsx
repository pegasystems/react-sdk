import dompurify from 'dompurify';
import get from 'lodash.get';
import set from 'lodash.set';

import { Link, NoValue, safeStringify } from '@pega/cosmos-react-core';

export const getResolvedConstantValue = (pConnect, key) => {
  return pConnect.getValue(PCore.getResolvedConstantValue(key)) || pConnect.getValue(key);
};

export function getMappedKey(key) {
  const mappedKey = PCore.getEnvironmentInfo().getKeyMapping(key);
  if (!mappedKey) {
    return key;
  }
  return mappedKey;
}

export const resolveReferencedPConnect = pConnect => {
  if (!pConnect || !pConnect.meta) return undefined;
  const type = get(pConnect, '_type');
  const referencedPConnect = type === 'reference' && pConnect.getReferencedViewPConnect().getPConnect();
  return referencedPConnect || pConnect;
};

export const hasAny = (pConn, cb) => {
  const pConnect = resolveReferencedPConnect(pConn);

  if (!pConnect) {
    return false;
  }

  const conditionMet = cb(pConnect);

  if (conditionMet) {
    return conditionMet;
  }

  const children = pConnect.getChildren();

  if (!children || !children.length) {
    return conditionMet;
  }

  return children.some(c => hasAny(c.getPConnect(), cb));
};

/**
 * Given the PConnect object of a Template component, retrieve the children
 * metadata of all regions.
 * @param {Function} pConnect PConnect of a Template component.
 */
export function getAllFields(pConnect) {
  const metadata = pConnect().getRawMetadata();
  if (!metadata.children) {
    return [];
  }

  let allFields = [];

  const makeField = f => ({
    ...pConnect().resolveConfigProps(f.config),
    type: f.type
  });

  const hasRegions = !!metadata.children[0]?.children;
  if (hasRegions) {
    allFields = metadata.children.map(region =>
      region.children.map(field => {
        // Do not resolve the config props if is status work, instead create component here as status badge and mark as status display
        if (field.config?.value === `@P .${getMappedKey('pyStatusWork')}`) {
          field.type = 'TextInput';
          field.config.displayAsStatus = true;
          return pConnect().createComponent(field);
        }

        return makeField(field);
      })
    );
  } else {
    allFields = metadata.children.map(makeField);
  }

  return allFields;
}

/**
 * A helper function to create an object consisting react component as per the type.
 * This is used by CaseSummary template.
 * @param {object} pConnectMeta Object containing meta information for the particular field authored
 * @param {Function} getPConnect PConnect function passed along to other components.
 * @param {string} displayMode displayMode string contains information about the layout of component in review mode.
 */
export function prepareComponentInCaseSummary(pConnectMeta, getPConnect) {
  const { config, children } = pConnectMeta;

  const noValueComponent = <NoValue />;
  const placeholder = '...';
  const pConnect = getPConnect();

  const caseSummaryComponentObject = {};

  let { type } = pConnectMeta;
  let showAddressLabel = true;

  if (config && config.value === `@P .${getMappedKey('pyStatusWork')}`) {
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
    case 'Location': {
      const rawValue = pConnect.resolveConfigProps({
        value: config.value
      }).value;

      caseSummaryComponentObject.variant = 'stacked';
      caseSummaryComponentObject.simpleValue = rawValue?.length ? rawValue : noValueComponent;
      break;
    }
    case 'RichText': {
      const rawValue = pConnect.resolveConfigProps({
        value: config.value
      }).value;

      caseSummaryComponentObject.variant = 'stacked';
      caseSummaryComponentObject.simpleValue = rawValue?.length
        ? dompurify.sanitize(rawValue, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            KEEP_CONTENT: true
          })
        : noValueComponent;
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

export function prepareCaseSummaryData(caseSummaryRegion, portalSpecificVisibilityChecker) {
  const filterVisibleChildren = children => {
    return children
      ?.getPConnect()
      ?.getChildren()
      ?.filter(child => {
        const configProps = child.getPConnect().getConfigProps();
        const defaultVisibilityCn = !('visibility' in configProps) || configProps.visibility === true;
        return defaultVisibilityCn && (portalSpecificVisibilityChecker?.(configProps) ?? true);
      });
  };
  const convertChildrenToSummaryData = children => {
    return children?.map((childItem, index) => {
      const childMeta = childItem.getPConnect().meta;
      const caseSummaryComponentObject = prepareComponentInCaseSummary(childMeta, childItem.getPConnect);
      caseSummaryComponentObject.id = index + 1;
      return caseSummaryComponentObject;
    });
  };

  const summaryFieldChildren = caseSummaryRegion.props
    .getPConnect()
    .getChildren()[0]
    ?.getPConnect()
    ?.getReferencedViewPConnect()
    ?.getPConnect()
    ?.getChildren();

  const primarySummaryFields =
    summaryFieldChildren && summaryFieldChildren.length > 0
      ? convertChildrenToSummaryData(filterVisibleChildren(summaryFieldChildren[0]))
      : undefined;
  const secondarySummaryFields =
    summaryFieldChildren && summaryFieldChildren.length > 1
      ? convertChildrenToSummaryData(filterVisibleChildren(summaryFieldChildren[1]))
      : undefined;

  return {
    primarySummaryFields,
    secondarySummaryFields
  };
}

export function filterSummaryFields(getPConnect) {
  const metadata = getPConnect().getRawMetadata();
  const primaryMeta = metadata.children[0];
  const secondaryMeta = metadata.children[1];
  const primaryFields = primaryMeta?.children ?? primaryMeta ?? [];
  const secondaryFields = secondaryMeta?.children ?? secondaryMeta ?? [];

  // Filter out fields that are not visible and unsupported types for primary fields (for CaseSummary)
  const filteredPrimary = primaryFields.filter(item => {
    const resolvedItem = getPConnect().resolveConfigProps(item.config);
    return resolvedItem.visibility !== false && item.type !== 'TextContent';
  });

  const filteredSecondary = secondaryFields.filter(item => {
    const resolvedItem = getPConnect().resolveConfigProps(item.config);
    return resolvedItem.visibility !== false && item.type !== 'TextContent';
  });

  return [filteredPrimary, filteredSecondary];
}

/**
 * Returns ConfigurableLayout mapped content. With pre-populated default layout configs.
 * @param {object[]} regionData template children item.
 * @returns {object[]} ConfigurableLayout content.
 */
export function getLayoutDataFromRegion(regionData) {
  const defaultLayoutConfig = {
    width: 'full',
    fillAvailable: true,
    minWidth: [300, 'px']
  };

  return regionData.props
    ?.getPConnect()
    ?.getChildren()
    ?.map((item, index) => {
      const itemPConnect = item?.getPConnect();

      return {
        id: itemPConnect?.getComponentName() ? `${itemPConnect.getComponentName()}--${index}` : `item--${index}`,
        content: itemPConnect?.getComponent(),
        layoutConfig: {
          ...defaultLayoutConfig,
          ...itemPConnect?.getConfigProps().layoutConfig
        }
      };
    });
}

/**
 * Determine if the current view is the view of the case step/assignment.
 * @param {Function} pConnect PConnect object for the component
 */
export function getIsAssignmentView(pConnect) {
  // Get caseInfo content from the store which contains the view info about the current assignment/step
  const assignmentViewClass = pConnect.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_CLASSID);
  const assignmentViewName = pConnect.getCaseInfo().getCurrentAssignmentViewName();

  const assignmentViewId = `${assignmentViewName}!${assignmentViewClass}`;

  // Get the info about the current view from pConnect
  const currentViewId = `${pConnect.getCurrentView()}!${pConnect.getCurrentClassID()}`;

  return assignmentViewId === currentViewId;
}

/**
 * Determine if the current view is the view of the case-wide action.
 * @param {Function} pConnect PConnect object for the component
 */
export function getIsCaseWideActionView(pConnect) {
  if (!pConnect.getDataObject()) {
    return false;
  }
  const isCaseWideAction = pConnect.getCaseSummary()?.isCaseWideAction();
  const flowActionID = pConnect.getCaseInfo().getActiveFlowActionID();
  const currentViewID = pConnect.getCurrentView();

  const isLaunchpadRuntime = PCore.getEnvironmentInfo().KeyMapping?.pyID === 'BusinessID';
  if (isLaunchpadRuntime && currentViewID.includes('__')) {
    // Stop-gap solution for BUG-0007QUF. The view IDs in Launchpad are namespace qualified (with __),
    // but the action IDs are not. Turn view ID into namespace-unqualified to compare with the
    // action ID for now until proper cross-team solution can be implemented (US-599170)
    const unqualifiedViewID = currentViewID.replace(/^.*__/, '');
    return isCaseWideAction && flowActionID === unqualifiedViewID;
  }

  return isCaseWideAction && flowActionID === currentViewID;
}

/**
 * A hook that gets the instructions content for a view.
 * @param {Function} pConnect PConnect object for the component
 * @param {string} [instructions="casestep"] 'casestep', 'none', or the html content of a Rule-UI-Paragraph rule (processed via core's paragraph annotation handler)
 */
export function getInstructions(pConnect, instructions = 'casestep') {
  const caseStepInstructions = pConnect.getValue(PCore.getConstants().CASE_INFO.INSTRUCTIONS);

  // Determine if this view is the current assignment/step view
  const isCurrentAssignmentView = getIsAssignmentView(pConnect);

  // Case step instructions
  if (instructions === 'casestep' && isCurrentAssignmentView && caseStepInstructions?.length) {
    return caseStepInstructions;
  }

  // No instructions
  if (instructions === 'none') {
    return undefined;
  }

  // If the annotation wasn't processed correctly, don't return any instruction text
  if (instructions?.startsWith('@PARAGRAPH')) {
    // eslint-disable-next-line no-console
    console.error('@PARAGRAPH annotation was not processed. Hiding custom instructions.');
    return undefined;
  }

  // Custom instructions from the view
  // The raw metadata for `instructions` will be something like '@PARAGRAPH .SomeParagraphRule' but
  // it is evaluated by core logic to the content
  if (instructions !== 'casestep' && instructions !== 'none') {
    return instructions;
  }
  return undefined;
}

export function renderActions(
  /* eslint-disable default-param-last */
  actions = [],
  flowActions = [],
  processes = [],
  caseLinks = [],
  actionsAPI,
  localeUtils,
  localeKey,
  pConnect,
  customActions = [],
  isDataObject
  /* eslint-enable default-param-last */
) {
  const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);
  const deleteWorkAction = actionsAPI.deleteWork.bind(actionsAPI);
  const openProcessAction = actionsAPI.openProcessAction.bind(actionsAPI);
  const createWork = actionsAPI.createWork.bind(actionsAPI);
  const ID = getResolvedConstantValue(pConnect, PCore.getConstants().CASE_INFO.CASE_INFO_ID);
  const caseTypeID = getResolvedConstantValue(pConnect, PCore.getConstants().CASE_INFO.CASE_TYPE_ID);
  const publishEvent = payload => {
    if (payload?.pyActionName && payload?.pyPayload) {
      PCore.getPubSubUtils().publish(payload?.pyActionName, payload?.pyPayload);
    }
  };
  const editActions = ['pyUpdateCaseDetails', 'Edit'];
  // Pull out Edit action to map to separate button
  const editAction = Array.isArray(actions) && actions.find(action => editActions.includes(action.ID));
  const caseViewMode = pConnect.getValue('context_data.caseViewMode');
  const caseActions = caseViewMode === 'review' ? actions.filter(item => item.type === 'Case') : actions;
  let flowActionsForDataObject = [];
  let createCaseActions = [];
  let onClick = () => openLocalAction(editAction.ID, { ...editAction, containerName: 'modal' });
  if (isDataObject) {
    const className = pConnect.getValue('.classID', 'dataInfo.content');
    const dataRecord = pConnect.getValue('.content', 'dataInfo');
    const dataObjectActions = pConnect.getValue('.actions', 'dataInfo') || {};
    const { availableActions = [], availableCreateCaseActions = [] } = dataObjectActions;
    createCaseActions = availableCreateCaseActions.map(action => {
      const targetDataReferenceField = action.targetDataReferenceField;
      const field = targetDataReferenceField?.field;
      const startingFields = targetDataReferenceField.inputs.reduce((prevObj, val) => {
        set(prevObj, `${field}.${val.linkedField}`, pConnect.getValue(`.${val.linkedField}`));
        return prevObj;
      }, {});
      return {
        text: localeUtils.getLocaleValue(action.name, '', localeKey),
        id: action.ID,
        onClick: () => {
          createWork(action.ID, {
            startingFields
          });
        }
      };
    });

    const openDataObjectAction = actionsAPI.openDataObjectAction.bind(actionsAPI);
    flowActionsForDataObject = availableActions.map(val => {
      return {
        id: val.ID,
        text: val.name,
        onClick: () => {
          openDataObjectAction(className, dataRecord, val.ID, val.name);
        }
      };
    });
    const getDataObjectView = actionsAPI.getDataObjectView.bind(actionsAPI);
    onClick = () => getDataObjectView(className, dataRecord, { viewName: editAction.ID, containerName: 'modal' });
  }

  const caseActionsList = caseActions.map(action => {
    if (action.ID === 'Delete') {
      return {
        text: localeUtils.getLocaleValue(action.name, '', localeKey),
        id: action.ID,
        onClick: () => {
          // eslint-disable-next-line no-alert
          if (window.confirm('Are you sure you want to delete this record?')) {
            deleteWorkAction(ID, caseTypeID);
          }
        }
      };
    }
    return {
      text: localeUtils.getLocaleValue(action.name, '', localeKey),
      id: action.ID,
      onClick: () => {
        // TODO strange assumption that every action in list is supposed to be a local action...what about Refresh action?
        openLocalAction(action.ID, {
          ...action,
          // Overriding name property in action objet with localized string
          name: localeUtils.getLocaleValue(action.name, '', localeKey),
          containerName: 'modal'
        });
      }
    };
  });
  const flowActionsList = flowActions.map(action => {
    return {
      text: localeUtils.getLocaleValue(action.name, '', localeKey),
      id: action.ID,
      onClick: () => {
        openLocalAction(action.ID, {
          ...action
        });
      }
    };
  });
  const processActionsList = processes.map(process => {
    return {
      text: localeUtils.getLocaleValue(process.name, '', localeKey),
      id: process.ID,
      onClick: () => {
        openProcessAction(process.ID, {
          ...process
        });
      }
    };
  });
  // extension logic to open external URLs, an arrangement made for launching infinity pages in new tab
  const caseLinksList = caseLinks.map(link => {
    return {
      text: localeUtils.getLocaleValue(link.pyLabel, '', localeKey),
      id: link.pyLabel,
      onClick: () => {
        window.open(link.pyURLContent, '_blank');
      }
    };
  });

  const customActionsList = customActions.map(action => {
    return {
      text: localeUtils.getLocaleValue(action?.pyLabel, '', localeKey),
      id: action?.pyLabel,
      onClick: () => {
        publishEvent(action?.pyActionMeta);
      }
    };
  });

  const shouldDisableActionsMenu = () => {
    return !(
      caseActionsList.length > 0 ||
      processActionsList.length > 0 ||
      flowActionsList.length > 0 ||
      caseLinksList.length > 0 ||
      customActionsList.length > 0 ||
      createCaseActions.length > 0 ||
      flowActionsForDataObject.length > 0
    );
  };
  const optionalActions = [
    ...caseActionsList,
    ...processActionsList,
    ...flowActionsList,
    ...caseLinksList,
    ...customActionsList,
    ...createCaseActions,
    ...flowActionsForDataObject
  ];
  let promotedActionItem = caseActionsList.find(action => !editActions.includes(action.id));
  /* In Launchpad apps, if we have 'Edit' as first entry in caseActionsList, we need to hide promoted action button.
     If the user wants to have a different promoted action, they need to explicitly move that action ABOVE edit on the case type rule. */
  if (caseActionsList[0]?.id === 'Edit') {
    promotedActionItem = undefined;
  }
  const promotedAction = promotedActionItem ? [promotedActionItem] : [];
  return {
    promotedAction,
    optionalActions,
    editAction,
    shouldDisableMenu: shouldDisableActionsMenu(),
    onClick
  };
}

/**
 * Updates insights props if single insight is present in region
 * @param {object[]} regionData template children item.
 */
export function handleInsightsFitToScreen(regionsData) {
  regionsData.forEach(regionData => {
    const children = regionData.props?.getPConnect()?.meta?.children;

    if (children?.length === 1 && children[0].type === 'Insight') {
      children[0].config.inheritedProps = [
        {
          prop: 'fitToScreen',
          value: true
        }
      ];
    }
    return regionData;
  });
}

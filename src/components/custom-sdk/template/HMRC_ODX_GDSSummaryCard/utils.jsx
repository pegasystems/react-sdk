import { Status, createUID } from '@pega/cosmos-react-core';
import { Fragment } from 'react';

export function Region(props) {
  const { children } = props;
  return <Fragment>{children}</Fragment>;
}

export function StatusWorkRenderer({ value }) {
  let variant = 'info';

  const warnStrings = ['fail', 'cancel', 'reject', 'revoke', 'stopped', 'warn'];
  const infoStrings = ['open', 'hold', 'info', 'new'];
  const successStrings = ['resolved', 'completed', 'success'];
  const pendingStrings = ['pending'];

  if (new RegExp(warnStrings.join('|'), 'i').test(value)) {
    variant = 'warn';
  } else if (new RegExp(infoStrings.join('|'), 'i').test(value)) {
    variant = 'info';
  } else if (new RegExp(successStrings.join('|'), 'i').test(value)) {
    variant = 'success';
  } else if (new RegExp(pendingStrings.join('|'), 'i').test(value)) {
    variant = 'pending';
  }

  return (
    <Status type='rectangle' variant={variant}>
      {value}
    </Status>
  );
}

// import { LazyMap as LazyComponentMap } from '../../components_map';

const LazyComponentMap = {};

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
        if (field.config?.value === '@P .pyStatusWork') {
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
 * @param {object} configObject Object containing meta information for the particular field authored
 * @param {Function} getPConnect PConnect function passed along to other components.
 * @param {string} displayMode displayMode string contains information about the layout of component in review mode.
 */
export function prepareComponentInCaseSummary(configObject, getPConnect, displayMode) {
  const { config, children } = configObject;
  let { type } = configObject;
  const caseSummaryComponentObject = {};
  let showAddressLabel = true;
  if (config && config.value === '@P .pyStatusWork') {
    config.displayAsStatus = true;
    type = 'TextInput'; // force the type to be TextInput for status field.
    // As TextInput is loaded forcefully sometimes, TextInput component might not be available in lazy map.
    // Load TextInput if it is not available.
    if (!LazyComponentMap[type]) {
      PCore.getAssetLoader().getLoader('component-loader')([type]);
    }
  }

  caseSummaryComponentObject.name = getPConnect().resolveConfigProps({
    label: config.label
  }).label;
  if (type === 'CaseOperator') {
    switch (caseSummaryComponentObject.name) {
      case 'Create operator':
        caseSummaryComponentObject.name = getPConnect().resolveConfigProps({
          createLabel: config.createLabel
        }).createLabel;
        break;
      case 'Update operator':
        caseSummaryComponentObject.name = getPConnect().resolveConfigProps({
          updateLabel: config.updateLabel
        }).updateLabel;
        break;
      default:
        caseSummaryComponentObject.name = getPConnect().resolveConfigProps({
          resolveLabel: config.resolveLabel
        }).resolveLabel;
        break;
    }
  } else if (type === 'Checkbox') {
    caseSummaryComponentObject.name = getPConnect().resolveConfigProps({
      label: config.caption
    }).label;
  } else if (type === 'Address') {
    showAddressLabel = false;
  }
  const createdComponent = getPConnect().createComponent({
    type,
    children: children ? [...children] : [],
    showAddressLabel,
    config: {
      ...config,
      hideLabel: true,
      key: createUID() // Need a unique key on render of the summary so that the component is recreated each time
    }
  });
  createdComponent.props.getPConnect().setInheritedProp('displayMode', displayMode);
  if (type === 'Address') {
    createdComponent.props.getPConnect().setInheritedProp('showAddressLabel', showAddressLabel);
  }
  // createdComponent.props.getPConnect().setInheritedProp("hideLabel", true);
  caseSummaryComponentObject.value = createdComponent;
  if (type === 'reference') {
    caseSummaryComponentObject.name = createdComponent.props
      .getPConnect()
      .getInheritedProps().label;
  }

  return caseSummaryComponentObject;
}

export function getFilteredFields(getPConnect) {
  let primaryFieldsRaw;
  let secondaryFieldsRaw;
  const metadata = getPConnect().getRawMetadata();
  const hasRegions = !!metadata.children[0]?.children;
  if (hasRegions) {
    primaryFieldsRaw = metadata.children[0].children;
    secondaryFieldsRaw = metadata.children[1].children;
  } else {
    [primaryFieldsRaw, secondaryFieldsRaw] = metadata.children;
  }

  // Filter out fields that are not visible and unsupported types for primary fields (for CaseSummary)
  primaryFieldsRaw = primaryFieldsRaw.filter(item => {
    const resolvedItem = getPConnect().resolveConfigProps(item.config);
    return resolvedItem.visibility !== false && item.type !== 'TextContent';
  });

  secondaryFieldsRaw = secondaryFieldsRaw.filter(item => {
    const resolvedItem = getPConnect().resolveConfigProps(item.config);
    return resolvedItem.visibility !== false && item.type !== 'TextContent';
  });

  return [primaryFieldsRaw, secondaryFieldsRaw];
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
        id: itemPConnect?.getComponentName()
          ? `${itemPConnect.getComponentName()}--${index}`
          : `item--${index}`,
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
  // TODO To be replaced with pConnect.getCaseInfo().getCurrentAssignmentView when it's available
  const assignmentViewClass = pConnect.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_CLASSID);
  const assignmentViewName = pConnect.getValue(PCore.getConstants().CASE_INFO.ASSIGNMENTACTION_ID);

  const assignmentViewId = `${assignmentViewName}!${assignmentViewClass}`;

  // Get the info about the current view from pConnect
  const currentViewId = `${pConnect.getCurrentView()}!${pConnect.getCurrentClassID()}`;

  return assignmentViewId === currentViewId;
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
    // console.error('@PARAGRAPH annotation was not processed. Hiding custom instructions.');
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

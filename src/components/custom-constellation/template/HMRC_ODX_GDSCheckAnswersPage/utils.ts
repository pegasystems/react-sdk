//  This file is adapted from React components/Templates/utils.js
// declare const PCore: any;

export function getAllFields(pConnect: any) {
  const metadata = pConnect.getRawMetadata();
  let allFields = [];
  if (metadata.children && metadata.children.map) {
    allFields = metadata.children.map(fields => {
      const children = fields.children instanceof Array ? fields.children : [];
      return children.map(field => field.config);
    });
  }
  return allFields;
}

export function filterForFieldValueList(fields: any) {
  return fields
    .filter(({ visibility }) => visibility !== false)
    .map(({ value, label }) => ({
      id: label.toLowerCase(),
      name: label,
      value
    }));
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

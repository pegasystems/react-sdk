//  From CosmosReact DX Components

//  Moved PCore.getConstants() into each function in which it's used until we can
//  make sure that this code isn't run until PCore is defined (after onPCoreReady)
// const { CASE_INFO } = window.PCore.getConstants();

export const addContainerItem = (pConnect) => {
  const containerManager = pConnect.getContainerManager();
  const contextName = pConnect.getContextName(); // here we will get parent context name, as flow container is child of view container
  const caseViewMode = pConnect.getValue("context_data.caseViewMode");

  let key;
  let flowName;

  if(caseViewMode !== "review") {
    const target = contextName.substring(0, contextName.lastIndexOf("_"));
    const activeContainerItemID = window.PCore.getContainerUtils().getActiveContainerItemName(target);
    const containerItemData = window.PCore.getContainerUtils().getContainerItemData(target, activeContainerItemID);

    if(containerItemData) {
      ({ key, flowName } = containerItemData);
    }
  }

  containerManager.addContainerItem({
    semanticURL: "",
    key,
    flowName,
    caseViewMode: "perform",
    resourceType: "ASSIGNMENT",
    data: pConnect.getDataObject(contextName)
  });
};

export const hasContainerItems = (pConnect) => {
  const contextName = pConnect.getContextName();
  const containerName = pConnect.getContainerName();
  return window.PCore.getContainerUtils().hasContainerItems(`${contextName}/${containerName}`);
}

export const getActiveCaseActionName = (pConnect) => {
  const { CASE_INFO } = window.PCore.getConstants();
  const caseActions = pConnect.getValue(CASE_INFO.CASE_INFO_ACTIONS);
  const activeActionID = pConnect.getValue(CASE_INFO.ACTIVE_ACTION_ID);
  const activeAction = caseActions.find(
    (action) => action.ID === activeActionID
  );
  return activeAction?.name || "";
};

export const getFirstCaseActionName = (pConnect) => {
  const { CASE_INFO } = window.PCore.getConstants();
  const caseActions = pConnect.getValue(CASE_INFO.CASE_INFO_ACTIONS);
  return caseActions[0]?.name || "";
};

export const hasNotificationMessages = (pConnect) => {
  return !!pConnect.getValue("caseMessages");
};

export const isCaseWideLocalAction = (pConnect) => {
  const { CASE_INFO } = window.PCore.getConstants();
  const actionID = pConnect.getValue(CASE_INFO.ACTIVE_ACTION_ID);
  const caseActions = pConnect.getValue(CASE_INFO.CASE_INFO_ACTIONS);
  if (caseActions && actionID) {
    const activeAction = caseActions.find(
      (caseAction) => caseAction.ID === actionID
    );
    return activeAction?.type === "Case";
  }
  return false;
};

export const getChildCaseAssignments = (pConnect) => {
  const { CASE_INFO } = window.PCore.getConstants();
  const childCases = pConnect.getValue(CASE_INFO.CHILD_ASSIGNMENTS);
  let allAssignments = [];
  if (childCases && childCases.length > 0) {
    childCases.forEach(({ assignments = [], Name }) => {
      const childCaseAssignments = assignments.map((assignment) => ({
        ...assignment,
        caseName: Name
      }));
      allAssignments = allAssignments.concat(childCaseAssignments);
    });
  }
  return allAssignments;
};

export const hasAssignments = (pConnect) => {
  const { CASE_INFO } = window.PCore.getConstants();
  const assignments = pConnect.getValue(CASE_INFO.D_CASE_ASSIGNMENTS_RESULTS);
  const childCasesAssignments = getChildCaseAssignments(pConnect);

  if (assignments || childCasesAssignments || isCaseWideLocalAction(pConnect)) {
    return true;
  }
  return false;
};

export const showBanner = (getPConnect) => {
  const pConnect = getPConnect();
  return hasNotificationMessages(pConnect) || !hasAssignments(pConnect);
};

export const showTodo = (pConnect) => {
  const caseViewMode = pConnect.getValue("context_data.caseViewMode");
  return caseViewMode !== "perform";
};

export const isRenderWithToDoWrapper = (getPConnect, options) => {
  const pConnect = getPConnect();
  const { showWithToDo } = options;
  return (
    showWithToDo && (!isCaseWideLocalAction(pConnect) || showTodo(pConnect))
  );
};

export const getToDoAssignments = (pConnect) => {
  const { CASE_INFO } = window.PCore.getConstants();
  const caseActions = pConnect.getValue(CASE_INFO.CASE_INFO_ACTIONS);
  const assignmentLabel = pConnect.getValue(CASE_INFO.ASSIGNMENT_LABEL);
  const assignments =
    pConnect.getValue(CASE_INFO.D_CASE_ASSIGNMENTS_RESULTS) || [];
  const childCasesAssignments = getChildCaseAssignments(pConnect) || [];
  let childCasesAssignmentsCopy = JSON.parse(
    JSON.stringify(childCasesAssignments)
  );

  childCasesAssignmentsCopy = childCasesAssignmentsCopy.map((assignment) => {
    assignment.isChild = true;
    return assignment;
  });

  const todoAssignments = [...assignments, ...childCasesAssignmentsCopy];
  let todoAssignmentsCopy = JSON.parse(JSON.stringify(todoAssignments));

  if (caseActions && !showTodo(pConnect)) {
    todoAssignmentsCopy = todoAssignmentsCopy.map((assignment) => {
      assignment.name = getActiveCaseActionName(pConnect) || assignmentLabel;
      return assignment;
    });
  }

  return todoAssignmentsCopy;
};

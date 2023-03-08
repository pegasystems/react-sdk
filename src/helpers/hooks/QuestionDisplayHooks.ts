import {useState, useEffect} from 'react';

declare const PCore;

/**
 * Helper hook for handling instances where there is only one field presented in the current view.
 * Returns a boolean indicating whether or not there is only one field to display in the current context
*/


function useIsOnlyField(){
  const [isOnlyField, setisOnlyField] = useState(PCore.getFormUtils().getEditableFields("root/primary_1/workarea_1").length === 1);

  useEffect ( () => {
    setisOnlyField(PCore.getFormUtils().getEditableFields("root/primary_1/workarea_1").length === 1);
  }, [])

  return isOnlyField;
}

function useStepName(isOnlyField: boolean, getPConnect: Function){
  const [stepName] = useState(getPConnect().getDataObject()?.caseInfo.assignments[0].name);
  return stepName
}


export {useIsOnlyField, useStepName};

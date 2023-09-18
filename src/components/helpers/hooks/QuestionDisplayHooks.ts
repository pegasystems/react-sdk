import {useContext} from 'react';
import {DefaultFormContext, HMRCAppContext} from '../../helpers/HMRCAppContext';
/**
 * Helper hook for handling instances where there is only one field presented in the current view.
 * Returns a boolean indicating whether or not there is only one field to display in the current context
*/

/* Retaining this code for future change in implementation of single question pages. */


export default function useIsOnlyField(callerDisplayOrder = null){
    const DFContext = useContext(DefaultFormContext);
    const AssignmentContext = useContext(HMRCAppContext);

    // Checks to see if the closest parent default form of the current element is in the SingleQuestionDisplayDFStack
    // If it is, display this element as if it's a single field IF it's the first element in the form. (Driven by the display order it has been given)
    if(AssignmentContext.SingleQuestionDisplayDFStack.includes(DFContext.DFName)){
        return callerDisplayOrder === "0" ? DFContext.displayAsSingleQuestion : false;
    }
    // Otherwise, use the Assignment context's singleQuestion page value, to fall back to the original logic (checking number of editable fields);
    else {
        return AssignmentContext.singleQuestionPage;
    }
}

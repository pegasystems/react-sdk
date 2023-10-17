import {useContext, useEffect, useState} from 'react';
import {DefaultFormContext} from '../../helpers/HMRCAppContext';
/**
 * Helper hook for handling instances where there is only one field presented in the current view.
 * Returns a boolean indicating whether or not there is only one field to display in the current context
*/

/* Retaining this code for future change in implementation of single question pages. */


export default function useIsOnlyField(callerDisplayOrder = null, refreshTrigger = null){
    const DFContext = useContext(DefaultFormContext);
    const defaultOnlyFieldDetails = {isOnlyField: false, overrideLabel: ''};
    const [onlyFieldDetails, setOnlyFieldDetails] = useState({isOnlyField: false, overrideLabel: ''})
    

    useEffect(() => {

    if (PCore.getStoreValue('displayAsSingleQuestion', '', 'app') && DFContext.DFName === -1){
        defaultOnlyFieldDetails.isOnlyField = true;
        setOnlyFieldDetails(defaultOnlyFieldDetails);
    }
    

    // Checks to see if the closest parent default form of the current element is in the SingleQuestionDisplayDFStack
    // If it is, display this element as if it's a single field IF it's the first element in the form. (Driven by the display order it has been given)
    if(DFContext.displayAsSingleQuestion){
        defaultOnlyFieldDetails.isOnlyField = callerDisplayOrder === "0" ? DFContext.displayAsSingleQuestion : false;
    }
    // Otherwise, use the Assignment context's singleQuestion page value, to fall back to the original logic (checking number of editable fields);
    else {
        defaultOnlyFieldDetails.overrideLabel = DFContext.OverrideLabelValue;
        const editableFieldsCount = PCore.getFormUtils().getEditableFields(PCore.getContainerUtils().getActiveContainerItemContext('app/primary_1/workarea')).length;

        if(editableFieldsCount === 1){
            defaultOnlyFieldDetails.isOnlyField = true;
        } else if (DFContext.DFName !== -1) {
            defaultOnlyFieldDetails.isOnlyField = false;
        } else {
            defaultOnlyFieldDetails.isOnlyField = !!PCore.getStoreValue('displayAsSingleQuestion', '', 'app');
        }

    }
    setOnlyFieldDetails(defaultOnlyFieldDetails);
    }, [refreshTrigger])
    
    return onlyFieldDetails;
}

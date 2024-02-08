/** ************************
* Returns a function to handle switching of Notification Language within a Pega Claim using the 2nd process
* defined in document attached to US-12624 (TODO: Host documentation in Common Component Documentation Catalogue)
*
* params:
*   config - object linking language codes to respective language switch processes
*   PConnectObject - assignment level PConnectObject used to call processAction   
*
* Expects a config object to link languages to respective process, e.g. 
* to handle switching to welsh, where the Process action to do so is named SwitchLanguageToWelsh,
*     and switching to english, where the PRocess action to do so is named SwitchLanguageToEnglish
* the config object would look like:
*
*   {en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh'}
*
* (The returned callback is expected to be called in the LanguageToggle component, where it will be called with the selecte language code, 
* and a Pconnect object)
*/
function toggleNotificationProcess(config, PConnectObject) {

    return (lang) => {
        if(config[lang] && PConnectObject){
            PConnectObject.getActionsApi().openProcessAction( config[lang], {caseID: PConnectObject.getDataObject().caseInfo.ID, type:'Case'})
        }        
    }   
        
};

export default toggleNotificationProcess;
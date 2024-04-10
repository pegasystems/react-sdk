/* ***
 * helper function for closing a PCore container item by name
*/ 
function closeContainer(containerName, skipDirtyCheck){

    const containerUtils = PCore.getContainerUtils();
    const closeContainer = containerUtils.closeContainerItem;

    try{
        closeContainer(containerName, {skipDirtyCheck});
    } catch(e) {
        console.log(`Error occured while attempting to close container ${containerName} - ${e}`)
    }
    
}

function closeActivePrimaryContainer(skipDirtyCheck){
    const containerUtils = PCore.getContainerUtils();
    const closeContainer = containerUtils.closeContainerItem;

    const containerName = PCore.getContainerUtils().getActiveContainerItemContext('app/primary')

    closeContainer(containerName, skipDirtyCheck)
}

function closeActiveWorkareaContainer(skipDirtyCheck){
    const containerUtils = PCore.getContainerUtils();
    const closeContainer = containerUtils.closeContainerItem;
    
    const activePrimaryContainer = PCore.getContainerUtils().getActiveContainerItemContext('app/primary')
    const containerName = PCore.getContainerUtils().getActiveContainerItemName(
        `${activePrimaryContainer}/workarea`
      );

    closeContainer(containerName, skipDirtyCheck)
}

export {closeContainer, closeActiveWorkareaContainer, closeActivePrimaryContainer}



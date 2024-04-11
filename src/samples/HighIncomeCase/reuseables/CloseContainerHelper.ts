/* ***
 * helper function for closing a PCore container item by name
*/ 
function closeContainer(containerName, skipDirtyCheck){

    const containerUtils = PCore.getContainerUtils();
    const closeContainerItem = containerUtils.closeContainerItem;

    try{
        closeContainerItem(containerName, {skipDirtyCheck});
    } catch(e) {
        // eslint-disable-next-line 
        console.error(`Error occured while attempting to close container ${containerName} - ${e}`)
    }
    
}

function closeActivePrimaryContainer(skipDirtyCheck){
    const containerUtils = PCore.getContainerUtils();
    const closeContainerItem = containerUtils.closeContainerItem;

    const containerName = PCore.getContainerUtils().getActiveContainerItemContext('app/primary')

    closeContainerItem(containerName, skipDirtyCheck)
}

function closeActiveWorkareaContainer(skipDirtyCheck){
    const containerUtils = PCore.getContainerUtils();
    const closeContainerItem = containerUtils.closeContainerItem;
    
    const activePrimaryContainer = PCore.getContainerUtils().getActiveContainerItemContext('app/primary')
    const containerName = PCore.getContainerUtils().getActiveContainerItemName(
        `${activePrimaryContainer}/workarea`
      );

      closeContainerItem(containerName, skipDirtyCheck)
}

export {closeContainer, closeActiveWorkareaContainer, closeActivePrimaryContainer}



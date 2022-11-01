/* eslint-disable no-undef */
export const getDeferFriendlyTabs = allTabs => {
  return allTabs.map(tab => {
    const theTabCompConfig = tab.getPConnect().getConfigProps();
    return { type: 'DeferLoad', config: theTabCompConfig };
  });
};

export const getVisibleTabs = (allTabs, uuid) => {
  let index = 0;
  return allTabs.props
    .getPConnect()
    .getChildren()
    ?.filter(child => {
      // US-402838: Filter out tab entries if the config object does not contain the visibility attribute or it evaluates to the boolean true,
      const config = child.getPConnect().getConfigProps();

      // BUG-642335 - adding isChildDeferLoad prop
      if (child.getPConnect().getComponentName() === 'DeferLoad') {
        const { name: viewName, deferLoadId = `${viewName}_${uuid}_${index}` } = config;
        child.getPConnect().registerAdditionalProps({
          deferLoadId,
          isChildDeferLoad: true
        });
      }
      index += 1;
      return !('visibility' in config) || config.visibility === true;
    });
};

export const getTransientTabs = (availableTabs, currentTabId, tabItems) => {
  return (
    availableTabs?.map((child, i) => {
      const config = child.getPConnect().getConfigProps();
      const tabLabel =
        config.label ||
        config.inheritedProps?.find(obj => obj.prop === 'label')?.value ||
        PCore.getLocaleUtils().getLocaleValue('No label specified in config', 'Generic');
      const tabContent = () => {
        if (i.toString() === currentTabId) {
          return tabItems?.[i.toString()]?.content
            ? tabItems?.[i.toString()]?.content
            : child.getPConnect().getComponent();
        }
        return tabItems?.[i.toString()]?.content;
      };
      return {
        name: tabLabel,
        id: i.toString(),
        content: tabContent()
      };
    }) || []
  );
};

export const tabClick = (id, availableTabs, currentTabId, setCurrentTabId, tabItems) => {
  const currentPConn = availableTabs[currentTabId].getPConnect();
  const { deferLoadId } = currentPConn.getConfigProps();
  PCore.getDeferLoadManager().deactivate(deferLoadId, currentPConn.getContextName());

  setCurrentTabId(id);
  const index = parseInt(id, 10);
  if (tabItems[index]?.content === null) {
    tabItems[index].content = availableTabs[index].getPConnect().getComponent();
  }

  const nextPConn = availableTabs[id].getPConnect();
  const { deferLoadId: activeId } = nextPConn?.getConfigProps();
  PCore.getDeferLoadManager().activate(activeId, nextPConn?.getContextName());
  PCore.getDeferLoadManager().refreshComponent(activeId, nextPConn?.getContextName());
};

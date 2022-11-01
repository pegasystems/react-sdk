import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs } from "@material-ui/core";
import { TabContext, TabPanel } from '@material-ui/lab';
import { getTransientTabs, getVisibleTabs, tabClick } from '../tabUtils';

export default function SubTabs(props) {
  const { children } = props;

  const defaultTabIndex = 0;
  const deferLoadedTabs = children[0];
  const availableTabs = getVisibleTabs(deferLoadedTabs, "tabsSubs");
  const [currentTabId, setCurrentTabId] = useState(defaultTabIndex.toString());

  const [tabItems, setTabitem] = useState<Array<any>>([]);
  useEffect(() => {
    const tempTabItems = getTransientTabs(
      availableTabs,
      currentTabId,
      tabItems
    );
    setTabitem(tempTabItems);
  }, [currentTabId]);


  const handleTabClick = (id, index: string) => {
    setCurrentTabId(index);
    tabClick(index, availableTabs, currentTabId, setCurrentTabId, tabItems);
  };

  return (
    <Fragment>
      <TabContext value={currentTabId.toString()}>
      <Tabs
        onChange={handleTabClick}
        value={currentTabId}
        variant="scrollable"
        >
      {tabItems.map((tab:any) =>
        <Tab
        key={tab.id}
        label={tab.name}
        value={tab.id}
        />
  )}
    </Tabs>

      {
        tabItems.map((tab:any) => (
          <TabPanel key={tab.id} value={tab.id} tabIndex={+tab.id}>
            <div>{tab.content ? tab.content : "No content exists"}</div>
          </TabPanel>
        ))}
      </TabContext>
    </Fragment>
  );
}

SubTabs.defaultProps = {
   children: []
}

SubTabs.propTypes = {
   children: PropTypes.arrayOf(PropTypes.node)
};

import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getTransientTabs, getVisibleTabs, tabClick } from '../../tabUtils';
import React from 'react';
import { Tab, Tabs, TextField } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';

export default function DetailsSubTabs(props) {
  const { children, label, showLabel, getPConnect } = props;
  // Get the inherited props from the parent to determine label settings
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  const defaultTabIndex = 0;
  const deferLoadedTabs = children[0];
  let availableTabs = [];

  useEffect(() => {
    availableTabs = getVisibleTabs(deferLoadedTabs, 'detailsSubTabs');
  }, [availableTabs]);

  const [currentTabId, setCurrentTabId] = useState(defaultTabIndex.toString());

  const [tabItems, setTabitem] = useState([]);
  useEffect(() => {
    const tempTabItems = getTransientTabs(availableTabs, currentTabId, tabItems);
    setTabitem(tempTabItems);
  }, [currentTabId]);

  const handleTabClick = (id, index: string) => {
    setCurrentTabId(index);
    tabClick(index, availableTabs, currentTabId, setCurrentTabId, tabItems);
  };

  return (
    <Fragment>
      {propsToUse.showLabel && <TextField>{propsToUse.label}</TextField>}
      <TabContext value={currentTabId.toString()}>
        <Tabs onChange={handleTabClick} value={currentTabId}>
          {tabItems.map((tab: any) => (
            <Tab key={tab.id} label={tab.name} value={tab.id} />
          ))}
        </Tabs>

        {tabItems.map((tab: any) => (
          <TabPanel key={tab.id} value={tab.id} tabIndex={+tab.id}>
            <div>{tab.content ? tab.content : 'No content exists'}</div>
          </TabPanel>
        ))}
      </TabContext>
    </Fragment>
  );
}

DetailsSubTabs.defaultProps = {
  children: [],
  label: undefined,
  showLabel: true
};

DetailsSubTabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired
};

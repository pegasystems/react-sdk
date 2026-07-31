import { useEffect, useState } from 'react';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';

import HomeScreen from './HomeScreen';
import PegaAuthProvider from './context/PegaAuthProvider';
import { PegaProvider, usePega, type CaseReference, type CaseTypeInfo } from './context/PegaProvider';
import { theme } from '../../theme';
import './styles.css';

const HOME_TAB_ID = 'home';

interface TabItem {
  id: string;
  title: string;
  type: 'home' | 'case';
  containerItemID?: string;
  loading?: boolean;
}

export default function Tabs() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PegaAuthProvider>
          <PegaProvider>
            <TabsWorkspace />
          </PegaProvider>
        </PegaAuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

function TabsWorkspace() {
  const { isPegaReady, caseTypes, createCase, activateCase, closeCase, PegaContainer } = usePega();

  const [tabs, setTabs] = useState<TabItem[]>([{ id: HOME_TAB_ID, title: 'Home', type: 'home' }]);
  const [activeTabId, setActiveTabId] = useState<string>(HOME_TAB_ID);
  const [caseCounter, setCaseCounter] = useState(0);
  // Tracks which case is currently in front so we only re-activate on change.
  const [activeItemID, setActiveItemID] = useState<string | null>(null);

  const activeTab = tabs.find(tab => tab.id === activeTabId) ?? tabs[0];

  // Bring the active case's container item to the front (no server reload) when the tab changes.
  useEffect(() => {
    if (activeTab.type !== 'case' || !activeTab.containerItemID || activeTab.containerItemID === activeItemID) {
      return;
    }
    activateCase(activeTab.containerItemID)
      .then(() => setActiveItemID(activeTab.containerItemID ?? null))
      .catch(error => console.error('Failed to activate case', error));
  }, [activeTab, activeItemID, activateCase]);

  const handleCreateCase = async (caseType: CaseTypeInfo) => {
    if (!isPegaReady) return;

    // Open the tab immediately in a loading state, then fill it once the case is created.
    const nextCount = caseCounter + 1;
    const tabId = `case-${nextCount}`;
    setTabs(prevTabs => [...prevTabs, { id: tabId, title: caseType.name, type: 'case', loading: true }]);
    setActiveTabId(tabId);
    setCaseCounter(nextCount);

    try {
      const caseRef: CaseReference = await createCase(caseType.id);
      setTabs(prevTabs =>
        prevTabs.map(tab =>
          tab.id === tabId ? { ...tab, title: caseRef.businessID || caseType.name, containerItemID: caseRef.containerItemID, loading: false } : tab
        )
      );
      setActiveItemID(caseRef.containerItemID);
    } catch (error) {
      console.error('Failed to create case', error);
      setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
      setActiveTabId(current => (current === tabId ? HOME_TAB_ID : current));
    }
  };

  const handleCloseTab = (event: React.MouseEvent, tabId: string) => {
    event.stopPropagation();
    const closingTab = tabs.find(tab => tab.id === tabId);
    if (closingTab?.containerItemID) {
      closeCase(closingTab.containerItemID).catch(error => console.error('Failed to close case', error));
    }

    setTabs(prevTabs => {
      const closingIndex = prevTabs.findIndex(tab => tab.id === tabId);
      const remainingTabs = prevTabs.filter(tab => tab.id !== tabId);

      // If the active tab is closed, activate the neighbour (or Home as fallback)
      if (activeTabId === tabId) {
        const fallbackTab = remainingTabs[closingIndex - 1] ?? remainingTabs[0] ?? { id: HOME_TAB_ID };
        setActiveTabId(fallbackTab.id);
      }

      return remainingTabs;
    });
  };

  return (
    <div className='tabs-container'>
      <nav className='tabs-left-panel' aria-label='Tabs'>
        <div className='tabs-left-panel-heading'>Workspace</div>
        <ul className='tabs-tab-list'>
          {tabs.map(tab => {
            const isActive = tab.id === activeTab.id;
            return (
              <li
                key={tab.id}
                className={`tabs-tab-item ${isActive ? 'tabs-tab-item-active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className='tabs-tab-label'>{tab.title}</span>
                {tab.type === 'case' && (
                  <button
                    type='button'
                    className='tabs-close-button'
                    aria-label={`Close ${tab.title}`}
                    onClick={event => handleCloseTab(event, tab.id)}
                  >
                    &times;
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <main className='tabs-content'>
        {activeTab.type === 'home' && <HomeScreen isPegaReady={isPegaReady} caseTypes={caseTypes} onCreateCase={handleCreateCase} />}

        {/* The multiple-mode work area stays mounted and hosts every open case; only the heading swaps. */}
        <div style={{ display: activeTab.type === 'case' ? 'block' : 'none' }}>
          {activeTab.type === 'case' && <h2 className='tabs-case-heading'>{activeTab.title}</h2>}

          {activeTab.type === 'case' && activeTab.loading && (
            <div className='tabs-loading' role='status'>
              <span className='tabs-spinner' aria-hidden='true' />
              Loading case…
            </div>
          )}

          {/* Keep the work area mounted while loading so no cases are lost; just hide it visually. */}
          <div style={{ display: activeTab.type === 'case' && activeTab.loading ? 'none' : 'block' }}>{isPegaReady && <PegaContainer />}</div>
        </div>
      </main>
    </div>
  );
}

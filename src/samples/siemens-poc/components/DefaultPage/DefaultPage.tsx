import { createElement, useEffect, useMemo, useState, type ReactNode } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import CheckIcon from '@mui/icons-material/Check';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SdkDefaultPage from '@pega/react-sdk-components/lib/components/template/DefaultPage';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

import { localize, ShortcutsVariantContext, useCockpit } from '../../context/CockpitContext';

interface DefaultPageProps {
  getPConnect: () => typeof PConnect;
  enableBanner?: boolean;
  localeReference?: string;
  children?: ReactNode;
  [key: string]: any;
}

interface ChildRef {
  getPConnect: () => typeof PConnect;
}

const HIGH_PRIORITY = 75;
const DUE_SOON_DAYS = 7;

function renderChild(child: ChildRef, key: string) {
  return createElement(createPConnectComponent(), { ...child, key });
}

function getRegionName(child: ChildRef) {
  return (child.getPConnect().getRawMetadata() as any)?.name ?? '';
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function getInsightTitle(child: ChildRef) {
  const { id, label } = child.getPConnect().getConfigProps() as any;
  try {
    const insight: any = (PCore.getMetadataUtils() as any).getInsight?.(id);
    const content = typeof insight?.pyContent === 'string' ? JSON.parse(insight.pyContent) : insight?.pyContent;
    return content?.details?.title || label || insight?.pyName;
  } catch {
    return label;
  }
}

export default function CockpitDefaultPage(props: DefaultPageProps) {
  const { enabled } = useCockpit();

  // Only the portal landing page with a banner gets the Cockpit layout; nested/other pages keep the SDK layout.
  if (!enabled || !props.enableBanner) {
    return <SdkDefaultPage {...(props as any)} />;
  }

  return <CockpitHome {...props} />;
}

function CockpitHome({ getPConnect, title }: DefaultPageProps) {
  const { assignments } = useCockpit();
  const pConn = getPConnect();
  const regions = (pConn.getChildren() as unknown as ChildRef[]) ?? [];

  const byName = (name: string) => regions.find(region => getRegionName(region) === name);
  const bannerContent = byName('BannerContent');
  const bannerRegion = byName('BannerRegion');
  const sideRegion = byName('A');
  const mainRegion = byName('B');

  // Authors sometimes place the same agent in both banner regions; render it once.
  const showBannerRegion =
    bannerRegion &&
    JSON.stringify((bannerRegion.getPConnect().getRawMetadata() as any)?.children) !==
      JSON.stringify((bannerContent?.getPConnect().getRawMetadata() as any)?.children);

  const sideWidgets = ((sideRegion?.getPConnect().getChildren() as unknown as ChildRef[]) ?? []).map(child => ({
    child,
    type: child.getPConnect().getComponentName()
  }));
  const shortcutWidgets = sideWidgets.filter(widget => widget.type === 'Shortcuts');

  const tabs = useMemo(
    () =>
      sideWidgets.map((widget, index) => ({
        id: `${widget.type}-${index}`,
        widget,
        label: widget.type === 'Insight' ? localize(getInsightTitle(widget.child)) : localize('Apps'),
        icon: widget.type === 'Insight' ? <NewspaperOutlinedIcon /> : <AppsIcon />
      })),
    [sideRegion]
  );
  const [activeTab, setActiveTab] = useState('');
  useEffect(() => {
    // Apps first, matching the Cockpit layout
    const appsTab = tabs.find(tab => tab.widget.type === 'Shortcuts') ?? tabs[0];
    if (appsTab && !tabs.some(tab => tab.id === activeTab)) setActiveTab(appsTab.id);
  }, [tabs]);

  const operatorName = PCore.getEnvironmentInfo().getOperatorName() || '';
  const appName = localize(PCore.getEnvironmentInfo().getApplicationLabel() || '');
  const stats = useMemo(() => summarize(assignments), [assignments]);

  useEffect(() => {
    // Nested landing-page views (e.g. the worklist reference) also set the document title; the home page should win.
    const pageTitle = localize(title);
    document.title = pageTitle ? `${pageTitle} - ${appName}` : appName;
  }, [assignments, title]);

  return (
    <div className='ck-page'>
      <section className='ck-card ck-hero' aria-label={localize("Today's overview")}>
        <div className='ck-hero-top'>
          <div className='ck-greeting'>
            <div className='ck-greeting-eyebrow'>{localize(getGreeting())}</div>
            <h1 className='ck-greeting-name'>{operatorName}</h1>
            <p className='ck-greeting-text'>
              {`${localize('Welcome to your')} ${appName}. `}
              {assignments
                ? `${localize('You have')} ${stats.pending} ${localize('pending tasks')}, ${stats.highPriority} ${localize('of them high priority')}.`
                : localize('Loading your tasks…')}
            </p>
          </div>
          <div className='ck-overview'>
            <div className='ck-overview-title'>{localize("Today's Overview")}</div>
            <div className='ck-overview-stats'>
              <Stat icon={<CheckIcon />} tone='teal' value={stats.pending} label={localize('Pending Actions')} />
              <Stat icon={<ScheduleIcon />} tone='rose' value={stats.dueSoon} label={localize('Due This Week')} />
              <Stat icon={<LightbulbOutlinedIcon />} tone='amber' value={stats.highPriority} label={localize('High Priority')} />
            </div>
          </div>
        </div>
        {bannerContent && <div className='ck-hero-banner'>{renderChild(bannerContent, 'banner-content')}</div>}
        {showBannerRegion && <div className='ck-hero-banner'>{renderChild(bannerRegion, 'banner-region')}</div>}
      </section>

      {shortcutWidgets.length > 0 && (
        <section>
          <ShortcutsVariantContext.Provider value='tiles'>
            {shortcutWidgets.map((widget, index) => renderChild(widget.child, `quick-${index}`))}
          </ShortcutsVariantContext.Provider>
        </section>
      )}

      <div className='ck-columns'>
        {tabs.length > 0 && (
          <aside className='ck-card ck-side' aria-label={localize('My Apps & News')}>
            <h2 className='ck-section-title'>{localize('My Apps & News')}</h2>
            <div className='ck-tabs' role='tablist' aria-label={localize('Apps and news')}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type='button'
                  role='tab'
                  id={`ck-tab-${tab.id}`}
                  aria-selected={tab.id === activeTab}
                  aria-controls={`ck-panel-${tab.id}`}
                  className={`ck-tab ${tab.id === activeTab ? 'ck-tab-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            <ShortcutsVariantContext.Provider value='list'>
              {tabs.map(tab => (
                <div key={tab.id} role='tabpanel' id={`ck-panel-${tab.id}`} aria-labelledby={`ck-tab-${tab.id}`} hidden={tab.id !== activeTab}>
                  {renderChild(tab.widget.child, `panel-${tab.id}`)}
                </div>
              ))}
            </ShortcutsVariantContext.Provider>
          </aside>
        )}
        {mainRegion && <div>{renderChild(mainRegion, 'main')}</div>}
      </div>
    </div>
  );
}

function Stat({ icon, tone, value, label }: { icon: ReactNode; tone: string; value: number; label: string }) {
  return (
    <div className='ck-stat'>
      <span className={`ck-stat-icon ck-stat-icon-${tone}`}>{icon}</span>
      <span>
        <strong className='ck-stat-value'>{value}</strong>
        <span className='ck-stat-label'>{label}</span>
      </span>
    </div>
  );
}

function summarize(rows: any[] | null) {
  const list = rows ?? [];
  const now = Date.now();
  const soon = now + DUE_SOON_DAYS * 24 * 60 * 60 * 1000;
  return {
    pending: list.length,
    highPriority: list.filter(row => Number(row.Priority) >= HIGH_PRIORITY).length,
    dueSoon: list.filter(row => {
      const due = row.Deadline ? new Date(row.Deadline).getTime() : NaN;
      return !Number.isNaN(due) && due <= soon;
    }).length
  };
}

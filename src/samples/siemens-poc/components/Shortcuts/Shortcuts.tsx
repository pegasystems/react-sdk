import { useContext, useMemo, useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';

import { localize, ShortcutsVariantContext } from '../../context/CockpitContext';
import { getAccentClass, getPiIcon } from '../../utils/icons';

interface ShortcutItem {
  type: 'ShortcutLink' | 'ShortcutPage' | 'ShortcutGroup';
  config: {
    label?: string;
    url?: string;
    imageUrl?: string;
    icon?: string;
    description?: string;
    ruleName?: string;
    name?: string;
  };
  children?: ShortcutItem[];
}

interface ShortcutsProps {
  getPConnect: () => typeof PConnect;
  heading?: string;
  shortcutItems?: ShortcutItem[];
  showHeader?: boolean;
}

interface Shortcut {
  id: string;
  label: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  open: () => void;
}

function flattenItems(items: ShortcutItem[]): ShortcutItem[] {
  return items.flatMap(item => (item.type === 'ShortcutGroup' ? flattenItems(item.children ?? []) : [item]));
}

function findNavPage(pages: any[], ruleName: string): any {
  for (const page of pages ?? []) {
    if (page.pyRuleName === ruleName) return page;
    const nested = findNavPage(page.NavigationPages, ruleName);
    if (nested) return nested;
  }
  return undefined;
}

export default function Shortcuts(props: ShortcutsProps) {
  const { getPConnect, heading, shortcutItems = [], showHeader } = props;
  const variant = useContext(ShortcutsVariantContext);
  const [filter, setFilter] = useState('');
  const pConn = getPConnect();

  const shortcuts: Shortcut[] = useMemo(() => {
    const navPages = (PCore.getStore().getState() as any)?.data?.app?.pyPortal?.pyPrimaryNavPages ?? [];

    return flattenItems(shortcutItems).flatMap((item, index): Shortcut[] => {
      const { config = {} } = item;
      if (item.type === 'ShortcutPage') {
        const page = findNavPage(navPages, config.ruleName ?? '');
        if (!page) return [];
        return [
          {
            id: `page-${index}`,
            label: localize(page.pyDefaultHeading || page.pyLabel),
            description: '',
            icon: page.pxPageViewIcon,
            open: () => pConn.getActionsApi().showPage(page.pyRuleName, page.pyClassName ?? 'Data-Portal')
          }
        ];
      }
      const url = config.url?.trim();
      if (!url || !config.label) return [];
      return [
        {
          id: `link-${index}`,
          label: localize(config.label),
          description: localize(config.description),
          imageUrl: config.imageUrl,
          icon: config.icon,
          open: () => window.open(url, '_blank', 'noopener')
        }
      ];
    });
  }, [shortcutItems]);

  const visible = filter ? shortcuts.filter(item => item.label.toLowerCase().includes(filter.toLowerCase())) : shortcuts;

  if (variant === 'list') {
    return (
      <div>
        <label className='ck-search'>
          <SearchIcon />
          <input
            type='search'
            placeholder={localize('Search apps...')}
            aria-label={localize('Search apps')}
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        </label>
        {visible.length === 0 ? (
          <p className='ck-empty'>{localize('No apps found')}</p>
        ) : (
          <ul className='ck-app-list'>
            {visible.map((item, index) => (
              <li key={item.id}>
                <button type='button' className='ck-app' onClick={item.open}>
                  <ShortcutIcon item={item} index={index} className='ck-app-icon' />
                  <span>
                    <div className='ck-app-name'>{item.label}</div>
                    {item.description && <div className='ck-app-desc'>{item.description}</div>}
                  </span>
                  <OpenInNewIcon className='ck-app-open' aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div>
      {showHeader && heading && <h2 className='ck-section-title ck-shortcuts-heading'>{localize(heading)}</h2>}
      <div className='ck-tiles'>
        {shortcuts.map((item, index) => (
          <button key={item.id} type='button' className='ck-card ck-tile' onClick={item.open}>
            <ShortcutIcon item={item} index={index} className='ck-tile-icon' />
            <span className='ck-tile-title'>{item.label}</span>
            {item.description && <span className='ck-tile-desc'>{item.description}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function ShortcutIcon({ item, index, className }: { item: Shortcut; index: number; className: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = item.imageUrl && !imageFailed;
  return (
    <span className={`${className} ${getAccentClass(index)}`} aria-hidden>
      {showImage ? <img src={item.imageUrl} alt='' onError={() => setImageFailed(true)} /> : getPiIcon(item.icon)}
    </span>
  );
}

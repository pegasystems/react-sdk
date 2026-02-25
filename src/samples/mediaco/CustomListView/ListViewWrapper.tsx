import { useEffect, useMemo, useRef, useState } from 'react';
import ActivityListView from './ActivityListView';
import './ActivityListView.css';

import { modifyListData } from './utils';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface ListViewProps extends PConnProps {
  bInForm?: boolean;
  globalSearch?: boolean;
  referenceList?: any[];
  selectionMode?: string;
  referenceType?: string;
  payload?: any;
  parameters?: any;
  compositeKeys?: any;
  showDynamicFields?: boolean;
  readonlyContextList?: any;
  value: any;
  viewName?: string;
  showRecords?: boolean;
  displayAs?: string;
}

export default function ListViewWrapper(props: ListViewProps) {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const closeModal = () => setOpen(false);
  const { getPConnect } = props;
  const thePConn = getPConnect();
  const configProps: any = thePConn.getConfigProps() as ListViewProps;
  const referenceDataPage = configProps.referenceList;
  const template = configProps.presets[0]?.template;
  const itemCountLabel = useMemo(() => {
    const n = items?.length ?? 0;
    return `${n} item${n === 1 ? '' : 's'} available`;
  }, [items]);

  useEffect(() => {
    PCore.getDataPageUtils()
      .getDataAsync(referenceDataPage, thePConn.getContextName())
      .then(({ data }) => {
        const modifiedData = data ? modifyListData(data, referenceDataPage) : [];
        setItems(modifiedData);
      });
  }, []);

  // ESC close + scroll lock + focus close button
  useEffect(() => {
    if (!open) return;

    const onKeyDown = e => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function showAllItems() {
    setOpen(true);
  }

  const title = referenceDataPage === 'D_AccountHistoryList' ? 'Activity' : referenceDataPage === 'D_TrendingItemsList' ? 'Trending Now' : '';

  return (
    <div style={{ padding: 24, background: '#ffffff' }}>
      {template === 'Table' && <ActivityListView items={items} title={title} showAllItems={showAllItems} referenceDataPage={referenceDataPage} />}

      {open && (
        <Modal onClose={closeModal}>
          <div className='alv-modalShell' role='document'>
            <div className='alv-modalHeader'>
              <div>
                <h3 className='alv-modalTitle'>All Activities</h3>
                <div className='alv-modalSubtitle'>{itemCountLabel}</div>
              </div>

              <button ref={closeBtnRef} type='button' className='alv-modalCloseBtn' onClick={closeModal} aria-label='Close'>
                <XIcon />
              </button>
            </div>

            <div className='alv-modalDivider' />

            <div className='alv-modalBody'>
              <div className='alv-tilesGrid'>
                {items.map((item, idx) => (
                  <div key={item.id ?? idx} className='alv-tile'>
                    <div className={`alv-tileIconCircle bg-${idx % 6}`} aria-hidden='true'>
                      <img
                        className={`alv-iconImg color-${idx % 6}`}
                        src={item.iconSrc}
                        alt={item.iconAlt ?? ''}
                        loading='lazy'
                        decoding='async'
                        draggable='false'
                      />
                    </div>

                    <div className='alv-tileText'>
                      <div className='alv-tileTitle'>{item.title}</div>
                      <div className='alv-tileDesc'>{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function XIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className='alv-modalOverlay' role='dialog' aria-modal='true'>
      {/* Backdrop */}
      <div className='alv-modalBackdrop' onClick={onClose} />
      {/* Panel */}
      <div className='alv-modalPanel'>{children}</div>
    </div>
  );
}

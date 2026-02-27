import './ActivityListView.scss';
import { getImageSrc, getSDKStaticConentUrl } from './utils';

interface ActivityItem {
  rating?: number;
  id?: string | number;
  title: string;
  description: string;
  time: string;
  iconSrc: string;
  iconAlt?: string;
  views?: string;
  accent?: {
    bg?: string;
    fg?: string;
  };
}

interface ActivityListViewProps {
  title?: string;
  items?: ActivityItem[];
  referenceDataPage?: string;
  showAllItems: () => void;
  onItemClick?: (item: ActivityItem) => void;
}

export default function ActivityListView({ title, items = [], referenceDataPage, showAllItems }: ActivityListViewProps) {
  return (
    <div>
      <div className='header-container'>
        <h2 className='alv-title'>{title}</h2>
      </div>

      <div className='alv-card' role='list'>
        {items.slice(0, 5).map((item, idx) => (
          <div key={item.id ?? idx} className={`alv-row alv-rowClickable`} role='listitem'>
            <div className={`alv-iconCircle bg-${idx % 6}`} aria-hidden='true'>
              {referenceDataPage === 'D_AccountHistoryList' && (
                <img
                  className={`alv-iconImg color-${idx % 6}`}
                  src={item.iconSrc}
                  alt={item.iconAlt ?? ''}
                  loading='lazy'
                  decoding='async'
                  draggable='false'
                />
              )}
              {referenceDataPage === 'D_TrendingItemsList' && <span className={`color-${idx % 6}`}>{idx + 1}</span>}
            </div>

            <div className='alv-content'>
              <div className='alv-topLine'>
                <span className='alv-itemTitle'>{item.title}</span>
                {item.time && (
                  <span className='alv-dot' aria-hidden='true'>
                    •
                  </span>
                )}
                <span className='alv-time'>{item.time}</span>
              </div>
              <div className='alv-topLine'>
                <span className='alv-desc'>{item.description}</span>
                {item.views && (
                  <span className='alv-dot' aria-hidden='true'>
                    •
                  </span>
                )}
                <span className='alv-time'>{item.views}</span>
              </div>
            </div>
            {item.rating && (
              <div className='extra-content'>
                <img src={getImageSrc('star-solid', getSDKStaticConentUrl())} className='star' alt='star' />
                &nbsp;{item.rating}
              </div>
            )}
          </div>
        ))}
      </div>
      {referenceDataPage === 'D_AccountHistoryList' && (
        <div className='alv-headerBtn' onClick={showAllItems} aria-label='Open activity'>
          Show all
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import ListView from '@pega/react-sdk-components/lib/components/template/ListView';
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import { getActivityIcon, timeSince, CASE_TYPE_TO_ACTIVITY_MAP } from './helpers';
import Carousel from '../Carousel';
import GalleryGrid from '../GalleryGrid';
import './ListView.scss';

/** Custom MediaCo data pages that get the gallery/carousel/table treatment */
const MEDIACO_DATA_PAGES = ['D_AccountHistoryList', 'D_TrendingItemsList', 'D_CarouselitemList'];

interface ListViewProps {
  getPConnect: () => typeof PConnect;
  bInForm?: boolean;
  title: any;
  [key: string]: any; // pass-through props for SDK ListView
}

export default function MediaCoListView(props: ListViewProps) {
  const { getPConnect, referenceList = '', title } = props;
  const pConn = getPConnect();

  const refList: string = referenceList;
  const isCustomDataPage = MEDIACO_DATA_PAGES.includes(refList);

  // ── If NOT a custom MediaCo data page → delegate to SDK ListView ──
  if (!isCustomDataPage) {
    return <ListView {...(props as any)} />;
  }

  // ── Custom MediaCo rendering (gallery / carousel / table) ──
  return <MediaCoListViewContent pConn={pConn} refList={refList} title={title} />;
}

/** Inner component for the custom MediaCo data pages */
function MediaCoListViewContent({ pConn, refList, title }: { pConn: any; refList: string; title: any }) {
  const [sourceList, setSourceList] = useState<any[] | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const componentConfig: any = pConn.getComponentConfig();
  const preset = componentConfig?.presets?.[0];
  const template = preset?.template || '';
  const columnFields = preset?.children?.[0]?.children || [];

  useEffect(() => {
    PCore.getDataPageUtils()
      .getDataAsync(refList, pConn.getContextName())
      .then(({ data }: any) => {
        modifyListData(data, refList, columnFields);
      })
      .catch((err: any) => console.error('ListView data fetch error:', err));
  }, [pConn, refList]);

  function modifyListData(data: any[], dataPage: string, columnFields: any[]) {
    const cols = columnFields.map((field: any, index: number) => {
      let theField = field.config?.value?.substring(field.config.value.indexOf(' ') + 1) || '';
      if (theField.indexOf('.') === 0) theField = theField.substring(1);
      return { id: theField, label: field.config?.label || '', index };
    });
    if (dataPage === 'D_AccountHistoryList') {
      setSourceList(
        data.map(item => {
          const caseType = CASE_TYPE_TO_ACTIVITY_MAP[item.ActivityType] || '';
          return {
            icon: Utils.getImageSrc(getActivityIcon(caseType), Utils.getSDKStaticConentUrl()),
            title: cols[0] ? item[cols[0].id] : undefined,
            title_subtext: cols[2] ? timeSince(new Date(item[cols[2].id] || item.pxCreateDateTime)) : undefined,
            description: cols[1] ? item[cols[1].id] : undefined
          };
        })
      );
    } else if (dataPage === 'D_TrendingItemsList') {
      setSourceList(
        data.map((item, index) => ({
          number: index + 1,
          title: cols[0] ? item[cols[0].id] : undefined,
          description: cols[1] ? item[cols[1].id] : undefined,
          description_subtext: cols[2] ? `${item[cols[2].id]} views` : undefined,
          rating: cols[3] ? item[cols[3].id] : undefined
        }))
      );
    } else if (dataPage === 'D_CarouselitemList') {
      setSourceList(
        data.map(item => ({
          Carouselheading: item.Carouselheading,
          ImageURL: item.ImageURL
        }))
      );
    }
  }

  return (
    <>
      {/* Header */}
      <div className='mc-list-view-header'>
        <div className='mc-list-view-header-title-wrap'>
          <div className='mc-list-view-header-title-content'>
            <h3 className='mc-list-view-title'>{title}</h3>
            <div className='mc-list-view-title-underline' />
          </div>
        </div>
        {refList === 'D_AccountHistoryList' && (
          <button onClick={() => setGalleryOpen(true)} className='mc-list-view-arrow-button'>
            <ArrowForwardIcon className='mc-list-view-arrow-icon' />
          </button>
        )}
      </div>

      {/* Table template */}
      {template === 'Table' && sourceList && sourceList.length > 0 && (
        <div className='mc-list-view-table'>
          {sourceList.slice(0, 5).map((item, i, arr) => (
            <div key={i} className={`lv-row mc-list-view-row ${i === arr.length - 1 ? 'mc-list-view-row-last' : ''}`}>
              {/* Icon */}
              <div className={`mc-list-view-icon-box mc-list-view-icon-box-${i % 6}`}>
                {item.icon && !item.icon.endsWith('/.svg') ? (
                  <img src={item.icon} alt='' className={`mc-list-view-icon-image mc-list-view-icon-filter-${i % 6}`} />
                ) : (
                  <span className={`mc-list-view-icon-index mc-list-view-icon-filter-${i % 6}`}>{item.number ?? i + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className='mc-list-view-content'>
                <div className='mc-list-view-content-top'>
                  <span className='mc-list-view-item-title'>{item.title}</span>
                  {item.title_subtext && (
                    <>
                      <span className='mc-list-view-dot' />
                      <span className='mc-list-view-subtext'>{item.title_subtext}</span>
                    </>
                  )}
                </div>
                <div className='mc-list-view-content-bottom'>
                  <span>{item.description}</span>
                  {item.description_subtext && (
                    <>
                      <span className='mc-list-view-dot' />
                      <span className='mc-list-view-subtext'>{item.description_subtext}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Rating */}
              {item.rating && (
                <div className='mc-list-view-rating'>
                  <StarIcon className='mc-list-view-rating-icon' />
                  <span>{item.rating}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table loading indicator */}
      {template === 'Table' && !sourceList && (
        <div className='mc-list-view-loading'>
          <span className='mc-list-view-loading-text'>Loading...</span>
        </div>
      )}

      {/* Gallery/Carousel template */}
      {template === 'Gallery' && (
        <>
          <div className='mc-list-view-gallery'>{sourceList && <Carousel data={sourceList} />}</div>
          {refList !== 'D_TrendingItemsList' && (
            <Box className='mc-list-view-gallery-actions'>
              <Button variant='text' className='mc-list-view-show-all' onClick={() => setGalleryOpen(true)}>
                Show All
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Gallery Grid Dialog */}
      <GalleryGrid open={galleryOpen} onClose={() => setGalleryOpen(false)} items={sourceList || []} dataPage={refList} />
    </>
  );
}

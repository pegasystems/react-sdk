import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { getImageSrc, bgColors, colorFilters } from '../../utils/helpers';
import { getActivityIcon, timeSince, CASE_TYPE_TO_ACTIVITY_MAP } from './helpers';
import Carousel from '../carousel/Carousel';
import GalleryGrid from '../gallery-grid/GalleryGrid';
import OOTBListView from '@pega/react-sdk-components/lib/components/template/ListView';

/** Custom MediaCo data pages that get the gallery/carousel/table treatment */
const MEDIACO_DATA_PAGES = ['D_AccountHistoryList', 'D_TrendingItemsList', 'D_CarouselitemList'];

interface ListViewProps {
  getPConnect: () => typeof PConnect;
  bInForm?: boolean;
  title: any;
  [key: string]: any; // pass-through props for OOTB ListView
}

export default function ListView(props: ListViewProps) {
  const { getPConnect, referenceList = '', title } = props;
  const pConn = getPConnect();

  const refList: string = referenceList;
  const isCustomDataPage = MEDIACO_DATA_PAGES.includes(refList);

  // ── If NOT a custom MediaCo data page → delegate to OOTB ListView immediately ──
  if (!isCustomDataPage) {
    return <OOTBListView {...(props as any)} />;
  }

  // ── Custom MediaCo rendering (gallery / carousel / table) ──
  return <MediaCoListView pConn={pConn} refList={refList} title={title} />;
}

/** Inner component for the custom MediaCo data pages */
function MediaCoListView({ pConn, refList, title }: { pConn: any; refList: string; title: any }) {
  const [sourceList, setSourceList] = useState<any[] | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const componentConfig: any = pConn.getComponentConfig();
  const preset = componentConfig?.presets?.[0];
  const template = preset?.template || '';

  useEffect(() => {
    const componentConfig: any = pConn.getComponentConfig();
    const columnFields = componentConfig?.presets?.[0]?.children?.[0]?.children || [];

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
            icon: getImageSrc(getActivityIcon(caseType)),
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 28 }}>
        <div style={{ display: 'flex', padding: '0 4px' }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 400, color: '#2c2c2c', margin: '0 0 4px 0' }}>{title}</h3>
            <div style={{ height: 4, backgroundColor: '#9c27b0', width: '100%', borderRadius: 2 }} />
          </div>
        </div>
        {refList === 'D_AccountHistoryList' && (
          <button
            onClick={() => setGalleryOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowForwardIcon />
          </button>
        )}
      </div>

      {/* Table template */}
      {template === 'Table' && sourceList && sourceList.length > 0 && (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {sourceList.slice(0, 5).map((item, i) => (
            <div
              key={i}
              className='lv-row'
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '20px 25px',
                position: 'relative',
                backgroundColor: '#fff',
                transition: 'background-color 0.3s ease',
                borderBottom: i < sourceList.slice(0, 5).length - 1 ? '1px solid #e5e7eb' : 'none'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#f6f5f5';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#fff';
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 17,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  backgroundColor: bgColors[i % 6],
                  flexShrink: 0,
                  transition: 'transform 0.3s ease'
                }}
              >
                {item.icon && !item.icon.endsWith('/.svg') ? (
                  <img src={item.icon} alt='' style={{ width: 24, height: 24, objectFit: 'contain', filter: colorFilters[i % 6] }} />
                ) : (
                  <span style={{ fontWeight: 600, fontSize: 14, filter: colorFilters[i % 6] }}>{item.number ?? i + 1}</span>
                )}
              </div>

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: 12, height: 48, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</span>
                  {item.title_subtext && (
                    <>
                      <span style={{ width: 3, height: 3, backgroundColor: '#9ca3af', borderRadius: '50%', display: 'inline-block' }} />
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>{item.title_subtext}</span>
                    </>
                  )}
                </div>
                <div style={{ color: '#4b5563', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.description}</span>
                  {item.description_subtext && (
                    <>
                      <span style={{ width: 3, height: 3, backgroundColor: '#9ca3af', borderRadius: '50%', display: 'inline-block' }} />
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>{item.description_subtext}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Rating */}
              {item.rating && (
                <div style={{ height: 48, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                  <StarIcon style={{ color: '#ffc107', height: 16, marginRight: 5 }} />
                  <span>{item.rating}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table loading indicator */}
      {template === 'Table' && !sourceList && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <span style={{ color: '#9ca3af', fontSize: 14 }}>Loading...</span>
        </div>
      )}

      {/* Gallery/Carousel template */}
      {template === 'Gallery' && (
        <>
          <div style={{ display: 'block', width: '100%', maxWidth: '100%', overflow: 'hidden', position: 'relative' }}>
            {sourceList && <Carousel data={sourceList} />}
          </div>
          {refList !== 'D_TrendingItemsList' && (
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', py: '10px', boxSizing: 'border-box' }}>
              <Button variant='text' sx={{ color: 'rgb(103,80,164)', textTransform: 'none' }} onClick={() => setGalleryOpen(true)}>
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

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import './GalleryGrid.scss';

interface GalleryGridProps {
  open: boolean;
  onClose: () => void;
  items: any[];
  dataPage: string;
}

function TableTemplateCard({ data, index }: { data: any; index: number }) {
  const bgIdx = index % 6;
  return (
    <Box className='mc-gallery-table-card'>
      <Box className='mc-gallery-table-card-content'>
        <Box className={`mc-gallery-table-icon-box mc-gallery-table-icon-box-${bgIdx}`}>
          {data.icon && <Box component='img' src={data.icon} className={`mc-gallery-table-icon-image mc-gallery-table-icon-filter-${bgIdx}`} />}
        </Box>
        <Box className='mc-gallery-table-text'>
          <Typography className='mc-gallery-table-title'>{data.title}</Typography>
          <Typography className='mc-gallery-table-description'>{data.description}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function GalleryGrid({ open, onClose, items, dataPage }: GalleryGridProps) {
  const isCarousel = dataPage === 'D_CarouselitemList';
  const isAccountHistory = dataPage === 'D_AccountHistoryList';

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ className: 'mc-gallery-dialog-paper' }}>
      <Box className='mc-gallery-dialog'>
        {/* Header */}
        <Box className='mc-gallery-dialog-header'>
          <Box>
            <Typography className='mc-gallery-dialog-title'>{isAccountHistory ? 'All Activities' : 'Featured Content'}</Typography>
            <Typography className='mc-gallery-dialog-subtitle'>{items.length} items available</Typography>
          </Box>
          <IconButton onClick={onClose} className='mc-gallery-close-button'>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        {isCarousel && (
          <Box className='mc-gallery-carousel-grid'>
            {items.map((item, i) => (
              <Box key={i} className='mc-gallery-carousel-item'>
                <Box component='img' src={item.ImageURL} alt='Item' className='mc-gallery-carousel-image' />
                <Typography className='mc-gallery-carousel-label'>{item.Carouselheading}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {isAccountHistory && (
          <Box className='mc-gallery-table-grid'>
            {items.map((item, i) => (
              <Box key={i}>
                <TableTemplateCard data={item} index={i} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Dialog>
  );
}

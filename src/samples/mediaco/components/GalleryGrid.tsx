import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

interface GalleryGridProps {
  open: boolean;
  onClose: () => void;
  items: any[];
  dataPage: string;
}

const bgColors = ['#ede9fe', '#fce7f3', '#e0f2fe', '#ffedd5', '#f3e8ff', '#d1fae5'];
const colorFilters = [
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(250deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(320deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(190deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(25deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(120deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(90deg) saturate(500%)'
];

function TableTemplateCard({ data, index }: { data: any; index: number }) {
  const bgIdx = index % 6;
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '20px',
        boxShadow: '0px 1px 2px 0px #0000004d, 0px 2px 6px 2px #00000026',
        p: '18px',
        transition: 'transform 0.1s',
        background: '#f3edf7',
        '&:hover': { transform: 'scale(1.01)', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Box
          sx={{
            minWidth: 64,
            minHeight: 64,
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: bgColors[bgIdx]
          }}
        >
          {data.icon && (
            <Box component='img' src={data.icon} sx={{ display: 'block', borderRadius: '8px', filter: colorFilters[bgIdx], width: 24, height: 24 }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography sx={{ fontSize: 22, fontWeight: 400, lineHeight: '28px', color: '#1d1b20' }}>{data.title}</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', letterSpacing: '0.25px' }}>{data.description}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function GalleryGrid({ open, onClose, items, dataPage }: GalleryGridProps) {
  const isCarousel = dataPage === 'D_CarouselitemList';
  const isAccountHistory = dataPage === 'D_AccountHistoryList';

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ sx: { width: '100%', maxWidth: 1400, maxHeight: '90vh', background: '#f8f2fb' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '2rem', py: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
          <Box>
            <Typography sx={{ fontSize: 45, fontWeight: 400, lineHeight: '52px', m: 0 }}>
              {isAccountHistory ? 'All Activities' : 'Featured Content'}
            </Typography>
            <Typography sx={{ color: '#6b7280', fontSize: 14, fontWeight: 400, lineHeight: '20px' }}>{items.length} items available</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        {isCarousel && (
          <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', p: 3, overflowY: 'auto' }}>
            {items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  position: 'relative',
                  border: '1px solid #e0e0e0',
                  borderRadius: '1.5rem',
                  transition: 'transform 0.2s',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }
                }}
              >
                <Box component='img' src={item.ImageURL} alt='Item' sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <Typography sx={{ position: 'absolute', bottom: 0, left: 0, m: 0, p: 2, fontWeight: 500, color: '#fff', fontSize: 16 }}>
                  {item.Carouselheading}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {isAccountHistory && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: '22px',
              p: '1.5rem 2rem',
              overflowY: 'auto'
            }}
          >
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

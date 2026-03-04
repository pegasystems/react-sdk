import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const footerLinkStyle = {
  px: 0,
  py: 0.5,
  '&:hover': { backgroundColor: 'transparent', transform: 'translateX(4px)', transition: 'transform 0.3s ease' }
};

export default function Footer() {
  return (
    <Box component='footer' sx={{ backgroundColor: '#f7f2fa', color: '#333', py: '30px' }}>
      <Box sx={{ mx: 'auto', px: '20px' }}>
        {/* Top Section */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', mb: '2rem' }}>
          {/* Column 1 - MediaCo */}
          <Box sx={{ flex: 1, minWidth: 220, mb: '20px', pl: '10px' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: '15px', fontSize: 18 }}>
              MediaCo
            </Typography>
            <Typography variant='body2' sx={{ lineHeight: 1.6, mb: '20px', pt: 0.5 }}>
              Your trusted partner for premium entertainment and connectivity solutions.
            </Typography>
            <Box sx={{ display: 'flex' }}>
              {[
                { icon: <FacebookIcon />, label: 'Facebook' },
                { icon: <TwitterIcon />, label: 'Twitter' },
                { icon: <InstagramIcon />, label: 'Instagram' },
                { icon: <YouTubeIcon />, label: 'YouTube' }
              ].map(social => (
                <IconButton
                  key={social.label}
                  aria-label={social.label}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: '10px',
                    backgroundColor: '#edeaf2',
                    '&:hover': { backgroundColor: '#6750a4', '& .MuiSvgIcon-root': { color: '#fff' } }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Column 2 - Quick Links */}
          <Box sx={{ flex: 1, minWidth: 220, mb: '20px', pl: '10px' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: '15px', fontSize: 18 }}>
              Quick Links
            </Typography>
            <List disablePadding>
              {['About Us', 'Services', 'Plans & Pricing', 'Help Center', 'Contact'].map(text => (
                <ListItemButton key={text} sx={footerLinkStyle}>
                  <ListItemText primary={text} primaryTypographyProps={{ sx: { color: '#49454f', fontSize: '0.9rem', '&:hover': { color: '#6750a4' } } }} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Column 3 - Support */}
          <Box sx={{ flex: 1, minWidth: 220, mb: '20px', pl: '10px' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: '15px', fontSize: 18 }}>
              Support
            </Typography>
            <List disablePadding>
              {['FAQ', 'Account Settings', 'Billing', 'Technical Support', 'Privacy Policy'].map(text => (
                <ListItemButton key={text} sx={footerLinkStyle}>
                  <ListItemText primary={text} primaryTypographyProps={{ sx: { color: '#49454f', fontSize: '0.9rem', '&:hover': { color: '#6750a4' } } }} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Column 4 - Contact Us */}
          <Box sx={{ flex: 1, minWidth: 220, mb: '20px', pl: '10px' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: '15px', fontSize: 18 }}>
              Contact Us
            </Typography>
            <Box sx={{ pt: '1rem' }}>
              {[
                {
                  icon: <PhoneIcon sx={{ color: '#6750a4', mr: '10px' }} />,
                  text: (
                    <>
                      1-800-MEDIACO
                      <br />
                      Mon-Fri 9am-6pm EST
                    </>
                  )
                },
                { icon: <EmailIcon sx={{ color: '#6750a4', mr: '10px' }} />, text: 'support@mediaco.com' },
                {
                  icon: <LocationOnIcon sx={{ color: '#6750a4', mr: '10px' }} />,
                  text: (
                    <>
                      123 Media Street
                      <br />
                      New York, NY 10001
                    </>
                  )
                }
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: '15px', fontSize: 14 }}>
                  {item.icon}
                  <Typography variant='body2'>{item.text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', pt: '20px', fontSize: 14 }}>
          <Typography variant='body2' sx={{ color: '#555' }}>
            &copy; 2025 MediaCo. All rights reserved.
          </Typography>
          <Box>
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(text => (
              <Typography
                key={text}
                component='a'
                variant='body2'
                sx={{ color: '#555', textDecoration: 'none', ml: '20px', cursor: 'pointer', '&:hover': { color: '#6750a4' } }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

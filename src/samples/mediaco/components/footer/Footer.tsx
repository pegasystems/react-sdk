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

export default function Footer() {
  return (
    <Box component='footer' className='mc-footer'>
      <Box className='mc-footer-container'>
        {/* Top Section */}
        <Box className='mc-footer-top'>
          {/* Column 1 - MediaCo */}
          <Box className='mc-footer-column'>
            <Typography variant='h6' className='mc-footer-column-title'>
              MediaCo
            </Typography>
            <Typography variant='body2' className='mc-footer-about'>
              Your trusted partner for premium entertainment and connectivity solutions.
            </Typography>
            <Box className='mc-footer-social-row'>
              {[
                { icon: <FacebookIcon className='mc-footer-social-icon' />, label: 'Facebook' },
                { icon: <TwitterIcon className='mc-footer-social-icon' />, label: 'Twitter' },
                { icon: <InstagramIcon className='mc-footer-social-icon' />, label: 'Instagram' },
                { icon: <YouTubeIcon className='mc-footer-social-icon' />, label: 'YouTube' }
              ].map(social => (
                <IconButton key={social.label} aria-label={social.label} className='mc-footer-social-button'>
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Column 2 - Quick Links */}
          <Box className='mc-footer-column'>
            <Typography variant='h6' className='mc-footer-column-title'>
              Quick Links
            </Typography>
            <List disablePadding>
              {['About Us', 'Services', 'Plans & Pricing', 'Help Center', 'Contact'].map(text => (
                <ListItemButton key={text} className='mc-footer-link-item'>
                  <ListItemText primary={text} primaryTypographyProps={{ className: 'mc-footer-link-text' }} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Column 3 - Support */}
          <Box className='mc-footer-column'>
            <Typography variant='h6' className='mc-footer-column-title'>
              Support
            </Typography>
            <List disablePadding>
              {['FAQ', 'Account Settings', 'Billing', 'Technical Support', 'Privacy Policy'].map(text => (
                <ListItemButton key={text} className='mc-footer-link-item'>
                  <ListItemText primary={text} primaryTypographyProps={{ className: 'mc-footer-link-text' }} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Column 4 - Contact Us */}
          <Box className='mc-footer-column'>
            <Typography variant='h6' className='mc-footer-column-title'>
              Contact Us
            </Typography>
            <Box className='mc-footer-contact-list'>
              {[
                {
                  icon: <PhoneIcon className='mc-footer-contact-icon' />,
                  text: (
                    <>
                      1-800-MEDIACO
                      <br />
                      Mon-Fri 9am-6pm EST
                    </>
                  )
                },
                { icon: <EmailIcon className='mc-footer-contact-icon' />, text: 'support@mediaco.com' },
                {
                  icon: <LocationOnIcon className='mc-footer-contact-icon' />,
                  text: (
                    <>
                      123 Media Street
                      <br />
                      New York, NY 10001
                    </>
                  )
                }
              ].map((item, i) => (
                <Box key={i} className='mc-footer-contact-item'>
                  {item.icon}
                  <Typography variant='body2'>{item.text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Bottom Section */}
        <Box className='mc-footer-bottom'>
          <Typography variant='body2' className='mc-footer-copyright'>
            &copy; 2025 MediaCo. All rights reserved.
          </Typography>
          <Box className='mc-footer-bottom-links'>
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(text => (
              <Typography key={text} component='a' variant='body2' className='mc-footer-bottom-link'>
                {text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

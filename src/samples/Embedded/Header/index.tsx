import { useState } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.headerNav.backgroundColor,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '1rem 0'
  },
  embedTopIcon: {
    width: '40px',
    filter: 'var(--svg-color)'
  },
  navContainer: {
    width: '90%',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem'
  },
  logo: {
    '& img': {
      height: '35px',
      width: 'auto',
      verticalAlign: 'middle'
    }
  },

  navMenu: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    '@media (max-width: 768px)': {
      position: 'fixed',
      top: 0,
      right: '-100%',
      width: '80%',
      maxWidth: '320px',
      height: '100vh',
      backgroundColor: 'var(--utility-background-color)',
      boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '3rem',
      transition: 'right 0.3s ease-in-out',
      zIndex: 1000
    }
  },
  navMenuActive: {
    '@media (max-width: 768px)': {
      right: 0
    }
  },
  navList: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    '& a': {
      textDecoration: 'none',
      color: theme.headerNav.navLinkColor,
      transition: 'color 0.3s ease',
      '&:hover': {
        color: theme.headerNav.navLinkHoverColor
      }
    },
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  showNavListsOnMobile: {
    '$navMenuActive &': {
      '@media (max-width: 768px)': {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%',
        textAlign: 'center',
        '& a': {
          color: theme.palette.text.primary,
          '&:hover': {
            color: theme.palette.primary.main
          }
        }
      }
    }
  },
  profileAvatar: {
    height: '32px',
    width: '32px',
    borderRadius: '50%'
  },
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1001,
    padding: 0,
    color: theme.headerNav.menuToggleColor,
    '@media (max-width: 768px)': {
      display: 'block'
    }
  }
}));
export default function Header() {
  const classes = useStyles();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const navMenuClassName = `${classes.navMenu} ${isMenuOpen ? classes.navMenuActive : ''}`;
  const navListClassName = `${classes.navList} ${isMenuOpen ? classes.showNavListsOnMobile : ''}`;

  return (
    <header className={classes.header}>
      <nav className={classes.navContainer}>
        <a href='/' className={classes.logo}>
          <img src='./assets/img/MediaCoLogo.png' alt='MediaCo Logo' />
        </a>

        <div className={navMenuClassName}>
          <ul className={navListClassName}>
            <li>
              <a href='/'>Mobile</a>
            </li>
            <li>
              <a href='/'>Internet</a>
            </li>
            <li>
              <a href='/'>Coverage</a>
            </li>
            <li>
              <a href='/'>Deals</a>
            </li>
          </ul>

          <ul className={navListClassName}>
            <li>
              <a href='/'>Find a store</a>
            </li>
            <li>
              <a href='/'>Contact and support</a>
            </li>
            <li>
              <a href='/' className='cart-link'>
                Cart
              </a>
            </li>
            <li>
              <a href='/' className='profile-link' aria-label='User Profile'>
                <img src='./assets/img/UserProfile.png' alt='User Profile' className={classes.profileAvatar} />
              </a>
            </li>
          </ul>
        </div>
        <button type='button' className={classes.menuToggle} onClick={toggleMenu} aria-label='Open menu'>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M4 6H20M4 12H20M4 18H20' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </button>
      </nav>
    </header>
  );
}

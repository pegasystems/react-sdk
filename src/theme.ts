// @ts-nocheck
import { createTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';

import sdkConfig from '../sdk-config.json';

/**
 * Since makeStyles is now exported from @mui/styles package which does not know about Theme in the core package.
 * you need to augment the DefaultTheme (empty object) in @mui/styles with Theme from the core.
 */
declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {
    backgroundColor: string;
    card: {
      backgroundColor: string;
      borderLeft: string;
      borderLeftColor: string;
    };
    modal: {
      backgroundColor: string;
      topColor: string;
    };
    headerNav: {
      backgroundColor: string;
      navLinkColor: string;
      navLinkHoverColor: string;
      menuToggleColor: string;
    };
    embedded: {
      resolutionTextColor: string;
    };
    actionButtons: {
      primary: {
        backgroundColor: string;
        color: string;
      };
      secondary: {
        backgroundColor: string;
        color: string;
      };
    };
  }
}

const lightThemeColours = {
  ':root': {
    '--app-primary-color': '#007bff' /* was #673ab7; */,
    '--app-primary-dark-color': '#0048cc' /* was #4527A0; */,
    '--app-primary-light-color': '#33aeff' /* was #B499FC; */,
    '--app-secondary-color': '#FFC400',
    '--app-neutral-color': 'grey',
    '--app-neutral-light-color': 'lightgrey',
    '--app-neutral-dark-color': '#262626',
    '--app-error-color': '#f44336',
    '--app-error-light-color': '#e57373',
    '--app-error-dark-color': '#d32f2f',
    '--app-warning-color': '#ff9800',
    '--app-warning-color-light': '#ffb74d',
    '--app-warning-color-dark': '#f57c00',

    '--app-background-color': 'whitesmoke',
    '--app-form-bg-color': 'white',

    /* App Navigation */
    '--app-nav-bg': '#262626' /*! default */,
    '--app-nav-color': '#d9d9d9' /* invert( var(--app-nav-bg)) !default */,

    /* Few custom colors */
    '--modal-background-color': 'rgba(100, 100, 100, 0.4)',
    '--modal-top-color': 'white',
    '--modal-border-color': 'black',
    '--modal-box-shadow-color': '#777',
    '--utility-count-background-color': '#65b5f5',
    '--utility-card-border-color': '#f5f5f5',
    '--link-button-color': '#3f51b5',
    '--banner-text-color': 'rgb(0, 0, 0)',
    '--app-text-color': 'white',
    '--utility-background-color': 'white',
    '--table-header-background': '#f5f5f5',
    '--step-line-color': 'rgba(0, 0, 0, 0.12)',
    '--selected-step-label-color': 'rgba(0, 0, 0, 0.87)',
    '--step-label-color': 'rgba(0, 0, 0, 0.54)',
    '--svg-color': 'invert(0%)',
    '--secondary-button-text-color': '#ffffff',

    '--text-primary-color': '#000',
    '--text-secondary-color': '#c0c0c0',
    '--stepper-completed-bg-color': '#218721'
  }
};
const darkThemeColours = {
  ':root': {
    '--app-primary-color': '#C70BB5' /* accent pink */,
    '--app-primary-dark-color': '#c2185b' /* darker pink */,
    '--app-primary-light-color': '#ff5ca2' /* lighter pink */,
    '--app-secondary-color': '#c0c0c0' /* accent silver */,
    '--app-neutral-color': '#b0b0b0' /* light gray for text/icons */,
    '--app-neutral-light-color': '#e0e0e0' /* lighter gray for highlights */,
    '--app-neutral-dark-color': '#262626' /* dark gray for backgrounds */,
    '--app-error-color': '#ff5370' /* vibrant error red */,
    '--app-error-light-color': '#ffb4b4' /* soft error red */,
    '--app-error-dark-color': '#b71c1c' /* deep error red */,
    '--app-warning-color': '#ffb300' /* amber warning */,
    '--app-warning-color-light': '#ffe082' /* light amber */,
    '--app-warning-color-dark': '#c68400' /* dark amber */,

    '--app-background-color': '#060326' /* main dark background */,
    '--app-form-bg-color': '#23273f' /* slightly lighter for forms */,

    /* App Navigation */
    '--app-nav-bg': '#18132c' /* navigation background */,
    '--app-nav-color': '#c0c0c0',

    '--modal-background-color': 'rgba(40, 30, 90, 0.85)' /* nearly matches #060326, slightly lighter and more opaque */,
    '--modal-top-color': '#2a1f54' /* light pink accent for modal top */,
    '--modal-border-color': '#2a1f54' /* matches card background */,
    '--modal-box-shadow-color': '#777',

    '--utility-count-background-color': '#f8aaf0',
    '--utility-card-border-color': '#2a1f54',
    '--link-button-color': '#f72585',
    '--banner-text-color': '#e0e0e0',
    '--app-text-color': '#e0e0e0',
    '--utility-background-color': '#2a1f54',
    '--table-header-background': '#18132c',
    '--step-line-color': 'rgba(0, 0, 0, 0.12)',
    '--selected-step-label-color': 'rgba(0, 0, 0, 0.87)',
    '--step-label-color': 'rgba(0, 0, 0, 0.54)',
    '--svg-color': 'invert(100%)',
    '--secondary-button-text-color': '#1a103c',

    '--text-primary-color': '#e0e0e0',
    '--text-secondary-color': '#c0c0c0',
    '--stepper-completed-bg-color': '#158715'
  }
};

const lightTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...lightThemeColours
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    }
  },
  headerNav: {
    backgroundColor: '#ffffff',
    navLinkColor: 'rgba(0, 0, 0, 0.87)',
    navLinkHoverColor: '#3f51b5',
    menuToggleColor: 'rgba(0, 0, 0, 0.87)'
  },
  actionButtons: {
    primary: {
      backgroundColor: '#cc0f60',
      color: '#FFFFFF'
    },
    secondary: {
      backgroundColor: '#3F51B5',
      color: '#FFFFFF'
    }
  },
  modal: {
    backgroundColor: 'rgba(100, 100, 100, 0.4)',
    topColor: 'white'
  },
  embedded: {
    resolutionTextColor: 'darkslategray'
  },
  backgroundColor: '#fff',
  card: {
    backgroundColor: '#fff',
    borderLeft: '6px solid',
    borderLeftColor: '#C70BB5'
  },
  palette: {
    primary: {
      contrastText: '#fff',
      dark: '#303f9f',
      light: '#7986cb',
      main: '#3f51b5'
    },
    secondary: {
      contrastText: '#fff',
      dark: '#c51162',
      light: '#ff4081',
      main: '#f50057'
    },
    backgroundColor: '#fff'
  }
});

const darkTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'radial-gradient(178.62% 112% at 50% -12%, #0B0F2A 69.96%, #111951 89.19%)',
          backgroundAttachment: 'fixed'
        },
        ...darkThemeColours,

        // scrollbar styling
        '*': {
          scrollbarWidth: 'thin', // Options: auto | thin | none
          scrollbarColor: '#555 #2c2c2c' // thumb color, track color
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {}
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    }
  },
  headerNav: {
    backgroundColor: 'var(--app-nav-bg)',
    navLinkColor: 'var(--app-nav-color)',
    navLinkHoverColor: '#ffffff',
    menuToggleColor: '#ffffff'
  },
  actionButtons: {
    primary: {
      backgroundColor: '#C70BB5',
      color: '#FFFFFF'
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      color: '#C70BB5'
    }
  },
  embedded: {
    resolutionTextColor: 'darkslategray'
  },
  backgroundColor: '#060326',
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderLeft: '',
    borderLeftColor: ''
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#C70BB5', // pink
      light: '#C70BB5', // pink
      dark: '#c2185b', // darker shade
      contrastText: '#ffffff' // white text on pink buttons
    },
    secondary: {
      main: '#c0c0c0', // accent silver
      light: '#d9d9d9',
      dark: '#8c8c8c',
      contrastText: '#1a103c' // dark text on silver background
    },
    info: {
      main: '#e91e63', // Pink
      dark: '#E885D2', // Light pink
      light: '#C70BB5', // Lighter pink for backgrounds
      contrastText: '#fff'
    },
    background: {
      // default: 'radial-gradient(178.62% 112% at 50% -12%, #0B0F2A 69.96%, #111951 89.19%)',
      // paper: '#18132c'
      paper: '#191b2c' // card-bg
    },
    text: {
      primary: '#e0e0e0', // text-light
      secondary: '#c0c0c0' // silver for muted text
    },
    divider: 'rgba(255, 255, 255, 0.1)' // border-color
  }
});

export const theme = sdkConfig.theme === 'dark' ? darkTheme : lightTheme;

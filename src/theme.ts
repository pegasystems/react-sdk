import { createTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';

/**
 * Since makeStyles is now exported from @mui/styles package which does not know about Theme in the core package.
 * you need to augment the DefaultTheme (empty object) in @mui/styles with Theme from the core.
 */
declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

// eslint-disable-next-line import/prefer-default-export
export const theme = createTheme({
  components: {
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
    }
  }
});

import { createTheme } from '@material-ui/core/styles';

// eslint-disable-next-line import/prefer-default-export
export const theme = createTheme({
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

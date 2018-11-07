import { createMuiTheme } from '@material-ui/core/styles';

const indigoPalette = {
  primary: { main: '#3F51B5' },
  secondary: { main: '#9FA8DA' },
  typography: {
    useNextVariants: true,
  },
};

const indigoName = 'Quezone Indigo';
const indigoTheme = createMuiTheme({ indigoPalette, indigoName });

const theme = {
  indigoTheme,
};

export default theme;

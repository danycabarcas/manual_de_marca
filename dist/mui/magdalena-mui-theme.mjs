// MUI v5/v6/v7 — npm i @mui/material @emotion/react @emotion/styled
import { createTheme } from '@mui/material/styles';
import { magdalena as m } from './magdalena-tokens.mjs';

export const magdalenaTheme = createTheme({
  palette: {
    primary:   { main: m.colors.primary.hex, light: m.scales.primary['400'], dark: m.scales.primary['700'], contrastText: '#fff' },
    secondary: { main: m.colors.cyan.hex,    light: m.colors.sky.hex,       dark: m.scales.cyan['700'],    contrastText: m.neutrals.ink },
    info:      { main: m.colors.cyan.hex,    contrastText: m.neutrals.ink },
    success:   { main: m.colors.green.hex,   contrastText: m.neutrals.ink },
    warning:   { main: m.colors.yellow.hex,  contrastText: m.neutrals.ink },
    error:     { main: m.colors.red.hex,     contrastText: '#fff' },
    text:      { primary: m.neutrals.ink, secondary: m.neutrals.gray },
    background: { default: m.neutrals.surface, paper: '#fff' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: m.fonts.sans,
    h1: { fontWeight: 800 }, h2: { fontWeight: 700 }, h3: { fontWeight: 700 }, h4: { fontWeight: 700 }, button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
        containedPrimary: { backgroundImage: m.gradients.action, '&:hover': { backgroundImage: m.gradients.action, filter: 'brightness(1.08)' } },
      },
    },
    MuiAppBar: { styleOverrides: { colorPrimary: { backgroundImage: m.gradients.night } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
  },
});
export default magdalenaTheme;

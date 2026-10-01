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
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: m.fonts.sans,
    h1: { fontWeight: 900 }, h2: { fontWeight: 800 }, h3: { fontWeight: 800 }, h4: { fontWeight: 800 }, button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999 },
        containedPrimary: { backgroundImage: m.gradients.action, '&:hover': { backgroundImage: m.gradients.action, filter: 'brightness(1.08)' } },
      },
    },
    MuiAppBar: { styleOverrides: { colorPrimary: { backgroundImage: m.gradients['primary-h'] } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiLinearProgress: { styleOverrides: { barColorPrimary: { backgroundImage: m.gradients['primary-h'] } } },
  },
});
export default magdalenaTheme;

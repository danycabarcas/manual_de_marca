// Vuetify 3 — npm i vuetify
import { createVuetify } from 'vuetify';
import { magdalena as m } from './magdalena-tokens.mjs';

export const magdalenaVuetifyTheme = {
  dark: false,
  colors: {
    background: m.neutrals.surface, surface: '#FFFFFF',
    primary: m.colors.primary.hex, secondary: m.neutrals.gray, accent: m.colors.cyan.hex,
    info: m.colors.cyan.hex, success: m.colors.green.hex, warning: m.colors.yellow.hex, error: m.colors.red.hex,
    'on-primary': '#FFFFFF', 'on-info': m.neutrals.ink, 'on-success': m.neutrals.ink, 'on-warning': m.neutrals.ink, 'on-error': '#FFFFFF',
    sky: m.colors.sky.hex, olive: m.colors.olive.hex, purple: m.colors.purple.hex,
  },
};

export default createVuetify({
  theme: { defaultTheme: 'magdalena', themes: { magdalena: magdalenaVuetifyTheme } },
  defaults: {
    VBtn: { rounded: 'lg', class: 'text-none font-weight-semibold' },
    VCard: { rounded: 'lg', elevation: 1 },
  },
});

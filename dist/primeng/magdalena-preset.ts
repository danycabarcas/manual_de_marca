// PrimeNG 18+ / PrimeVue 4 / PrimeReact 11 — preset Gobernación del Magdalena 2026
// PrimeNG 18-19:  npm i @primeng/themes     PrimeNG 20+ / PrimeVue 4 / PrimeReact:  npm i @primeuix/themes
// Cambie la línea de import según la versión que use:
import { definePreset } from '@primeuix/themes';   // PrimeNG 18/19: '@primeng/themes'
import Aura from '@primeuix/themes/aura';              // PrimeNG 18/19: '@primeng/themes/aura'

export const MagdalenaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      "50": "#EBF4FA",
      "100": "#D6E8F4",
      "200": "#ADD2E9",
      "300": "#80B8DD",
      "400": "#4094CC",
      "500": "#0071BB",
      "600": "#0061A1",
      "700": "#004F83",
      "800": "#003D65",
      "900": "#002B47",
      "950": "#001B2D"
},
    formField: { borderRadius: '10px', focusRing: { width: '3px', style: 'solid', color: '#00B7D9', offset: '1px' } },
    focusRing: { width: '3px', style: 'solid', color: '#00B7D9', offset: '2px' },
    colorScheme: {
      light: {
        primary: { color: '{primary.500}', contrastColor: '#ffffff', hoverColor: '{primary.600}', activeColor: '{primary.700}' },
        highlight: { background: '{primary.50}', focusBackground: '{primary.100}', color: '{primary.800}', focusColor: '{primary.900}' },
        surface: {
          "50": "#FAFAFA",
          "100": "#F6F5F5",
          "200": "#ECEBEB",
          "300": "#DDDCDC",
          "400": "#B9B8B8",
          "500": "#8C8B8B",
          "600": "#606060",
          "700": "#4A4A4A",
          "800": "#333332",
          "900": "#1D1D1B",
          "950": "#0F0F0E"
},
      },
      dark: {
        primary: { color: '{primary.400}', contrastColor: '{primary.950}', hoverColor: '{primary.300}', activeColor: '{primary.200}' },
        highlight: { background: 'color-mix(in srgb, {primary.400}, transparent 84%)', focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)', color: 'rgba(255,255,255,.87)', focusColor: 'rgba(255,255,255,.87)' },
      },
    },
  },
  components: {
    button: { root: { borderRadius: '999px', label: { fontWeight: '700' } } },
    card: { root: { borderRadius: '16px' } },
    dialog: { root: { borderRadius: '16px' } },
  },
});

export default MagdalenaPreset;

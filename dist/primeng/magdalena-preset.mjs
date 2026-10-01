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
    formField: { borderRadius: '8px', focusRing: { width: '3px', style: 'solid', color: '#00B7D9', offset: '1px' } },
    focusRing: { width: '3px', style: 'solid', color: '#00B7D9', offset: '2px' },
    colorScheme: {
      light: {
        primary: { color: '{primary.500}', contrastColor: '#ffffff', hoverColor: '{primary.600}', activeColor: '{primary.700}' },
        highlight: { background: '{primary.50}', focusBackground: '{primary.100}', color: '{primary.800}', focusColor: '{primary.900}' },
        surface: {
          "50": "#F8FAFC",
          "100": "#F1F4F8",
          "200": "#E3E8EF",
          "300": "#CBD2DC",
          "400": "#97A1B0",
          "500": "#6B7482",
          "600": "#4F5866",
          "700": "#3A424F",
          "800": "#252B36",
          "900": "#161A22",
          "950": "#0C0F14"
},
      },
      dark: {
        primary: { color: '{primary.400}', contrastColor: '{primary.950}', hoverColor: '{primary.300}', activeColor: '{primary.200}' },
        highlight: { background: 'color-mix(in srgb, {primary.400}, transparent 84%)', focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)', color: 'rgba(255,255,255,.87)', focusColor: 'rgba(255,255,255,.87)' },
      },
    },
  },
  components: {
    button: { root: { borderRadius: '8px', label: { fontWeight: '600' } } },
    card: { root: { borderRadius: '12px' } },
    dialog: { root: { borderRadius: '12px' } },
  },
});

export default MagdalenaPreset;

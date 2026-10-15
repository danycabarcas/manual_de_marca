// Preset de tema PrimeNG / PrimeVue — Gobernación del Magdalena 2026 (generado desde los tokens)
//
// ⚠ LICENCIAS — elija versiones con licencia MIT (verificado en el LICENSE.md de cada paquete, 2026-10):
//   PrimeNG 18–21 (no «-lts»)  +  imports de '@primeng/themes' (18/19) o '@primeuix/themes' ^1 (v20) / ^2 (v21)   → MIT
//   PrimeVue 4.x               +  '@primeuix/themes' ^2                                                          → MIT
//   PrimeNG 22, PrimeVue 5 y '@primeuix/themes' ≥ 3 usan la «PrimeUI License» (comercial; exige clave de licencia
//   y la versión gratuita es solo para organizaciones pequeñas). Consulte con TIC/Compras antes de actualizar.
//
// Import según la versión:  PrimeNG 18/19 → '@primeng/themes' y '@primeng/themes/aura'
//                           PrimeNG 20/21 y PrimeVue 4 → '@primeuix/themes' y '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MagdalenaPreset = definePreset(Aura, {
  // Los colores de severidad (éxito, peligro, aviso, info) salen de la paleta institucional
  primitive: {
    "red": {
        "50": "#FEEBEF",
        "100": "#FED6E0",
        "200": "#FCADC1",
        "300": "#FB809E",
        "400": "#F9406D",
        "500": "#F7003C",
        "600": "#D40034",
        "700": "#AD002A",
        "800": "#850020",
        "900": "#5E0017",
        "950": "#3B000E"
    },
    "green": {
        "50": "#F3F9F2",
        "100": "#E7F3E5",
        "200": "#CFE8CB",
        "300": "#B4DBAE",
        "400": "#8EC986",
        "500": "#69B75E",
        "600": "#5A9D51",
        "700": "#4A8042",
        "800": "#396333",
        "900": "#284624",
        "950": "#192C17"
    },
    "orange": {
        "50": "#FFFBEB",
        "100": "#FFF6D6",
        "200": "#FFEDAD",
        "300": "#FEE480",
        "400": "#FED640",
        "500": "#FEC800",
        "600": "#DAAC00",
        "700": "#B28C00",
        "800": "#896C00",
        "900": "#614C00",
        "950": "#3D3000"
    },
    "yellow": {
        "50": "#FFFBEB",
        "100": "#FFF6D6",
        "200": "#FFEDAD",
        "300": "#FEE480",
        "400": "#FED640",
        "500": "#FEC800",
        "600": "#DAAC00",
        "700": "#B28C00",
        "800": "#896C00",
        "900": "#614C00",
        "950": "#3D3000"
    },
    "sky": {
        "50": "#EBF9FC",
        "100": "#D6F3F9",
        "200": "#ADE8F3",
        "300": "#80DBEC",
        "400": "#40C9E2",
        "500": "#00B7D9",
        "600": "#009DBB",
        "700": "#008098",
        "800": "#006375",
        "900": "#004652",
        "950": "#002C34"
    },
    "cyan": {
        "50": "#EBF9FC",
        "100": "#D6F3F9",
        "200": "#ADE8F3",
        "300": "#80DBEC",
        "400": "#40C9E2",
        "500": "#00B7D9",
        "600": "#009DBB",
        "700": "#008098",
        "800": "#006375",
        "900": "#004652",
        "950": "#002C34"
    },
    "purple": {
        "50": "#F1EDF9",
        "100": "#E4DAF4",
        "200": "#C9B5E9",
        "300": "#AA8CDC",
        "400": "#8052CB",
        "500": "#5618BA",
        "600": "#4A15A0",
        "700": "#3C1182",
        "800": "#2E0D64",
        "900": "#210947",
        "950": "#15062D"
    }
},
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
    button: {
      root: { borderRadius: '8px', label: { fontWeight: '600' } },
      // Contraste AA: texto blanco solo sobre tonos oscuros; texto oscuro sobre cian y amarillo
      colorScheme: { light: { root: {
        success: { background: '{green.700}', hoverBackground: '{green.800}', activeBackground: '{green.900}', borderColor: '{green.700}', hoverBorderColor: '{green.800}', activeBorderColor: '{green.900}' },
        danger:  { background: '{red.600}', hoverBackground: '{red.700}', activeBackground: '{red.800}', borderColor: '{red.600}', hoverBorderColor: '{red.700}', activeBorderColor: '{red.800}' },
        info:    { color: '{surface.900}', hoverColor: '{surface.900}', activeColor: '{surface.900}' },
        warn:    { color: '{surface.900}', hoverColor: '{surface.900}', activeColor: '{surface.900}' },
      } } },
    },
    card: { root: { borderRadius: '12px' } },
    dialog: { root: { borderRadius: '12px' } },
  },
});

export default MagdalenaPreset;

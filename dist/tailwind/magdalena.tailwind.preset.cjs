/** Tailwind CSS v3 preset — Gobernación del Magdalena 2026
 *  tailwind.config.js:  presets: [require('./magdalena.tailwind.preset.cjs')]
 *  Clases:  bg-mg-primary-600  text-mg-cyan  bg-mg-grad-primary  bg-mg-grad-stripe  shadow-mg-md  rounded-mg-lg  font-sans
 */
const plugin = require('tailwindcss/plugin');
module.exports = {
  theme: {
    extend: {
      colors: {
        "mg-primary": {
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
                "950": "#001B2D",
                "DEFAULT": "#0071BB"
        },
        "mg-cyan": {
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
                "950": "#002C34",
                "DEFAULT": "#00B7D9"
        },
        "mg-sky": {
                "50": "#F7FCFD",
                "100": "#F0F9FB",
                "200": "#E0F2F7",
                "300": "#CFEBF2",
                "400": "#B7E1EC",
                "500": "#9FD7E5",
                "600": "#89B9C5",
                "700": "#6F96A0",
                "800": "#56747C",
                "900": "#3C5257",
                "950": "#263437",
                "DEFAULT": "#9FD7E5"
        },
        "mg-red": {
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
                "950": "#3B000E",
                "DEFAULT": "#F7003C"
        },
        "mg-yellow": {
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
                "950": "#3D3000",
                "DEFAULT": "#FEC800"
        },
        "mg-green": {
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
                "950": "#192C17",
                "DEFAULT": "#69B75E"
        },
        "mg-olive": {
                "50": "#F8F5EF",
                "100": "#F0EBDF",
                "200": "#E1D6BE",
                "300": "#D0C09A",
                "400": "#B9A067",
                "500": "#A28034",
                "600": "#8B6E2D",
                "700": "#715A24",
                "800": "#57451C",
                "900": "#3E3114",
                "950": "#271F0C",
                "DEFAULT": "#A28034"
        },
        "mg-purple": {
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
                "950": "#15062D",
                "DEFAULT": "#5618BA"
        },
        "mg-gray": {
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
                "950": "#0C0F14",
                "DEFAULT": "#606060"
        },
        "mg-navy": {
                "600": "#12395C",
                "700": "#0E2D49",
                "800": "#0B2239",
                "900": "#081A2C",
                "950": "#051220",
                "DEFAULT": "#081A2C"
        },
        "mg-ink": "#1D1D1B",
        "mg-surface": "#F6F5F5",
        "primary": {
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
                "950": "#001B2D",
                "DEFAULT": "#0071BB"
        },
        "accent": {
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
                "950": "#002C34",
                "DEFAULT": "#00B7D9"
        }
},
      backgroundImage: {
        "mg-grad-primary": "linear-gradient(135deg, #0071BB 0%, #00B7D9 100%)",
        "mg-grad-primary-h": "linear-gradient(90deg, #0071BB 0%, #00B7D9 100%)",
        "mg-grad-primary-v": "linear-gradient(180deg, #0071BB 0%, #00B7D9 100%)",
        "mg-grad-sky": "linear-gradient(135deg, #0071BB 0%, #00B7D9 55%, #9FD7E5 100%)",
        "mg-grad-sky-h": "linear-gradient(90deg, #0071BB 0%, #00B7D9 55%, #9FD7E5 100%)",
        "mg-grad-aqua": "linear-gradient(135deg, #00B7D9 0%, #9FD7E5 100%)",
        "mg-grad-mist": "linear-gradient(180deg, #9FD7E5 0%, #EAF6FA 100%)",
        "mg-grad-deep": "linear-gradient(180deg, #081A2C 0%, #051220 100%)",
        "mg-grad-night": "linear-gradient(135deg, #0B2239 0%, #051220 100%)",
        "mg-grad-steel": "linear-gradient(180deg, #147CC0 0%, #0071BB 100%)",
        "mg-grad-action": "linear-gradient(180deg, #147CC0 0%, #0071BB 100%)",
        "mg-grad-action-aa": "linear-gradient(180deg, #147CC0 0%, #0071BB 100%)",
        "mg-grad-tropical": "linear-gradient(135deg, #00B7D9 0%, #69B75E 100%)",
        "mg-grad-sun": "linear-gradient(135deg, #FEC800 0%, #DAAC00 100%)",
        "mg-grad-heat": "linear-gradient(135deg, #F7003C 0%, #AD002A 100%)",
        "mg-grad-earth": "linear-gradient(135deg, #A28034 0%, #715A24 100%)",
        "mg-grad-violet": "linear-gradient(135deg, #5618BA 0%, #0071BB 100%)",
        "mg-grad-stripe": "linear-gradient(90deg, #5618BA 0.0% 11.111%, #A28034 11.111% 22.222%, #FEC800 22.222% 33.333%, #F7003C 33.333% 44.444%, #0071BB 44.444% 55.556%, #00B7D9 55.556% 66.667%, #9FD7E5 66.667% 77.778%, #69B75E 77.778% 88.889%, #5618BA 88.889% 100.0%)",
        "mg-grad-stripe-v": "linear-gradient(180deg, #5618BA 0.0% 11.111%, #A28034 11.111% 22.222%, #FEC800 22.222% 33.333%, #F7003C 33.333% 44.444%, #0071BB 44.444% 55.556%, #00B7D9 55.556% 66.667%, #9FD7E5 66.667% 77.778%, #69B75E 77.778% 88.889%, #5618BA 88.889% 100.0%)",
        "mg-grad-stripe-flow": "linear-gradient(90deg, #5618BA, #A28034, #FEC800, #F7003C, #0071BB, #00B7D9, #9FD7E5, #69B75E, #5618BA)"
},
      fontFamily: { sans: "Montserrat, Gotham, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif".split(', '), display: "Montserrat, Gotham, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif".split(', ') },
      borderRadius: {
        "mg-sm": "4px",
        "mg-md": "8px",
        "mg-lg": "12px",
        "mg-xl": "16px",
        "mg-pill": "999px"
},
      boxShadow: {
        "mg-sm": "0 1px 2px rgba(8,26,44,.06)",
        "mg-md": "0 2px 6px rgba(8,26,44,.08), 0 1px 2px rgba(8,26,44,.05)",
        "mg-lg": "0 12px 28px rgba(8,26,44,.14), 0 2px 6px rgba(8,26,44,.06)",
        "mg-glow": "0 0 0 3px rgba(0,113,187,.22)"
},
    },
  },
  plugins: [
    plugin(function ({ addComponents, addUtilities }) {
      addUtilities({
        '.mg-stripe-bar': { height: '6px', width: '100%', backgroundImage: "linear-gradient(90deg, #5618BA 0.0% 11.111%, #A28034 11.111% 22.222%, #FEC800 22.222% 33.333%, #F7003C 33.333% 44.444%, #0071BB 44.444% 55.556%, #00B7D9 55.556% 66.667%, #9FD7E5 66.667% 77.778%, #69B75E 77.778% 88.889%, #5618BA 88.889% 100.0%)" },
        '.mg-text-gradient': { backgroundImage: "linear-gradient(135deg, #0071BB 0%, #00B7D9 100%)", '-webkit-background-clip': 'text', backgroundClip: 'text', color: 'transparent' },
      });
      addComponents({
        '.mg-btn': { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '.7rem 1.4rem', borderRadius: '8px', fontWeight: '600', color: '#fff', backgroundImage: "linear-gradient(180deg, #147CC0 0%, #0071BB 100%)", transition: 'filter .2s', '&:hover': { filter: 'brightness(.94)' } },
      });
    }),
  ],
};

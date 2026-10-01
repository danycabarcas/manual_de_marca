# React / Next.js

CSS directo, MUI o Tailwind. Los tokens están disponibles como JSON/ESM tipado.

## CSS global

`src/main.jsx`

```jsx
import './styles/magdalena.min.css';     // copiado de dist/css/

export default function Hero() {
  return <section className="mg-hero"><h1>Bienvenido</h1><button className="mg-btn mg-btn--accent">Ingresar</button></section>;
}
```

## Material UI (MUI)

`src/theme.jsx`

```jsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import magdalenaTheme from './magdalena-mui-theme.mjs';   // dist/mui/ (incluye magdalena-tokens.mjs)

<ThemeProvider theme={magdalenaTheme}><CssBaseline /><App /></ThemeProvider>
```

## Next.js (app router)

`app/layout.tsx`

```tsx
import '../styles/magdalena.min.css';
export default function RootLayout({ children }) { return <html lang="es"><body className="mg-base">{children}</body></html>; }
```

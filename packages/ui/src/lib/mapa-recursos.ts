/** Rampas de color, iconos y utilidades del mapa. Los colores salen de la paleta institucional. */

export const RAMPAS: Record<string, { nombre: string; colores: string[] }> = {
  azul:      { nombre: 'Azul institucional', colores: ['#EAF4FA', '#9FD7E5', '#00B7D9', '#0071BB', '#0B2239'] },
  cian:      { nombre: 'Cian → celeste',     colores: ['#F0FBFD', '#9FD7E5', '#00B7D9', '#007A91', '#00364A'] },
  verde:     { nombre: 'Verde',              colores: ['#F1F8F0', '#B7DBB1', '#69B75E', '#3F7A37', '#1E3F1B'] },
  amarillo:  { nombre: 'Amarillo → ocre',    colores: ['#FFF8DB', '#FEC800', '#D9A800', '#A28034', '#4D3A12'] },
  rojo:      { nombre: 'Rojo (alertas)',     colores: ['#FFE9EE', '#FF8FA8', '#F7003C', '#B20028', '#610011'] },
  violeta:   { nombre: 'Violeta',            colores: ['#F2ECFB', '#B79DE6', '#5618BA', '#3F1288', '#20094A'] },
  divergente:{ nombre: 'Divergente rojo–azul', colores: ['#F7003C', '#FF8FA8', '#F1F4F8', '#9FD7E5', '#0071BB'] },
  gris:      { nombre: 'Neutra',             colores: ['#F8FAFC', '#CBD2DC', '#97A1B0', '#4F5866', '#161A22'] },
};

export const ICONOS: Record<string, { nombre: string; d: string }> = {
  punto:    { nombre: 'Punto',      d: 'M12 6a6 6 0 1 0 0 12a6 6 0 0 0 0-12z' },
  cruz:     { nombre: 'Salud',      d: 'M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z' },
  escuela:  { nombre: 'Educación',  d: 'M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm-6 9.2v4L12 20l6-3.8v-4L12 15.5 6 12.2z' },
  edificio: { nombre: 'Edificio',   d: 'M5 21V5l9-2v6h5v12h-4v-4h-3v4H5zm3-12v2h2V9H8zm0 4v2h2v-2H8z' },
  alerta:   { nombre: 'Alerta',     d: 'M12 3 2 20h20L12 3zm-1 7h2v5h-2v-5zm0 6h2v2h-2v-2z' },
  gota:     { nombre: 'Agua',       d: 'M12 2.5S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5z' },
  estrella: { nombre: 'Destacado',  d: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5z' },
  bandera:  { nombre: 'Bandera',    d: 'M6 3h2v18H6V3zm3 1 9 3-9 4V4z' },
  casa:     { nombre: 'Vivienda',   d: 'M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3z' },
  rayo:     { nombre: 'Energía',    d: 'M13 2 4 14h6l-1 8 9-12h-6l1-8z' },
  vehiculo: { nombre: 'Vía',        d: 'M4 15V9l2-4h12l2 4v6h-2v2h-3v-2H9v2H6v-2H4zm3-5h10l-1-3H8l-1 3zm1 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' },
  persona:  { nombre: 'Personas',   d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z' },
  escudo:   { nombre: 'Seguridad',  d: 'M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z' },
};

export function hexRgb(h: string): [number, number, number] {
  const s = h.replace('#', '');
  const v = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
export function rgbHex(c: number[]): string {
  return '#' + c.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('').toUpperCase();
}
export function mezcla(a: string, b: string, t: number): string {
  const A = hexRgb(a), B = hexRgb(b);
  return rgbHex(A.map((x, i) => x + (B[i] - x) * t));
}
/** Interpola una rampa de N paradas en t∈[0,1]. */
export function colorEnRampa(colores: string[], t: number): string {
  if (colores.length === 1) return colores[0];
  const x = Math.max(0, Math.min(1, t)) * (colores.length - 1);
  const i = Math.min(colores.length - 2, Math.floor(x));
  return mezcla(colores[i], colores[i + 1], x - i);
}
/** Luminancia relativa y color de texto con mejor contraste. */
export function textoSobre(hex: string): string {
  const [r, g, b] = hexRgb(hex).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (L + 0.05) / 0.05 > 1.05 / (L + 0.05) ? '#1D1D1B' : '#FFFFFF';
}

export interface Clase { desde: number; hasta: number; color: string }
/** Calcula clases (cortes) lineales o por cuantiles. */
export function calcularClases(valores: number[], n: number, colores: string[], escala: 'lineal' | 'cuantiles'): Clase[] {
  const v = valores.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return [];
  const min = v[0], max = v[v.length - 1];
  const cortes: number[] = [min];
  for (let i = 1; i < n; i++) cortes.push(escala === 'cuantiles' ? v[Math.min(v.length - 1, Math.floor((i / n) * v.length))] : min + ((max - min) * i) / n);
  cortes.push(max);
  const clases: Clase[] = [];
  for (let i = 0; i < n; i++) clases.push({ desde: cortes[i], hasta: cortes[i + 1], color: colorEnRampa(colores, n === 1 ? 0.5 : i / (n - 1)) });
  return clases;
}
export function claseDe(valor: number, clases: Clase[]): Clase | undefined {
  if (!clases.length) return undefined;
  for (let i = 0; i < clases.length; i++) if (valor <= clases[i].hasta || i === clases.length - 1) return clases[i];
  return clases.at(-1);
}
export function formatoNumero(n: number, f?: string): string {
  if (!Number.isFinite(n)) return '—';
  const o: Intl.NumberFormatOptions = f === 'cop' ? { style: 'currency', currency: 'COP', maximumFractionDigits: 0 } : f === 'porcentaje' ? { style: 'percent', maximumFractionDigits: 1 } : { maximumFractionDigits: 2 };
  return new Intl.NumberFormat('es-CO', o).format(n);
}

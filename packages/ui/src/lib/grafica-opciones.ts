/** Constructores de opciones ECharts para <gob-grafica> y tema «gob-theme». Sin dependencia de echarts (solo genera objetos). */
import { formatoNumero, textoSobre } from './mapa-recursos.js';

export const PALETAS: Record<string, { nombre: string; colores: string[] }> = {
  institucional: { nombre: 'Institucional', colores: ['#0071BB', '#00B7D9', '#FEC800', '#69B75E', '#F7003C', '#5618BA', '#A28034', '#9FD7E5'] },
  azules:        { nombre: 'Azules', colores: ['#0B2239', '#0071BB', '#4FA3D4', '#00B7D9', '#9FD7E5', '#12395C'] },
  calida:        { nombre: 'Cálida', colores: ['#FEC800', '#F5A300', '#F7003C', '#A28034', '#B20028', '#5A3E00'] },
  semaforo:      { nombre: 'Semáforo', colores: ['#69B75E', '#FEC800', '#F7003C'] },
  neutra:        { nombre: 'Neutra', colores: ['#4F5866', '#97A1B0', '#CBD2DC', '#6B7482'] },
};
export const TIPOS: Record<string, string> = {
  barras: 'Barras', 'barras-horizontal': 'Barras horizontales', lineas: 'Líneas', area: 'Áreas', torta: 'Torta', dona: 'Dona', radar: 'Radar', gauge: 'Indicador (gauge)', 'mapa-calor': 'Mapa de calor', treemap: 'Treemap', sankey: 'Sankey', embudo: 'Embudo', calendario: 'Calendario de actividad', gantt: 'Cronograma (Gantt)',
};

export interface Cfg {
  tipo: string; colores: string[]; titulo: string; subtitulo: string; leyenda: boolean; leyendaPosicion: 'arriba' | 'abajo' | 'derecha';
  etiquetas: boolean; apilado: boolean; suave: boolean; formato: string; unidad: string; tituloEjeX: string; tituloEjeY: string;
  umbrales?: [number, string][]; resaltar?: string; min: number; max: number; patrones: boolean; animacion: boolean; oscuro: boolean; centro: string;
}
const FUENTE = "Montserrat, 'Segoe UI', system-ui, sans-serif";

/** Tema ECharts de la Gobernación (claro / oscuro). */
export function temaGob(oscuro: boolean) {
  const txt = oscuro ? '#E3E8EF' : '#252B36', suave = oscuro ? '#97A1B0' : '#6B7482', linea = oscuro ? '#1B4B75' : '#CBD2DC', rejilla = oscuro ? '#12395C' : '#E3E8EF';
  const eje = { axisLine: { lineStyle: { color: linea } }, axisTick: { lineStyle: { color: linea } }, axisLabel: { color: suave, fontFamily: FUENTE }, splitLine: { lineStyle: { color: rejilla } }, nameTextStyle: { color: suave, fontFamily: FUENTE, fontWeight: 600 } };
  return {
    color: PALETAS.institucional.colores, backgroundColor: 'transparent', textStyle: { fontFamily: FUENTE, color: txt },
    title: { textStyle: { color: oscuro ? '#fff' : '#161A22', fontFamily: FUENTE, fontWeight: 700, fontSize: 16 }, subtextStyle: { color: suave, fontFamily: FUENTE, fontSize: 12 } },
    legend: { textStyle: { color: txt, fontFamily: FUENTE, fontSize: 12 }, pageTextStyle: { color: txt } },
    categoryAxis: eje, valueAxis: eje, timeAxis: eje, logAxis: eje,
    tooltip: { backgroundColor: oscuro ? '#fff' : '#081A2C', borderColor: 'transparent', textStyle: { color: oscuro ? '#081A2C' : '#fff', fontFamily: FUENTE, fontSize: 12 }, extraCssText: 'border-radius:8px;box-shadow:0 8px 24px rgba(8,26,44,.28);padding:8px 12px;' },
    visualMap: { textStyle: { color: txt, fontFamily: FUENTE } },
    radar: { axisName: { color: txt, fontFamily: FUENTE }, splitLine: { lineStyle: { color: rejilla } }, axisLine: { lineStyle: { color: linea } }, splitArea: { show: false } },
  };
}

export function normalizar(d: any): { categorias: string[]; series: { nombre: string; valores: number[] }[] } {
  if (Array.isArray(d)) return { categorias: d.map((x) => String(x.nombre)), series: [{ nombre: 'Valor', valores: d.map((x) => Number(x.valor)) }] };
  if (d && d.categorias && d.series) return { categorias: d.categorias.map(String), series: d.series.map((s: any) => ({ nombre: String(s.nombre ?? 'Serie'), valores: (s.valores ?? []).map(Number) })) };
  return { categorias: [], series: [] };
}
const suma = (a: number[]) => a.reduce((x, y) => x + (Number.isFinite(y) ? y : 0), 0);

/** Tabla de datos (para accesibilidad y exportación CSV). */
export function tablaDe(tipo: string, d: any): { cab: string[]; filas: (string | number)[][] } {
  if (tipo === 'gauge') return { cab: ['Indicador', 'Valor'], filas: [[typeof d === 'object' && d?.nombre ? d.nombre : 'Valor', typeof d === 'object' ? d?.valor : d]] };
  if (tipo === 'gantt') return { cab: ['Tarea', 'Inicio', 'Fin', 'Avance'], filas: ((d as any[]) ?? []).map((t) => [t.nombre, t.inicio, t.fin, t.avance != null ? Math.round(t.avance * 100) + ' %' : '']) };
  if (tipo === 'calendario') return { cab: ['Fecha', 'Valor'], filas: ((d as any[]) ?? []).map((x) => [x.fecha, x.valor]) };
  if (tipo === 'torta' || tipo === 'dona' || tipo === 'treemap' || tipo === 'embudo') { const a = Array.isArray(d) ? d : []; return { cab: ['Nombre', 'Valor'], filas: a.map((x: any) => [x.nombre, x.valor]) }; }
  if (tipo === 'mapa-calor') return { cab: ['Fila', 'Columna', 'Valor'], filas: ((d?.valores as number[][]) ?? []).map(([xi, yi, v]) => [d.y?.[yi] ?? yi, d.x?.[xi] ?? xi, v]) };
  if (tipo === 'sankey') return { cab: ['Origen', 'Destino', 'Valor'], filas: ((d?.enlaces as any[]) ?? []).map((e) => [e.origen, e.destino, e.valor]) };
  const n = normalizar(d); return { cab: ['Categoría', ...n.series.map((s) => s.nombre)], filas: n.categorias.map((c, i) => [c, ...n.series.map((s) => s.valores[i] ?? '')]) };
}

export function construirOpcion(c: Cfg, d: any): Record<string, any> {
  const fmt = (v: unknown) => formatoNumero(Number(v), c.formato) + (c.unidad && c.formato !== 'cop' && c.formato !== 'porcentaje' ? ' ' + c.unidad : '');
  const suave = c.oscuro ? '#97A1B0' : '#6B7482', fondo = c.oscuro ? '#081A2C' : '#FFFFFF';
  const tTop = c.titulo ? (c.subtitulo ? 58 : 38) : 12;
  const legArriba = c.leyenda && c.leyendaPosicion === 'arriba', legAbajo = c.leyenda && c.leyendaPosicion === 'abajo', legDer = c.leyenda && c.leyendaPosicion === 'derecha';
  const opt: Record<string, any> = {
    color: c.colores, animation: c.animacion, animationDuration: 700, animationEasing: 'cubicOut',
    aria: { enabled: true, decal: { show: c.patrones } },
    title: c.titulo ? { text: c.titulo, subtext: c.subtitulo || undefined, left: 0, top: 0 } : undefined,
    legend: c.leyenda ? { type: 'scroll', icon: 'roundRect', itemWidth: 12, itemHeight: 8, ...(legDer ? { orient: 'vertical', right: 0, top: 'middle' } : legAbajo ? { bottom: 0 } : { top: c.titulo ? (c.subtitulo ? 50 : 32) : 0, left: 0 }) } : undefined,
    tooltip: { confine: true },
  };
  const grid = { left: 8, right: legDer ? 130 : 16, top: tTop + (legArriba ? 30 : 0), bottom: legAbajo ? 40 : 8, containLabel: true };
  const tipo = c.tipo;

  if (tipo === 'barras' || tipo === 'barras-horizontal' || tipo === 'lineas' || tipo === 'area') {
    const n = normalizar(d); const horiz = tipo === 'barras-horizontal'; const esBarra = tipo === 'barras' || horiz;
    const cat = { type: 'category', data: n.categorias, axisTick: { alignWithLabel: true }, name: c.tituloEjeX || undefined, nameLocation: 'middle', nameGap: 32, inverse: horiz, boundaryGap: esBarra };
    const val = { type: 'value', axisLabel: { formatter: (v: number) => formatoNumero(v, c.formato === 'cop' ? 'cop' : c.formato) }, name: c.tituloEjeY || undefined, nameGap: 12 };
    opt.grid = grid; opt.xAxis = horiz ? val : cat; opt.yAxis = horiz ? cat : val;
    opt.tooltip = { ...opt.tooltip, trigger: 'axis', axisPointer: { type: esBarra ? 'shadow' : 'line' }, valueFormatter: fmt };
    opt.series = n.series.map((s) => esBarra
      ? { name: s.nombre, type: 'bar', data: c.resaltar ? s.valores.map((v, i) => ({ value: v, itemStyle: n.categorias[i] === c.resaltar ? undefined : { opacity: 0.3 } })) : s.valores, stack: c.apilado ? 'total' : undefined, barMaxWidth: 40, itemStyle: { borderRadius: horiz ? [0, 4, 4, 0] : [4, 4, 0, 0] }, emphasis: { focus: 'series' }, label: { show: c.etiquetas, position: c.apilado ? 'inside' : horiz ? 'right' : 'top', formatter: (p: any) => fmt(p.value), fontFamily: FUENTE, fontSize: 11, color: c.apilado ? '#fff' : suave } }
      : { name: s.nombre, type: 'line', data: s.valores, smooth: c.suave, symbolSize: 7, showSymbol: n.categorias.length <= 24, lineWidth: 2.5, lineStyle: { width: 2.5 }, stack: tipo === 'area' && c.apilado ? 'total' : undefined, areaStyle: tipo === 'area' ? { opacity: 0.16 } : undefined, emphasis: { focus: 'series' }, label: { show: c.etiquetas, position: 'top', formatter: (p: any) => fmt(p.value), fontFamily: FUENTE, fontSize: 11, color: suave } });
  } else if (tipo === 'torta' || tipo === 'dona') {
    const a: { nombre: string; valor: number }[] = Array.isArray(d) ? d : []; const dona = tipo === 'dona'; const total = suma(a.map((x) => Number(x.valor)));
    opt.tooltip = { ...opt.tooltip, trigger: 'item', valueFormatter: fmt };
    opt.series = [{ type: 'pie', radius: dona ? ['48%', '72%'] : ['0%', '72%'], center: [legDer ? '38%' : '50%', legAbajo ? '48%' : '54%'], data: a.map((x) => ({ name: x.nombre, value: Number(x.valor), ...(c.resaltar && x.nombre !== c.resaltar ? { itemStyle: { opacity: 0.3 } } : {}) })), itemStyle: { borderColor: fondo, borderWidth: 2, borderRadius: dona ? 6 : 4 }, label: { show: c.etiquetas, formatter: '{b}\n{d}%', fontFamily: FUENTE, fontSize: 11, color: c.oscuro ? '#E3E8EF' : '#252B36' }, labelLine: { show: c.etiquetas }, emphasis: { scaleSize: 6 } }];
    if (dona) opt.graphic = [{ type: 'group', left: legDer ? '25%' : 'center', top: legAbajo ? '43%' : '50%', children: [
      { type: 'text', style: { text: c.centro || fmt(total), textAlign: 'center', textVerticalAlign: 'bottom', fontSize: 24, fontWeight: 800, fontFamily: FUENTE, fill: c.oscuro ? '#fff' : '#161A22' } },
      { type: 'text', style: { text: c.centro ? '' : 'Total', textAlign: 'center', textVerticalAlign: 'top', y: 2, fontSize: 12, fontFamily: FUENTE, fill: suave } }] }];
  } else if (tipo === 'radar') {
    const n = normalizar(d); const max = Math.max(1, ...n.series.flatMap((s) => s.valores)) * 1.15;
    opt.radar = { indicator: n.categorias.map((nm) => ({ name: nm, max })), radius: '64%', center: [legDer ? '40%' : '50%', legAbajo ? '48%' : '56%'] };
    opt.tooltip = { ...opt.tooltip, trigger: 'item' };
    opt.series = [{ type: 'radar', symbolSize: 5, lineStyle: { width: 2 }, data: n.series.map((s) => ({ name: s.nombre, value: s.valores, areaStyle: { opacity: 0.14 } })) }];
  } else if (tipo === 'gauge') {
    const v = typeof d === 'object' && d !== null ? Number(d.valor) : Number(d); const nombre = typeof d === 'object' && d ? d.nombre ?? '' : '';
    const min = c.min, max = c.max; const frac = (v - min) / (max - min || 1);
    const um = c.umbrales && c.umbrales.length ? c.umbrales : null; const color = um ? (um.find(([f]) => frac <= f) ?? um[um.length - 1])[1] : c.colores[0];
    opt.tooltip = undefined; opt.legend = undefined;
    opt.series = [{ type: 'gauge', min, max, startAngle: 210, endAngle: -30, radius: '88%', center: ['50%', c.titulo ? '62%' : '58%'], progress: { show: true, width: 18, roundCap: true, itemStyle: { color } }, pointer: { show: false }, axisLine: { roundCap: true, lineStyle: { width: 18, color: [[1, c.oscuro ? '#12395C' : '#E3E8EF']] } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      anchor: { show: false }, title: { offsetCenter: [0, '44%'], fontSize: 13, color: suave, fontFamily: FUENTE }, detail: { valueAnimation: true, fontSize: 36, fontWeight: 800, fontFamily: FUENTE, offsetCenter: [0, '8%'], color: c.oscuro ? '#fff' : '#161A22', formatter: (x: number) => fmt(x) }, data: [{ value: v, name: nombre }] }];
  } else if (tipo === 'mapa-calor') {
    const x: string[] = d?.x ?? [], y: string[] = d?.y ?? [], vals: number[][] = d?.valores ?? []; const todos = vals.map((q) => q[2]);
    const rampa = c.colores.length >= 3 && JSON.stringify(c.colores) !== JSON.stringify(PALETAS.institucional.colores) ? c.colores : ['#EAF4FA', '#9FD7E5', '#00B7D9', '#0071BB', '#0B2239'];
    opt.grid = { ...grid, bottom: 84 }; opt.legend = undefined;
    opt.xAxis = { type: 'category', data: x, splitArea: { show: false }, axisTick: { show: false } }; opt.yAxis = { type: 'category', data: y, inverse: true, splitArea: { show: false }, axisTick: { show: false } };
    opt.visualMap = { min: Math.min(...todos), max: Math.max(...todos), calculable: false, orient: 'horizontal', left: 'center', bottom: 8, itemWidth: 14, itemHeight: 160, textGap: 10, inRange: { color: rampa }, formatter: (v: number) => fmt(v) };
    opt.tooltip = { ...opt.tooltip, trigger: 'item', formatter: (p: any) => `<b>${y[p.value[1]]}</b> · ${x[p.value[0]]}<br>${fmt(p.value[2])}` };
    opt.series = [{ type: 'heatmap', data: vals, label: { show: c.etiquetas, formatter: (p: any) => fmt(p.value[2]), fontFamily: FUENTE, fontSize: 11 }, itemStyle: { borderColor: fondo, borderWidth: 2, borderRadius: 3 }, emphasis: { itemStyle: { borderColor: c.oscuro ? '#fff' : '#081A2C', borderWidth: 2 } } }];
  } else if (tipo === 'treemap') {
    const pal = c.colores.length ? c.colores : PALETAS.institucional.colores;
    const conv = (x: any, col: string): any => ({ name: x.nombre, value: x.valor, label: { color: textoSobre(col) }, itemStyle: { color: col }, children: x.hijos ? x.hijos.map((h: any) => conv(h, col)) : undefined });
    opt.legend = undefined; opt.tooltip = { ...opt.tooltip, trigger: 'item', valueFormatter: fmt };
    opt.series = [{ type: 'treemap', top: tTop, left: 0, right: 0, bottom: 0, roam: false, nodeClick: false, breadcrumb: { show: false }, data: (Array.isArray(d) ? d : []).map((x: any, i: number) => conv(x, pal[i % pal.length])), label: { show: true, formatter: (p: any) => `${p.name}
${fmt(p.value)}`, fontFamily: FUENTE, fontWeight: 600, fontSize: 12 }, upperLabel: { show: false }, itemStyle: { borderColor: fondo, borderWidth: 2, gapWidth: 2, borderRadius: 4 }, levels: [{ itemStyle: { borderWidth: 0, gapWidth: 3 } }, { colorSaturation: [0.55, 0.85], itemStyle: { borderColorSaturation: 0.7, gapWidth: 2, borderWidth: 2 } }] }];
  } else if (tipo === 'embudo') {
    const a: { nombre: string; valor: number }[] = Array.isArray(d) ? d : []; const max = Math.max(...a.map((x) => Number(x.valor)), 1);
    opt.legend = undefined; opt.tooltip = { ...opt.tooltip, trigger: 'item', formatter: (p: any) => `<b>${p.name}</b><br>${fmt(p.data.real)} (${Math.round((p.data.real / (a[0] ? Number(a[0].valor) : 1)) * 100)} % del inicio)` };
    opt.series = [{ type: 'funnel', top: tTop, left: '8%', right: '8%', bottom: legAbajo ? 44 : 8, minSize: '18%', maxSize: '100%', gap: 3, sort: 'none', data: a.map((x) => ({ name: x.nombre, value: Number(x.valor) / max * 100, real: Number(x.valor) })), itemStyle: { borderColor: fondo, borderWidth: 1 }, label: { show: true, position: 'inside', fontFamily: FUENTE, fontWeight: 700, fontSize: 12, formatter: (p: any) => `${p.name}  ${fmt(p.data.real)}`, color: '#fff' }, emphasis: { label: { fontSize: 13 } } }];
  } else if (tipo === 'calendario') {
    const a: { fecha: string; valor: number }[] = Array.isArray(d) ? d : []; const fechas = a.map((x) => x.fecha).sort(); const ini = fechas[0] ?? new Date().toISOString().slice(0, 10); const fin = fechas.at(-1) ?? ini; const t0 = new Date(ini + 'T00:00'), t1 = new Date(fin + 'T00:00');
    const meses = Math.max(1, (t1.getFullYear() - t0.getFullYear()) * 12 + t1.getMonth() - t0.getMonth() + 1); const rango = meses > 12 ? [ini, fin] : [new Date(t0.getFullYear(), t0.getMonth(), 1).toISOString().slice(0, 10), new Date(t0.getFullYear(), t0.getMonth() + meses, 0).toISOString().slice(0, 10)];
    const rampa = c.colores.length >= 3 && JSON.stringify(c.colores) !== JSON.stringify(PALETAS.institucional.colores) ? c.colores : ['#EAF4FA', '#9FD7E5', '#00B7D9', '#0071BB', '#0B2239']; const vs = a.map((x) => Number(x.valor));
    opt.legend = undefined; opt.tooltip = { ...opt.tooltip, trigger: 'item', formatter: (p: any) => `<b>${p.value[0]}</b><br>${fmt(p.value[1])}` };
    opt.visualMap = { min: 0, max: Math.max(...vs, 1), calculable: false, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 14, itemHeight: 140, inRange: { color: rampa }, formatter: (v: number) => fmt(v) };
    opt.calendar = { top: tTop + 24, left: 36, right: 8, bottom: 44, cellSize: ['auto', 15], range: rango, itemStyle: { borderWidth: 3, borderColor: fondo, color: c.oscuro ? '#12395C' : '#F1F4F8' }, splitLine: { show: false }, yearLabel: { show: false }, dayLabel: { firstDay: 1, nameMap: ['D', 'L', 'M', 'M', 'J', 'V', 'S'], color: suave, fontFamily: FUENTE, fontSize: 10 }, monthLabel: { nameMap: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], color: suave, fontFamily: FUENTE, fontSize: 11 } };
    opt.series = [{ type: 'heatmap', coordinateSystem: 'calendar', data: a.map((x) => [x.fecha, Number(x.valor)]), itemStyle: { borderRadius: 3 } }];
  } else if (tipo === 'gantt') {
    const a: { nombre: string; inicio: string; fin: string; avance?: number; grupo?: string }[] = Array.isArray(d) ? d : []; const pal = c.colores.length ? c.colores : PALETAS.institucional.colores;
    const grupos = [...new Set(a.map((x) => x.grupo ?? ''))]; const T = (s: string) => new Date(s + 'T00:00').getTime();
    opt.legend = undefined; opt.grid = { ...grid, left: 8, right: 24, bottom: 8 };
    opt.xAxis = { type: 'time', position: 'top', splitLine: { show: true }, axisLabel: { fontFamily: FUENTE, color: suave, formatter: (v: number) => { const f = new Date(v); return ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][f.getMonth()] + ' ' + String(f.getFullYear()).slice(2); } } };
    opt.yAxis = { type: 'category', inverse: true, data: a.map((x) => x.nombre), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { fontFamily: FUENTE, color: c.oscuro ? '#E3E8EF' : '#252B36', fontWeight: 600 } };
    opt.tooltip = { ...opt.tooltip, trigger: 'item', formatter: (p: any) => { const t = a[p.dataIndex]; return `<b>${t.nombre}</b><br>${t.inicio} → ${t.fin}${t.avance != null ? `<br>Avance: ${Math.round(t.avance * 100)} %` : ''}`; } };
    opt.series = [{ type: 'custom', encode: { x: [1, 2], y: 0 }, data: a.map((x, i) => [i, T(x.inicio), T(x.fin) + 86400000, x.avance ?? 0, grupos.indexOf(x.grupo ?? '')]),
      renderItem: (_p: any, api: any) => { const i = api.value(0); const s = api.coord([api.value(1), i]), e = api.coord([api.value(2), i]); const h = Math.min(22, api.size([0, 1])[1] * 0.55); const w = Math.max(e[0] - s[0], 3); const col = pal[api.value(4) % pal.length]; const av = Math.max(0, Math.min(1, api.value(3)));
        return { type: 'group', children: [{ type: 'rect', shape: { x: s[0], y: s[1] - h / 2, width: w, height: h, r: 5 }, style: { fill: col, opacity: av > 0 ? 0.28 : 0.9 } }, ...(av > 0 ? [{ type: 'rect', shape: { x: s[0], y: s[1] - h / 2, width: w * av, height: h, r: 5 }, style: { fill: col } }] : [])] }; } }];
  } else if (tipo === 'sankey') {
    const nodos: string[] = (d?.nodos ?? []).map((n: any) => (typeof n === 'string' ? n : n.nombre));
    opt.legend = undefined; opt.tooltip = { ...opt.tooltip, trigger: 'item', valueFormatter: fmt };
    opt.series = [{ type: 'sankey', top: tTop, left: 8, right: 90, bottom: 8, nodeWidth: 16, nodeGap: 12, emphasis: { focus: 'adjacency' }, data: nodos.map((name) => ({ name })), links: (d?.enlaces ?? []).map((e: any) => ({ source: e.origen, target: e.destino, value: Number(e.valor) })), lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.45 }, label: { fontFamily: FUENTE, fontWeight: 600, fontSize: 12, color: c.oscuro ? '#E3E8EF' : '#252B36' }, itemStyle: { borderWidth: 0 } }];
  }
  return opt;
}

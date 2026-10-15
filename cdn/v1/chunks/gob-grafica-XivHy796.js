import { a as $, A as _, b as x, i as k } from "./lit-element-CZvHeOsZ.js";
import { f as z, t as D } from "./mapa-recursos-DvOcbc8o.js";
const y = {
  institucional: { nombre: "Institucional", colores: ["#0071BB", "#00B7D9", "#FEC800", "#69B75E", "#F7003C", "#5618BA", "#A28034", "#9FD7E5"] },
  azules: { nombre: "Azules", colores: ["#0B2239", "#0071BB", "#4FA3D4", "#00B7D9", "#9FD7E5", "#12395C"] },
  calida: { nombre: "Cálida", colores: ["#FEC800", "#F5A300", "#F7003C", "#A28034", "#B20028", "#5A3E00"] },
  semaforo: { nombre: "Semáforo", colores: ["#69B75E", "#FEC800", "#F7003C"] },
  neutra: { nombre: "Neutra", colores: ["#4F5866", "#97A1B0", "#CBD2DC", "#6B7482"] }
}, j = {
  barras: "Barras",
  "barras-horizontal": "Barras horizontales",
  lineas: "Líneas",
  area: "Áreas",
  torta: "Torta",
  dona: "Dona",
  radar: "Radar",
  gauge: "Indicador (gauge)",
  "mapa-calor": "Mapa de calor",
  treemap: "Treemap",
  sankey: "Sankey",
  embudo: "Embudo",
  calendario: "Calendario de actividad",
  gantt: "Cronograma (Gantt)"
}, h = "Montserrat, 'Segoe UI', system-ui, sans-serif";
function q(t) {
  const e = t ? "#E3E8EF" : "#252B36", s = t ? "#97A1B0" : "#6B7482", a = t ? "#1B4B75" : "#CBD2DC", m = t ? "#12395C" : "#E3E8EF", d = { axisLine: { lineStyle: { color: a } }, axisTick: { lineStyle: { color: a } }, axisLabel: { color: s, fontFamily: h }, splitLine: { lineStyle: { color: m } }, nameTextStyle: { color: s, fontFamily: h, fontWeight: 600 } };
  return {
    color: y.institucional.colores,
    backgroundColor: "transparent",
    textStyle: { fontFamily: h, color: e },
    title: { textStyle: { color: t ? "#fff" : "#161A22", fontFamily: h, fontWeight: 700, fontSize: 16 }, subtextStyle: { color: s, fontFamily: h, fontSize: 12 } },
    legend: { textStyle: { color: e, fontFamily: h, fontSize: 12 }, pageTextStyle: { color: e } },
    categoryAxis: d,
    valueAxis: d,
    timeAxis: d,
    logAxis: d,
    tooltip: { backgroundColor: t ? "#fff" : "#081A2C", borderColor: "transparent", textStyle: { color: t ? "#081A2C" : "#fff", fontFamily: h, fontSize: 12 }, extraCssText: "border-radius:8px;box-shadow:0 8px 24px rgba(8,26,44,.28);padding:8px 12px;" },
    visualMap: { textStyle: { color: e, fontFamily: h } },
    radar: { axisName: { color: e, fontFamily: h }, splitLine: { lineStyle: { color: m } }, axisLine: { lineStyle: { color: a } }, splitArea: { show: !1 } }
  };
}
function C(t) {
  return Array.isArray(t) ? { categorias: t.map((e) => String(e.nombre)), series: [{ nombre: "Valor", valores: t.map((e) => Number(e.valor)) }] } : t && t.categorias && t.series ? { categorias: t.categorias.map(String), series: t.series.map((e) => ({ nombre: String(e.nombre ?? "Serie"), valores: (e.valores ?? []).map(Number) })) } : { categorias: [], series: [] };
}
const W = (t) => t.reduce((e, s) => e + (Number.isFinite(s) ? s : 0), 0);
function M(t, e) {
  if (t === "gauge") return { cab: ["Indicador", "Valor"], filas: [[typeof e == "object" && e?.nombre ? e.nombre : "Valor", typeof e == "object" ? e?.valor : e]] };
  if (t === "gantt") return { cab: ["Tarea", "Inicio", "Fin", "Avance"], filas: (e ?? []).map((a) => [a.nombre, a.inicio, a.fin, a.avance != null ? Math.round(a.avance * 100) + " %" : ""]) };
  if (t === "calendario") return { cab: ["Fecha", "Valor"], filas: (e ?? []).map((a) => [a.fecha, a.valor]) };
  if (t === "torta" || t === "dona" || t === "treemap" || t === "embudo") {
    const a = Array.isArray(e) ? e : [];
    return { cab: ["Nombre", "Valor"], filas: a.map((m) => [m.nombre, m.valor]) };
  }
  if (t === "mapa-calor") return { cab: ["Fila", "Columna", "Valor"], filas: (e?.valores ?? []).map(([a, m, d]) => [e.y?.[m] ?? m, e.x?.[a] ?? a, d]) };
  if (t === "sankey") return { cab: ["Origen", "Destino", "Valor"], filas: (e?.enlaces ?? []).map((a) => [a.origen, a.destino, a.valor]) };
  const s = C(e);
  return { cab: ["Categoría", ...s.series.map((a) => a.nombre)], filas: s.categorias.map((a, m) => [a, ...s.series.map((d) => d.valores[m] ?? "")]) };
}
function T(t, e) {
  const s = (n) => z(Number(n), t.formato) + (t.unidad && t.formato !== "cop" && t.formato !== "porcentaje" ? " " + t.unidad : ""), a = t.oscuro ? "#97A1B0" : "#6B7482", m = t.oscuro ? "#081A2C" : "#FFFFFF", d = t.titulo ? t.subtitulo ? 58 : 38 : 12, L = t.leyenda && t.leyendaPosicion === "arriba", v = t.leyenda && t.leyendaPosicion === "abajo", F = t.leyenda && t.leyendaPosicion === "derecha", o = {
    color: t.colores,
    animation: t.animacion,
    animationDuration: 700,
    animationEasing: "cubicOut",
    aria: { enabled: !0, decal: { show: t.patrones } },
    title: t.titulo ? { text: t.titulo, subtext: t.subtitulo || void 0, left: 0, top: 0 } : void 0,
    legend: t.leyenda ? { type: "scroll", icon: "roundRect", itemWidth: 12, itemHeight: 8, ...F ? { orient: "vertical", right: 0, top: "middle" } : v ? { bottom: 0 } : { top: t.titulo ? t.subtitulo ? 50 : 32 : 0, left: 0 } } : void 0,
    tooltip: { confine: !0 }
  }, A = { left: 8, right: F ? 130 : 16, top: d + (L ? 30 : 0), bottom: v ? 40 : 8, containLabel: !0 }, p = t.tipo;
  if (p === "barras" || p === "barras-horizontal" || p === "lineas" || p === "area") {
    const n = C(e), l = p === "barras-horizontal", r = p === "barras" || l, u = { type: "category", data: n.categorias, axisTick: { alignWithLabel: !0 }, name: t.tituloEjeX || void 0, nameLocation: "middle", nameGap: 32, inverse: l, boundaryGap: r }, c = { type: "value", axisLabel: { formatter: (i) => z(i, t.formato === "cop" ? "cop" : t.formato) }, name: t.tituloEjeY || void 0, nameGap: 12 };
    o.grid = A, o.xAxis = l ? c : u, o.yAxis = l ? u : c, o.tooltip = { ...o.tooltip, trigger: "axis", axisPointer: { type: r ? "shadow" : "line" }, valueFormatter: s }, o.series = n.series.map((i) => r ? { name: i.nombre, type: "bar", data: t.resaltar ? i.valores.map((b, g) => ({ value: b, itemStyle: n.categorias[g] === t.resaltar ? void 0 : { opacity: 0.3 } })) : i.valores, stack: t.apilado ? "total" : void 0, barMaxWidth: 40, itemStyle: { borderRadius: l ? [0, 4, 4, 0] : [4, 4, 0, 0] }, emphasis: { focus: "series" }, label: { show: t.etiquetas, position: t.apilado ? "inside" : l ? "right" : "top", formatter: (b) => s(b.value), fontFamily: h, fontSize: 11, color: t.apilado ? "#fff" : a } } : { name: i.nombre, type: "line", data: i.valores, smooth: t.suave, symbolSize: 7, showSymbol: n.categorias.length <= 24, lineWidth: 2.5, lineStyle: { width: 2.5 }, stack: p === "area" && t.apilado ? "total" : void 0, areaStyle: p === "area" ? { opacity: 0.16 } : void 0, emphasis: { focus: "series" }, label: { show: t.etiquetas, position: "top", formatter: (b) => s(b.value), fontFamily: h, fontSize: 11, color: a } });
  } else if (p === "torta" || p === "dona") {
    const n = Array.isArray(e) ? e : [], l = p === "dona", r = W(n.map((u) => Number(u.valor)));
    o.tooltip = { ...o.tooltip, trigger: "item", valueFormatter: s }, o.series = [{ type: "pie", radius: l ? ["48%", "72%"] : ["0%", "72%"], center: [F ? "38%" : "50%", v ? "48%" : "54%"], data: n.map((u) => ({ name: u.nombre, value: Number(u.valor), ...t.resaltar && u.nombre !== t.resaltar ? { itemStyle: { opacity: 0.3 } } : {} })), itemStyle: { borderColor: m, borderWidth: 2, borderRadius: l ? 6 : 4 }, label: { show: t.etiquetas, formatter: `{b}
{d}%`, fontFamily: h, fontSize: 11, color: t.oscuro ? "#E3E8EF" : "#252B36" }, labelLine: { show: t.etiquetas }, emphasis: { scaleSize: 6 } }], l && (o.graphic = [{ type: "group", left: F ? "25%" : "center", top: v ? "43%" : "50%", children: [
      { type: "text", style: { text: t.centro || s(r), textAlign: "center", textVerticalAlign: "bottom", fontSize: 24, fontWeight: 800, fontFamily: h, fill: t.oscuro ? "#fff" : "#161A22" } },
      { type: "text", style: { text: t.centro ? "" : "Total", textAlign: "center", textVerticalAlign: "top", y: 2, fontSize: 12, fontFamily: h, fill: a } }
    ] }]);
  } else if (p === "radar") {
    const n = C(e), l = Math.max(1, ...n.series.flatMap((r) => r.valores)) * 1.15;
    o.radar = { indicator: n.categorias.map((r) => ({ name: r, max: l })), radius: "64%", center: [F ? "40%" : "50%", v ? "48%" : "56%"] }, o.tooltip = { ...o.tooltip, trigger: "item" }, o.series = [{ type: "radar", symbolSize: 5, lineStyle: { width: 2 }, data: n.series.map((r) => ({ name: r.nombre, value: r.valores, areaStyle: { opacity: 0.14 } })) }];
  } else if (p === "gauge") {
    const n = Number(typeof e == "object" && e !== null ? e.valor : e), l = typeof e == "object" && e ? e.nombre ?? "" : "", r = t.min, u = t.max, c = (n - r) / (u - r || 1), i = t.umbrales && t.umbrales.length ? t.umbrales : null, b = i ? (i.find(([g]) => c <= g) ?? i[i.length - 1])[1] : t.colores[0];
    o.tooltip = void 0, o.legend = void 0, o.series = [{
      type: "gauge",
      min: r,
      max: u,
      startAngle: 210,
      endAngle: -30,
      radius: "88%",
      center: ["50%", t.titulo ? "62%" : "58%"],
      progress: { show: !0, width: 18, roundCap: !0, itemStyle: { color: b } },
      pointer: { show: !1 },
      axisLine: { roundCap: !0, lineStyle: { width: 18, color: [[1, t.oscuro ? "#12395C" : "#E3E8EF"]] } },
      axisTick: { show: !1 },
      splitLine: { show: !1 },
      axisLabel: { show: !1 },
      anchor: { show: !1 },
      title: { offsetCenter: [0, "44%"], fontSize: 13, color: a, fontFamily: h },
      detail: { valueAnimation: !0, fontSize: 36, fontWeight: 800, fontFamily: h, offsetCenter: [0, "8%"], color: t.oscuro ? "#fff" : "#161A22", formatter: (g) => s(g) },
      data: [{ value: n, name: l }]
    }];
  } else if (p === "mapa-calor") {
    const n = e?.x ?? [], l = e?.y ?? [], r = e?.valores ?? [], u = r.map((i) => i[2]), c = t.colores.length >= 3 && JSON.stringify(t.colores) !== JSON.stringify(y.institucional.colores) ? t.colores : ["#EAF4FA", "#9FD7E5", "#00B7D9", "#0071BB", "#0B2239"];
    o.grid = { ...A, bottom: 84 }, o.legend = void 0, o.xAxis = { type: "category", data: n, splitArea: { show: !1 }, axisTick: { show: !1 } }, o.yAxis = { type: "category", data: l, inverse: !0, splitArea: { show: !1 }, axisTick: { show: !1 } }, o.visualMap = { min: Math.min(...u), max: Math.max(...u), calculable: !1, orient: "horizontal", left: "center", bottom: 8, itemWidth: 14, itemHeight: 160, textGap: 10, inRange: { color: c }, formatter: (i) => s(i) }, o.tooltip = { ...o.tooltip, trigger: "item", formatter: (i) => `<b>${l[i.value[1]]}</b> · ${n[i.value[0]]}<br>${s(i.value[2])}` }, o.series = [{ type: "heatmap", data: r, label: { show: t.etiquetas, formatter: (i) => s(i.value[2]), fontFamily: h, fontSize: 11 }, itemStyle: { borderColor: m, borderWidth: 2, borderRadius: 3 }, emphasis: { itemStyle: { borderColor: t.oscuro ? "#fff" : "#081A2C", borderWidth: 2 } } }];
  } else if (p === "treemap") {
    const n = t.colores.length ? t.colores : y.institucional.colores, l = (r, u) => ({ name: r.nombre, value: r.valor, label: { color: D(u) }, itemStyle: { color: u }, children: r.hijos ? r.hijos.map((c) => l(c, u)) : void 0 });
    o.legend = void 0, o.tooltip = { ...o.tooltip, trigger: "item", valueFormatter: s }, o.series = [{ type: "treemap", top: d, left: 0, right: 0, bottom: 0, roam: !1, nodeClick: !1, breadcrumb: { show: !1 }, data: (Array.isArray(e) ? e : []).map((r, u) => l(r, n[u % n.length])), label: { show: !0, formatter: (r) => `${r.name}
${s(r.value)}`, fontFamily: h, fontWeight: 600, fontSize: 12 }, upperLabel: { show: !1 }, itemStyle: { borderColor: m, borderWidth: 2, gapWidth: 2, borderRadius: 4 }, levels: [{ itemStyle: { borderWidth: 0, gapWidth: 3 } }, { colorSaturation: [0.55, 0.85], itemStyle: { borderColorSaturation: 0.7, gapWidth: 2, borderWidth: 2 } }] }];
  } else if (p === "embudo") {
    const n = Array.isArray(e) ? e : [], l = Math.max(...n.map((r) => Number(r.valor)), 1);
    o.legend = void 0, o.tooltip = { ...o.tooltip, trigger: "item", formatter: (r) => `<b>${r.name}</b><br>${s(r.data.real)} (${Math.round(r.data.real / (n[0] ? Number(n[0].valor) : 1) * 100)} % del inicio)` }, o.series = [{ type: "funnel", top: d, left: "8%", right: "8%", bottom: v ? 44 : 8, minSize: "18%", maxSize: "100%", gap: 3, sort: "none", data: n.map((r) => ({ name: r.nombre, value: Number(r.valor) / l * 100, real: Number(r.valor) })), itemStyle: { borderColor: m, borderWidth: 1 }, label: { show: !0, position: "inside", fontFamily: h, fontWeight: 700, fontSize: 12, formatter: (r) => `${r.name}  ${s(r.data.real)}`, color: "#fff" }, emphasis: { label: { fontSize: 13 } } }];
  } else if (p === "calendario") {
    const n = Array.isArray(e) ? e : [], l = n.map((f) => f.fecha).sort(), r = l[0] ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), u = l.at(-1) ?? r, c = /* @__PURE__ */ new Date(r + "T00:00"), i = /* @__PURE__ */ new Date(u + "T00:00"), b = Math.max(1, (i.getFullYear() - c.getFullYear()) * 12 + i.getMonth() - c.getMonth() + 1), g = b > 12 ? [r, u] : [new Date(c.getFullYear(), c.getMonth(), 1).toISOString().slice(0, 10), new Date(c.getFullYear(), c.getMonth() + b, 0).toISOString().slice(0, 10)], w = t.colores.length >= 3 && JSON.stringify(t.colores) !== JSON.stringify(y.institucional.colores) ? t.colores : ["#EAF4FA", "#9FD7E5", "#00B7D9", "#0071BB", "#0B2239"], S = n.map((f) => Number(f.valor));
    o.legend = void 0, o.tooltip = { ...o.tooltip, trigger: "item", formatter: (f) => `<b>${f.value[0]}</b><br>${s(f.value[1])}` }, o.visualMap = { min: 0, max: Math.max(...S, 1), calculable: !1, orient: "horizontal", left: "center", bottom: 0, itemWidth: 14, itemHeight: 140, inRange: { color: w }, formatter: (f) => s(f) }, o.calendar = { top: d + 24, left: 36, right: 8, bottom: 44, cellSize: ["auto", 15], range: g, itemStyle: { borderWidth: 3, borderColor: m, color: t.oscuro ? "#12395C" : "#F1F4F8" }, splitLine: { show: !1 }, yearLabel: { show: !1 }, dayLabel: { firstDay: 1, nameMap: ["D", "L", "M", "M", "J", "V", "S"], color: a, fontFamily: h, fontSize: 10 }, monthLabel: { nameMap: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], color: a, fontFamily: h, fontSize: 11 } }, o.series = [{ type: "heatmap", coordinateSystem: "calendar", data: n.map((f) => [f.fecha, Number(f.valor)]), itemStyle: { borderRadius: 3 } }];
  } else if (p === "gantt") {
    const n = Array.isArray(e) ? e : [], l = t.colores.length ? t.colores : y.institucional.colores, r = [...new Set(n.map((c) => c.grupo ?? ""))], u = (c) => (/* @__PURE__ */ new Date(c + "T00:00")).getTime();
    o.legend = void 0, o.grid = { ...A, left: 8, right: 24, bottom: 8 }, o.xAxis = { type: "time", position: "top", splitLine: { show: !0 }, axisLabel: { fontFamily: h, color: a, formatter: (c) => {
      const i = new Date(c);
      return ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][i.getMonth()] + " " + String(i.getFullYear()).slice(2);
    } } }, o.yAxis = { type: "category", inverse: !0, data: n.map((c) => c.nombre), axisTick: { show: !1 }, axisLine: { show: !1 }, axisLabel: { fontFamily: h, color: t.oscuro ? "#E3E8EF" : "#252B36", fontWeight: 600 } }, o.tooltip = { ...o.tooltip, trigger: "item", formatter: (c) => {
      const i = n[c.dataIndex];
      return `<b>${i.nombre}</b><br>${i.inicio} → ${i.fin}${i.avance != null ? `<br>Avance: ${Math.round(i.avance * 100)} %` : ""}`;
    } }, o.series = [{
      type: "custom",
      encode: { x: [1, 2], y: 0 },
      data: n.map((c, i) => [i, u(c.inicio), u(c.fin) + 864e5, c.avance ?? 0, r.indexOf(c.grupo ?? "")]),
      renderItem: (c, i) => {
        const b = i.value(0), g = i.coord([i.value(1), b]), w = i.coord([i.value(2), b]), S = Math.min(22, i.size([0, 1])[1] * 0.55), f = Math.max(w[0] - g[0], 3), B = l[i.value(4) % l.length], E = Math.max(0, Math.min(1, i.value(3)));
        return { type: "group", children: [{ type: "rect", shape: { x: g[0], y: g[1] - S / 2, width: f, height: S, r: 5 }, style: { fill: B, opacity: E > 0 ? 0.28 : 0.9 } }, ...E > 0 ? [{ type: "rect", shape: { x: g[0], y: g[1] - S / 2, width: f * E, height: S, r: 5 }, style: { fill: B } }] : []] };
      }
    }];
  } else if (p === "sankey") {
    const n = (e?.nodos ?? []).map((l) => typeof l == "string" ? l : l.nombre);
    o.legend = void 0, o.tooltip = { ...o.tooltip, trigger: "item", valueFormatter: s }, o.series = [{ type: "sankey", top: d, left: 8, right: 90, bottom: 8, nodeWidth: 16, nodeGap: 12, emphasis: { focus: "adjacency" }, data: n.map((l) => ({ name: l })), links: (e?.enlaces ?? []).map((l) => ({ source: l.origen, target: l.destino, value: Number(l.valor) })), lineStyle: { color: "gradient", curveness: 0.5, opacity: 0.45 }, label: { fontFamily: h, fontWeight: 600, fontSize: 12, color: t.oscuro ? "#E3E8EF" : "#252B36" }, itemStyle: { borderWidth: 0 } }];
  }
  return o;
}
const N = { fromAttribute: (t) => {
  try {
    return t ? JSON.parse(t) : void 0;
  } catch {
    return;
  }
}, toAttribute: (t) => JSON.stringify(t) };
let O = null;
function R() {
  return O ??= import("./echarts-setup-BkTqtLDg.js");
}
class P extends $ {
  constructor() {
    if (super(), this._chart = null, this._tema = "", this._t = 0, this.tipo = "barras", this.colores = "institucional", this.titulo = "", this.subtitulo = "", this.leyenda = !0, this.leyendaPosicion = "arriba", this.etiquetas = !1, this.apilado = !1, this.suave = !1, this.formato = "numero", this.unidad = "", this.tituloEjeX = "", this.tituloEjeY = "", this.resaltar = "", this.min = 0, this.max = 100, this.patrones = !1, this.animacion = !0, this.tema = "claro", this.altura = 360, this.centro = "", this.descripcion = "", this._listo = !1, this._error = "", Object.prototype.hasOwnProperty.call(this, "config")) {
      const e = this.config;
      delete this.config, this.config = e;
    }
  }
  static {
    this.properties = {
      tipo: { type: String, reflect: !0 },
      datos: { converter: N },
      colores: { converter: { fromAttribute: (e) => e ? e.trim().startsWith("[") ? JSON.parse(e) : e.trim() : "institucional" } },
      titulo: { type: String },
      subtitulo: { type: String },
      leyenda: { type: Boolean },
      leyendaPosicion: { attribute: "leyenda-posicion", type: String },
      etiquetas: { type: Boolean },
      apilado: { type: Boolean },
      suave: { type: Boolean },
      formato: { type: String },
      unidad: { type: String },
      tituloEjeX: { attribute: "titulo-eje-x", type: String },
      tituloEjeY: { attribute: "titulo-eje-y", type: String },
      umbrales: { converter: N },
      resaltar: { type: String },
      min: { type: Number },
      max: { type: Number },
      patrones: { type: Boolean },
      animacion: { type: Boolean },
      tema: { type: String, reflect: !0 },
      altura: { type: Number },
      centro: { type: String },
      descripcion: { type: String },
      _listo: { state: !0 },
      _error: { state: !0 }
    };
  }
  /** Asigna varias propiedades a la vez. */
  set config(e) {
    Object.assign(this, e);
  }
  get config() {
    return {};
  }
  static get paletas() {
    return y;
  }
  static get tipos() {
    return j;
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver(() => this._chart?.resize());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect(), this._chart?.dispose(), this._chart = null, this._tema = "";
  }
  updated(e) {
    e.size && (clearTimeout(this._t), this._t = window.setTimeout(() => this._dibujar(), 30));
  }
  _paleta() {
    return Array.isArray(this.colores) ? this.colores : y[this.colores]?.colores ?? y.institucional.colores;
  }
  _cfg() {
    return {
      tipo: this.tipo,
      colores: this._paleta(),
      titulo: this.titulo,
      subtitulo: this.subtitulo,
      leyenda: this.leyenda,
      leyendaPosicion: this.leyendaPosicion,
      etiquetas: this.etiquetas,
      apilado: this.apilado,
      suave: this.suave,
      formato: this.formato,
      unidad: this.unidad,
      tituloEjeX: this.tituloEjeX,
      tituloEjeY: this.tituloEjeY,
      umbrales: this.umbrales,
      resaltar: this.resaltar,
      min: this.min,
      max: this.max,
      patrones: this.patrones,
      animacion: this.animacion && !matchMedia("(prefers-reduced-motion: reduce)").matches,
      oscuro: this.tema === "oscuro",
      centro: this.centro
    };
  }
  async _dibujar() {
    const e = this.renderRoot.querySelector(".ch");
    if (!(!e || this.datos == null))
      try {
        const s = await R(), a = this.tema === "oscuro" ? "gob-oscuro" : "gob";
        this._chart && this._tema !== a && (this._chart.dispose(), this._chart = null), this._chart || (this._chart = s.init(e, a, { renderer: "canvas" }), this._tema = a, this._ro?.observe(e), this._chart.on("click", (m) => this.dispatchEvent(new CustomEvent("gob-grafica-click", { detail: { nombre: m.name, serie: m.seriesName, valor: m.value, indice: m.dataIndex, tipo: m.seriesType }, bubbles: !0, composed: !0 }))), this._chart.on("finished", () => {
          this._listo || (this._listo = !0, this.dispatchEvent(new CustomEvent("gob-grafica-lista", { bubbles: !0, composed: !0 })));
        })), this._chart.setOption(T(this._cfg(), this.datos), { notMerge: !0 }), this._chart.resize(), this._error = "";
      } catch (s) {
        this._error = String(s.message || s);
      }
  }
  // ---- exportación
  /** Descarga la gráfica como PNG. */
  descargarPNG(e = "grafica", s = 2) {
    if (!this._chart) return;
    const a = this._chart.getDataURL({ type: "png", pixelRatio: s, backgroundColor: this.tema === "oscuro" ? "#081A2C" : "#FFFFFF" }), m = document.createElement("a");
    m.href = a, m.download = e + ".png", m.click();
  }
  /** Devuelve los datos como CSV (separador «;», UTF-8 con BOM al descargar). */
  csv() {
    const e = M(this.tipo, this.datos);
    return [e.cab, ...e.filas].map((s) => s.map((a) => `"${String(a).replace(/"/g, '""')}"`).join(";")).join(`
`);
  }
  descargarCSV(e = "datos") {
    const s = new Blob(["\uFEFF" + this.csv()], { type: "text/csv;charset=utf-8" }), a = document.createElement("a");
    a.href = URL.createObjectURL(s), a.download = e + ".csv", a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 1e3);
  }
  imprimir() {
    window.print();
  }
  render() {
    const e = M(this.tipo, this.datos), s = [this.titulo || j[this.tipo] || "Gráfica", this.descripcion].filter(Boolean).join(". ");
    return x`<div class="wrap" part="grafica">
      ${this._error ? x`<div class="err" role="alert">⚠ ${this._error}</div>` : _}
      ${!this._listo && !this._error ? x`<div class="cargando" role="status">Cargando gráfica…</div>` : _}
      <div class="ch" part="lienzo" role="img" aria-label=${s} style="height:${this.altura}px"></div>
      <table class="sr"><caption>${s}</caption><thead><tr>${e.cab.map((a) => x`<th>${a}</th>`)}</tr></thead>
        <tbody>${e.filas.map((a) => x`<tr>${a.map((m) => x`<td>${m}</td>`)}</tr>`)}</tbody></table></div>`;
  }
  static {
    this.styles = k`
    :host { display: block; position: relative; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); }
    .wrap { position: relative; } .ch { width: 100%; min-height: 200px; }
    .cargando, .err { position: absolute; inset: 0; display: grid; place-items: center; font-size: .85rem; color: #6B7482; pointer-events: none; } .err { color: #B20028; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media print { .ch { break-inside: avoid; } }
  `;
  }
}
customElements.get("gob-grafica") || customElements.define("gob-grafica", P);
export {
  P as G,
  q as t
};

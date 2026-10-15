import { i as j, A, b, a as z } from "./lit-element-B3qO7mJS.js";
import { f as E, t as k } from "./mapa-recursos-DvOcbc8o.js";
const y = {
  institucional: { nombre: "Institucional", colores: ["#0071BB", "#00B7D9", "#FEC800", "#69B75E", "#F7003C", "#5618BA", "#A28034", "#9FD7E5"] },
  azules: { nombre: "Azules", colores: ["#0B2239", "#0071BB", "#4FA3D4", "#00B7D9", "#9FD7E5", "#12395C"] },
  calida: { nombre: "Cálida", colores: ["#FEC800", "#F5A300", "#F7003C", "#A28034", "#B20028", "#5A3E00"] },
  semaforo: { nombre: "Semáforo", colores: ["#69B75E", "#FEC800", "#F7003C"] },
  neutra: { nombre: "Neutra", colores: ["#4F5866", "#97A1B0", "#CBD2DC", "#6B7482"] }
}, w = {
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
  sankey: "Sankey"
}, u = "Montserrat, 'Segoe UI', system-ui, sans-serif";
function R(t) {
  const e = t ? "#E3E8EF" : "#252B36", a = t ? "#97A1B0" : "#6B7482", o = t ? "#1B4B75" : "#CBD2DC", l = t ? "#12395C" : "#E3E8EF", p = { axisLine: { lineStyle: { color: o } }, axisTick: { lineStyle: { color: o } }, axisLabel: { color: a, fontFamily: u }, splitLine: { lineStyle: { color: l } }, nameTextStyle: { color: a, fontFamily: u, fontWeight: 600 } };
  return {
    color: y.institucional.colores,
    backgroundColor: "transparent",
    textStyle: { fontFamily: u, color: e },
    title: { textStyle: { color: t ? "#fff" : "#161A22", fontFamily: u, fontWeight: 700, fontSize: 16 }, subtextStyle: { color: a, fontFamily: u, fontSize: 12 } },
    legend: { textStyle: { color: e, fontFamily: u, fontSize: 12 }, pageTextStyle: { color: e } },
    categoryAxis: p,
    valueAxis: p,
    timeAxis: p,
    logAxis: p,
    tooltip: { backgroundColor: t ? "#fff" : "#081A2C", borderColor: "transparent", textStyle: { color: t ? "#081A2C" : "#fff", fontFamily: u, fontSize: 12 }, extraCssText: "border-radius:8px;box-shadow:0 8px 24px rgba(8,26,44,.28);padding:8px 12px;" },
    visualMap: { textStyle: { color: e, fontFamily: u } },
    radar: { axisName: { color: e, fontFamily: u }, splitLine: { lineStyle: { color: l } }, axisLine: { lineStyle: { color: o } }, splitArea: { show: !1 } }
  };
}
function x(t) {
  return Array.isArray(t) ? { categorias: t.map((e) => String(e.nombre)), series: [{ nombre: "Valor", valores: t.map((e) => Number(e.valor)) }] } : t && t.categorias && t.series ? { categorias: t.categorias.map(String), series: t.series.map((e) => ({ nombre: String(e.nombre ?? "Serie"), valores: (e.valores ?? []).map(Number) })) } : { categorias: [], series: [] };
}
const N = (t) => t.reduce((e, a) => e + (Number.isFinite(a) ? a : 0), 0);
function C(t, e) {
  if (t === "gauge") return { cab: ["Indicador", "Valor"], filas: [[typeof e == "object" && e?.nombre ? e.nombre : "Valor", typeof e == "object" ? e?.valor : e]] };
  if (t === "torta" || t === "dona" || t === "treemap") {
    const o = Array.isArray(e) ? e : [];
    return { cab: ["Nombre", "Valor"], filas: o.map((l) => [l.nombre, l.valor]) };
  }
  if (t === "mapa-calor") return { cab: ["Fila", "Columna", "Valor"], filas: (e?.valores ?? []).map(([o, l, p]) => [e.y?.[l] ?? l, e.x?.[o] ?? o, p]) };
  if (t === "sankey") return { cab: ["Origen", "Destino", "Valor"], filas: (e?.enlaces ?? []).map((o) => [o.origen, o.destino, o.valor]) };
  const a = x(e);
  return { cab: ["Categoría", ...a.series.map((o) => o.nombre)], filas: a.categorias.map((o, l) => [o, ...a.series.map((p) => p.valores[l] ?? "")]) };
}
function W(t, e) {
  const a = (n) => E(Number(n), t.formato) + (t.unidad && t.formato !== "cop" && t.formato !== "porcentaje" ? " " + t.unidad : ""), o = t.oscuro ? "#97A1B0" : "#6B7482", l = t.oscuro ? "#081A2C" : "#FFFFFF", p = t.titulo ? t.subtitulo ? 58 : 38 : 12, B = t.leyenda && t.leyendaPosicion === "arriba", g = t.leyenda && t.leyendaPosicion === "abajo", v = t.leyenda && t.leyendaPosicion === "derecha", i = {
    color: t.colores,
    animation: t.animacion,
    animationDuration: 700,
    animationEasing: "cubicOut",
    aria: { enabled: !0, decal: { show: t.patrones } },
    title: t.titulo ? { text: t.titulo, subtext: t.subtitulo || void 0, left: 0, top: 0 } : void 0,
    legend: t.leyenda ? { type: "scroll", icon: "roundRect", itemWidth: 12, itemHeight: 8, ...v ? { orient: "vertical", right: 0, top: "middle" } : g ? { bottom: 0 } : { top: t.titulo ? t.subtitulo ? 50 : 32 : 0, left: 0 } } : void 0,
    tooltip: { confine: !0 }
  }, F = { left: 8, right: v ? 130 : 16, top: p + (B ? 30 : 0), bottom: g ? 40 : 8, containLabel: !0 }, h = t.tipo;
  if (h === "barras" || h === "barras-horizontal" || h === "lineas" || h === "area") {
    const n = x(e), r = h === "barras-horizontal", s = h === "barras" || r, m = { type: "category", data: n.categorias, axisTick: { alignWithLabel: !0 }, name: t.tituloEjeX || void 0, nameLocation: "middle", nameGap: 32, inverse: r, boundaryGap: s }, d = { type: "value", axisLabel: { formatter: (c) => E(c, t.formato === "cop" ? "cop" : t.formato) }, name: t.tituloEjeY || void 0, nameGap: 12 };
    i.grid = F, i.xAxis = r ? d : m, i.yAxis = r ? m : d, i.tooltip = { ...i.tooltip, trigger: "axis", axisPointer: { type: s ? "shadow" : "line" }, valueFormatter: a }, i.series = n.series.map((c) => s ? { name: c.nombre, type: "bar", data: t.resaltar ? c.valores.map((f, S) => ({ value: f, itemStyle: n.categorias[S] === t.resaltar ? void 0 : { opacity: 0.3 } })) : c.valores, stack: t.apilado ? "total" : void 0, barMaxWidth: 40, itemStyle: { borderRadius: r ? [0, 4, 4, 0] : [4, 4, 0, 0] }, emphasis: { focus: "series" }, label: { show: t.etiquetas, position: t.apilado ? "inside" : r ? "right" : "top", formatter: (f) => a(f.value), fontFamily: u, fontSize: 11, color: t.apilado ? "#fff" : o } } : { name: c.nombre, type: "line", data: c.valores, smooth: t.suave, symbolSize: 7, showSymbol: n.categorias.length <= 24, lineWidth: 2.5, lineStyle: { width: 2.5 }, stack: h === "area" && t.apilado ? "total" : void 0, areaStyle: h === "area" ? { opacity: 0.16 } : void 0, emphasis: { focus: "series" }, label: { show: t.etiquetas, position: "top", formatter: (f) => a(f.value), fontFamily: u, fontSize: 11, color: o } });
  } else if (h === "torta" || h === "dona") {
    const n = Array.isArray(e) ? e : [], r = h === "dona", s = N(n.map((m) => Number(m.valor)));
    i.tooltip = { ...i.tooltip, trigger: "item", valueFormatter: a }, i.series = [{ type: "pie", radius: r ? ["48%", "72%"] : ["0%", "72%"], center: [v ? "38%" : "50%", g ? "48%" : "54%"], data: n.map((m) => ({ name: m.nombre, value: Number(m.valor), ...t.resaltar && m.nombre !== t.resaltar ? { itemStyle: { opacity: 0.3 } } : {} })), itemStyle: { borderColor: l, borderWidth: 2, borderRadius: r ? 6 : 4 }, label: { show: t.etiquetas, formatter: `{b}
{d}%`, fontFamily: u, fontSize: 11, color: t.oscuro ? "#E3E8EF" : "#252B36" }, labelLine: { show: t.etiquetas }, emphasis: { scaleSize: 6 } }], r && (i.graphic = [{ type: "group", left: v ? "25%" : "center", top: g ? "43%" : "50%", children: [
      { type: "text", style: { text: t.centro || a(s), textAlign: "center", textVerticalAlign: "bottom", fontSize: 24, fontWeight: 800, fontFamily: u, fill: t.oscuro ? "#fff" : "#161A22" } },
      { type: "text", style: { text: t.centro ? "" : "Total", textAlign: "center", textVerticalAlign: "top", y: 2, fontSize: 12, fontFamily: u, fill: o } }
    ] }]);
  } else if (h === "radar") {
    const n = x(e), r = Math.max(1, ...n.series.flatMap((s) => s.valores)) * 1.15;
    i.radar = { indicator: n.categorias.map((s) => ({ name: s, max: r })), radius: "64%", center: [v ? "40%" : "50%", g ? "48%" : "56%"] }, i.tooltip = { ...i.tooltip, trigger: "item" }, i.series = [{ type: "radar", symbolSize: 5, lineStyle: { width: 2 }, data: n.series.map((s) => ({ name: s.nombre, value: s.valores, areaStyle: { opacity: 0.14 } })) }];
  } else if (h === "gauge") {
    const n = Number(typeof e == "object" && e !== null ? e.valor : e), r = typeof e == "object" && e ? e.nombre ?? "" : "", s = t.min, m = t.max, d = (n - s) / (m - s || 1), c = t.umbrales && t.umbrales.length ? t.umbrales : null, f = c ? (c.find(([S]) => d <= S) ?? c[c.length - 1])[1] : t.colores[0];
    i.tooltip = void 0, i.legend = void 0, i.series = [{
      type: "gauge",
      min: s,
      max: m,
      startAngle: 210,
      endAngle: -30,
      radius: "88%",
      center: ["50%", t.titulo ? "62%" : "58%"],
      progress: { show: !0, width: 18, roundCap: !0, itemStyle: { color: f } },
      pointer: { show: !1 },
      axisLine: { roundCap: !0, lineStyle: { width: 18, color: [[1, t.oscuro ? "#12395C" : "#E3E8EF"]] } },
      axisTick: { show: !1 },
      splitLine: { show: !1 },
      axisLabel: { show: !1 },
      anchor: { show: !1 },
      title: { offsetCenter: [0, "44%"], fontSize: 13, color: o, fontFamily: u },
      detail: { valueAnimation: !0, fontSize: 36, fontWeight: 800, fontFamily: u, offsetCenter: [0, "8%"], color: t.oscuro ? "#fff" : "#161A22", formatter: (S) => a(S) },
      data: [{ value: n, name: r }]
    }];
  } else if (h === "mapa-calor") {
    const n = e?.x ?? [], r = e?.y ?? [], s = e?.valores ?? [], m = s.map((c) => c[2]), d = t.colores.length >= 3 && JSON.stringify(t.colores) !== JSON.stringify(y.institucional.colores) ? t.colores : ["#EAF4FA", "#9FD7E5", "#00B7D9", "#0071BB", "#0B2239"];
    i.grid = { ...F, bottom: 84 }, i.legend = void 0, i.xAxis = { type: "category", data: n, splitArea: { show: !1 }, axisTick: { show: !1 } }, i.yAxis = { type: "category", data: r, inverse: !0, splitArea: { show: !1 }, axisTick: { show: !1 } }, i.visualMap = { min: Math.min(...m), max: Math.max(...m), calculable: !1, orient: "horizontal", left: "center", bottom: 8, itemWidth: 14, itemHeight: 160, textGap: 10, inRange: { color: d }, formatter: (c) => a(c) }, i.tooltip = { ...i.tooltip, trigger: "item", formatter: (c) => `<b>${r[c.value[1]]}</b> · ${n[c.value[0]]}<br>${a(c.value[2])}` }, i.series = [{ type: "heatmap", data: s, label: { show: t.etiquetas, formatter: (c) => a(c.value[2]), fontFamily: u, fontSize: 11 }, itemStyle: { borderColor: l, borderWidth: 2, borderRadius: 3 }, emphasis: { itemStyle: { borderColor: t.oscuro ? "#fff" : "#081A2C", borderWidth: 2 } } }];
  } else if (h === "treemap") {
    const n = t.colores.length ? t.colores : y.institucional.colores, r = (s, m) => ({ name: s.nombre, value: s.valor, label: { color: k(m) }, itemStyle: { color: m }, children: s.hijos ? s.hijos.map((d) => r(d, m)) : void 0 });
    i.legend = void 0, i.tooltip = { ...i.tooltip, trigger: "item", valueFormatter: a }, i.series = [{ type: "treemap", top: p, left: 0, right: 0, bottom: 0, roam: !1, nodeClick: !1, breadcrumb: { show: !1 }, data: (Array.isArray(e) ? e : []).map((s, m) => r(s, n[m % n.length])), label: { show: !0, formatter: (s) => `${s.name}
${a(s.value)}`, fontFamily: u, fontWeight: 600, fontSize: 12 }, upperLabel: { show: !1 }, itemStyle: { borderColor: l, borderWidth: 2, gapWidth: 2, borderRadius: 4 }, levels: [{ itemStyle: { borderWidth: 0, gapWidth: 3 } }, { colorSaturation: [0.55, 0.85], itemStyle: { borderColorSaturation: 0.7, gapWidth: 2, borderWidth: 2 } }] }];
  } else if (h === "sankey") {
    const n = (e?.nodos ?? []).map((r) => typeof r == "string" ? r : r.nombre);
    i.legend = void 0, i.tooltip = { ...i.tooltip, trigger: "item", valueFormatter: a }, i.series = [{ type: "sankey", top: p, left: 8, right: 90, bottom: 8, nodeWidth: 16, nodeGap: 12, emphasis: { focus: "adjacency" }, data: n.map((r) => ({ name: r })), links: (e?.enlaces ?? []).map((r) => ({ source: r.origen, target: r.destino, value: Number(r.valor) })), lineStyle: { color: "gradient", curveness: 0.5, opacity: 0.45 }, label: { fontFamily: u, fontWeight: 600, fontSize: 12, color: t.oscuro ? "#E3E8EF" : "#252B36" }, itemStyle: { borderWidth: 0 } }];
  }
  return i;
}
const _ = { fromAttribute: (t) => {
  try {
    return t ? JSON.parse(t) : void 0;
  } catch {
    return;
  }
}, toAttribute: (t) => JSON.stringify(t) };
let L = null;
function T() {
  return L ??= import("./echarts-setup-CyS0U4SK.js");
}
class $ extends j {
  constructor() {
    if (super(), this._chart = null, this._tema = "", this._t = 0, this.tipo = "barras", this.colores = "institucional", this.titulo = "", this.subtitulo = "", this.leyenda = !0, this.leyendaPosicion = "arriba", this.etiquetas = !1, this.apilado = !1, this.suave = !1, this.formato = "numero", this.unidad = "", this.tituloEjeX = "", this.tituloEjeY = "", this.resaltar = "", this.min = 0, this.max = 100, this.patrones = !1, this.animacion = !0, this.tema = "claro", this.altura = 360, this.centro = "", this.descripcion = "", this._listo = !1, this._error = "", Object.prototype.hasOwnProperty.call(this, "config")) {
      const e = this.config;
      delete this.config, this.config = e;
    }
  }
  static {
    this.properties = {
      tipo: { type: String, reflect: !0 },
      datos: { converter: _ },
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
      umbrales: { converter: _ },
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
    return w;
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
        const a = await T(), o = this.tema === "oscuro" ? "gob-oscuro" : "gob";
        this._chart && this._tema !== o && (this._chart.dispose(), this._chart = null), this._chart || (this._chart = a.init(e, o, { renderer: "canvas" }), this._tema = o, this._ro?.observe(e), this._chart.on("click", (l) => this.dispatchEvent(new CustomEvent("gob-grafica-click", { detail: { nombre: l.name, serie: l.seriesName, valor: l.value, indice: l.dataIndex, tipo: l.seriesType }, bubbles: !0, composed: !0 }))), this._chart.on("finished", () => {
          this._listo || (this._listo = !0, this.dispatchEvent(new CustomEvent("gob-grafica-lista", { bubbles: !0, composed: !0 })));
        })), this._chart.setOption(W(this._cfg(), this.datos), { notMerge: !0 }), this._chart.resize(), this._error = "";
      } catch (a) {
        this._error = String(a.message || a);
      }
  }
  // ---- exportación
  /** Descarga la gráfica como PNG. */
  descargarPNG(e = "grafica", a = 2) {
    if (!this._chart) return;
    const o = this._chart.getDataURL({ type: "png", pixelRatio: a, backgroundColor: this.tema === "oscuro" ? "#081A2C" : "#FFFFFF" }), l = document.createElement("a");
    l.href = o, l.download = e + ".png", l.click();
  }
  /** Devuelve los datos como CSV (separador «;», UTF-8 con BOM al descargar). */
  csv() {
    const e = C(this.tipo, this.datos);
    return [e.cab, ...e.filas].map((a) => a.map((o) => `"${String(o).replace(/"/g, '""')}"`).join(";")).join(`
`);
  }
  descargarCSV(e = "datos") {
    const a = new Blob(["\uFEFF" + this.csv()], { type: "text/csv;charset=utf-8" }), o = document.createElement("a");
    o.href = URL.createObjectURL(a), o.download = e + ".csv", o.click(), setTimeout(() => URL.revokeObjectURL(o.href), 1e3);
  }
  imprimir() {
    window.print();
  }
  render() {
    const e = C(this.tipo, this.datos), a = [this.titulo || w[this.tipo] || "Gráfica", this.descripcion].filter(Boolean).join(". ");
    return b`<div class="wrap" part="grafica">
      ${this._error ? b`<div class="err" role="alert">⚠ ${this._error}</div>` : A}
      ${!this._listo && !this._error ? b`<div class="cargando" role="status">Cargando gráfica…</div>` : A}
      <div class="ch" part="lienzo" role="img" aria-label=${a} style="height:${this.altura}px"></div>
      <table class="sr"><caption>${a}</caption><thead><tr>${e.cab.map((o) => b`<th>${o}</th>`)}</tr></thead>
        <tbody>${e.filas.map((o) => b`<tr>${o.map((l) => b`<td>${l}</td>`)}</tr>`)}</tbody></table></div>`;
  }
  static {
    this.styles = z`
    :host { display: block; position: relative; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); }
    .wrap { position: relative; } .ch { width: 100%; min-height: 200px; }
    .cargando, .err { position: absolute; inset: 0; display: grid; place-items: center; font-size: .85rem; color: #6B7482; pointer-events: none; } .err { color: #B20028; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media print { .ch { break-inside: avoid; } }
  `;
  }
}
customElements.get("gob-grafica") || customElements.define("gob-grafica", $);
export {
  $ as G,
  R as t
};

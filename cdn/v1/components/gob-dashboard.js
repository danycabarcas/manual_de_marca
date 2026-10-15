import { i as S, b as m, A as $, a as B } from "../chunks/lit-element-B3qO7mJS.js";
import { i as y } from "../chunks/icono-CX7ui34k.js";
import "./gob-kpi.js";
import "../chunks/gob-grafica-BQfc8u2Y.js";
import "./gob-tabla.js";
import "./gob-mapa-magdalena.js";
import "./gob-mensajes.js";
const x = { fromAttribute: (d) => {
  try {
    return d ? JSON.parse(d) : void 0;
  } catch {
    return;
  }
}, toAttribute: (d) => JSON.stringify(d) }, F = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
function g(d, t) {
  const [e, i] = t.split(":"), r = d[e];
  if (r == null) return "";
  if (!i) return String(r);
  const a = new Date(r);
  if (isNaN(+a)) return String(r);
  const o = a.getFullYear(), l = a.getMonth() + 1;
  return i === "mes" ? `${o}-${String(l).padStart(2, "0")}` : i === "anio" ? String(o) : i === "trimestre" ? `${o}-T${Math.ceil(l / 3)}` : i === "dia" ? String(r).slice(0, 10) : String(r);
}
function u(d, t) {
  return d.split(":")[1] === "mes" && /^\d{4}-\d{2}$/.test(t) ? `${F[+t.slice(5) - 1]} ${t.slice(0, 4)}` : t;
}
function h(d, t, e) {
  if (!t || t === "conteo") return d.length;
  if (t === "distintos") return new Set(d.map((r) => r[e])).size;
  const i = d.map((r) => Number(r[e])).filter(Number.isFinite);
  return i.length ? t === "suma" ? i.reduce((r, a) => r + a, 0) : t === "promedio" ? i.reduce((r, a) => r + a, 0) / i.length : t === "max" ? Math.max(...i) : Math.min(...i) : 0;
}
function k(d, t) {
  const e = /* @__PURE__ */ new Map();
  for (const i of d) {
    const r = g(i, t);
    r !== "" && (e.get(r) ?? e.set(r, []).get(r)).push(i);
  }
  return e;
}
class M extends S {
  constructor() {
    if (super(), this._labels = /* @__PURE__ */ new Map(), this.titulo = "", this.subtitulo = "", this.registros = [], this.filtros = [], this.widgets = [], this.tema = "claro", this.colores = "institucional", this._f = {}, Object.prototype.hasOwnProperty.call(this, "config")) {
      const t = this.config;
      delete this.config, this.config = t;
    }
  }
  static {
    this.properties = {
      titulo: { type: String },
      subtitulo: { type: String },
      registros: { converter: x },
      filtros: { converter: x },
      widgets: { converter: x },
      tema: { type: String, reflect: !0 },
      colores: { converter: { fromAttribute: (t) => t ?? "institucional" } },
      _f: { state: !0 }
    };
  }
  set config(t) {
    Object.assign(this, t);
  }
  get config() {
    return {};
  }
  updated(t) {
    t.has("_f") && this.dispatchEvent(new CustomEvent("gob-dashboard-filtro", { detail: { filtros: { ...this._f }, total: this._filtrar().length }, bubbles: !0, composed: !0 }));
  }
  _filtrar(t) {
    const e = Object.entries(this._f).filter(([i, r]) => r !== "" && i !== t);
    return e.length ? this.registros.filter((i) => e.every(([r, a]) => g(i, r) === a)) : this.registros;
  }
  _base(t, e) {
    const i = Object.entries(t.donde ?? {}), r = this._filtrar(e);
    return i.length ? r.filter((a) => i.every(([o, l]) => g(a, o) === l)) : r;
  }
  _setF(t, e) {
    this._f = { ...this._f, [t]: e };
  }
  _toggle(t, e) {
    this._setF(t, this._f[t] === e ? "" : e);
  }
  reiniciar() {
    this._f = {};
  }
  _opciones(t) {
    return t.opciones ? t.opciones.map((e) => typeof e == "string" ? { valor: e, etiqueta: u(t.campo, e) } : e) : [...new Set(this.registros.map((e) => g(e, t.campo)).filter(Boolean))].sort((e, i) => e.localeCompare(i, "es", { numeric: !0 })).map((e) => ({ valor: e, etiqueta: u(t.campo, e) }));
  }
  csv() {
    const t = this._filtrar();
    if (!t.length) return "";
    const e = Object.keys(t[0]);
    return [e, ...t.map((i) => e.map((r) => String(i[r] ?? "")))].map((i) => i.map((r) => `"${r.replace(/"/g, '""')}"`).join(";")).join(`
`);
  }
  descargarCSV(t = "datos-filtrados") {
    const e = new Blob(["\uFEFF" + this.csv()], { type: "text/csv;charset=utf-8" }), i = document.createElement("a");
    i.href = URL.createObjectURL(e), i.download = t + ".csv", i.click(), setTimeout(() => URL.revokeObjectURL(i.href), 1e3);
  }
  imprimir() {
    window.print();
  }
  // ------------------------------------------------------------------ construcción de cada widget
  _ordenar(t, e, i) {
    return e === "valor-desc" ? t.sort((r, a) => a[1] - r[1]) : e === "valor-asc" ? t.sort((r, a) => r[1] - a[1]) : e === "nombre" ? t.sort((r, a) => u(i, r[0]).localeCompare(u(i, a[0]), "es", { numeric: !0 })) : /:(mes|anio|trimestre|dia)$/.test(i) && t.sort((r, a) => r[0].localeCompare(a[0])), t;
  }
  _grafica(t, e) {
    const i = this._base(t, t.agrupar), r = k(i, t.agrupar ?? ""), a = t.agrupar ?? "", o = /* @__PURE__ */ new Map(), l = t.grafica ?? "barras";
    let s, f = "";
    if (l === "gauge") s = { valor: h(this._base(t), t.medida, t.campo), nombre: t.titulo ?? "" };
    else if ((l === "mapa-calor" || l === "sankey") && t.serie) {
      const c = [...r.keys()].sort(), b = [...new Set(i.map((n) => g(n, t.serie)))].filter(Boolean).sort();
      l === "mapa-calor" ? s = { x: c.map((n) => u(a, n)), y: b, valores: b.flatMap((n, p) => c.map((v, _) => [_, p, h((r.get(v) ?? []).filter((E) => g(E, t.serie) === n), t.medida, t.campo)])) } : s = { nodos: [...c, ...b.filter((n) => !c.includes(n))], enlaces: c.flatMap((n) => b.map((p) => ({ origen: n, destino: p, valor: h((r.get(n) ?? []).filter((v) => g(v, t.serie) === p), t.medida, t.campo) })).filter((p) => p.valor > 0)) };
    } else {
      let c = [...r].map(([n, p]) => [n, h(p, t.medida, t.campo)]);
      if (c = this._ordenar(c, t.orden, a), t.limite && (c = c.slice(0, t.limite)), c.forEach(([n]) => o.set(u(a, n), n)), this._labels.set(e, o), ["torta", "dona", "treemap"].includes(l)) s = c.map(([n, p]) => ({ nombre: u(a, n), valor: p }));
      else if (t.serie) {
        const n = [...new Set(i.map((p) => g(p, t.serie)))].filter(Boolean).sort();
        s = { categorias: c.map(([p]) => u(a, p)), series: n.map((p) => ({ nombre: p, valores: c.map(([v]) => h((r.get(v) ?? []).filter((_) => g(_, t.serie) === p), t.medida, t.campo)) })) };
      } else s = { categorias: c.map(([n]) => u(a, n)), series: [{ nombre: t.titulo || "Valor", valores: c.map(([, n]) => n) }] };
      const b = this._f[a];
      b && (f = u(a, b));
    }
    return { datos: s, resaltar: f };
  }
  _kpi(t) {
    const e = this._base(t), i = h(e, t.medida, t.campo);
    let r, a;
    if (t.serie) {
      const o = k(e, t.serie), l = [...o.keys()].sort();
      this._sinParcial(l, t.serie), r = l.map((s) => h(o.get(s), t.medida, t.campo)), r.length >= 2 && r.at(-2) && (a = Math.round((r.at(-1) - r.at(-2)) / Math.abs(r.at(-2)) * 1e3) / 10);
    }
    return { valor: i, serie: r, delta: a };
  }
  /** Si el último mes está incompleto (los datos llegan hasta mitad de mes) se omite de la serie para no mostrar caídas falsas. */
  _sinParcial(t, e) {
    const [i, r] = e.split(":");
    if (r !== "mes" || !t.length) return;
    let a = "";
    for (const s of this.registros) {
      const f = String(s[i] ?? "").slice(0, 10);
      f > a && (a = f);
    }
    if (!a) return;
    const o = /* @__PURE__ */ new Date(a + "T00:00:00"), l = new Date(o.getFullYear(), o.getMonth() + 1, 0).getDate();
    g({ [i]: a }, e) === t.at(-1) && o.getDate() < l - 1 && t.pop();
  }
  _mapa(t) {
    const e = this._base(t, t.agrupar ?? "codigo"), i = k(e, t.agrupar ?? "codigo"), r = {};
    for (const [a, o] of i) r[a] = h(o, t.medida, t.campo);
    return r;
  }
  _alAgrupar(t, e, i) {
    if (e.filtrar === !1 || e.serie) return;
    const r = this._labels.get(i)?.get(t.detail.nombre);
    r != null && this._toggle(e.agrupar ?? "", r);
  }
  _widget(t, e) {
    const i = t.id ?? "w" + e, r = this.tema === "oscuro", a = Math.max(1, Math.min(12, t.col ?? 6));
    let o;
    switch (t.tipo) {
      case "kpi": {
        const s = this._kpi(t);
        o = m`<gob-kpi .etiqueta=${t.titulo ?? ""} .valor=${s.valor} .formato=${t.formato ?? "numero"} .unidad=${t.unidad ?? ""} .icono=${t.icono ?? ""} .color=${t.color ?? "primario"} .serie=${s.serie} .delta=${s.delta} .meta=${t.meta} .buenoSube=${t.buenoSube ?? !0} .ayuda=${t.ayuda ?? ""} .oscuro=${r}></gob-kpi>`;
        break;
      }
      case "grafica": {
        const s = this._grafica(t, i), f = this.tema === "oscuro" ? "oscuro" : "claro";
        o = m`<gob-grafica .tipo=${t.grafica ?? "barras"} .datos=${s.datos} .colores=${t.colores ?? this.colores} .altura=${t.alto ?? 300} .formato=${t.formato ?? "numero"} .unidad=${t.unidad ?? ""} .etiquetas=${!!t.etiquetas} .apilado=${!!t.apilado} .suave=${!!t.suave}
          .leyenda=${t.leyenda ?? (!!t.serie || ["torta", "dona"].includes(t.grafica ?? ""))} .leyendaPosicion=${t.leyendaPosicion ?? "abajo"} .umbrales=${t.umbrales} .min=${t.min ?? 0} .max=${t.max ?? 100} .resaltar=${s.resaltar} .tema=${f}
          @gob-grafica-click=${(c) => this._alAgrupar(c, t, i)}></gob-grafica>`;
        break;
      }
      case "mapa":
        o = m`<gob-mapa-magdalena .modo=${"coropleta"} .datos=${this._mapa(t)} .rampa=${t.rampa ?? "azul"} .etiquetas=${t.mapaEtiquetas ?? "ninguna"} .formato=${t.formato ?? "numero"} .unidad=${t.unidad ?? ""} .leyendaTitulo=${t.leyendaTitulo ?? ""} .clic=${"evento"} .detalle=${"bajo"} .seleccion=${this._f[t.agrupar ?? "codigo"] ?? ""} .efectos=${["entrada", "hormigas"]} .tema=${this.tema}
          @gob-municipio-click=${(s) => {
          t.filtrar !== !1 && this._toggle(t.agrupar ?? "codigo", s.detail.codigo);
        }}></gob-mapa-magdalena>`;
        break;
      case "tabla": {
        const s = this._base(t), f = t.limite ? s.slice(0, t.limite) : s;
        o = m`<gob-tabla .columnas=${t.columnas ?? []} .datos=${f} .llave=${"id"} .tema=${this.tema} .tamanoPagina=${8} .busqueda=${!0} .exportar=${!0} .config=${t.opciones ?? {}}></gob-tabla>`;
        break;
      }
      case "alerta":
        o = m`<gob-alerta .tipo=${t.tono ?? "info"} .titulo=${t.titulo ?? ""}>${t.contenido}</gob-alerta>`;
        break;
      default:
        o = m`<p class="tx">${t.contenido}</p>`;
    }
    const l = !["kpi", "tabla", "alerta"].includes(t.tipo);
    return m`<section class="w ${l ? "c" : ""} t-${t.tipo}" style="--n:${a}" aria-label=${t.titulo ?? t.tipo}>${l && t.titulo ? m`<header><h3>${t.titulo}</h3>${t.descripcion ? m`<p>${t.descripcion}</p>` : $}</header>` : $}${t.tipo === "tabla" && t.titulo ? m`<header class="ht"><h3>${t.titulo}</h3></header>` : $}${o}</section>`;
  }
  render() {
    const t = Object.entries(this._f).filter(([, e]) => e !== "");
    return m`<div class="d" part="tablero">
      <header class="h"><div><h2>${this.titulo}</h2>${this.subtitulo ? m`<p>${this.subtitulo}</p>` : $}</div>
        <div class="ac"><button type="button" class="bt" @click=${() => this.descargarCSV()}>${y("descargar", 16)}<span>CSV</span></button><button type="button" class="bt" @click=${() => this.imprimir()}>${y("imprimir", 16)}<span>Imprimir</span></button></div></header>
      ${this.filtros.length ? m`<div class="fl" role="group" aria-label="Filtros del tablero">${this.filtros.map((e) => m`<label><span>${e.etiqueta ?? e.campo}</span><select @change=${(i) => this._setF(e.campo, i.target.value)}>
        <option value="">${e.todos ?? "Todos"}</option>${this._opciones(e).map((i) => m`<option value=${i.valor} .selected=${this._f[e.campo] === i.valor}>${i.etiqueta}</option>`)}</select></label>`)}
        ${t.length ? m`<button type="button" class="bt lim" @click=${() => this.reiniciar()}>${y("filtro-quitar", 16)}<span>Restablecer</span></button>` : $}</div>` : $}
      ${t.length ? m`<div class="ch" aria-live="polite">${t.map(([e, i]) => m`<span class="chip">${this.filtros.find((r) => r.campo === e)?.etiqueta ?? e}: <b>${u(e, i)}</b><button type="button" aria-label=${`Quitar filtro ${e}`} @click=${() => this._setF(e, "")}>${y("cerrar", 12)}</button></span>`)}<span class="rs">${this._filtrar().length} de ${this.registros.length} registros</span></div>` : $}
      <div class="g">${this.widgets.map((e, i) => this._widget(e, i))}</div></div>`;
  }
  static {
    this.styles = B`
    :host { display: block; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); color: #252B36; container-type: inline-size; } :host([tema='oscuro']) { color: #E3E8EF; background: #051220; padding: 1rem; border-radius: 14px; } svg { display: block; }
    .h { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: .9rem; } h2 { margin: 0; font-size: 1.5rem; font-weight: 800; letter-spacing: -.01em; color: #161A22; } :host([tema='oscuro']) h2 { color: #fff; } .h p { margin: .15rem 0 0; color: #6B7482; font-size: .9rem; }
    .ac { display: flex; gap: .4rem; } .bt { display: inline-flex; align-items: center; gap: .4rem; border: 1px solid #CBD2DC; background: #fff; border-radius: 8px; padding: .45rem .75rem; font: 600 .8125rem inherit; font-family: inherit; color: #252B36; cursor: pointer; } .bt:hover { background: #F1F4F8; } .bt:focus-visible, select:focus-visible, .chip button:focus-visible { outline: 2px solid #0071BB; outline-offset: 2px; } :host([tema='oscuro']) .bt { background: #0B2239; border-color: #1B4B75; color: #E3E8EF; }
    .fl { display: flex; flex-wrap: wrap; gap: .75rem; align-items: end; padding: .8rem 1rem; background: rgba(255,255,255,.72); backdrop-filter: blur(10px); border: 1px solid #E3E8EF; border-radius: 12px; margin-bottom: .75rem; } :host([tema='oscuro']) .fl { background: rgba(11,34,57,.7); border-color: #12395C; }
    .fl label { display: grid; gap: .2rem; font-size: .72rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #4F5866; } :host([tema='oscuro']) .fl label { color: #97A1B0; } select { font: 500 .85rem inherit; font-family: inherit; padding: .45rem .6rem; border: 1px solid #CBD2DC; border-radius: 8px; background: #fff; color: #252B36; min-width: 10rem; text-transform: none; letter-spacing: 0; } :host([tema='oscuro']) select { background: #0B2239; color: #E3E8EF; border-color: #1B4B75; }
    .ch { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; margin-bottom: .75rem; font-size: .8rem; } .chip { display: inline-flex; align-items: center; gap: .35rem; background: #D6E8F4; color: #003D66; border-radius: 99px; padding: .2rem .35rem .2rem .7rem; } .chip button { border: 0; background: rgba(0,61,102,.12); border-radius: 50%; width: 1.3rem; height: 1.3rem; display: grid; place-items: center; cursor: pointer; color: inherit; padding: 0; } .rs { color: #6B7482; margin-left: .4rem; }
    .g { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem; } .w { grid-column: span var(--n); min-width: 0; } .w.c { background: #fff; border: 1px solid #E3E8EF; border-radius: 12px; padding: 1rem 1.1rem; box-shadow: 0 1px 2px rgba(8,26,44,.06); } :host([tema='oscuro']) .w.c { background: #0B2239; border-color: #12395C; }
    .w header h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #161A22; } :host([tema='oscuro']) .w header h3 { color: #fff; } .w header p { margin: .15rem 0 .4rem; font-size: .8rem; color: #6B7482; } .ht h3 { margin: 0 0 .5rem; font-size: 1rem; font-weight: 700; } .tx { margin: 0; line-height: 1.6; }
    @container (max-width: 900px) { .w { grid-column: span 12; } .w.t-kpi { grid-column: span 6; } } @container (max-width: 520px) { .w.t-kpi { grid-column: span 12; } .h h2 { font-size: 1.25rem; } select { min-width: 8rem; } }
    @media print { .fl, .ac { display: none; } .w { break-inside: avoid; } :host { color: #000; } }`;
  }
}
customElements.get("gob-dashboard") || customElements.define("gob-dashboard", M);
export {
  M as GobDashboard,
  u as etiquetaClave,
  h as medir,
  g as valorCampo
};

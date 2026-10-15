const P = globalThis, B = P.ShadowRoot && (P.ShadyCSS === void 0 || P.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, R = /* @__PURE__ */ Symbol(), V = /* @__PURE__ */ new WeakMap();
let Y = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== R) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = V.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && V.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ot = (r) => new Y(typeof r == "string" ? r : r + "", void 0, R), Ht = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new Y(e, r, R);
}, ht = (r, t) => {
  if (B) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = P.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, k = B ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ot(e);
})(r) : r;
const { is: at, defineProperty: lt, getOwnPropertyDescriptor: ct, getOwnPropertyNames: dt, getOwnPropertySymbols: ut, getPrototypeOf: pt } = Object, z = globalThis, I = z.trustedTypes, $t = I ? I.emptyScript : "", mt = z.reactiveElementPolyfillSupport, b = (r, t) => r, D = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? $t : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, tt = (r, t) => !at(r, t), W = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: tt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let g = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = W) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && lt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = ct(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const l = i?.call(this);
      n?.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? W;
  }
  static _$Ei() {
    if (this.hasOwnProperty(b("elementProperties"))) return;
    const t = pt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(b("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(b("properties"))) {
      const e = this.properties, s = [...dt(e), ...ut(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(k(i));
    } else t !== void 0 && e.push(k(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ht(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : D).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : D;
      this._$Em = i;
      const l = o.fromAttribute(e, n.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? tt)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: o } = n, l = this[i];
        o !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, n, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[b("elementProperties")] = /* @__PURE__ */ new Map(), g[b("finalized")] = /* @__PURE__ */ new Map(), mt?.({ ReactiveElement: g }), (z.reactiveElementVersions ??= []).push("2.1.2");
const T = globalThis, q = (r) => r, H = T.trustedTypes, Z = H ? H.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, et = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, st = "?" + m, ft = `<${st}>`, A = document, S = () => A.createComment(""), C = (r) => r === null || typeof r != "object" && typeof r != "function", L = Array.isArray, _t = (r) => L(r) || typeof r?.[Symbol.iterator] == "function", O = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, J = /-->/g, K = />/g, f = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), G = /'/g, Q = /"/g, it = /^(?:script|style|textarea|title)$/i, rt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), Ut = rt(1), Ot = rt(2), v = /* @__PURE__ */ Symbol.for("lit-noChange"), u = /* @__PURE__ */ Symbol.for("lit-nothing"), X = /* @__PURE__ */ new WeakMap(), _ = A.createTreeWalker(A, 129);
function nt(r, t) {
  if (!L(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Z !== void 0 ? Z.createHTML(t) : t;
}
const At = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
  for (let l = 0; l < e; l++) {
    const h = r[l];
    let a, d, c = -1, p = 0;
    for (; p < h.length && (o.lastIndex = p, d = o.exec(h), d !== null); ) p = o.lastIndex, o === E ? d[1] === "!--" ? o = J : d[1] !== void 0 ? o = K : d[2] !== void 0 ? (it.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = f) : d[3] !== void 0 && (o = f) : o === f ? d[0] === ">" ? (o = i ?? E, c = -1) : d[1] === void 0 ? c = -2 : (c = o.lastIndex - d[2].length, a = d[1], o = d[3] === void 0 ? f : d[3] === '"' ? Q : G) : o === Q || o === G ? o = f : o === J || o === K ? o = E : (o = f, i = void 0);
    const $ = o === f && r[l + 1].startsWith("/>") ? " " : "";
    n += o === E ? h + ft : c >= 0 ? (s.push(a), h.slice(0, c) + et + h.slice(c) + m + $) : h + m + (c === -2 ? l : $);
  }
  return [nt(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class w {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, h = this.parts, [a, d] = At(t, e);
    if (this.el = w.createElement(a, s), _.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = _.nextNode()) !== null && h.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(et)) {
          const p = d[o++], $ = i.getAttribute(c).split(m), x = /([.?@])?(.*)/.exec(p);
          h.push({ type: 1, index: n, name: x[2], strings: $, ctor: x[1] === "." ? vt : x[1] === "?" ? yt : x[1] === "@" ? Et : U }), i.removeAttribute(c);
        } else c.startsWith(m) && (h.push({ type: 6, index: n }), i.removeAttribute(c));
        if (it.test(i.tagName)) {
          const c = i.textContent.split(m), p = c.length - 1;
          if (p > 0) {
            i.textContent = H ? H.emptyScript : "";
            for (let $ = 0; $ < p; $++) i.append(c[$], S()), _.nextNode(), h.push({ type: 2, index: ++n });
            i.append(c[p], S());
          }
        }
      } else if (i.nodeType === 8) if (i.data === st) h.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(m, c + 1)) !== -1; ) h.push({ type: 7, index: n }), c += m.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function y(r, t, e = r, s) {
  if (t === v) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = C(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = y(r, i._$AS(r, t.values), i, s)), t;
}
class gt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? A).importNode(e, !0);
    _.currentNode = i;
    let n = _.nextNode(), o = 0, l = 0, h = s[0];
    for (; h !== void 0; ) {
      if (o === h.index) {
        let a;
        h.type === 2 ? a = new M(n, n.nextSibling, this, t) : h.type === 1 ? a = new h.ctor(n, h.name, h.strings, this, t) : h.type === 6 && (a = new bt(n, this, t)), this._$AV.push(a), h = s[++l];
      }
      o !== h?.index && (n = _.nextNode(), o++);
    }
    return _.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = y(this, t, e), C(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== v && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : _t(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && C(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = w.createElement(nt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new gt(i, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = X.get(t.strings);
    return e === void 0 && X.set(t.strings, e = new w(t)), e;
  }
  k(t) {
    L(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new M(this.O(S()), this.O(S()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = q(t).nextSibling;
      q(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class U {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = y(this, t, e, 0), o = !C(t) || t !== this._$AH && t !== v, o && (this._$AH = t);
    else {
      const l = t;
      let h, a;
      for (t = n[0], h = 0; h < n.length - 1; h++) a = y(this, l[s + h], e, h), a === v && (a = this._$AH[h]), o ||= !C(a) || a !== this._$AH[h], a === u ? t = u : t !== u && (t += (a ?? "") + n[h + 1]), this._$AH[h] = a;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class vt extends U {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class yt extends U {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Et extends U {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = y(this, t, e, 0) ?? u) === v) return;
    const s = this._$AH, i = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class bt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    y(this, t);
  }
}
const St = T.litHtmlPolyfillSupport;
St?.(w, M), (T.litHtmlVersions ??= []).push("3.3.3");
const Ct = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = i = new M(t.insertBefore(S(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
const j = globalThis;
class F extends g {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ct(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return v;
  }
}
F._$litElement$ = !0, F.finalized = !0, j.litElementHydrateSupport?.({ LitElement: F });
const wt = j.litElementPolyfillSupport;
wt?.({ LitElement: F });
(j.litElementVersions ??= []).push("4.2.2");
const Dt = {
  azul: { nombre: "Azul institucional", colores: ["#EAF4FA", "#9FD7E5", "#00B7D9", "#0071BB", "#0B2239"] },
  cian: { nombre: "Cian → celeste", colores: ["#F0FBFD", "#9FD7E5", "#00B7D9", "#007A91", "#00364A"] },
  verde: { nombre: "Verde", colores: ["#F1F8F0", "#B7DBB1", "#69B75E", "#3F7A37", "#1E3F1B"] },
  amarillo: { nombre: "Amarillo → ocre", colores: ["#FFF8DB", "#FEC800", "#D9A800", "#A28034", "#4D3A12"] },
  rojo: { nombre: "Rojo (alertas)", colores: ["#FFE9EE", "#FF8FA8", "#F7003C", "#B20028", "#610011"] },
  violeta: { nombre: "Violeta", colores: ["#F2ECFB", "#B79DE6", "#5618BA", "#3F1288", "#20094A"] },
  divergente: { nombre: "Divergente rojo–azul", colores: ["#F7003C", "#FF8FA8", "#F1F4F8", "#9FD7E5", "#0071BB"] },
  gris: { nombre: "Neutra", colores: ["#F8FAFC", "#CBD2DC", "#97A1B0", "#4F5866", "#161A22"] }
}, Nt = {
  punto: { nombre: "Punto", d: "M12 6a6 6 0 1 0 0 12a6 6 0 0 0 0-12z" },
  cruz: { nombre: "Salud", d: "M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" },
  escuela: { nombre: "Educación", d: "M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm-6 9.2v4L12 20l6-3.8v-4L12 15.5 6 12.2z" },
  edificio: { nombre: "Edificio", d: "M5 21V5l9-2v6h5v12h-4v-4h-3v4H5zm3-12v2h2V9H8zm0 4v2h2v-2H8z" },
  alerta: { nombre: "Alerta", d: "M12 3 2 20h20L12 3zm-1 7h2v5h-2v-5zm0 6h2v2h-2v-2z" },
  gota: { nombre: "Agua", d: "M12 2.5S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5z" },
  estrella: { nombre: "Destacado", d: "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" },
  bandera: { nombre: "Bandera", d: "M6 3h2v18H6V3zm3 1 9 3-9 4V4z" },
  casa: { nombre: "Vivienda", d: "M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3z" },
  rayo: { nombre: "Energía", d: "M13 2 4 14h6l-1 8 9-12h-6l1-8z" },
  vehiculo: { nombre: "Vía", d: "M4 15V9l2-4h12l2 4v6h-2v2h-3v-2H9v2H6v-2H4zm3-5h10l-1-3H8l-1 3zm1 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" },
  persona: { nombre: "Personas", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z" },
  escudo: { nombre: "Seguridad", d: "M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z" }
};
function N(r) {
  const t = r.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [parseInt(e.slice(0, 2), 16), parseInt(e.slice(2, 4), 16), parseInt(e.slice(4, 6), 16)];
}
function Mt(r) {
  return "#" + r.map((t) => Math.max(0, Math.min(255, Math.round(t))).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function xt(r, t, e) {
  const s = N(r), i = N(t);
  return Mt(s.map((n, o) => n + (i[o] - n) * e));
}
function Pt(r, t) {
  if (r.length === 1) return r[0];
  const e = Math.max(0, Math.min(1, t)) * (r.length - 1), s = Math.min(r.length - 2, Math.floor(e));
  return xt(r[s], r[s + 1], e - s);
}
function Bt(r) {
  const [t, e, s] = N(r).map((n) => {
    const o = n / 255;
    return o <= 0.03928 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
  }), i = 0.2126 * t + 0.7152 * e + 0.0722 * s;
  return (i + 0.05) / 0.05 > 1.05 / (i + 0.05) ? "#1D1D1B" : "#FFFFFF";
}
function Rt(r, t, e, s) {
  const i = r.filter((a) => Number.isFinite(a)).sort((a, d) => a - d);
  if (!i.length) return [];
  const n = i[0], o = i[i.length - 1], l = [n];
  for (let a = 1; a < t; a++) l.push(s === "cuantiles" ? i[Math.min(i.length - 1, Math.floor(a / t * i.length))] : n + (o - n) * a / t);
  l.push(o);
  const h = [];
  for (let a = 0; a < t; a++) h.push({ desde: l[a], hasta: l[a + 1], color: Pt(e, t === 1 ? 0.5 : a / (t - 1)) });
  return h;
}
function Tt(r, t) {
  if (t.length) {
    for (let e = 0; e < t.length; e++) if (r <= t[e].hasta || e === t.length - 1) return t[e];
    return t.at(-1);
  }
}
function Lt(r, t) {
  if (!Number.isFinite(r)) return "—";
  const e = t === "compacto" ? { notation: "compact", maximumFractionDigits: 1 } : t === "cop" ? { style: "currency", currency: "COP", maximumFractionDigits: 0 } : t === "porcentaje" ? { style: "percent", maximumFractionDigits: 1 } : { maximumFractionDigits: 2 };
  return new Intl.NumberFormat("es-CO", e).format(r);
}
export {
  u as A,
  v as E,
  Nt as I,
  Dt as R,
  Ht as a,
  Ut as b,
  Rt as c,
  Tt as d,
  Lt as f,
  F as i,
  Bt as t,
  Ot as w
};

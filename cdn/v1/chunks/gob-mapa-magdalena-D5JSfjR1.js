const U = globalThis, W = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = /* @__PURE__ */ Symbol(), K = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (W && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const gt = (r) => new lt(typeof r == "string" ? r : r + "", void 0, Y), mt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, o, s) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + r[s + 1], r[0]);
  return new lt(e, r, Y);
}, $t = (r, t) => {
  if (W) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), o = U.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = e.cssText, r.appendChild(i);
  }
}, Z = W ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return gt(e);
})(r) : r;
const { is: bt, defineProperty: _t, getOwnPropertyDescriptor: yt, getOwnPropertyNames: vt, getOwnPropertySymbols: xt, getPrototypeOf: At } = Object, T = globalThis, Q = T.trustedTypes, wt = Q ? Q.emptyScript : "", Et = T.reactiveElementPolyfillSupport, C = (r, t) => r, q = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? wt : null;
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
} }, ct = (r, t) => !bt(r, t), tt = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: ct };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), T.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, i, e);
      o !== void 0 && _t(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: o, set: s } = yt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: o, set(n) {
      const h = o?.call(this);
      s?.call(this, n), this.requestUpdate(t, h, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...vt(e), ...xt(e)];
      for (const o of i) this.createProperty(o, e[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, o] of e) this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const o = this._$Eu(e, i);
      o !== void 0 && this._$Eh.set(o, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i) e.unshift(Z(o));
    } else t !== void 0 && e.push(Z(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, i);
    if (o !== void 0 && i.reflect === !0) {
      const s = (i.converter?.toAttribute !== void 0 ? i.converter : q).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(o) : this.setAttribute(o, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const s = i.getPropertyOptions(o), n = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : q;
      this._$Em = o;
      const h = n.fromAttribute(e, s.type);
      this[o] = h ?? this._$Ej?.get(o) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, o = !1, s) {
    if (t !== void 0) {
      const n = this.constructor;
      if (o === !1 && (s = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? ct)(s, e) || i.useDefault && i.reflect && s === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: o, wrapped: s }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), s !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, s] of i) {
        const { wrapped: n } = s, h = this[o];
        n !== !0 || this._$AL.has(o) || h === void 0 || this.C(o, void 0, s, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[C("elementProperties")] = /* @__PURE__ */ new Map(), E[C("finalized")] = /* @__PURE__ */ new Map(), Et?.({ ReactiveElement: E }), (T.reactiveElementVersions ??= []).push("2.1.2");
const X = globalThis, et = (r) => r, H = X.trustedTypes, it = H ? H.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ht = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + _, St = `<${dt}>`, x = document, B = () => x.createComment(""), z = (r) => r === null || typeof r != "object" && typeof r != "function", G = Array.isArray, kt = (r) => G(r) || typeof r?.[Symbol.iterator] == "function", O = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, st = />/g, y = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, nt = /"/g, pt = /^(?:script|style|textarea|title)$/i, ut = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), g = ut(1), f = ut(2), A = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), v = x.createTreeWalker(x, 129);
function ft(r, t) {
  if (!G(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Ct = (r, t) => {
  const e = r.length - 1, i = [];
  let o, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = k;
  for (let h = 0; h < e; h++) {
    const l = r[h];
    let c, a, d = -1, u = 0;
    for (; u < l.length && (n.lastIndex = u, a = n.exec(l), a !== null); ) u = n.lastIndex, n === k ? a[1] === "!--" ? n = ot : a[1] !== void 0 ? n = st : a[2] !== void 0 ? (pt.test(a[2]) && (o = RegExp("</" + a[2], "g")), n = y) : a[3] !== void 0 && (n = y) : n === y ? a[0] === ">" ? (n = o ?? k, d = -1) : a[1] === void 0 ? d = -2 : (d = n.lastIndex - a[2].length, c = a[1], n = a[3] === void 0 ? y : a[3] === '"' ? nt : rt) : n === nt || n === rt ? n = y : n === ot || n === st ? n = k : (n = y, o = void 0);
    const m = n === y && r[h + 1].startsWith("/>") ? " " : "";
    s += n === k ? l + St : d >= 0 ? (i.push(c), l.slice(0, d) + ht + l.slice(d) + _ + m) : l + _ + (d === -2 ? h : m);
  }
  return [ft(r, s + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class F {
  constructor({ strings: t, _$litType$: e }, i) {
    let o;
    this.parts = [];
    let s = 0, n = 0;
    const h = t.length - 1, l = this.parts, [c, a] = Ct(t, e);
    if (this.el = F.createElement(c, i), v.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (o = v.nextNode()) !== null && l.length < h; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const d of o.getAttributeNames()) if (d.endsWith(ht)) {
          const u = a[n++], m = o.getAttribute(d).split(_), $ = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: s, name: $[2], strings: m, ctor: $[1] === "." ? Bt : $[1] === "?" ? zt : $[1] === "@" ? Ft : j }), o.removeAttribute(d);
        } else d.startsWith(_) && (l.push({ type: 6, index: s }), o.removeAttribute(d));
        if (pt.test(o.tagName)) {
          const d = o.textContent.split(_), u = d.length - 1;
          if (u > 0) {
            o.textContent = H ? H.emptyScript : "";
            for (let m = 0; m < u; m++) o.append(d[m], B()), v.nextNode(), l.push({ type: 2, index: ++s });
            o.append(d[u], B());
          }
        }
      } else if (o.nodeType === 8) if (o.data === dt) l.push({ type: 2, index: s });
      else {
        let d = -1;
        for (; (d = o.data.indexOf(_, d + 1)) !== -1; ) l.push({ type: 7, index: s }), d += _.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const i = x.createElement("template");
    return i.innerHTML = t, i;
  }
}
function S(r, t, e = r, i) {
  if (t === A) return t;
  let o = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const s = z(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== s && (o?._$AO?.(!1), s === void 0 ? o = void 0 : (o = new s(r), o._$AT(r, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = o : e._$Cl = o), o !== void 0 && (t = S(r, o._$AS(r, t.values), o, i)), t;
}
class Mt {
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
    const { el: { content: e }, parts: i } = this._$AD, o = (t?.creationScope ?? x).importNode(e, !0);
    v.currentNode = o;
    let s = v.nextNode(), n = 0, h = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new R(s, s.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(s, l.name, l.strings, this, t) : l.type === 6 && (c = new Rt(s, this, t)), this._$AV.push(c), l = i[++h];
      }
      n !== l?.index && (s = v.nextNode(), n++);
    }
    return v.currentNode = x, o;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, o) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = S(this, t, e), z(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = F.createElement(ft(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === o) this._$AH.p(e);
    else {
      const s = new Mt(o, this), n = s.u(this.options);
      s.p(e), this.T(n), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new F(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, o = 0;
    for (const s of t) o === e.length ? e.push(i = new R(this.O(B()), this.O(B()), this, this.options)) : i = e[o], i._$AI(s), o++;
    o < e.length && (this._$AR(i && i._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = et(t).nextSibling;
      et(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, o, s) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, o) {
    const s = this.strings;
    let n = !1;
    if (s === void 0) t = S(this, t, e, 0), n = !z(t) || t !== this._$AH && t !== A, n && (this._$AH = t);
    else {
      const h = t;
      let l, c;
      for (t = s[0], l = 0; l < s.length - 1; l++) c = S(this, h[i + l], e, l), c === A && (c = this._$AH[l]), n ||= !z(c) || c !== this._$AH[l], c === p ? t = p : t !== p && (t += (c ?? "") + s[l + 1]), this._$AH[l] = c;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class zt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ft extends j {
  constructor(t, e, i, o, s) {
    super(t, e, i, o, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? p) === A) return;
    const i = this._$AH, o = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, s = t !== p && (i === p || o);
    o && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Rt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const Dt = X.litHtmlPolyfillSupport;
Dt?.(F, R), (X.litHtmlVersions ??= []).push("3.3.3");
const Pt = (r, t, e) => {
  const i = e?.renderBefore ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const s = e?.renderBefore ?? null;
    i._$litPart$ = o = new R(t.insertBefore(B(), s), s, void 0, e ?? {});
  }
  return o._$AI(r), o;
};
const J = globalThis;
let M = class extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Pt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
};
M._$litElement$ = !0, M.finalized = !0, J.litElementHydrateSupport?.({ LitElement: M });
const Ut = J.litElementPolyfillSupport;
Ut?.({ LitElement: M });
(J.litElementVersions ??= []).push("4.2.2");
const Ht = { CHILD: 2 }, Tt = (r) => (...t) => ({ _$litDirective$: r, values: t });
class jt {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
class I extends jt {
  constructor(t) {
    if (super(t), this.it = p, t.type !== Ht.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === p || t == null) return this._t = void 0, this.it = t;
    if (t === A) return t;
    if (typeof t != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.it) return this._t;
    this.it = t;
    const e = [t];
    return e.raw = e, this._t = { _$litType$: this.constructor.resultType, strings: e, values: [] };
  }
}
I.directiveName = "unsafeHTML", I.resultType = 1;
const Ot = Tt(I), N = {
  azul: { nombre: "Azul institucional", colores: ["#EAF4FA", "#9FD7E5", "#00B7D9", "#0071BB", "#0B2239"] },
  cian: { nombre: "Cian → celeste", colores: ["#F0FBFD", "#9FD7E5", "#00B7D9", "#007A91", "#00364A"] },
  verde: { nombre: "Verde", colores: ["#F1F8F0", "#B7DBB1", "#69B75E", "#3F7A37", "#1E3F1B"] },
  amarillo: { nombre: "Amarillo → ocre", colores: ["#FFF8DB", "#FEC800", "#D9A800", "#A28034", "#4D3A12"] },
  rojo: { nombre: "Rojo (alertas)", colores: ["#FFE9EE", "#FF8FA8", "#F7003C", "#B20028", "#610011"] },
  violeta: { nombre: "Violeta", colores: ["#F2ECFB", "#B79DE6", "#5618BA", "#3F1288", "#20094A"] },
  divergente: { nombre: "Divergente rojo–azul", colores: ["#F7003C", "#FF8FA8", "#F1F4F8", "#9FD7E5", "#0071BB"] },
  gris: { nombre: "Neutra", colores: ["#F8FAFC", "#CBD2DC", "#97A1B0", "#4F5866", "#161A22"] }
}, L = {
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
function V(r) {
  const t = r.replace("#", ""), e = t.length === 3 ? t.split("").map((i) => i + i).join("") : t;
  return [parseInt(e.slice(0, 2), 16), parseInt(e.slice(2, 4), 16), parseInt(e.slice(4, 6), 16)];
}
function Nt(r) {
  return "#" + r.map((t) => Math.max(0, Math.min(255, Math.round(t))).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function Lt(r, t, e) {
  const i = V(r), o = V(t);
  return Nt(i.map((s, n) => s + (o[n] - s) * e));
}
function qt(r, t) {
  if (r.length === 1) return r[0];
  const e = Math.max(0, Math.min(1, t)) * (r.length - 1), i = Math.min(r.length - 2, Math.floor(e));
  return Lt(r[i], r[i + 1], e - i);
}
function It(r) {
  const [t, e, i] = V(r).map((s) => {
    const n = s / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  }), o = 0.2126 * t + 0.7152 * e + 0.0722 * i;
  return (o + 0.05) / 0.05 > 1.05 / (o + 0.05) ? "#1D1D1B" : "#FFFFFF";
}
function Vt(r, t, e, i) {
  const o = r.filter((c) => Number.isFinite(c)).sort((c, a) => c - a);
  if (!o.length) return [];
  const s = o[0], n = o[o.length - 1], h = [s];
  for (let c = 1; c < t; c++) h.push(i === "cuantiles" ? o[Math.min(o.length - 1, Math.floor(c / t * o.length))] : s + (n - s) * c / t);
  h.push(n);
  const l = [];
  for (let c = 0; c < t; c++) l.push({ desde: h[c], hasta: h[c + 1], color: qt(e, t === 1 ? 0.5 : c / (t - 1)) });
  return l;
}
function Wt(r, t) {
  if (t.length) {
    for (let e = 0; e < t.length; e++) if (r <= t[e].hasta || e === t.length - 1) return t[e];
    return t.at(-1);
  }
}
function D(r, t) {
  if (!Number.isFinite(r)) return "—";
  const e = t === "cop" ? { style: "currency", currency: "COP", maximumFractionDigits: 0 } : t === "porcentaje" ? { style: "percent", maximumFractionDigits: 1 } : { maximumFractionDigits: 2 };
  return new Intl.NumberFormat("es-CO", e).format(r);
}
const P = /* @__PURE__ */ new Map(), Yt = new URL("../datos/", import.meta.url).href, b = (r) => String(r ?? "").replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]), Xt = { fromAttribute: (r) => r ? r.split(/[\s,]+/).filter(Boolean) : [], toAttribute: (r) => r.join(",") }, w = { fromAttribute: (r) => {
  try {
    return r ? JSON.parse(r) : void 0;
  } catch {
    return;
  }
}, toAttribute: (r) => JSON.stringify(r) };
class Gt extends M {
  constructor() {
    super(), this._pointers = /* @__PURE__ */ new Map(), this._drag = null, this._pinch0 = null, this._anim = 0, this.detalle = "medio", this.modo = "subregiones", this.rampa = "azul", this.clases = 5, this.escala = "lineal", this.etiquetas = "ninguna", this.etiquetasAuto = !0, this.leyenda = !0, this.leyendaTitulo = "", this.tooltip = !0, this.tooltipFormato = "<strong>{nombre}</strong><br><span>{subregion}</span><br>{valor}", this.seleccion = "", this.multiple = !1, this.clic = "seleccionar", this.enlace = "", this.efectos = ["entrada"], this.tema = "claro", this.zoom = !0, this.zoomRueda = !1, this.controles = !0, this.titulo = "Mapa del departamento del Magdalena", this.descripcion = "", this.formato = "numero", this.unidad = "", this.srcDatos = "", this.filtroSubregion = "", this.mostrarContorno = !0, this._geo = null, this._tf = { k: 1, x: 0, y: 0 }, this._hover = null, this._tip = null, this._ppu = 0.5, this._error = "";
  }
  static {
    this.properties = {
      detalle: { type: String },
      modo: { type: String },
      datos: { converter: w },
      categorias: { converter: w },
      coloresCategorias: { attribute: "colores-categorias", converter: w },
      coloresSubregiones: { attribute: "colores-subregiones", converter: w },
      rampa: { converter: { fromAttribute: (t) => t ? t.trim().startsWith("[") ? JSON.parse(t) : t : "azul" } },
      clases: { type: Number },
      escala: { type: String },
      etiquetas: { type: String },
      etiquetasAuto: { attribute: "etiquetas-auto", type: Boolean },
      leyenda: { type: Boolean },
      leyendaTitulo: { attribute: "leyenda-titulo", type: String },
      tooltip: { type: Boolean },
      tooltipFormato: { attribute: "tooltip-formato", type: String },
      seleccion: { type: String, reflect: !0 },
      multiple: { type: Boolean },
      clic: { type: String },
      enlace: { type: String },
      marcadores: { converter: w },
      lineas: { converter: w },
      efectos: { converter: Xt },
      tema: { type: String, reflect: !0 },
      zoom: { type: Boolean },
      zoomRueda: { attribute: "zoom-rueda", type: Boolean },
      controles: { type: Boolean },
      titulo: { type: String },
      descripcion: { type: String },
      formato: { type: String },
      unidad: { type: String },
      srcDatos: { attribute: "src-datos", type: String },
      filtroSubregion: { attribute: "filtro-subregion", type: String },
      mostrarContorno: { attribute: "mostrar-contorno", type: Boolean },
      _geo: { state: !0 },
      _tf: { state: !0 },
      _hover: { state: !0 },
      _tip: { state: !0 },
      _ppu: { state: !0 },
      _error: { state: !0 }
    };
  }
  /** Configura varias propiedades a la vez (lo usa el Estudio para generar y aplicar código). */
  set config(t) {
    Object.assign(this, t);
  }
  get config() {
    return {};
  }
  static get rampas() {
    return N;
  }
  static get iconos() {
    return L;
  }
  // ------------------------------------------------------------------ ciclo de vida
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver(() => this._medir()), this._cargar();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect(), cancelAnimationFrame(this._anim);
  }
  firstUpdated() {
    const t = this.renderRoot.querySelector("svg");
    t && this._ro?.observe(t), this._medir();
  }
  updated(t) {
    (t.has("detalle") || t.has("srcDatos")) && this._cargar(), t.has("seleccion") && this.dispatchEvent(new CustomEvent("gob-seleccion-cambio", { detail: { seleccion: this._selSet() }, bubbles: !0, composed: !0 }));
  }
  _medir() {
    const t = this.renderRoot.querySelector("svg");
    if (t && this._geo) {
      const e = t.getBoundingClientRect().width;
      e && (this._ppu = e / this._geo.meta.viewBox[2]);
    }
  }
  _cargar() {
    const e = (this.srcDatos || Yt).replace(/\/?$/, "/") + `magdalena-municipios.${this.detalle}.json`;
    P.has(e) || P.set(e, fetch(e).then((i) => {
      if (!i.ok) throw new Error(`No se pudo cargar ${e} (${i.status})`);
      return i.json();
    })), P.get(e).then((i) => {
      this._geo = i, this._error = "", this.updateComplete.then(() => {
        const o = this.renderRoot.querySelector("svg");
        o && this._ro?.observe(o), this._medir(), this.dispatchEvent(new CustomEvent("gob-mapa-listo", { bubbles: !0, composed: !0 }));
      });
    }).catch((i) => {
      P.delete(e), this._error = String(i.message || i);
    });
  }
  // ------------------------------------------------------------------ datos derivados
  _selSet() {
    return this.seleccion ? this.seleccion.split(",").filter(Boolean) : [];
  }
  _colores() {
    return Array.isArray(this.rampa) ? this.rampa : N[this.rampa]?.colores ?? N.azul.colores;
  }
  _clases() {
    return this.modo === "coropleta" && this.datos ? Vt(Object.values(this.datos), Math.max(2, this.clases), this._colores(), this.escala) : [];
  }
  _subColor(t) {
    return this.coloresSubregiones?.[t] ?? this._geo?.subregiones.find((e) => e.id === t)?.color ?? "#97A1B0";
  }
  _fillDe(t, e) {
    switch (this.modo) {
      case "plano":
        return "var(--gob-mapa-relleno)";
      case "coropleta": {
        const i = this.datos?.[t.codigo], o = i == null ? void 0 : Wt(i, e);
        return o ? o.color : "var(--gob-mapa-sin-dato)";
      }
      case "categorias": {
        const i = this.categorias?.[t.codigo];
        return i && this.coloresCategorias?.[i] || "var(--gob-mapa-sin-dato)";
      }
      default:
        return this._subColor(t.subregion);
    }
  }
  _valorTxt(t) {
    const e = this.datos?.[t];
    return e == null ? "" : D(e, this.formato) + (this.unidad ? " " + this.unidad : "");
  }
  _xy(t) {
    if (!this._geo || !t) return null;
    if (typeof t == "string") return this._geo.municipios.find((s) => s.codigo === t)?.centro ?? null;
    const { bbox: e, proyeccion: i } = this._geo.meta, o = Math.cos(i.lat0 * Math.PI / 180);
    return [(t[0] - e[0]) * o * i.escala, (e[3] - t[1]) * i.escala];
  }
  get _u() {
    return 1 / (Math.max(this._ppu, 0.05) * this._tf.k);
  }
  // unidades del viewBox por píxel CSS
  // ------------------------------------------------------------------ interacción
  _emitir(t, e, i) {
    this.dispatchEvent(new CustomEvent(t, { detail: { codigo: e.codigo, nombre: e.nombre, subregion: e.subregion, valor: this.datos?.[e.codigo], categoria: this.categorias?.[e.codigo], originalEvent: i }, bubbles: !0, composed: !0 }));
  }
  _click(t, e) {
    if (this._drag?.moved) return;
    this._emitir("gob-municipio-click", t, e);
    const i = this.clic;
    (i === "seleccionar" || i === "zoom-seleccionar") && this._toggleSel(t.codigo), (i === "zoom" || i === "zoom-seleccionar") && this.zoomA(t.codigo), i === "enlace" && this.enlace && (location.href = this.enlace.replace("{codigo}", t.codigo).replace("{nombre}", encodeURIComponent(t.nombre)));
  }
  _toggleSel(t) {
    const e = this._selSet(), i = e.indexOf(t);
    this.multiple ? (i >= 0 ? e.splice(i, 1) : e.push(t), this.seleccion = e.join(",")) : this.seleccion = i >= 0 ? "" : t;
  }
  _tipDe(t) {
    const e = this._geo?.subregiones.find((o) => o.id === t.subregion)?.nombre ?? "", i = this._valorTxt(t.codigo);
    return this.tooltipFormato.replace(/\{(\w+)\}/g, (o, s) => ({ nombre: b(t.nombre), codigo: b(t.codigo), subregion: b(e), valor: b(i), categoria: b(this.categorias?.[t.codigo] ?? "") })[s] ?? "");
  }
  _enter(t, e) {
    this._hover = t.codigo, this._emitir("gob-municipio-hover", t, e), this._mover(t, e);
  }
  _mover(t, e) {
    if (!this.tooltip || this._drag?.moved) return;
    const i = this.renderRoot.querySelector(".wrap").getBoundingClientRect();
    this._tip = { x: e.clientX - i.left, y: e.clientY - i.top, html: this._tipDe(t) };
  }
  _leave() {
    this._hover = null, this._tip = null;
  }
  _focus(t) {
    this._hover = t.codigo;
    const e = this.renderRoot.querySelector(`[data-c="${t.codigo}"]`), i = this.renderRoot.querySelector(".wrap").getBoundingClientRect();
    if (e && this.tooltip) {
      const o = e.getBoundingClientRect();
      this._tip = { x: o.left - i.left + o.width / 2, y: o.top - i.top, html: this._tipDe(t) };
    }
  }
  _key(t, e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._drag = null, this._click(t, e));
  }
  _vp(t) {
    const i = this.renderRoot.querySelector("svg").getBoundingClientRect();
    return { x: (t.clientX - i.left) / this._ppu, y: (t.clientY - i.top) / this._ppu };
  }
  _setTf(t, e, i) {
    if (!this._geo) return;
    const [, , o, s] = this._geo.meta.viewBox;
    t = Math.max(1, Math.min(14, t)), e = Math.min(0, Math.max(o - o * t, e)), i = Math.min(0, Math.max(s - s * t, i)), this._tf = { k: t, x: e, y: i };
  }
  _zoomEn(t, e) {
    if (!this._geo) return;
    const [, , i, o] = this._geo.meta.viewBox, s = e ?? { x: i / 2, y: o / 2 }, { k: n, x: h, y: l } = this._tf, c = Math.max(1, Math.min(14, n * t));
    this._setTf(c, s.x - (s.x - h) * c / n, s.y - (s.y - l) * c / n);
  }
  _down(t) {
    if (this.zoom) {
      if (this._pointers.set(t.pointerId, { x: t.clientX, y: t.clientY }), this._pointers.size === 2) {
        const [e, i] = [...this._pointers.values()];
        this._pinch0 = { d: Math.hypot(e.x - i.x, e.y - i.y), k: this._tf.k }, this._drag = null;
        return;
      }
      this._drag = { x: t.clientX, y: t.clientY, tx: this._tf.x, ty: this._tf.y, moved: !1 };
    }
  }
  _move(t) {
    if (!this.zoom || !this._pointers.has(t.pointerId)) return;
    if (this._pointers.set(t.pointerId, { x: t.clientX, y: t.clientY }), this._pointers.size === 2 && this._pinch0) {
      const [o, s] = [...this._pointers.values()], n = Math.hypot(o.x - s.x, o.y - s.y);
      this._zoomEn(this._pinch0.k * n / this._pinch0.d / this._tf.k, this._vp({ clientX: (o.x + s.x) / 2, clientY: (o.y + s.y) / 2 }));
      return;
    }
    if (!this._drag) return;
    const e = t.clientX - this._drag.x, i = t.clientY - this._drag.y;
    !this._drag.moved && Math.hypot(e, i) > 5 && (this._drag.moved = !0, this._tip = null, t.currentTarget.setPointerCapture?.(t.pointerId)), this._drag.moved && this._tf.k > 1 && this._setTf(this._tf.k, this._drag.tx + e / this._ppu, this._drag.ty + i / this._ppu);
  }
  _up(t) {
    this._pointers.delete(t.pointerId), this._pointers.size < 2 && (this._pinch0 = null), setTimeout(() => {
      this._pointers.size === 0 && (this._drag = null);
    }, 0);
  }
  _wheel(t) {
    !this.zoom || !(this.zoomRueda || t.ctrlKey || t.metaKey) || (t.preventDefault(), this._zoomEn(t.deltaY < 0 ? 1.25 : 0.8, this._vp(t)));
  }
  /** Acerca el mapa a un municipio (animado). */
  zoomA(t) {
    const e = this.renderRoot.querySelector(`[data-c="${t}"]`);
    if (!e || !this._geo) return;
    const i = e.getBBox(), [, , o, s] = this._geo.meta.viewBox, n = Math.min(8, Math.max(1.5, Math.min(o / (i.width * 2.2), s / (i.height * 2.2))));
    this._animar(n, o / 2 - n * (i.x + i.width / 2), s / 2 - n * (i.y + i.height / 2));
  }
  reiniciar() {
    this._animar(1, 0, 0);
  }
  _animar(t, e, i) {
    if (cancelAnimationFrame(this._anim), matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this._setTf(t, e, i);
      return;
    }
    const o = { ...this._tf }, s = performance.now(), n = 700, h = (l) => {
      const c = Math.min(1, (l - s) / n), a = c < 0.5 ? 4 * c ** 3 : 1 - (-2 * c + 2) ** 3 / 2;
      this._setTf(o.k + (t - o.k) * a, o.x + (e - o.x) * a, o.y + (i - o.y) * a), c < 1 && (this._anim = requestAnimationFrame(h));
    };
    this._anim = requestAnimationFrame(h);
  }
  // ------------------------------------------------------------------ exportación
  /** SVG estático (sin animaciones) para descargar o imprimir. */
  exportarSVG() {
    const t = this._geo;
    if (!t) return "";
    const [, , e, i] = t.meta.viewBox, o = this._clases(), s = 1 / Math.max(this._ppu, 0.05), n = this.tema === "oscuro", h = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${i}" width="${e}" height="${i}" font-family="Montserrat, Arial, sans-serif"><title>${b(this.titulo)}</title>`];
    n && h.push(`<rect width="${e}" height="${i}" fill="#081A2C"/>`);
    for (const l of t.municipios) h.push(`<path d="${l.d}" fill="${this._fillDe(l, o).startsWith("var") ? "#DCE6EE" : this._fillDe(l, o)}" stroke="${n ? "#081A2C" : "#fff"}" stroke-width="${1.2 * s}" stroke-linejoin="round"/>`);
    for (const l of this.lineas ?? []) {
      const c = this._xy(l.desde), a = this._xy(l.hasta);
      c && a && h.push(`<path d="${this._curva(c, a, l.curva ?? 0.18)}" fill="none" stroke="${l.color ?? "#0071BB"}" stroke-width="${(l.ancho ?? 2) * s}" ${l.estilo === "guion" || l.estilo === "flujo" ? `stroke-dasharray="${6 * s} ${6 * s}"` : ""}/>`);
    }
    for (const l of this.marcadores ?? []) {
      const c = this._xy(l.codigo ?? l.lonlat);
      if (!c) continue;
      const a = (l.tamano ?? 26) / 2 * s;
      h.push(`<circle cx="${c[0]}" cy="${c[1]}" r="${a}" fill="${l.color ?? "#0071BB"}" stroke="#fff" stroke-width="${1.5 * s}"/>`);
      const d = L[l.icono ?? "punto"];
      d && h.push(`<path d="${d.d}" fill="#fff" transform="translate(${c[0] - a * 0.6} ${c[1] - a * 0.6}) scale(${a * 1.2 / 24})"/>`);
    }
    if (this.etiquetas !== "ninguna") for (const l of t.municipios) h.push(`<text x="${l.centro[0]}" y="${l.centro[1]}" font-size="${10 * s}" text-anchor="middle" fill="${n ? "#fff" : "#161A22"}">${b(this._etiqueta(l))}</text>`);
    return h.push("</svg>"), h.join("");
  }
  descargarSVG(t = "mapa-magdalena") {
    this._bajar(new Blob([this.exportarSVG()], { type: "image/svg+xml" }), t + ".svg");
  }
  async descargarPNG(t = "mapa-magdalena", e = 2) {
    const i = this._geo;
    if (!i) return;
    const [, , o, s] = i.meta.viewBox, n = new Image(), h = URL.createObjectURL(new Blob([this.exportarSVG()], { type: "image/svg+xml" }));
    await new Promise((a, d) => {
      n.onload = a, n.onerror = d, n.src = h;
    });
    const l = document.createElement("canvas");
    l.width = o * e, l.height = s * e;
    const c = l.getContext("2d");
    c.fillStyle = this.tema === "oscuro" ? "#081A2C" : "#ffffff", c.fillRect(0, 0, l.width, l.height), c.drawImage(n, 0, 0, l.width, l.height), URL.revokeObjectURL(h), l.toBlob((a) => a && this._bajar(a, t + ".png"));
  }
  imprimir() {
    window.print();
  }
  _bajar(t, e) {
    const i = document.createElement("a");
    i.href = URL.createObjectURL(t), i.download = e, i.click(), setTimeout(() => URL.revokeObjectURL(i.href), 1e3);
  }
  // ------------------------------------------------------------------ render
  _curva(t, e, i) {
    const o = (t[0] + e[0]) / 2, s = (t[1] + e[1]) / 2, n = e[0] - t[0], h = e[1] - t[1], l = Math.hypot(n, h) || 1;
    return `M${t[0].toFixed(1)} ${t[1].toFixed(1)}Q${(o - h / l * i * l).toFixed(1)} ${(s + n / l * i * l).toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
  }
  _etiqueta(t) {
    const e = this._valorTxt(t.codigo);
    switch (this.etiquetas) {
      case "codigos":
        return t.codigo;
      case "valores":
        return e;
      case "nombres-valores":
        return e ? `${t.nombre} · ${e}` : t.nombre;
      default:
        return t.nombre;
    }
  }
  _marcador(t, e) {
    const i = this._xy(t.codigo ?? t.lonlat);
    if (!i) return p;
    const o = this._u, s = t.tamano ?? 26, n = s / 2 * o, h = t.color ?? "var(--gob-color-primario, #0071BB)", l = L[t.icono ?? "punto"], c = t.efecto ?? "ninguno", a = n * 2.6;
    return f`<g class="mk" part="marcador" transform="translate(${i[0]} ${i[1]})" style="--c:${h}" tabindex="0" role="button" aria-label=${t.nombre ?? "Marcador"}
        @click=${(d) => {
      d.stopPropagation(), this.dispatchEvent(new CustomEvent("gob-marcador-click", { detail: { ...t, indice: e }, bubbles: !0, composed: !0 })), t.url && (location.href = t.url);
    }}
        @pointerenter=${(d) => {
      if (this.tooltip && t.nombre) {
        const u = this.renderRoot.querySelector(".wrap").getBoundingClientRect();
        this._tip = { x: d.clientX - u.left, y: d.clientY - u.top, html: `<strong>${b(t.nombre)}</strong>${t.categoria ? `<br><span>${b(t.categoria)}</span>` : ""}${t.valor != null ? `<br>${b(D(t.valor, this.formato))}` : ""}` };
      }
    }}
        @pointerleave=${() => this._leave()}>
      ${c === "ping" || c === "radar" ? f`<circle class="ring r1" r=${a} /><circle class="ring r2" r=${a} />` : p}
      ${c === "pulso" ? f`<circle class="glow" r=${n * 1.9} />` : p}
      ${c === "radar" ? f`<path class="sweep" d="M0 0 L${a} 0 A${a} ${a} 0 0 0 ${a * Math.cos(-0.9)} ${a * Math.sin(-0.9)} Z" />` : p}
      <circle class="dot" r=${n} stroke-width=${1.5 * o} />
      ${l ? f`<path class="ico" d=${l.d} transform="translate(${-n * 0.62} ${-n * 0.62}) scale(${n * 1.24 / 24})" />` : p}
      ${t.etiqueta && t.nombre ? f`<text class="mk-t" y=${n + 12 * o} font-size=${11 * o} stroke-width=${3 * o}>${t.nombre}</text>` : p}
    </g>`;
  }
  _linea(t, e) {
    const i = this._xy(t.desde), o = this._xy(t.hasta);
    if (!i || !o) return p;
    const s = this._curva(i, o, t.curva ?? 0.18), n = t.estilo ?? "flujo", h = t.color ?? "var(--gob-color-primario, #0071BB)";
    return f`<g part="linea" style="--c:${h};--w:${t.ancho ?? 2}px;--i:${e}">
      <path class="ln base" d=${s} />
      <path class="ln ${n}" d=${s} pathLength="1" />
      ${t.particulas ? f`<circle class="pk" r=${3.2 * this._u} fill=${h}><animateMotion dur=${3 + e % 4 * 0.6}s repeatCount="indefinite" path=${s} /></circle>` : p}
    </g>`;
  }
  _leyenda(t) {
    if (!this.leyenda || !this._geo) return p;
    let e = p, i = this.leyendaTitulo;
    this.modo === "subregiones" ? (i ||= "Subregiones", e = this._geo.subregiones.map((s) => g`<li class=${this.filtroSubregion === s.id ? "on" : ""}><button type="button" @click=${() => this.filtroSubregion = this.filtroSubregion === s.id ? "" : s.id}><i style="background:${this._subColor(s.id)}"></i>${s.nombre}</button></li>`)) : this.modo === "coropleta" ? (i ||= "Valores", e = t.map((s) => g`<li><span><i style="background:${s.color}"></i>${D(s.desde, this.formato)} – ${D(s.hasta, this.formato)}${this.unidad ? " " + this.unidad : ""}</span></li>`)) : this.modo === "categorias" && this.coloresCategorias && (i ||= "Categorías", e = Object.entries(this.coloresCategorias).map(([s, n]) => g`<li><span><i style="background:${n}"></i>${s}</span></li>`));
    const o = /* @__PURE__ */ new Map();
    for (const s of this.marcadores ?? []) s.categoria && o.set(s.categoria, { color: s.color ?? "#0071BB", icono: s.icono });
    return g`<aside class="leyenda" part="leyenda" aria-label="Leyenda">
      ${i ? g`<h4>${i}</h4>` : p}<ul>${e}</ul>
      ${o.size ? g`<h4>Puntos</h4><ul>${[...o].map(([s, n]) => g`<li><span><i class="c" style="background:${n.color}"></i>${s}</span></li>`)}</ul>` : p}
    </aside>`;
  }
  render() {
    if (this._error) return g`<div class="estado err" role="alert">⚠ ${this._error}</div>`;
    const t = this._geo;
    if (!t) return g`<div class="estado" role="status">Cargando mapa…</div>`;
    const [, , e, i] = t.meta.viewBox, o = this._clases(), s = this._selSet(), n = this._u, h = new Set(this.efectos), l = h.has("foco") && s.length > 0, c = this._tf;
    return g`
      <div class="wrap ${[...h].map((a) => "ef-" + a).join(" ")}" part="mapa">
        <svg viewBox="0 0 ${e} ${i}" role="group" aria-label=${this.titulo} style="--k:${c.k}"
          @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up} @wheel=${this._wheel} @pointerleave=${() => {
      this._pointers.clear();
    }}>
          <title>${this.titulo}</title>${this.descripcion ? f`<desc>${this.descripcion}</desc>` : p}
          <g class="vista" transform="translate(${c.x} ${c.y}) scale(${c.k})">
            ${this.mostrarContorno ? f`<path class="contorno" part="contorno" d=${t.contorno} pathLength="1" />` : p}
            <g class="munis">
              ${t.municipios.map((a, d) => {
      const m = !!this.filtroSubregion && a.subregion !== this.filtroSubregion || l && !s.includes(a.codigo);
      return f`<path class="m ${s.includes(a.codigo) ? "sel" : ""} ${this._hover === a.codigo ? "hov" : ""} ${m ? "dim" : ""}" part="municipio" data-c=${a.codigo} d=${a.d}
                  style="--f:${this._fillDe(a, o)};--i:${d}" tabindex="0" role="button" aria-pressed=${s.includes(a.codigo)}
                  aria-label=${`${a.nombre}${this._valorTxt(a.codigo) ? ", " + this._valorTxt(a.codigo) : ""}`}
                  @click=${($) => this._click(a, $)} @pointerenter=${($) => this._enter(a, $)} @pointermove=${($) => this._mover(a, $)}
                  @pointerleave=${() => this._leave()} @focus=${() => this._focus(a)} @blur=${() => this._leave()} @keydown=${($) => this._key(a, $)} />`;
    })}
            </g>
            ${t.municipios.filter((a) => s.includes(a.codigo)).map((a) => f`<path class="halo ${h.has("hormigas") ? "ants" : ""}" d=${a.d} />`)}
            ${(this.lineas ?? []).map((a, d) => this._linea(a, d))}
            ${h.has("ping-seleccion") ? t.municipios.filter((a) => s.includes(a.codigo)).map((a) => f`<g transform="translate(${a.centro[0]} ${a.centro[1]})" pointer-events="none"><circle class="ring r1 sel-ring" r=${34 * n} /><circle class="ring r2 sel-ring" r=${34 * n} /></g>`) : p}
            ${this.etiquetas !== "ninguna" ? f`<g class="etiquetas" part="etiqueta" pointer-events="none">${t.municipios.map((a) => {
      const d = this._fillDe(a, o), u = this._etiqueta(a), m = !this.etiquetasAuto || (a.bbox[2] - a.bbox[0]) * this._ppu * this._tf.k >= u.length * 5.6 * 0.82;
      return u && m ? f`<text transform="translate(${a.centro[0]} ${a.centro[1]})" font-size=${10.5 * n} stroke-width=${3 * n} class=${d.startsWith("var") ? "" : "on"} style="--t:${d.startsWith("var") ? "var(--gob-mapa-texto)" : It(d)}">${u}</text>` : p;
    })}</g>` : p}
            ${(this.marcadores ?? []).map((a, d) => this._marcador(a, d))}
          </g>
        </svg>
        ${this.controles && this.zoom ? g`<div class="ctl" part="controles">
          <button type="button" aria-label="Acercar" @click=${() => this._zoomEn(1.5)}>+</button>
          <button type="button" aria-label="Alejar" @click=${() => this._zoomEn(1 / 1.5)}>−</button>
          <button type="button" aria-label="Vista completa" @click=${() => this.reiniciar()}>⌂</button></div>` : p}
        ${this._tip ? g`<div class="tip" part="tooltip" role="tooltip" style="left:${this._tip.x}px;top:${this._tip.y}px">${Ot(this._tip.html)}</div>` : p}
        ${this._leyenda(o)}
        <table class="sr"><caption>${this.titulo}</caption><thead><tr><th>Código</th><th>Municipio</th><th>Subregión</th><th>Valor</th></tr></thead>
          <tbody>${t.municipios.map((a) => g`<tr><td>${a.codigo}</td><td>${a.nombre}</td><td>${t.subregiones.find((d) => d.id === a.subregion)?.nombre}</td><td>${this._valorTxt(a.codigo)}</td></tr>`)}</tbody></table>
      </div>`;
  }
  static {
    this.styles = mt`
    :host { --gob-mapa-relleno: #DCE6EE; --gob-mapa-sin-dato: #E3E8EF; --gob-mapa-borde: #fff; --gob-mapa-contorno: #0B2239; --gob-mapa-sel: #0B2239; --gob-mapa-texto: #161A22; --gob-mapa-fondo: transparent;
      --gob-mapa-tip-bg: #081A2C; --gob-mapa-tip-fg: #fff; --gob-mapa-panel: rgba(255,255,255,.86); --gob-mapa-panel-fg: #252B36; --gob-mapa-panel-borde: #E3E8EF;
      display: block; position: relative; font-family: var(--gob-fuente, 'Montserrat', system-ui, sans-serif); container-type: inline-size; }
    :host([tema='oscuro']) { --gob-mapa-relleno: #12395C; --gob-mapa-sin-dato: #12395C; --gob-mapa-borde: #081A2C; --gob-mapa-contorno: #9FD7E5; --gob-mapa-sel: #fff; --gob-mapa-texto: #fff; --gob-mapa-fondo: #081A2C;
      --gob-mapa-tip-bg: #fff; --gob-mapa-tip-fg: #081A2C; --gob-mapa-panel: rgba(8,26,44,.78); --gob-mapa-panel-fg: #E3E8EF; --gob-mapa-panel-borde: #12395C; }
    .wrap { position: relative; background: var(--gob-mapa-fondo); border-radius: inherit; }
    svg { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; overflow: hidden; }
    .m, .contorno, .halo, .ln { vector-effect: non-scaling-stroke; }
    .contorno { fill: none; stroke: var(--gob-mapa-contorno); stroke-width: 1.4px; stroke-linejoin: round; opacity: .55; pointer-events: none; }
    .m { fill: var(--f); stroke: var(--gob-mapa-borde); stroke-width: 1.1px; stroke-linejoin: round; cursor: pointer; outline: none; transition: fill .35s ease, opacity .3s ease, filter .2s; transform-box: fill-box; transform-origin: center; }
    .m:hover, .m.hov { filter: brightness(1.08) saturate(1.1); stroke: var(--gob-mapa-sel); stroke-width: 2px; }
    .m:focus-visible { stroke: #00B7D9; stroke-width: 3px; }
    .m.sel { stroke: var(--gob-mapa-sel); stroke-width: 2.4px; }
    .m.dim { opacity: .28; }
    .halo { fill: none; stroke: var(--gob-mapa-sel); stroke-width: 3px; stroke-linejoin: round; pointer-events: none; }
    .halo.ants { stroke-dasharray: 9 7; animation: gob-marcha 1.1s linear infinite; }
    .etiquetas text { text-anchor: middle; dominant-baseline: central; font-weight: 600; fill: var(--t); paint-order: stroke; stroke: transparent; }
    .etiquetas text:not(.on) { stroke: color-mix(in srgb, var(--gob-mapa-fondo, #fff) 80%, #fff); }
    /* Líneas / rutas */
    .ln { fill: none; stroke: var(--c); stroke-width: var(--w); stroke-linecap: round; pointer-events: none; }
    .ln.base { opacity: .16; }
    .ln.solido { opacity: 1; } .ln.guion { stroke-dasharray: 5 6; }
    .ln.flujo { stroke-dasharray: .018 .03; animation: gob-flujo 1.4s linear infinite; }
    .ln.dibujar { stroke-dasharray: 1; stroke-dashoffset: 1; animation: gob-dibujar 2.2s ease forwards; animation-delay: calc(var(--i) * 250ms); }
    .pk { filter: drop-shadow(0 0 3px var(--c)); pointer-events: none; }
    /* Marcadores */
    .mk { cursor: pointer; outline: none; }
    .mk .dot { fill: var(--c); stroke: #fff; }
    .mk .ico { fill: #fff; pointer-events: none; }
    .mk:focus-visible .dot { stroke: #00B7D9; }
    .mk .ring { fill: none; stroke: var(--c); stroke-width: 2px; vector-effect: non-scaling-stroke; transform-box: fill-box; transform-origin: center; opacity: 0; pointer-events: none; animation: gob-ping 2.6s ease-out infinite; }
    .mk .ring.r2 { animation-delay: 1.3s; }
    .sel-ring { stroke: var(--gob-mapa-sel); transform-box: fill-box; transform-origin: center; animation: gob-ping 2.4s ease-out infinite; fill: none; stroke-width: 2px; vector-effect: non-scaling-stroke; opacity: 0; }
    .sel-ring.r2 { animation-delay: 1.2s; }
    .mk .glow { fill: var(--c); opacity: .25; transform-box: fill-box; transform-origin: center; animation: gob-pulso 2s ease-in-out infinite; pointer-events: none; }
    .mk .sweep { fill: color-mix(in srgb, var(--c) 38%, transparent); transform-box: view-box; animation: gob-gira 4.5s linear infinite; pointer-events: none; }
    .mk-t { text-anchor: middle; font-weight: 700; fill: var(--gob-mapa-texto); paint-order: stroke; stroke: var(--gob-mapa-fondo, #fff); stroke-linejoin: round; }
    @keyframes gob-ping { 0% { transform: scale(.15); opacity: .95; } 75% { opacity: .15; } 100% { transform: scale(1); opacity: 0; } }
    @keyframes gob-pulso { 0%, 100% { transform: scale(.7); opacity: .35; } 50% { transform: scale(1.15); opacity: .08; } }
    @keyframes gob-gira { to { transform: rotate(360deg); } }
    @keyframes gob-flujo { to { stroke-dashoffset: -.096; } }
    @keyframes gob-dibujar { to { stroke-dashoffset: 0; } }
    @keyframes gob-marcha { to { stroke-dashoffset: -32; } }
    @keyframes gob-entra { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
    @keyframes gob-trazo { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    .ef-entrada .m { animation: gob-entra .55s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 28ms); }
    .ef-entrada .contorno { stroke-dasharray: 1; animation: gob-trazo 1.8s ease both; }
    /* Controles, tooltip, leyenda */
    .ctl { position: absolute; top: .5rem; right: .5rem; display: grid; gap: 2px; }
    .ctl button { width: 2rem; height: 2rem; border: 1px solid var(--gob-mapa-panel-borde); background: var(--gob-mapa-panel); color: var(--gob-mapa-panel-fg); font: 700 1rem/1 inherit; cursor: pointer; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
    .ctl button:first-child { border-radius: 8px 8px 0 0; } .ctl button:last-child { border-radius: 0 0 8px 8px; }
    .ctl button:hover { background: #0071BB; color: #fff; } .ctl button:focus-visible { outline: 2px solid #00B7D9; outline-offset: 1px; }
    .tip { position: absolute; z-index: 5; transform: translate(-50%, calc(-100% - 12px)); pointer-events: none; background: var(--gob-mapa-tip-bg); color: var(--gob-mapa-tip-fg); padding: .5rem .7rem; border-radius: 8px; font-size: .78rem; line-height: 1.4; white-space: nowrap; box-shadow: 0 8px 24px rgba(8,26,44,.28); }
    .tip span { opacity: .72; } .tip strong { font-weight: 700; }
    .leyenda { position: absolute; left: .6rem; bottom: .6rem; max-width: 46%; padding: .55rem .7rem; border: 1px solid var(--gob-mapa-panel-borde); border-radius: 10px; background: var(--gob-mapa-panel); color: var(--gob-mapa-panel-fg); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); font-size: .72rem; }
    .leyenda h4 { margin: 0 0 .3rem; font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; opacity: .7; }
    .leyenda h4:not(:first-child) { margin-top: .5rem; }
    .leyenda ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
    .leyenda button, .leyenda span { display: flex; align-items: center; gap: .45rem; font: inherit; color: inherit; background: none; border: 0; padding: 1px 0; cursor: default; text-align: left; }
    .leyenda button { cursor: pointer; } .leyenda li.on button { font-weight: 700; text-decoration: underline; }
    .leyenda i { width: .8rem; height: .8rem; border-radius: 3px; flex: none; } .leyenda i.c { border-radius: 50%; }
    @container (max-width: 460px) { .leyenda { position: static; max-width: none; margin-top: .5rem; } }
    .estado { padding: 2rem; text-align: center; font-size: .9rem; color: #6B7482; } .estado.err { color: #B20028; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } .mk .ring, .sel-ring { opacity: 0 !important; } }
    @media print { .ctl { display: none; } * { animation: none !important; } .wrap, svg { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .leyenda { backdrop-filter: none; background: #fff; } .tip { display: none; } }
  `;
  }
}
customElements.get("gob-mapa-magdalena") || customElements.define("gob-mapa-magdalena", Gt);
export {
  Gt as G,
  L as I,
  N as R
};

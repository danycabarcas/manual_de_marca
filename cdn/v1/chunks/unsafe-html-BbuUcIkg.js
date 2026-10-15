import { A as r, E as o } from "./lit-element-CZvHeOsZ.js";
const u = { CHILD: 2 }, c = (i) => (...t) => ({ _$litDirective$: i, values: t });
class h {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, n) {
    this._$Ct = t, this._$AM = e, this._$Ci = n;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
class s extends h {
  constructor(t) {
    if (super(t), this.it = r, t.type !== u.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === r || t == null) return this._t = void 0, this.it = t;
    if (t === o) return t;
    if (typeof t != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.it) return this._t;
    this.it = t;
    const e = [t];
    return e.raw = e, this._t = { _$litType$: this.constructor.resultType, strings: e, values: [] };
  }
}
s.directiveName = "unsafeHTML", s.resultType = 1;
const l = c(s);
export {
  s as a,
  c as e,
  h as i,
  l as o,
  u as t
};

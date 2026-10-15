import { a as t, b as e, i } from "../chunks/lit-element-CZvHeOsZ.js";
import { N as s, i as a } from "../chunks/icono-x0IYmMl5.js";
class o extends t {
  static {
    this.properties = { nombre: { type: String }, tam: { type: Number }, etiqueta: { type: String } };
  }
  constructor() {
    super(), this.nombre = "", this.tam = 20, this.etiqueta = "";
  }
  static get nombres() {
    return s;
  }
  render() {
    return e`<span class="w" role=${this.etiqueta ? "img" : "presentation"} aria-label=${this.etiqueta || ""} aria-hidden=${this.etiqueta ? "false" : "true"}>${a(this.nombre, this.tam)}</span>`;
  }
  static {
    this.styles = i`:host { display: inline-flex; vertical-align: middle; color: inherit; } .w { display: inline-flex; line-height: 0; } svg { display: block; }`;
  }
}
customElements.get("gob-icono") || customElements.define("gob-icono", o);
export {
  o as GobIcono
};

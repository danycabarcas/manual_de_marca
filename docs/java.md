# Java (Spring, Thymeleaf, JSF/PrimeFaces, Vaadin)

Los CSS son estáticos: no dependen de la tecnología de servidor.

## Spring Boot + Thymeleaf

```bash
# copie dist/css y assets/logos a  src/main/resources/static/brand/
```

`templates/layout.html`

```html
<link rel="stylesheet" th:href="@{/brand/css/magdalena.min.css}">
<img th:src="@{/brand/logos/svg/logo-horizontal-color.svg}" alt="Gobernación del Magdalena" height="48">
```

## JSF / PrimeFaces

`template.xhtml`

```xml
<h:outputStylesheet name="brand/css/magdalena.min.css" />
<!-- PrimeFaces usa variables de tema: sobrescriba el color primario en su theme.css con #0071BB -->
```

## Vaadin (Lumo)

`frontend/themes/mi-app/styles.css`

```css
@import url('./magdalena-tokens.css');
html {
  --lumo-primary-color: #0071BB;
  --lumo-primary-text-color: #0071BB;
  --lumo-primary-color-50pct: rgba(0, 113, 187, .5);
  --lumo-primary-color-10pct: rgba(0, 113, 187, .1);
  --lumo-primary-contrast-color: #fff;
  --lumo-font-family: 'Montserrat', sans-serif;
}
```

## ASP.NET / Razor / Blazor

`_Layout.cshtml`

```html
<link rel="stylesheet" href="~/brand/css/magdalena.min.css" asp-append-version="true" />
```

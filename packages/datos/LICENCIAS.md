# Origen, fecha y licencia de los datos — `@gobmagdalena/datos`

| Dataset | Fuente | Fecha de descarga | Licencia / estado | Uso en el paquete |
|---|---|---|---|---|
| **Códigos DIVIPOLA** (30 municipios del Magdalena) | DANE — División Político-Administrativa de Colombia. Archivo `fuentes/divipola-dane.json` (1.122 municipios; mismo contenido que el servicio `geoportal.dane.gov.co/laboratorio/serviciosjson/`). Referencia pública: datos.gov.co `gdxc-w37w`. | 2026-10-14 | Datos abiertos del Estado colombiano. Citar: «DANE – DIVIPOLA». | **Llave primaria** (`CODIGO_DPTO_MPIO`) y nombre oficial. Nunca se usa el nombre como identificador. |
| **Geometría municipal** | DANE — **Marco Geoestadístico Nacional (MGN) 2024**, capa `MGN_MPIO_POLITICO`, publicada en ArcGIS por UPRA: `https://services.arcgis.com/wLfHepIACaM0pwj9/arcgis/rest/services/MGN_MPIO_POLITICO_2024/FeatureServer/0` (consulta `DPTO_CCDGO='47'`, WGS84). Archivo `fuentes/mgn2024-mpios-magdalena.geojson` (30 municipios, 229.250 vértices). | 2026-10-14 | Información geográfica oficial del DANE (datos abiertos). Citar: «DANE – Marco Geoestadístico Nacional 2024». | Límites simplificados (3 niveles) y rutas SVG. Unión por **código** `MPIO_CDPMP` (30/30 coinciden con DIVIPOLA). |
| Contorno departamental | Derivado: disolución de los 30 municipios anteriores. | — | Hereda la del MGN. | `contorno` |
| **Subregiones** (Santa Marta, Norte, Río, Centro, Sur) | Agrupación usada en las presentaciones del equipo (`infraestructurapub/tools/network.py`). Colores: paleta institucional. | 2026-10-14 | Definición interna. **Validar con Planeación Departamental.** | `subregiones.json`, campo `subregion` |

## Verificación recomendada

La capa se obtuvo del servicio publicado por UPRA (entidad pública), que replica el MGN del DANE. Para una fuente de primera mano, descargar el MGN desde `https://geoportal.dane.gov.co/` (Descargas → Marco Geoestadístico Nacional), filtrar `DPTO_CCDGO = '47'`, guardar como `fuentes/mgn2024-mpios-magdalena.geojson` (WGS84, con el campo `MPIO_CDPMP`) y ejecutar `npm run build`. El resultado debe ser equivalente.

## Pendiente (requiere insumos oficiales)

- Veredas y centros poblados con código DIVIPOLA (DANE MGN — capa rural/veredas) → PMTiles.
- Comunas y barrios de Santa Marta (Alcaldía Distrital / IGAC).
- Confirmar con Planeación la regionalización oficial del departamento.

## Reproducir

```bash
npm install
npm run datos      # packages/datos/dist/
npm run build      # + cdn/v1/ (componentes y datos)
```

Historial: la primera versión (2026-10-14) usó temporalmente geometría de GADM 4.1 (licencia no comercial, sin redistribución); fue **reemplazada** por el MGN 2024 del DANE antes de cualquier publicación.

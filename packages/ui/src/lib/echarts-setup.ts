/** Registro mínimo de ECharts (solo lo que usa <gob-grafica>). Se importa de forma perezosa. */
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, RadarChart, GaugeChart, HeatmapChart, TreemapChart, SankeyChart, FunnelChart, CustomChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, AriaComponent, GraphicComponent, RadarComponent, CalendarComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { temaGob } from './grafica-opciones.js';

echarts.use([BarChart, LineChart, PieChart, RadarChart, GaugeChart, HeatmapChart, TreemapChart, SankeyChart, FunnelChart, CustomChart,
  CalendarComponent, GridComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, AriaComponent, GraphicComponent, RadarComponent, CanvasRenderer]);
echarts.registerTheme('gob', temaGob(false));
echarts.registerTheme('gob-oscuro', temaGob(true));

export const init = echarts.init;

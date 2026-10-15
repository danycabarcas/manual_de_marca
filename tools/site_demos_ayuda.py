"""Demo «Mesa de ayuda»: tickets en kanban y lista, alta por pasos, detalle con línea de tiempo y centro de ayuda."""

AYUDA = '''        <div class="page-head"><div><h1>Mesa de ayuda</h1><p>Soporte técnico interno: reciba, asigne y resuelva solicitudes con seguimiento completo.</p></div>
          <div class="row" data-demo="Acciones de la página" data-nota="Botones nativos con el estilo de marca"><button type="button" id="exportar">Exportar</button><button id="nuevo">+ Nuevo ticket</button></div></div>

        <section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))" data-demo="Indicadores del servicio" data-nota="gob-kpi con meta (SLA) y variación">
          <gob-kpi id="k1" etiqueta="Tickets abiertos" icono="soporte"></gob-kpi><gob-kpi id="k2" etiqueta="En proceso" icono="reloj" color="cian"></gob-kpi>
          <gob-kpi id="k3" etiqueta="Críticos" icono="alerta" color="rojo" bueno-sube="false"></gob-kpi><gob-kpi id="k4" etiqueta="Resueltos a tiempo (SLA)" valor="0.87" formato="porcentaje" meta="0.9" icono="check-circulo" color="verde"></gob-kpi>
        </section>

        <gob-pestanas items='[{"id":"tab","titulo":"Tablero","icono":"panel"},{"id":"lis","titulo":"Lista","icono":"tabla"},{"id":"ayu","titulo":"Centro de ayuda","icono":"ayuda"}]' activa="tab" etiqueta="Vistas de la mesa de ayuda" data-demo="Vistas (pestañas)" data-nota="gob-pestanas: tablero kanban, lista con gob-tabla y centro de ayuda">
          <div slot="tab"><section data-demo="Tablero kanban de tickets" data-nota="gob-kanban: arrastre los tickets entre columnas; el evento gob-kanban-mover se guarda en su API"><gob-kanban id="kb"></gob-kanban></section></div>
          <div slot="lis"><section data-demo="Lista de tickets" data-nota="gob-tabla con búsqueda, filtros, selección y acciones por fila"><gob-tabla id="tabla" titulo="Todos los tickets" filtros-columna seleccion="multiple" tamano-pagina="8"></gob-tabla></section></div>
          <div slot="ayu">
            <section class="grid" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);align-items:start" data-demo="Centro de ayuda" data-nota="Preguntas frecuentes (mg-acordeon) y tarjeta de contacto con gob-avatar">
              <div class="mg-acordeon">
                <details open><summary>No puedo ingresar al sistema</summary><div class="cuerpo">Verifique su usuario y restablezca la contraseña desde «¿Olvidó su contraseña?». Si persiste, abra un ticket con la categoría <b>Acceso</b>.</div></details>
                <details><summary>¿Cómo solicito un equipo o software nuevo?</summary><div class="cuerpo">Abra un ticket de categoría <b>Solicitud</b> con la justificación y el visto bueno de su jefe inmediato.</div></details>
                <details><summary>¿Cuánto tarda la atención?</summary><div class="cuerpo">Críticos: 4 horas · Altos: 1 día hábil · Medios: 3 días · Bajos: 5 días.</div></details>
                <details><summary>¿Cómo veo el estado de mi ticket?</summary><div class="cuerpo">En la pestaña «Lista» abra el ticket: verá su historial en la línea de tiempo.</div></details>
              </div>
              <div class="mg-card" style="padding:1.25rem;display:grid;gap:.9rem"><strong>¿No encuentra su respuesta?</strong><p class="muted" style="margin:0">Nuestro equipo responde de lunes a viernes, 7:30 a.m. – 5:00 p.m.</p>
                <div class="row"><gob-avatar nombre="Mesa de ayuda TIC" estado="en-linea"></gob-avatar><div><b style="font-size:.9rem">Equipo de soporte</b><br><small class="muted">Extensión 1144 · soporte@magdalena.gov.co</small></div></div>
                <button type="button" id="contactar">Abrir un ticket</button></div>
            </section>
          </div>
        </gob-pestanas>

        <section data-demo="Nuevo ticket por pasos" data-nota="gob-modal + gob-pasos + gob-selector + gob-fecha + gob-archivos">
          <gob-modal id="mNuevo" titulo="Nuevo ticket de soporte" icono="soporte" tam="lg">
            <gob-pasos id="pasos" pasos='[{"titulo":"Clasificación"},{"titulo":"Descripción"},{"titulo":"Confirmar"}]'>
              <div slot="paso0" class="grid" style="gap:1rem;margin-top:.5rem">
                <label>Asunto * <input id="n-asunto" placeholder="Resuma el problema en una frase" aria-describedby="e-asunto"><span class="mg-error" id="e-asunto" role="alert"></span></label>
                <div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem"><label>Categoría *<gob-selector id="n-cat" etiqueta="Categoría" placeholder="Elija una categoría"></gob-selector><span class="mg-error" id="e-cat" role="alert"></span></label>
                  <label>Dependencia<gob-selector id="n-dep" etiqueta="Dependencia" placeholder="Busque su dependencia"></gob-selector></label></div>
                <fieldset><legend>Prioridad</legend><div class="row"><label><input type="radio" name="pri" value="baja"> Baja</label><label><input type="radio" name="pri" value="media" checked> Media</label><label><input type="radio" name="pri" value="alta"> Alta</label><label><input type="radio" name="pri" value="critica"> Crítica</label></div></fieldset>
              </div>
              <div slot="paso1" class="grid" style="gap:1rem;margin-top:.5rem">
                <label>Descripción * <textarea id="n-det" placeholder="¿Qué ocurre? ¿Desde cuándo? ¿Qué mensaje aparece?" aria-describedby="e-det"></textarea><span class="mg-error" id="e-det" role="alert"></span></label>
                <label>Fecha límite deseada<gob-fecha id="n-fecha" etiqueta="Fecha límite" style="max-width:16rem"></gob-fecha></label>
                <div><span class="mg-label">Capturas o documentos</span><gob-archivos id="n-arch" multiple accept=".png,.jpg,.pdf" max-mb="5" max-archivos="3"></gob-archivos></div>
              </div>
              <div slot="paso2" style="margin-top:.5rem"><gob-alerta tipo="info" titulo="Revise su solicitud">Al enviar se asigna un número y se notifica a la mesa de ayuda.</gob-alerta><dl id="resumen" style="display:grid;grid-template-columns:max-content 1fr;gap:.5rem 1.25rem;margin:1rem 0 0"></dl></div>
            </gob-pasos>
            <button slot="pie" type="button" id="atras">Atrás</button><button slot="pie" id="sig">Siguiente</button>
          </gob-modal>
        </section>

        <section data-demo="Detalle del ticket con línea de tiempo" data-nota="gob-modal + gob-linea-tiempo + gob-avatar + comentario con gob.toast">
          <gob-modal id="mDet" titulo="Ticket" icono="archivo" tam="lg">
            <div style="display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:1.5rem" class="det">
              <div><h3 id="d-asunto" style="margin:0 0 .25rem"></h3><p id="d-desc" class="muted" style="margin:0 0 1rem"></p><h4 style="margin:0 0 .75rem">Historial</h4><gob-linea-tiempo id="d-linea"></gob-linea-tiempo>
                <label style="margin-top:1rem;display:grid">Agregar comentario<textarea id="d-com" placeholder="Escriba una actualización para el solicitante…"></textarea></label></div>
              <aside class="grid" style="gap:.9rem;align-content:start"><div class="row"><gob-avatar id="d-av" nombre="" tam="44"></gob-avatar><div><b id="d-sol"></b><br><small class="muted" id="d-dep"></small></div></div>
                <dl style="display:grid;grid-template-columns:max-content 1fr;gap:.4rem 1rem;margin:0;font-size:.88rem" id="d-meta"></dl>
                <label>Estado<gob-selector id="d-est" etiqueta="Estado"></gob-selector></label></aside>
            </div>
            <button slot="pie" type="button" id="d-cerrar">Cerrar</button><button slot="pie" id="d-guardar">Guardar cambios</button>
          </gob-modal>
        </section>
        <style>@media (max-width: 800px) { .det { grid-template-columns: 1fr !important; } section[data-demo="Centro de ayuda"] { grid-template-columns: 1fr !important; } }</style>

        <script type="module">
          const $ = (id) => document.getElementById(id);
          const COLS = [{ id: 'nuevo', titulo: 'Nuevos', color: '#00B7D9' }, { id: 'proceso', titulo: 'En proceso', color: '#FEC800' }, { id: 'espera', titulo: 'En espera', color: '#A28034' }, { id: 'resuelto', titulo: 'Resueltos', color: '#69B75E' }];
          const EST = Object.fromEntries(COLS.map((c) => [c.id, c.titulo]));
          const CATS = ['Acceso y cuentas', 'Hardware', 'Software', 'Red e internet', 'Correo', 'Solicitud de equipo'];
          const DEPS = ['Secretaría General', 'Hacienda', 'Salud', 'Educación', 'Planeación', 'Oficina TIC', 'Infraestructura'];
          let n = 1042;
          let T = [
            { id: 1041, asunto: 'No puedo ingresar al sistema de nómina', desc: 'Aparece «usuario bloqueado» desde esta mañana.', solicitante: 'Ana Pérez', dep: 'Hacienda', cat: 'Acceso y cuentas', prioridad: 'alta', estado: 'nuevo', fecha: '14 oct' },
            { id: 1040, asunto: 'Impresora del piso 3 atasca el papel', desc: 'Se atasca cada 5 hojas.', solicitante: 'Luis Mora', dep: 'Secretaría General', cat: 'Hardware', prioridad: 'media', estado: 'proceso', fecha: '13 oct', asignado: 'Carlos Díaz' },
            { id: 1039, asunto: 'Sin internet en la oficina de Salud', desc: 'Intermitente desde el lunes.', solicitante: 'Marta Ruiz', dep: 'Salud', cat: 'Red e internet', prioridad: 'critica', estado: 'proceso', fecha: '13 oct', asignado: 'Sofía Gómez' },
            { id: 1038, asunto: 'Instalar Office en equipo nuevo', desc: '', solicitante: 'Pedro León', dep: 'Planeación', cat: 'Software', prioridad: 'baja', estado: 'espera', fecha: '10 oct', asignado: 'Carlos Díaz' },
            { id: 1037, asunto: 'Recuperar correo institucional', desc: 'Olvidé la contraseña del correo.', solicitante: 'Julia Vargas', dep: 'Educación', cat: 'Correo', prioridad: 'media', estado: 'resuelto', fecha: '09 oct', asignado: 'Sofía Gómez' },
            { id: 1036, asunto: 'Solicitud de portátil para supervisión', desc: 'Para visitas a municipios.', solicitante: 'Andrés Mejía', dep: 'Infraestructura', cat: 'Solicitud de equipo', prioridad: 'baja', estado: 'espera', fecha: '08 oct' },
            { id: 1035, asunto: 'Pantalla parpadea', desc: '', solicitante: 'Rosa Pardo', dep: 'Hacienda', cat: 'Hardware', prioridad: 'media', estado: 'resuelto', fecha: '07 oct', asignado: 'Carlos Díaz' },
            { id: 1034, asunto: 'Acceso a carpeta compartida', desc: '', solicitante: 'Iván Torres', dep: 'Planeación', cat: 'Acceso y cuentas', prioridad: 'alta', estado: 'proceso', fecha: '07 oct', asignado: 'Sofía Gómez' },
          ];
          const hist = {}; T.forEach((t) => (hist[t.id] = [{ fecha: t.fecha, titulo: 'Ticket creado', autor: t.solicitante, tipo: 'exito' }].concat(t.estado !== 'nuevo' ? [{ fecha: t.fecha, titulo: 'Asignado a ' + (t.asignado ?? 'soporte'), autor: 'Mesa de ayuda', tipo: 'info' }] : []).concat(t.estado === 'resuelto' ? [{ fecha: t.fecha, titulo: 'Resuelto', tipo: 'exito' }] : [])));
          const PRI = { critica: 'peligro', alta: 'aviso', media: 'info', baja: 'neutro' };

          const kb = $('kb'), tabla = $('tabla');
          const tarjeta = (t) => ({ id: String(t.id), columna: t.estado, titulo: '#' + t.id + ' · ' + t.asunto, descripcion: t.desc, prioridad: t.prioridad === 'critica' || t.prioridad === 'alta' ? 'alta' : t.prioridad === 'media' ? 'media' : 'baja', etiquetas: [t.cat], asignado: t.asignado, fecha: t.fecha });
          function pintar() {
            kb.columnas = COLS; kb.tarjetas = T.map(tarjeta);
            tabla.datos = T.map((t) => ({ ...t, estadoTxt: EST[t.estado], priTxt: t.prioridad[0].toUpperCase() + t.prioridad.slice(1) }));
            $('k1').valor = T.filter((t) => t.estado !== 'resuelto').length; $('k2').valor = T.filter((t) => t.estado === 'proceso').length; $('k3').valor = T.filter((t) => t.prioridad === 'critica' && t.estado !== 'resuelto').length;
          }
          tabla.config = { llave: 'id', ordenInicial: { campo: 'id', dir: 'desc' }, filaClicable: true, columnas: [
            { campo: 'id', titulo: '#', tipo: 'numero', nowrap: true }, { campo: 'asunto', titulo: 'Asunto' }, { campo: 'solicitante', titulo: 'Solicitante' }, { campo: 'cat', titulo: 'Categoría' },
            { campo: 'priTxt', titulo: 'Prioridad', tipo: 'estado', estados: { Critica: 'peligro', Alta: 'aviso', Media: 'info', Baja: 'neutro' } },
            { campo: 'estadoTxt', titulo: 'Estado', tipo: 'estado', estados: { Nuevos: 'primario', 'En proceso': 'aviso', 'En espera': 'neutro', Resueltos: 'exito' } }, { campo: 'fecha', titulo: 'Creado' } ],
            acciones: [{ id: 'ver', etiqueta: 'Abrir', icono: 'ojo' }], accionesMasivas: [{ id: 'resolver', etiqueta: 'Marcar resueltos', icono: 'check-circulo', tipo: 'primario' }] };
          pintar();

          // — mover en el tablero
          kb.addEventListener('gob-kanban-mover', (e) => { const t = T.find((x) => String(x.id) === e.detail.id); t.estado = e.detail.hasta; hist[t.id].push({ fecha: 'Hoy', titulo: 'Movido a «' + EST[t.estado] + '»', autor: 'Usted', tipo: t.estado === 'resuelto' ? 'exito' : 'info' }); pintar(); gob.toast({ tipo: 'exito', titulo: 'Ticket #' + t.id + ' → ' + EST[t.estado] }); });
          kb.addEventListener('gob-kanban-clic', (e) => abrirDetalle(+e.detail.tarjeta.id));
          tabla.addEventListener('gob-tabla-fila-clic', (e) => abrirDetalle(e.detail.fila.id));
          tabla.addEventListener('gob-tabla-accion', (e) => { if (e.detail.accion === 'ver') abrirDetalle(e.detail.fila.id); else if (e.detail.accion === 'resolver') { e.detail.filas.forEach((f) => (T.find((t) => t.id === f.id).estado = 'resuelto')); tabla.limpiarSeleccion(); pintar(); gob.toast({ tipo: 'exito', titulo: e.detail.filas.length + ' tickets resueltos' }); } });
          $('exportar').onclick = () => tabla.exportarCSV('tickets');
          $('contactar').onclick = () => abrirNuevo();

          // — detalle
          let actual = null;
          $('d-est').limpiable = false; $('d-est').buscable = false; $('d-est').opciones = COLS.map((c) => ({ valor: c.id, etiqueta: c.titulo }));
          function abrirDetalle(id) {
            actual = T.find((t) => t.id === id); const t = actual;
            $('mDet').titulo = 'Ticket #' + t.id; $('d-asunto').textContent = t.asunto; $('d-desc').textContent = t.desc || 'Sin descripción adicional.';
            $('d-av').nombre = t.solicitante; $('d-sol').textContent = t.solicitante; $('d-dep').textContent = t.dep; $('d-est').valor = t.estado; $('d-com').value = '';
            $('d-meta').innerHTML = [['Categoría', t.cat], ['Prioridad', t.prioridad], ['Asignado', t.asignado ?? 'Sin asignar'], ['Creado', t.fecha]].map(([k, v]) => `<dt class="muted">${k}</dt><dd style="margin:0;font-weight:600;text-transform:capitalize">${v}</dd>`).join('');
            $('d-linea').eventos = [...hist[t.id]]; $('d-linea').invertir = true; $('mDet').abrir();
          }
          $('d-cerrar').onclick = () => $('mDet').cerrar();
          $('d-guardar').onclick = () => {
            const e = $('d-est').valor, c = $('d-com').value.trim(); if (e !== actual.estado) { actual.estado = e; hist[actual.id].push({ fecha: 'Hoy', titulo: 'Estado: ' + EST[e], autor: 'Usted', tipo: e === 'resuelto' ? 'exito' : 'info' }); }
            if (c) hist[actual.id].push({ fecha: 'Hoy', titulo: 'Comentario', descripcion: c, autor: 'Usted', tipo: 'primario', icono: 'mensaje' });
            pintar(); $('mDet').cerrar(); gob.toast({ tipo: 'exito', titulo: 'Ticket actualizado' });
          };

          // — nuevo ticket por pasos
          $('n-cat').opciones = CATS; $('n-dep').opciones = DEPS;
          const val = { 0: () => { const a = $('n-asunto').value.trim().length >= 5, c = !!$('n-cat').valor; $('e-asunto').textContent = a ? '' : 'Escriba al menos 5 caracteres'; $('e-cat').textContent = c ? '' : 'Elija una categoría'; return a && c; },
                        1: () => { const d = $('n-det').value.trim().length >= 15; $('e-det').textContent = d ? '' : 'Describa el problema (mínimo 15 caracteres)'; return d; }, 2: () => true };
          function abrirNuevo() { $('pasos').actual = 0; $('pasos').error = -1; ['n-asunto', 'n-det'].forEach((i) => ($(i).value = '')); $('n-cat').limpiar(); $('n-dep').limpiar(); $('n-fecha').limpiar(); $('n-arch').limpiar(); ['e-asunto', 'e-cat', 'e-det'].forEach((i) => ($(i).textContent = '')); sync(); $('mNuevo').abrir(); }
          function sync() { const p = $('pasos'); $('atras').hidden = p.actual === 0; $('sig').textContent = p.actual === 2 ? 'Enviar ticket' : 'Siguiente'; if (p.actual === 2) $('resumen').innerHTML = [['Asunto', $('n-asunto').value], ['Categoría', $('n-cat').valor || '—'], ['Dependencia', $('n-dep').valor || '—'], ['Prioridad', document.querySelector('input[name=pri]:checked').value], ['Fecha límite', $('n-fecha').valor || 'Sin definir'], ['Adjuntos', $('n-arch').archivos.length + ' archivo(s)']].map(([k, v]) => `<dt class="muted">${k}</dt><dd style="margin:0;font-weight:600;text-transform:capitalize">${String(v).replace(/</g, '&lt;')}</dd>`).join(''); }
          $('nuevo').onclick = abrirNuevo;
          $('pasos').addEventListener('gob-paso-cambio', sync);
          $('atras').onclick = () => $('pasos').anterior();
          $('sig').onclick = () => {
            const p = $('pasos'); if (!val[p.actual]()) { p.error = p.actual; return gob.toast({ tipo: 'aviso', titulo: 'Complete los campos obligatorios' }); } p.error = -1;
            if (p.actual < 2) return p.siguiente();
            const t = { id: ++n, asunto: $('n-asunto').value.trim(), desc: $('n-det').value.trim(), solicitante: 'Usuario demostrativo', dep: $('n-dep').valor || 'Oficina TIC', cat: $('n-cat').valor, prioridad: document.querySelector('input[name=pri]:checked').value, estado: 'nuevo', fecha: 'Hoy' };
            T = [t, ...T]; hist[t.id] = [{ fecha: 'Hoy', titulo: 'Ticket creado', autor: t.solicitante, tipo: 'exito' }]; pintar(); $('mNuevo').cerrar(); gob.toast({ tipo: 'exito', titulo: 'Ticket #' + t.id + ' creado', mensaje: 'Recibirá una notificación cuando cambie de estado.' });
          };
        </script>'''

/* Portal Manual de Marca — Gobernación del Magdalena */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const toast = document.createElement('div'); toast.className = 'toast-ok'; document.body.appendChild(toast);
  function say(t) { toast.textContent = t; toast.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 1600); }
  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    say('Copiado: ' + (text.length > 48 ? text.slice(0, 45) + '…' : text));
    if (btn) { const o = btn.textContent; btn.classList.add('ok'); btn.textContent = '✔ Copiado'; setTimeout(() => { btn.classList.remove('ok'); btn.textContent = o; }, 1400); }
  }
  // URL base (dónde está publicado el repo): se detecta sola y se puede editar
  const detected = new URL('.', location.href).href.replace(/\/$/, '');
  let BASE = detected;
  try { BASE = localStorage.getItem('mg-base') || detected; } catch (e) {}
  function applyBase() {
    $$('[data-tpl]').forEach(el => { el.textContent = el.dataset.tpl.replaceAll('__BASE__', BASE); });
    $$('[data-url]').forEach(el => { el.textContent = BASE + '/' + el.dataset.url; });
  }
  const bi = $('#baseInput');
  if (bi) {
    bi.value = BASE;
    bi.addEventListener('input', () => { BASE = bi.value.replace(/\/$/, '') || detected; try { localStorage.setItem('mg-base', BASE); } catch (e) {} applyBase(); });
    $('#baseReset')?.addEventListener('click', () => { BASE = detected; bi.value = BASE; try { localStorage.removeItem('mg-base'); } catch (e) {} applyBase(); });
  }
  applyBase();
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-copy]'); if (c) { copy(c.dataset.copy, c.classList.contains('copy') ? c : null); return; }
    const cb = e.target.closest('.code [data-codecopy]'); if (cb) { copy(cb.closest('.code').querySelector('pre').textContent, cb); return; }
    const cu = e.target.closest('[data-copyurl]'); if (cu) { copy(BASE + '/' + cu.dataset.copyurl, cu); return; }
  });
  $('.pt-burger')?.addEventListener('click', () => $('.pt-nav').classList.toggle('open'));
  const links = $$('.int__nav a');
  if (links.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
    $$('.int__guide').forEach(g => io.observe(g));
  }
})();

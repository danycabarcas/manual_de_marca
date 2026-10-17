<?php
/**
 * Sección Desarrollo del Manual institucional (privada: requiere sesión del Panel TIC).
 * El contenido vive en contenido/*.md.php (Markdown; la primera línea impide que se sirva crudo).
 */
declare(strict_types=1);
require __DIR__ . '/_auth.php';
require __DIR__ . '/_lib/Parsedown.php';

$u = dev_exigir_sesion();

const PAGINAS = [
    'inicio'      => ['Introducción', 'Principios del estándar y cómo usar esta sección'],
    'tecnologia'  => ['Elegir la tecnología', 'Lista cerrada y matrices de decisión'],
    'backend'     => ['Backend NestJS', 'Estructura, configuración y buenas prácticas'],
    'datos'       => ['Datos y migraciones', 'PostgreSQL, Prisma y usuarios por aplicación'],
    'seguridad'   => ['Seguridad', 'OWASP Top 10 aplicado y lecciones propias'],
    'secretos'    => ['Archivos .env y secretos', 'Dónde vive cada secreto, cómo protegerlo y qué hacer si se filtra'],
    'frontend'    => ['Frontend', 'Angular, React, Next.js y Vue con la marca'],
    'calidad'     => ['Calidad y análisis de código', 'Pruebas, análisis estático y revisión'],
    'despliegue'  => ['Despliegue y operación', 'Coolify, ambientes y servicios del Panel TIC'],
    'publicacion' => ['Lista de verificación', 'Requisitos para publicar un sistema'],
    'transicion'  => ['Sistemas existentes', 'Plan de adecuación y estado actual'],
];
$p = isset(PAGINAS[$_GET['p'] ?? '']) ? $_GET['p'] : 'inicio';
$fuente = __DIR__ . '/contenido/' . $p . '.md.php';
$md = is_file($fuente) ? preg_replace('/^<\?php[^\n]*\n/', '', (string) file_get_contents($fuente)) : "# En construcción\n";
$md = (string) preg_replace('/^\s*# [^\n]*\n/', '', $md, 1);   // el título ya va en el encabezado de la página
$pd = new Parsedown();
$html = $pd->text($md);
// tablas y bloques de código con el estilo del manual
$html = str_replace('<table>', '<div class="tablewrap"><table class="urls">', $html);
$html = str_replace('</table>', '</table></div>', $html);
$claves = array_keys(PAGINAS);
$i = array_search($p, $claves, true);
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e(PAGINAS[$p][0]) ?> · Desarrollo · Manual institucional · Gobernación del Magdalena</title>
<link rel="icon" href="../assets/favicon/favicon.ico" sizes="any">
<link rel="stylesheet" href="../dist/css/magdalena.css">
<link rel="stylesheet" href="../site/portal.css">
<style>
  .dv { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 2rem; align-items: start; }
  .dv__nav { position: sticky; top: 1rem; display: grid; gap: .15rem; }
  .dv__nav a { padding: .5rem .75rem; border-radius: 8px; text-decoration: none; color: var(--mg-gray-700, #3d4752); font-size: .92rem; }
  .dv__nav a[aria-current] { background: var(--mg-primary, #0071BB); color: #fff; font-weight: 700; }
  .dv__nav small { display: block; padding: .75rem .75rem .25rem; color: var(--mg-text-muted, #5b6773); text-transform: uppercase; letter-spacing: .06em; font-size: .7rem; font-weight: 700; }
  .dv__doc { min-width: 0; line-height: 1.7; }
  .dv__doc h1 { margin-top: 0; } .dv__doc h2 { margin-top: 2.2rem; } .dv__doc h3 { margin-top: 1.6rem; }
  .dv__doc pre { background: #081A2C; color: #E6EEF6; padding: 1rem 1.2rem; border-radius: 10px; overflow: auto; font-size: .86rem; line-height: 1.55; }
  .dv__doc code { font-size: .9em; } .dv__doc pre code { color: inherit; }
  .dv__doc blockquote { margin: 1rem 0; padding: .75rem 1rem; border-left: 4px solid var(--mg-primary, #0071BB); background: #EEF6FC; border-radius: 0 8px 8px 0; }
  .dv__doc table td, .dv__doc table th { vertical-align: top; }
  .dv__pie { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid var(--mg-border, #e3e8ee); }
  .dv__user { font-size: .82rem; color: var(--mg-text-muted, #5b6773); padding: .75rem; }
  @media (max-width: 900px) { .dv { grid-template-columns: 1fr; } .dv__nav { position: static; } }
</style>
</head>
<body class="mg-base">
<header class="pt-header"><div class="pt-header__in">
  <a class="pt-brand" href="../index.html"><img src="../assets/logos/svg/logo-horizontal-color.svg" alt="Gobernación del Magdalena"></a>
  <button class="pt-burger" aria-label="Menú">☰</button>
  <nav class="pt-nav" aria-label="Principal"><a href="../index.html">Inicio</a><a href="../colores.html">Colores y degradados</a><a href="../logos.html">Logos y descargas</a><a href="../componentes.html">Componentes</a><a href="../integracion.html">Integración</a><a href="../demos/index.html">Demos</a><a href="./" aria-current="page">Desarrollo 🔒</a></nav>
</div></header>
<section class="pt-pagehead"><div class="pt-pagehead__in"><h1><?= e(PAGINAS[$p][0]) ?></h1><p><?= e(PAGINAS[$p][1]) ?> · Estándar de Desarrollo de Software v1.0</p></div></section>
<main class="pt-main">
  <?php if (dev_local()): ?><div class="mg-alert mg-alert--warning" style="margin-bottom:1rem"><div><b>Modo local:</b> en el servidor esta sección exige iniciar sesión con el Panel TIC.</div></div><?php endif; ?>
  <div class="dv">
    <nav class="dv__nav" aria-label="Secciones de desarrollo">
      <small>Estándar de desarrollo</small>
      <?php foreach (PAGINAS as $k => [$t]): ?><a href="./?p=<?= e($k) ?>"<?= $k === $p ? ' aria-current="page"' : '' ?>><?= e($t) ?></a><?php endforeach; ?>
      <div class="dv__user">Sesión: <b><?= e($u['nombre']) ?></b><br><?= e($u['email']) ?><br><a href="salir.php">Cerrar sesión</a></div>
    </nav>
    <article class="dv__doc">
      <?= $html ?>
      <div class="dv__pie">
        <span><?php if ($i > 0): ?><a class="mg-btn mg-btn--ghost mg-btn--sm" href="./?p=<?= e($claves[$i - 1]) ?>">← <?= e(PAGINAS[$claves[$i - 1]][0]) ?></a><?php endif; ?></span>
        <span><?php if ($i < count($claves) - 1): ?><a class="mg-btn mg-btn--sm" href="./?p=<?= e($claves[$i + 1]) ?>"><?= e(PAGINAS[$claves[$i + 1]][0]) ?> →</a><?php endif; ?></span>
      </div>
    </article>
  </div>
</main>
<script src="../site/portal.js"></script>
</body>
</html>

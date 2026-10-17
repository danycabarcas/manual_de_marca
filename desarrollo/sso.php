<?php
// Recibe el pase firmado del Panel TIC, abre la sesión de la sección Desarrollo y vuelve a la página pedida.
declare(strict_types=1);
require __DIR__ . '/_auth.php';

$u = dev_validar_pase((string) ($_GET['t'] ?? ''));
if (!$u || !dev_autorizado($u['email'])) {
    http_response_code(403);
    exit('No se pudo validar el acceso. Vuelva a intentarlo desde https://manualdemarca.magdalena.gov.co/desarrollo/');
}
session_regenerate_id(true);
$_SESSION['dev_usuario'] = $u;
$r = (string) ($_GET['r'] ?? DEV_BASE);
header('Location: ' . (strpos($r, DEV_BASE) === 0 ? $r : DEV_BASE), true, 303);

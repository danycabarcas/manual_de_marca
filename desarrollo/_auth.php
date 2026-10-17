<?php
/**
 * Control de acceso de la sección Desarrollo (privada).
 * La sesión se obtiene con el inicio de sesión único del Panel TIC (https://magdalena.gov.co/acceso/sso.php) y en cada
 * página se verifica que la persona siga siendo miembro activo o administrador (si se revoca en el panel, pierde el acceso).
 * En local (sin los archivos del servidor) la sección se muestra con un aviso de "modo local".
 */
declare(strict_types=1);

const DEV_PRIV = '/var/www/vhosts/gobernaciondelmagdalena.gov.co/neo_privado';
const DEV_SOL = '/var/www/vhosts/gobernaciondelmagdalena.gov.co/neo_solicitudes';
const DEV_SSO = 'https://magdalena.gov.co/acceso/sso.php';
const DEV_BASE = 'https://manualdemarca.magdalena.gov.co/desarrollo/';

date_default_timezone_set('America/Bogota');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: private, no-store');

function dev_local(): bool { return !is_dir(DEV_PRIV); }

function dev_sesion(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    if (!dev_local()) {
        $dir = DEV_PRIV . '/sesiones_manual';
        if (!is_dir($dir)) mkdir($dir, 0700);
        session_save_path($dir);
    }
    session_name('MDEV');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/desarrollo/', 'secure' => !dev_local(), 'httponly' => true, 'samesite' => 'Lax']);
    session_start();
}

function dev_b64d(string $s): string { return (string) base64_decode(strtr($s, '-_', '+/') . str_repeat('=', (4 - strlen($s) % 4) % 4)); }

/** ¿El correo sigue autorizado? (miembro activo vigente o administrador del panel) */
function dev_autorizado(string $email): bool {
    $cfg = @include DEV_PRIV . '/acceso_config.php';
    $admins = array_map('strtolower', (array) ($cfg['admins'] ?? []));
    if (in_array(strtolower($email), $admins, true)) return true;
    $m = json_decode((string) @file_get_contents(DEV_SOL . '/miembros.json'), true) ?: [];
    $yo = $m[strtolower($email)] ?? null;
    return $yo && (empty($yo['hasta']) || $yo['hasta'] > time());
}

/** Llamar al inicio de cada página privada. */
function dev_exigir_sesion(): array {
    dev_sesion();
    if (dev_local()) return ['email' => 'local@localhost', 'nombre' => 'Modo local', 'rol' => 'local'];
    $u = $_SESSION['dev_usuario'] ?? null;
    if ($u && dev_autorizado($u['email'])) return $u;
    $_SESSION = [];
    $ruta = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/desarrollo/', PHP_URL_PATH);
    $r = strpos($ruta, '/desarrollo/') === 0 ? 'https://manualdemarca.magdalena.gov.co' . $ruta : DEV_BASE;
    $q = (string) ($_SERVER['QUERY_STRING'] ?? '');
    header('Location: ' . DEV_SSO . '?volver=' . urlencode($r . ($q !== '' ? '?' . $q : '')), true, 303);
    exit;
}

/** Valida el pase firmado que entrega el Panel TIC. */
function dev_validar_pase(string $pase): ?array {
    $partes = explode('.', $pase);
    if (count($partes) !== 2 || dev_local()) return null;
    $secreto = trim((string) @file_get_contents(DEV_PRIV . '/sso_secret'));
    if ($secreto === '') return null;
    $esperada = rtrim(strtr(base64_encode(hash_hmac('sha256', $partes[0], $secreto, true)), '+/', '-_'), '=');
    if (!hash_equals($esperada, $partes[1])) return null;
    $d = json_decode(dev_b64d($partes[0]), true);
    if (!is_array($d) || ($d['exp'] ?? 0) < time() || empty($d['email'])) return null;
    dev_sesion();
    $usados = (array) ($_SESSION['dev_nonces'] ?? []);
    if (in_array($d['nonce'] ?? '', $usados, true)) return null;
    $_SESSION['dev_nonces'] = array_slice(array_merge($usados, [$d['nonce'] ?? '']), -20);
    return ['email' => strtolower((string) $d['email']), 'nombre' => (string) ($d['nombre'] ?? ''), 'rol' => (string) ($d['rol'] ?? '')];
}

function e(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

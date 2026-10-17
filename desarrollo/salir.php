<?php
declare(strict_types=1);
require __DIR__ . '/_auth.php';
dev_sesion();
$_SESSION = [];
session_destroy();
header('Location: ../index.html', true, 303);

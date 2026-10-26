<?php
// /bpr.php?r=<route> → read-only, cached proxy to the public BPR registry endpoints that send no CORS headers.
// Only the fixed routes below are reachable; nothing from the query string is forwarded.
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const REGISTRY = 'https://registry.brainsait.de';
const ROUTES = [
  'api' => '/api',
  'research' => '/api/research?spid=SA-PHY-000003',
  'fhir' => '/fhir/metadata',
];

$r = $_GET['r'] ?? '';
if (!isset(ROUTES[$r])) { http_response_code(404); echo '{"error":"unknown route"}'; exit; }

$cache = sys_get_temp_dir() . '/elfadil-bpr-' . $r . '.json';
if (is_readable($cache) && filemtime($cache) > time() - 120) { header('Cache-Control: public, max-age=60'); readfile($cache); exit; }

$ch = curl_init(REGISTRY . ROUTES[$r]);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_FOLLOWLOCATION => false,
  CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_HTTPHEADER => ['Accept: application/json', 'User-Agent: elfadil-bpr/1.0 (+https://elfadil.brainsait.de)']]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200 || $body === false || json_decode($body) === null) {
  // Serve the last good copy rather than nothing.
  if (is_readable($cache)) { header('Cache-Control: no-store'); readfile($cache); exit; }
  http_response_code(502); echo '{"error":"registry unavailable"}'; exit;
}
@file_put_contents($cache, $body);
header('Cache-Control: public, max-age=60');
echo $body;

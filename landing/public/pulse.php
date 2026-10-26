<?php
// /__pulse?u=<url>&u=<url> → {"results": {url: "online"|"probe"}} for the ecosystem section (replaces the Cloudflare worker).
// Only https URLs on the hosts below, never private addresses, redirects re-checked hop by hop. "online" means the
// site answered on its own host; a redirect to another host (e.g. the brainsait.de fallback) counts as "probe".
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const ALLOWED = ['brainsait.de', 'elfadil.com', 'elfadil.brainsait.de', 'brainsait369.blogspot.com', 'github.com', 'linkedin.com',
  'x.com', 'orcid.org', 'zenodo.org', 'huggingface.co', 'pypi.org', 'github.io', 'daftra.com'];

function allowed($url) {
  $p = parse_url($url);
  if (($p['scheme'] ?? '') !== 'https' || empty($p['host']) || isset($p['user']) || isset($p['port'])) return false;
  $host = strtolower($p['host']);
  $ok = false;
  foreach (ALLOWED as $d) if ($host === $d || str_ends_with($host, '.' . $d)) $ok = true;
  if (!$ok) return false;
  $ips = gethostbynamel($host) ?: [];
  foreach ($ips as $ip) if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) return false;
  return (bool)$ips;
}

function probe($url) {
  $host = parse_url($url, PHP_URL_HOST);
  for ($hop = 0; $hop < 4; $hop++) {
    if (!allowed($url)) return 'probe';
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_NOBODY => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 5, CURLOPT_FOLLOWLOCATION => false,
      CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_HTTPHEADER => ['User-Agent: elfadil-pulse/1.0 (+https://elfadil.brainsait.de)']]);
    curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $next = curl_getinfo($ch, CURLINFO_REDIRECT_URL);
    curl_close($ch);
    if ($code >= 300 && $code < 400 && $next) {
      if (strcasecmp(parse_url($next, PHP_URL_HOST) ?? '', $host) !== 0) return 'probe';
      $url = $next;
      continue;
    }
    // 405: some sites refuse HEAD but are up.
    return ($code > 0 && $code < 400) || $code === 405 ? 'online' : 'probe';
  }
  return 'probe';
}

// The app repeats u= (worker-style getAll); PHP's $_GET would keep only the last one.
$urls = [];
foreach (explode('&', $_SERVER['QUERY_STRING'] ?? '') as $pair)
  if (str_starts_with($pair, 'u=')) $urls[] = urldecode(substr($pair, 2));
$urls = array_slice(array_values(array_unique(array_filter($urls))), 0, 30);
$cache = sys_get_temp_dir() . '/elfadil-pulse-' . md5(implode('|', $urls)) . '.json';
if (is_readable($cache) && filemtime($cache) > time() - 60) { header('Cache-Control: public, max-age=60'); readfile($cache); exit; }
$out = ['results' => []];
foreach ($urls as $u) $out['results'][$u] = probe($u);
$json = json_encode($out, JSON_UNESCAPED_SLASHES);
@file_put_contents($cache, $json);
header('Cache-Control: public, max-age=60');
echo $json;

<?php
/**
 * Ergen Tekstil — form uç noktası (teklif, iletişim, katalog, bülten).
 *
 * Statik sitenin tek sunucu parçası. Yapılanlar:
 *   1. Girdi doğrulama + basit IP hız sınırı
 *   2. Kaydı public_html DIŞINDAKİ bir CSV'ye ekleme (CRM yerine kalıcı iz)
 *   3. info@ adresine e-posta
 *   4. Token tanımlıysa Meta Conversions API olayı (tarayıcı Pixel'iyle aynı event_id)
 *
 * Gizli değerler public_html dışındaki ergentekstil-config.php dosyasından okunur.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method']);
}

$home = dirname(__DIR__, 2); // /home/<kullanıcı>/public_html/api → /home/<kullanıcı>
$configFile = $home . '/ergentekstil-config.php';
$config = is_file($configFile) ? require $configFile : [];

$mailTo      = $config['mail_to'] ?? 'info@ergentekstil.com';
$mailFrom    = $config['mail_from'] ?? 'noreply@ergentekstil.com';
$pixelId     = $config['meta_pixel_id'] ?? '';
$capiToken   = $config['meta_capi_token'] ?? '';
$capiTest    = $config['meta_capi_test_event_code'] ?? '';
$dataDir     = $config['data_dir'] ?? ($home . '/ergentekstil-leads');

// Aynı sitenin dışından gelen istekleri reddet
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !preg_match('#^https?://(www\.)?ergentekstil\.com$#', $origin)
    && !preg_match('#^https?://[a-z0-9-]+\.ergentekstil\.com$#', $origin)) {
    respond(403, ['ok' => false, 'error' => 'origin']);
}

$raw = file_get_contents('php://input', false, null, 0, 64 * 1024);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'json']);
}

function field(array $in, string $key, int $max): string
{
    $v = isset($in[$key]) && is_scalar($in[$key]) ? trim((string) $in[$key]) : '';
    // Başlık enjeksiyonuna karşı tek satırlık alanlarda satır sonlarını at
    return mb_substr($v, 0, $max);
}

$lead = [
    'fullName'    => str_replace(["\r", "\n"], ' ', field($in, 'fullName', 200)),
    'email'       => str_replace(["\r", "\n"], '', field($in, 'email', 200)),
    'phone'       => str_replace(["\r", "\n"], ' ', field($in, 'phone', 50)),
    'subject'     => str_replace(["\r", "\n"], ' ', field($in, 'subject', 300)),
    'message'     => field($in, 'message', 5000),
    'productName' => str_replace(["\r", "\n"], ' ', field($in, 'productName', 500)),
    'locale'      => preg_replace('/[^a-z]/', '', field($in, 'locale', 5)),
    'sourceUrl'   => field($in, 'sourceUrl', 500),
    'eventId'     => preg_replace('/[^A-Za-z0-9._-]/', '', field($in, 'metaEventId', 100)),
    'eventName'   => in_array($in['metaEventName'] ?? 'Lead', ['Lead', 'Subscribe', 'Contact'], true)
        ? ($in['metaEventName'] ?? 'Lead') : 'Lead',
];

if (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'email']);
}

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0750, true);
}

// Hız sınırı: aynı IP'den 10 dakikada en fazla 8 gönderim
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateFile = $dataDir . '/rate-' . hash('sha256', $ip) . '.txt';
$now = time();
$hits = array_filter(
    is_file($rateFile) ? array_map('intval', file($rateFile, FILE_IGNORE_NEW_LINES) ?: []) : [],
    fn($t) => $t > $now - 600
);
if (count($hits) >= 8) {
    respond(429, ['ok' => false, 'error' => 'rate']);
}
$hits[] = $now;
@file_put_contents($rateFile, implode("\n", $hits), LOCK_EX);

// 1) CSV kaydı
$csv = $dataDir . '/leads.csv';
$isNew = !is_file($csv);
if ($fh = @fopen($csv, 'a')) {
    flock($fh, LOCK_EX);
    if ($isNew) {
        fputcsv($fh, ['tarih', 'tur', 'ad', 'eposta', 'telefon', 'konu', 'urun', 'mesaj', 'dil', 'sayfa', 'ip'], ',', '"', '');
    }
    // Excel'de formül olarak çalışmasın diye =,+,-,@ ile başlayan hücreler kaçırılır
    $safe = fn($v) => preg_match('/^[=+\-@\t\r]/', (string) $v) ? "'" . $v : $v;
    fputcsv($fh, array_map($safe, [
        date('c'), $lead['eventName'], $lead['fullName'], $lead['email'], $lead['phone'],
        $lead['subject'], $lead['productName'], $lead['message'], $lead['locale'], $lead['sourceUrl'], $ip,
    ]), ',', '"', '');
    flock($fh, LOCK_UN);
    fclose($fh);
}

// 2) E-posta
$kind = ['Lead' => 'Teklif / İletişim', 'Subscribe' => 'Bülten', 'Contact' => 'İletişim'][$lead['eventName']];
$body = implode("\n", array_filter([
    "Tür: {$kind}",
    "Ad: {$lead['fullName']}",
    "E-posta: {$lead['email']}",
    $lead['phone'] !== '' ? "Telefon: {$lead['phone']}" : null,
    $lead['productName'] !== '' ? "Ürün: {$lead['productName']}" : null,
    "Dil: {$lead['locale']}",
    "Sayfa: {$lead['sourceUrl']}",
    '',
    $lead['message'],
], fn($l) => $l !== null));

$subject = '=?UTF-8?B?' . base64_encode("[Web] {$kind}: " . ($lead['subject'] ?: $lead['fullName'])) . '?=';
$headers = implode("\r\n", [
    'From: Ergen Tekstil Web <' . $mailFrom . '>',
    'Reply-To: ' . $lead['email'],
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$mailed = @mail($mailTo, $subject, $body, $headers, '-f' . $mailFrom);

// 3) Meta Conversions API (token yoksa sessizce atlanır)
if ($pixelId !== '' && $capiToken !== '' && $lead['eventId'] !== '' && function_exists('curl_init')) {
    $h = fn(string $v) => hash('sha256', $v);
    $userData = [
        'client_ip_address' => $ip,
        'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'em' => [$h(strtolower($lead['email']))],
    ];
    if (!empty($_COOKIE['_fbp'])) $userData['fbp'] = $_COOKIE['_fbp'];
    if (!empty($_COOKIE['_fbc'])) $userData['fbc'] = $_COOKIE['_fbc'];

    $digits = preg_replace('/\D/', '', $lead['phone']);
    if ($digits !== '') {
        if ($digits[0] === '0') $digits = '9' . $digits;
        elseif (strlen($digits) === 10 && $digits[0] === '5') $digits = '90' . $digits;
        $userData['ph'] = [$h($digits)];
    }
    $parts = preg_split('/\s+/', mb_strtolower($lead['fullName'])) ?: [];
    if ($lead['fullName'] !== '' && $lead['fullName'] !== $lead['email'] && !empty($parts[0])) {
        $userData['fn'] = [$h($parts[0])];
        if (count($parts) > 1) $userData['ln'] = [$h(implode(' ', array_slice($parts, 1)))];
    }

    $payload = ['data' => [[
        'event_name' => $lead['eventName'],
        'event_time' => $now,
        'event_id' => $lead['eventId'],
        'event_source_url' => $lead['sourceUrl'] ?: ($_SERVER['HTTP_REFERER'] ?? ''),
        'action_source' => 'website',
        'user_data' => $userData,
        'custom_data' => [
            'content_name' => $lead['productName'] ?: $lead['subject'],
            'content_category' => $lead['subject'],
            'locale' => $lead['locale'],
        ],
    ]]];
    if ($capiTest !== '') $payload['test_event_code'] = $capiTest;

    $ch = curl_init('https://graph.facebook.com/v21.0/' . rawurlencode($pixelId) . '/events?access_token=' . rawurlencode($capiToken));
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 4,
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200) {
        @file_put_contents($dataDir . '/capi-errors.log', date('c') . " {$code} " . substr((string) $res, 0, 300) . "\n", FILE_APPEND);
    }
}

respond(200, ['ok' => true, 'mailed' => $mailed]);

import { catalogueUrl, type Catalogue } from "../catalogues";

/**
 * Katalog talep eden ziyaretçiye indirme bağlantısını Resend üzerinden gönderir.
 *
 * Gerekli Worker sırrı: RESEND_API_KEY (yoksa gönderim atlanır, form eskisi gibi yalnız talep kaydı açar).
 * İsteğe bağlı: CATALOGUE_MAIL_FROM, CATALOGUE_MAIL_REPLY_TO.
 * Gönderen alan adı (ergentekstil.com) Resend'de doğrulanmış olmalıdır.
 */

type MailLocale = "tr" | "en" | "de" | "ru" | "ar";

const DEFAULT_FROM = "Ergen Tekstil <info@ergentekstil.com>";
const DEFAULT_REPLY_TO = "info@ergentekstil.com";
const LOGO_URL = "https://www.ergentekstil.com/marka/cropped-logo-png.png";
const SITE_URL = "https://www.ergentekstil.com";
const PHONE = "+90 534 593 68 91";
const NAVY = "#151e32";

const COPY: Record<
  MailLocale,
  {
    heading: string;
    intro: (name: string) => string;
    button: string;
    fallback: string;
    help: string;
    reason: string;
    address: string;
  }
> = {
  tr: {
    heading: "Kataloğunuz hazır",
    intro: (name) =>
      `Merhaba, ${name} talebinizi aldık. Kataloğu aşağıdaki düğmeden indirebilirsiniz.`,
    button: "Kataloğu indir",
    fallback: "Düğme çalışmazsa bu bağlantıyı tarayıcınıza yapıştırın:",
    help: `Toptan fiyat, numune ya da özel üretim için bu e-postayı yanıtlayabilir veya ${PHONE} numarasından bize ulaşabilirsiniz.`,
    reason:
      "Bu e-posta, ergentekstil.com üzerindeki katalog formuna adresiniz yazıldığı için gönderildi. Talep size ait değilse dikkate almayabilirsiniz.",
    address: "Karaağaç OSB, Eski Bağlar Caddesi No:6, 59510 Kapaklı/Tekirdağ",
  },
  en: {
    heading: "Your catalogue is ready",
    intro: (name) =>
      `Hello, we have received your request for the ${name}. You can download it with the button below.`,
    button: "Download the catalogue",
    fallback: "If the button does not work, paste this link into your browser:",
    help: `For wholesale prices, samples or custom production, simply reply to this email or call us on ${PHONE}.`,
    reason:
      "You are receiving this email because your address was entered in the catalogue form on ergentekstil.com. If this was not you, you can ignore it.",
    address: "Karaağaç OIZ, Eski Bağlar Cad. No:6, 59510 Kapaklı/Tekirdağ, Türkiye",
  },
  de: {
    heading: "Ihr Katalog ist bereit",
    intro: (name) =>
      `Guten Tag, wir haben Ihre Anfrage erhalten: ${name}. Sie können den Katalog über die Schaltfläche unten herunterladen.`,
    button: "Katalog herunterladen",
    fallback: "Falls die Schaltfläche nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:",
    help: `Für Großhandelspreise, Muster oder Sonderanfertigungen antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: ${PHONE}.`,
    reason:
      "Sie erhalten diese E-Mail, weil Ihre Adresse im Katalogformular auf ergentekstil.com eingegeben wurde. Falls das nicht von Ihnen stammt, können Sie die E-Mail ignorieren.",
    address: "Karaağaç OSB, Eski Bağlar Cad. No:6, 59510 Kapaklı/Tekirdağ, Türkei",
  },
  ru: {
    heading: "Ваш каталог готов",
    intro: (name) =>
      `Здравствуйте! Мы получили ваш запрос: ${name}. Скачать каталог можно по кнопке ниже.`,
    button: "Скачать каталог",
    fallback: "Если кнопка не работает, скопируйте эту ссылку в браузер:",
    help: `По оптовым ценам, образцам и индивидуальному производству просто ответьте на это письмо или позвоните нам: ${PHONE}.`,
    reason:
      "Вы получили это письмо, потому что ваш адрес был указан в форме каталога на сайте ergentekstil.com. Если это были не вы, просто проигнорируйте письмо.",
    address: "Karaağaç OSB, Eski Bağlar Cad. No:6, 59510 Kapaklı/Tekirdağ, Турция",
  },
  ar: {
    heading: "الكتالوج جاهز",
    intro: (name) => `مرحبًا، استلمنا طلبكم: ${name}. يمكنكم تحميل الكتالوج من الزر أدناه.`,
    button: "تحميل الكتالوج",
    fallback: "إذا لم يعمل الزر، انسخوا هذا الرابط إلى المتصفح:",
    help: `لأسعار الجملة أو العينات أو الإنتاج الخاص، يمكنكم الرد على هذه الرسالة أو الاتصال بنا على الرقم ${PHONE}.`,
    reason:
      "وصلتكم هذه الرسالة لأن عنوان بريدكم أُدخل في نموذج الكتالوج على موقع ergentekstil.com. إذا لم يكن الطلب منكم يمكنكم تجاهلها.",
    address: "Karaağaç OSB, Eski Bağlar Cad. No:6, 59510 Kapaklı/Tekirdağ، تركيا",
  },
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildCatalogueMail(input: {
  catalogue: Catalogue;
  catalogueName: string;
  locale: string;
}) {
  const locale: MailLocale = input.locale in COPY ? (input.locale as MailLocale) : "tr";
  const t = COPY[locale];
  const rtl = locale === "ar";
  const url = catalogueUrl(input.catalogue);
  const name = input.catalogueName;
  const size = `PDF, ${input.catalogue.sizeMb} MB`;
  const align = rtl ? "right" : "left";
  const font = "font-family:Arial,Helvetica,sans-serif;";

  // Telefon sağdan sola metinde (Arapça) rakam grupları ters dizilmesin diye soldan sağa yalıtılır.
  const helpHtml = esc(t.help).replace(
    PHONE,
    `<span dir="ltr" style="white-space:nowrap;unicode-bidi:isolate;">${PHONE}</span>`
  );

  const subject = `${name} | Ergen Tekstil`;

  const text = [
    t.heading,
    "",
    t.intro(name),
    "",
    `${t.button} (${size}):`,
    url,
    "",
    t.help,
    "",
    `Ergen Tekstil · ${t.address}`,
    SITE_URL,
    "",
    t.reason,
  ].join("\n");

  const html = `<!doctype html>
<html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;">
<tr><td align="center" style="padding:32px 32px 8px;">
<a href="${SITE_URL}"><img src="${LOGO_URL}" width="150" alt="Ergen Tekstil" style="display:block;border:0;width:150px;height:auto;"></a>
</td></tr>
<tr><td dir="${rtl ? "rtl" : "ltr"}" style="padding:16px 32px 0;${font}text-align:${align};">
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${NAVY};">${esc(t.heading)}</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">${esc(t.intro(name))}</p>
</td></tr>
<tr><td align="center" style="padding:0 32px;${font}">
<a href="${url}" style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:14px 28px;border-radius:999px;">${esc(t.button)}</a>
<p style="margin:10px 0 0;font-size:12px;color:#6b7280;">${esc(name)} · <span dir="ltr">${size}</span></p>
</td></tr>
<tr><td dir="${rtl ? "rtl" : "ltr"}" style="padding:24px 32px 0;${font}text-align:${align};">
<p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#6b7280;">${esc(t.fallback)}</p>
<p dir="ltr" style="margin:0 0 20px;font-size:13px;line-height:1.5;word-break:break-all;text-align:left;"><a href="${url}" style="color:${NAVY};">${url}</a></p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">${helpHtml}</p>
</td></tr>
<tr><td dir="${rtl ? "rtl" : "ltr"}" style="padding:24px 32px 32px;${font}text-align:${align};">
<hr style="border:0;border-top:1px solid #e5e7eb;margin:0 0 16px;">
<p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:#6b7280;"><strong style="color:${NAVY};">Ergen Tekstil</strong> · ${esc(t.address)}<br><a href="${SITE_URL}" style="color:#6b7280;">www.ergentekstil.com</a></p>
<p style="margin:0;font-size:11px;line-height:1.6;color:#9ca3af;">${esc(t.reason)}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, html, text, url };
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** true: Resend e-postayı kabul etti. false: anahtar yok ya da gönderim başarısız (hata günlüğe yazılır). */
export async function sendCatalogueMail(input: {
  to: string;
  catalogue: Catalogue;
  catalogueName: string;
  locale: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const { subject, html, text } = buildCatalogueMail(input);
  const to = input.to.trim();

  // Aynı adrese aynı katalog günde en fazla bir kez gider (Resend aynı anahtarı 24 saat tekrar göndermez);
  // form art arda doldurulsa da kimsenin kutusu doldurulamaz.
  const day = new Date().toISOString().slice(0, 10);
  const idempotencyKey = `catalogue-${input.catalogue.key}-${input.locale}-${day}-${await sha256Hex(to.toLowerCase())}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.CATALOGUE_MAIL_FROM || DEFAULT_FROM,
        to: [to],
        reply_to: process.env.CATALOGUE_MAIL_REPLY_TO || DEFAULT_REPLY_TO,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("catalogue mail:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("catalogue mail failed:", e);
    return false;
  }
}

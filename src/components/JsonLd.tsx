/** Arama motorları ve yapay zekâ yanıt motorları için yapılandırılmış veri (schema.org JSON-LD). */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // İçerik yalnızca sitenin kendi verisinden üretilir; "<" kaçışı betik kırılmasını önler
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

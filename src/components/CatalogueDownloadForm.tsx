"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { requestCatalogue } from "@/lib/actions/request-catalogue";
import { trackMetaEvent } from "@/lib/meta/pixel";

export default function CatalogueDownloadForm({
  catalogueName,
  catalogueIndex,
  placeholder,
  buttonLabel,
  sentMessage,
  successMessage,
  readyMessage,
  openLabel,
}: {
  catalogueName: string;
  /** home.catalogues içindeki sıra; sunucu PDF'i buna göre seçer */
  catalogueIndex: number;
  placeholder: string;
  buttonLabel: string;
  /** E-posta gönderildiğinde gösterilir */
  sentMessage: string;
  /** Ne e-posta gitti ne indirme adresi döndüyse gösterilir */
  successMessage: string;
  /** E-posta gitmedi ama indirme düğmesi gösteriliyorsa */
  readyMessage: string;
  /** İndirme düğmesinin yazısı */
  openLabel: string;
}) {
  const params = useParams();
  const locale = (params.locale as string) ?? "tr";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [mailed, setMailed] = useState(false);
  const [download, setDownload] = useState<{ url: string; sizeMb?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const metaEventId = trackMetaEvent("Lead", {
      content_name: catalogueName,
      content_category: "catalogue_download",
    });
    let result: { ok: boolean; mailed: boolean; url?: string; sizeMb?: number } = {
      ok: false,
      mailed: false,
    };
    try {
      result = await requestCatalogue({
        email,
        catalogueIndex,
        locale,
        metaEventId,
        sourceUrl: window.location.href,
      });
    } catch (err) {
      console.error("catalogue request failed:", err);
    }
    setMailed(result.mailed);
    setDownload(result.url ? { url: result.url, sizeMb: result.sizeMb } : null);
    setSubmitting(false);
    setSent(true);
  }

  if (sent && download) {
    return (
      <div className="mt-4">
        <a
          href={download.url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90"
        >
          {openLabel}
          {download.sizeMb ? (
            <span className="ltr-only font-normal normal-case tracking-normal text-brand-navy/60">
              PDF · {download.sizeMb} MB
            </span>
          ) : null}
        </a>
        <p className="mt-3 text-sm text-white/75">{mailed ? sentMessage : readyMessage}</p>
      </div>
    );
  }

  if (sent) {
    return <p className="mt-4 text-sm text-white/80">{mailed ? sentMessage : successMessage}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      toolname={`request_catalogue_${catalogueName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
      tooldescription={`Request the ${catalogueName} PDF catalogue by email.`}
      className="mt-4 flex gap-2"
    >
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        toolparamdescription="Email address to send the catalogue PDF to"
        className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/50"
      />
      <button
        type="submit"
        disabled={submitting}
        className="shrink-0 rounded-full bg-white px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-white/90 disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

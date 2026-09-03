"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { submitLead } from "@/lib/actions/submit-lead";

export default function CatalogueDownloadForm({
  catalogueName,
  placeholder,
  buttonLabel,
  successMessage,
}: {
  catalogueName: string;
  placeholder: string;
  buttonLabel: string;
  successMessage: string;
}) {
  const params = useParams();
  const locale = (params.locale as string) ?? "tr";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await submitLead({
      fullName: email,
      email,
      subject: `Katalog Talebi: ${catalogueName}`,
      message: `${catalogueName} için katalog talebi.`,
      productName: catalogueName,
      locale,
    });
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return <p className="mt-4 text-sm text-white/80">{successMessage}</p>;
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

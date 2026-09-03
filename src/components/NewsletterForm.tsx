"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { submitLead } from "@/lib/actions/submit-lead";
import { trackMetaEvent } from "@/lib/meta/pixel";

export default function NewsletterForm({
  placeholder,
  buttonLabel,
  successMessage,
}: {
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
    const metaEventId = trackMetaEvent("Subscribe", { content_name: "newsletter" });
    await submitLead({
      fullName: email,
      email,
      subject: "Bülten Aboneliği",
      message: "E-posta bültenine abone olmak istiyor.",
      locale,
      metaEventId,
      metaEventName: "Subscribe",
      sourceUrl: window.location.href,
    });
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return <p className="mt-6 text-sm font-medium text-brand-navy">{successMessage}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      toolname="subscribe_newsletter"
      tooldescription="Subscribe to the Ergen Tekstil email newsletter for new collections and wholesale updates."
      className="mt-6 flex w-full max-w-md gap-2"
    >
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        toolparamdescription="Email address to subscribe to the newsletter"
        className="min-w-0 flex-1 rounded-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-brand-grey outline-none focus:border-brand-navy/50"
      />
      <button
        type="submit"
        disabled={submitting}
        className="shrink-0 rounded-full bg-brand-navy px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

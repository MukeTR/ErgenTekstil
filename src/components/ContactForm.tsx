"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { submitLead } from "@/lib/actions/submit-lead";
import { trackMetaEvent } from "@/lib/meta/pixel";

type Fields = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  product: string;
  submit: string;
};

export default function ContactForm({
  fields,
  targetEmail,
  successMessage,
  prefillProduct = "",
}: {
  fields: Fields;
  targetEmail: string;
  successMessage: string;
  prefillProduct?: string;
}) {
  const params = useParams();
  const locale = (params.locale as string) ?? "tr";
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const subject = form.get("subject") as string;
    const message = form.get("message") as string;
    const product = form.get("product") as string;

    setSubmitting(true);
    const metaEventId = trackMetaEvent("Lead", {
      content_name: product || subject || fields.subject,
      content_category: "wholesale_quote",
    });
    await submitLead({
      fullName: name,
      email,
      subject: subject || fields.subject,
      message,
      productName: product || undefined,
      locale,
      metaEventId,
      metaEventName: "Lead",
      sourceUrl: window.location.href,
    });
    setSubmitting(false);
    setSent(true);

    const body = [
      `${fields.fullName}: ${name}`,
      `${fields.email}: ${email}`,
      product ? `${fields.product}: ${product}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(
      subject || fields.subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      toolname="request_wholesale_quote"
      tooldescription="Submit a wholesale/B2B price quote request to Ergen Tekstil, a seamless activewear and shapewear manufacturer. Use this to request pricing for a specific product (by name) or a general inquiry."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
            {fields.fullName}
          </label>
          <input
            required
            name="name"
            type="text"
            toolparamdescription="Full name of the person requesting the quote"
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
            {fields.email}
          </label>
          <input
            required
            name="email"
            type="email"
            toolparamdescription="Email address to send the wholesale quote to"
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div>
        <label className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
          {fields.product}
        </label>
        <input
          name="product"
          type="text"
          defaultValue={prefillProduct}
          toolparamdescription="Name of the specific product this quote is for, if any (leave empty for a general inquiry)"
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div>
        <label className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
          {fields.subject}
        </label>
        <input
          required
          name="subject"
          type="text"
          toolparamdescription="Short subject line summarising the request"
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div>
        <label className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey">
          {fields.message}
        </label>
        <textarea
          required
          name="message"
          rows={5}
          toolparamdescription="The full message: quantity needed, sizes/colours of interest, target market, or any other details relevant to the quote"
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-brand-navy px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60"
      >
        {fields.submit}
      </button>

      {sent && <p className="text-sm text-brand-grey">{successMessage}</p>}
    </form>
  );
}

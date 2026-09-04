"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { productImageUrl } from "@/lib/data";
import { submitLead } from "@/lib/actions/submit-lead";
import { trackMetaEvent } from "@/lib/meta/pixel";
import { useQuoteList } from "./QuoteListProvider";

export default function QuoteListDrawer() {
  const t = useTranslations("quoteList");
  const params = useParams();
  const locale = (params.locale as string) ?? "tr";
  const { items, isOpen, close, remove, setQty, clear } = useQuoteList();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string).trim();
    const company = (form.get("company") as string).trim();
    const email = (form.get("email") as string).trim();
    const phone = (form.get("phone") as string).trim();
    const note = (form.get("note") as string).trim();

    const lines = items.map((i) => `• ${i.name} — ${i.qty} ${t("pcs")}`);
    const message = [
      `${t("subject")} (${items.length} ${t("products")}, ${totalQty} ${t("pcs")})`,
      company ? `${t("company")}: ${company}` : null,
      "",
      ...lines,
      note ? "" : null,
      note ? `${t("note")}: ${note}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    setSubmitting(true);
    setError(false);
    const metaEventId = trackMetaEvent("Lead", {
      content_name: "quote_list",
      content_category: "wholesale_quote_list",
      num_items: items.length,
      contents: items.map((i) => ({ id: i.slug, quantity: i.qty })),
    });
    const res = await submitLead({
      fullName: company ? `${name} (${company})` : name,
      email,
      phone: phone || undefined,
      subject: `${t("subject")} — ${items.length} ${t("products")}`,
      message,
      productName: items.map((i) => i.name).join(", ").slice(0, 500),
      locale,
      metaEventId,
      metaEventName: "Lead",
      sourceUrl: window.location.href,
    });
    setSubmitting(false);
    if (res.ok) {
      setSent(true);
      clear();
    } else {
      setError(true);
    }
  }

  return (
    <>
      {/* Karartma */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-brand-navy/50 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={`fixed inset-y-0 end-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <div>
            <h2 className="font-heading text-lg font-extrabold text-brand-navy">{t("title")}</h2>
            <p className="text-xs text-brand-grey">
              {items.length} {t("products")} · {totalQty} {t("pcs")}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-brand-grey-light"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-brand-navy">{t("sentTitle")}</h3>
              <p className="mt-2 max-w-xs text-sm text-brand-grey">{t("sentText")}</p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  close();
                }}
                className="mt-8 rounded-full bg-brand-navy px-7 py-3 font-heading text-xs font-semibold uppercase tracking-wide text-white"
              >
                {t("close")}
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-heading text-base font-bold text-brand-navy">{t("emptyTitle")}</p>
              <p className="mt-2 max-w-xs text-sm text-brand-grey">{t("emptyText")}</p>
              <Link
                href="/katalog"
                onClick={close}
                className="mt-6 rounded-full bg-brand-navy px-7 py-3 font-heading text-xs font-semibold uppercase tracking-wide text-white"
              >
                {t("browse")}
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.slug} className="flex gap-3 rounded-2xl bg-brand-grey-light p-3">
                    <Link
                      href={`/katalog/${item.slug}`}
                      onClick={close}
                      className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white"
                    >
                      {item.image && (
                        <Image
                          src={productImageUrl(item.image)}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/katalog/${item.slug}`}
                        onClick={close}
                        className="line-clamp-2 font-heading text-sm font-semibold text-brand-navy hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.category && (
                        <p className="mt-0.5 text-[11px] uppercase tracking-wide text-brand-grey">
                          {item.category}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-brand-navy/15 bg-white">
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, item.qty - 1)}
                            className="h-8 w-8 rounded-s-full text-brand-navy hover:bg-brand-grey-light"
                            aria-label="−"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) => setQty(item.slug, Number(e.target.value) || 1)}
                            aria-label={t("qty")}
                            className="w-14 bg-transparent py-1 text-center text-sm font-semibold text-brand-navy outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, item.qty + 1)}
                            className="h-8 w-8 rounded-e-full text-brand-navy hover:bg-brand-grey-light"
                            aria-label="+"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-brand-grey">{t("pcs")}</span>
                        <button
                          type="button"
                          onClick={() => remove(item.slug)}
                          className="ms-auto text-xs text-brand-grey underline-offset-2 hover:text-red-600 hover:underline"
                        >
                          {t("remove")}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-black/5 pt-6"
                toolname="request_wholesale_quote_for_list"
                tooldescription="Request a wholesale price quote for all products currently in the quote list."
              >
                <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-navy">
                  {t("formTitle")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <input name="name" required placeholder={t("name")} toolparamdescription="Contact person's full name" className="col-span-2 rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy sm:col-span-1" />
                  <input name="company" placeholder={t("company")} toolparamdescription="Company name" className="col-span-2 rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy sm:col-span-1" />
                  <input name="email" type="email" required placeholder={t("email")} toolparamdescription="Email address for the quote" className="col-span-2 rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy sm:col-span-1" />
                  <input name="phone" type="tel" placeholder={t("phone")} toolparamdescription="Phone number (optional)" className="col-span-2 rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy sm:col-span-1" />
                  <textarea name="note" rows={3} placeholder={t("notePlaceholder")} toolparamdescription="Additional notes: sizes, colours, delivery country, target date" className="col-span-2 rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-navy" />
                </div>
                {error && <p className="text-xs text-red-600">{t("error")}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-brand-navy py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60"
                >
                  {submitting ? t("sending") : t("submit")}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="w-full text-center text-xs text-brand-grey hover:text-brand-navy"
                >
                  {t("clear")}
                </button>
              </form>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

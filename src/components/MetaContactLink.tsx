"use client";

import type { ReactNode } from "react";
import { trackMetaEvent } from "@/lib/meta/pixel";

/** Tıklandığında Meta "Contact" olayı atan dış bağlantı (WhatsApp, telefon vb.). */
export default function MetaContactLink({
  href,
  channel,
  label,
  className,
  children,
}: {
  href: string;
  channel: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={className}
      onClick={() => trackMetaEvent("Contact", { content_name: channel })}
    >
      {children}
    </a>
  );
}

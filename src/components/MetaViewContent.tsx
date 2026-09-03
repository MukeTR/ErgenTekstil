"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta/pixel";

/** Ürün detay sayfası açıldığında Meta ViewContent olayı atar. */
export default function MetaViewContent({
  contentId,
  contentName,
  category,
}: {
  contentId: string;
  contentName: string;
  category?: string;
}) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_ids: [contentId],
      content_name: contentName,
      content_type: "product",
      content_category: category,
    });
  }, [contentId, contentName, category]);

  return null;
}

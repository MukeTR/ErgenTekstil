"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Teklif listesindeki tek ürün (sepet satırı). */
export type QuoteItem = {
  slug: string;
  name: string;
  image: string | null;
  category?: string;
  qty: number;
};

type QuoteListState = {
  items: QuoteItem[];
  isOpen: boolean;
  hydrated: boolean;
  add: (item: Omit<QuoteItem, "qty">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const STORAGE_KEY = "ergen-quote-list-v1";
const MIN_QTY = 1;
const MAX_QTY = 100000;

const QuoteListContext = createContext<QuoteListState | null>(null);

function clampQty(q: number) {
  if (!Number.isFinite(q)) return MIN_QTY;
  return Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(q)));
}

export function QuoteListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // localStorage → state (yalnızca tarayıcıda)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QuoteItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.slug));
      }
    } catch {
      /* bozuk veri → boş liste */
    }
    setHydrated(true);
  }, []);

  // state → localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* depolama kapalı olabilir */
    }
  }, [items, hydrated]);

  // Çekmece açıkken arka plan kaymasın
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const add = useCallback((item: Omit<QuoteItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, qty: clampQty(i.qty + qty) } : i
        );
      }
      return [...prev, { ...item, qty: clampQty(qty) }];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, qty: clampQty(qty) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<QuoteListState>(
    () => ({
      items,
      isOpen,
      hydrated,
      add,
      remove,
      setQty,
      clear,
      has: (slug) => items.some((i) => i.slug === slug),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [items, isOpen, hydrated, add, remove, setQty, clear]
  );

  return <QuoteListContext.Provider value={value}>{children}</QuoteListContext.Provider>;
}

export function useQuoteList(): QuoteListState {
  const ctx = useContext(QuoteListContext);
  if (!ctx) throw new Error("useQuoteList must be used inside <QuoteListProvider>");
  return ctx;
}

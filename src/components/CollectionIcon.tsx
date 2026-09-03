const ICONS: Record<string, React.ReactNode> = {
  shorts: (
    <path d="M4 4h16l-1 8-1 9a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1l-1-8-1 8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1l-1-9-1-8Z" />
  ),
  bra: (
    <path d="M3 8c0-2.5 2-4.5 4.5-4.5S12 5.5 12 8c0-2.5 2-4.5 4.5-4.5S21 5.5 21 8c0 3-2 5-4.5 5.5.3 2 .2 4-1 6-.7 1-1.7 1.5-3.5 1.5s-2.8-.5-3.5-1.5c-1.2-2-1.3-4-1-6C5 13 3 11 3 8Z" />
  ),
  corset: (
    <path d="M6 3 4 6l1 5-1 5 2 5h4l2-3 2 3h4l2-5-1-5 1-5-2-3-4 2-2-1-2 1-4-2Zm3 8h6M8 14h8" />
  ),
  tank: (
    <path d="M7 3 4 6v3l3-1v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8l3 1V6l-3-3-3 2H10L7 3Z" />
  ),
  polo: (
    <path d="M9 3 4 6l2 4 2-1v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9l2 1 2-4-5-3-1.5 2h-3L9 3Zm2 2 1 2 1-2" />
  ),
  leggings: (
    <path d="M8 3h8l1 9-1 8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1l-1-9-1 9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1l-1-8L8 3Z" />
  ),
};

export default function CollectionIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const path = ICONS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

const COLOR_HEX: Record<string, string> = {
  Mavi: "#2b5aa8",
  Kremit: "#b5603a",
  Pembe: "#e39ab0",
  Kırmızı: "#c02a2a",
  Siyah: "#111111",
  Turuncu: "#e0722a",
  Yeşil: "#3f7a4f",
  Lacivert: "#1c2c52",
  Beyaz: "#f5f5f5",
  Ten: "#d9b599",
};

import type { Product } from "@/lib/data";

export default function ColorSwatches({
  colors,
  colorKeys,
}: {
  colors: Product["colors"];
  colorKeys?: Product["colorKeys"];
}) {
  const keys = colorKeys ?? colors;
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((label, i) => (
        <span
          key={label + i}
          title={label}
          className="h-4 w-4 rounded-full border border-black/10"
          style={{ backgroundColor: COLOR_HEX[keys[i]] ?? "#ccc" }}
        />
      ))}
    </div>
  );
}

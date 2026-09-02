import type { Product } from "@/lib/data";
import { COLOR_HEX } from "@/lib/catalog-taxonomy";

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
          style={{
            backgroundColor:
              COLOR_HEX[keys[i] as keyof typeof COLOR_HEX] ?? "#ccc",
          }}
        />
      ))}
    </div>
  );
}

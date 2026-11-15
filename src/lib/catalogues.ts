/**
 * Katalog PDF'leri. Sıra, ana sayfadaki "Ürün Katalogları" kutularıyla aynıdır
 * (content.*.json → home.catalogues): Aktif Spor, Korse, FORMactive.
 *
 * Dosyalar 10–52 MB olduğu için e-postaya eklenmez; e-postada indirme bağlantısı gider.
 * PDF'ler Güzel Hosting'deki eski yükleme klasöründe durur (çıplak alan adı; www Worker'dadır).
 */
export const CATALOGUE_BASE_URL = "https://ergentekstil.com/wp-content/uploads/";

export const CATALOGUES = [
  { key: "activewear", file: "Ergen-Tekstil-Katalog.pdf", sizeMb: 52 },
  { key: "shapewear", file: "FORMactive-2022-KATALOG.pdf", sizeMb: 10 },
  { key: "formactive", file: "formactive-katalog-09.09.pdf", sizeMb: 34 },
] as const;

export type Catalogue = (typeof CATALOGUES)[number];

export function catalogueUrl(catalogue: Catalogue) {
  return CATALOGUE_BASE_URL + catalogue.file;
}

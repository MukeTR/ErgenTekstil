/**
 * Fabrikanın harita konumu: Google Haritalar'daki "Ergen Tekstil Kapaklı Üretim Tesisi" kaydı.
 * Adres metniyle arama yanlış sokağa düştüğü için iğne koordinatla sabitlenir.
 * Karaağaç OSB, Eski Bağlar Caddesi No:6, 59510 Kapaklı/Tekirdağ
 */
export const FACTORY_COORDS = { lat: 41.279437, lng: 27.947771 };

export const FACTORY_MAP_EMBED = `https://www.google.com/maps?q=${FACTORY_COORDS.lat},${FACTORY_COORDS.lng}&z=16&hl=tr&output=embed`;

export const FACTORY_MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=41.279437%2C27.947771&query_place_id=ChIJRzDcdM_htBQRg5_gkWfeKZw";

/**
 * İstanbul satış mağazası: Google Haritalar'daki "FORMactive" kaydı
 * (Yeşildirek, Sultan Mektebi Sok. No:13/A, 34120 Fatih). İğne yine koordinatla sabit.
 */
export const STORE_COORDS = { lat: 41.0123335, lng: 28.9722088 };

export const STORE_MAP_EMBED = `https://www.google.com/maps?q=${STORE_COORDS.lat},${STORE_COORDS.lng}&z=17&hl=tr&output=embed`;

export const STORE_MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=41.0123335%2C28.9722088&query_place_id=ChIJF3x6Wou5yhQRmbjoAdouNVI";

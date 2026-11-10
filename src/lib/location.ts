/**
 * Fabrikanın harita konumu: Google Haritalar'daki "Ergen Tekstil Kapaklı Üretim Tesisi" kaydı.
 * Adres metniyle arama yanlış sokağa düştüğü için iğne koordinatla sabitlenir.
 * Karaağaç OSB, Eski Bağlar Caddesi No:6, 59510 Kapaklı/Tekirdağ
 */
export const FACTORY_COORDS = { lat: 41.279437, lng: 27.947771 };

export const FACTORY_MAP_EMBED = `https://www.google.com/maps?q=${FACTORY_COORDS.lat},${FACTORY_COORDS.lng}&z=16&hl=tr&output=embed`;

export const FACTORY_MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=41.279437%2C27.947771&query_place_id=ChIJRzDcdM_htBQRg5_gkWfeKZw";

import json, re

SRC = "/Users/macos/ErgenTekstil/src/data/products.tr.json"

CAT_EN = {"Tayt": "Leggings", "Korse": "Shapewear", "Şort": "Shorts", "Genel": "General"}
CAT_AR = {"Tayt": "طماق", "Korse": "مشدّات", "Şort": "شورت", "Genel": "عام"}

COLOR_EN = {
    "Mavi": "Blue", "Kremit": "Terracotta", "Pembe": "Pink", "Kırmızı": "Red",
    "Siyah": "Black", "Turuncu": "Orange", "Yeşil": "Green", "Lacivert": "Navy",
    "Beyaz": "White", "Ten": "Nude",
}
COLOR_AR = {
    "Mavi": "أزرق", "Kremit": "طوبي", "Pembe": "وردي", "Kırmızı": "أحمر",
    "Siyah": "أسود", "Turuncu": "برتقالي", "Yeşil": "أخضر", "Lacivert": "كحلي",
    "Beyaz": "أبيض", "Ten": "بيج",
}

FEATURE_EN = {
    "% 20 Elastan": "20% Elastane",
    "% 82 Polyamid": "82% Polyamide",
    "%10 Elastan": "10% Elastane",
    "%15 Elastan": "15% Elastane",
    "%18 Elastan": "18% Elastane",
    "%20 Elastan": "20% Elastane",
    "%80 Polyamid": "80% Polyamide",
    "%82 Polyamid": "82% Polyamide",
    "%85 Bamboo": "85% Bamboo",
    "%90 Polyamid": "90% Polyamide",
    "%90 Polyamide": "90% Polyamide",
    "Ayarlanabilir ağraf": "Adjustable hook-and-eye closure",
    "Bölgesel duble etkili sekillendirme": "Targeted double-layer shaping",
    "Doğal bamboo kumaşıyla ipeksi dokunuş": "Silky touch with natural bamboo fabric",
    "Ekstra push-up özelliği": "Extra push-up effect",
    "Ekstra yüksek bel": "Extra high waist",
    "Günlük kullanıma uygun": "Suitable for everyday wear",
    "Kaymayı engelleyen slikon bant": "Non-slip silicone band",
    "Kaymayı Öneleyen silikon bant": "Non-slip silicone band",
    "Kaymayı önleyen silikon bant": "Non-slip silicone band",
    "Kaymayı önleyen silikon doku": "Non-slip silicone texture",
    "Kaymayı önleyen silikon serit": "Non-slip silicone strip",
    "Kaymayı önleyen silikon şerit": "Non-slip silicone strip",
    "Kaymayı önleyen silikon şerit1050": "Non-slip silicone strip",
    "Lacivert, Beyaz, Siyah renkler": "Available in Navy, White, Black",
    "Lacivert, Siyah ve Beyaz renkler": "Available in Navy, Black and White",
    "Micromasaj fonksiyonlu özel örme sistemi": "Special knit system with micro-massage function",
    "Nefes alabilen iç göstermez kumaş": "Breathable, opaque fabric",
    "Nefes alabilen kumaş": "Breathable fabric",
    "Push etkili": "Push-up effect",
    "Push-up etkisi": "Push-up effect",
    "Renk seçeneği; Natural": "Colour option: Natural",
    "S, M, L, XL": "S, M, L, XL",
    "S, M, L, XL ve XXL": "S, M, L, XL and XXL",
    "S, M, L, XL ve XXL beden seçenekleri": "S, M, L, XL and XXL size options",
    "S, M, L, XL, XXL ve 3XL": "S, M, L, XL, XXL and 3XL",
    "S, M, L, XL, XXL ve 3XL beden seçenekleri": "S, M, L, XL, XXL and 3XL size options",
    "S-M-L-XL": "S-M-L-XL",
    "S-M-L-XL-XXL": "S-M-L-XL-XXL",
    "Sezon renkler": "Seasonal colours",
    "Siyah renk": "Black colour",
    "Siyah ve Ten": "Black and Nude",
    "Siyah ve Ten rengi alternatifleri": "Black and Nude colour alternatives",
    "Siyah, Beyaz ve Ten": "Black, White and Nude",
    "Siyah, Beyaz ve Ten rengi alternatifleri": "Black, White and Nude colour alternatives",
    "Siyah, Beyaz ve Ten renkleri": "Black, White and Nude colours",
    "Siyah, Beyaz, Ten": "Black, White, Nude",
    "Sıklaştırıcı ve toparlayıcı etki": "Firming and shaping effect",
    "Ten /Beyaz / Siyah": "Nude / White / Black",
    "Ultra yüksek bel": "Ultra high waist",
    "Vücudu saran dikişsiz örgü sistemi": "Body-hugging seamless knit construction",
    "XS/S, M/L": "XS/S, M/L",
    "XS/S, M/L, L/XL": "XS/S, M/L, L/XL",
    "XS/S. M/L": "XS/S, M/L",
    "Yerli Üretim": "Made in Türkiye",
    "Yüksek bel extra sıkılaştırıcı korse": "High-waist extra firming shapewear",
    "yüksek bel": "high waist",
    "Çift taraflı silikon bant": "Double-sided silicone band",
    "Çıkarılabilir askı": "Removable straps",
    "İnce kumaşı sayesinde iz yapmaz.": "Thin fabric leaves no visible lines.",
    "İpeksi dokunuş": "Silky touch",
}

FEATURE_AR = {
    "% 20 Elastan": "20% إيلاستين",
    "% 82 Polyamid": "82% بولي أميد",
    "%10 Elastan": "10% إيلاستين",
    "%15 Elastan": "15% إيلاستين",
    "%18 Elastan": "18% إيلاستين",
    "%20 Elastan": "20% إيلاستين",
    "%80 Polyamid": "80% بولي أميد",
    "%82 Polyamid": "82% بولي أميد",
    "%85 Bamboo": "85% بامبو",
    "%90 Polyamid": "90% بولي أميد",
    "%90 Polyamide": "90% بولي أميد",
    "Ayarlanabilir ağraf": "إغلاق قابل للتعديل بالخطاف",
    "Bölgesel duble etkili sekillendirme": "تشكيل مضاعف موضعي",
    "Doğal bamboo kumaşıyla ipeksi dokunuş": "ملمس حريري بقماش البامبو الطبيعي",
    "Ekstra push-up özelliği": "تأثير رفع إضافي",
    "Ekstra yüksek bel": "خصر عالٍ جدًا",
    "Günlük kullanıma uygun": "مناسب للاستخدام اليومي",
    "Kaymayı engelleyen slikon bant": "شريط سيليكون مضاد للانزلاق",
    "Kaymayı Öneleyen silikon bant": "شريط سيليكون مضاد للانزلاق",
    "Kaymayı önleyen silikon bant": "شريط سيليكون مضاد للانزلاق",
    "Kaymayı önleyen silikon doku": "نسيج سيليكون مضاد للانزلاق",
    "Kaymayı önleyen silikon serit": "شريط سيليكون مضاد للانزلاق",
    "Kaymayı önleyen silikon şerit": "شريط سيليكون مضاد للانزلاق",
    "Kaymayı önleyen silikon şerit1050": "شريط سيليكون مضاد للانزلاق",
    "Lacivert, Beyaz, Siyah renkler": "متوفر بألوان كحلي وأبيض وأسود",
    "Lacivert, Siyah ve Beyaz renkler": "متوفر بألوان كحلي وأسود وأبيض",
    "Micromasaj fonksiyonlu özel örme sistemi": "نظام حياكة خاص بوظيفة تدليك دقيق",
    "Nefes alabilen iç göstermez kumaş": "قماش قابل للتنفس ولا يظهر من تحت الملابس",
    "Nefes alabilen kumaş": "قماش قابل للتنفس",
    "Push etkili": "تأثير رافع",
    "Push-up etkisi": "تأثير رافع",
    "Renk seçeneği; Natural": "خيار اللون: طبيعي",
    "S, M, L, XL": "S, M, L, XL",
    "S, M, L, XL ve XXL": "S, M, L, XL و XXL",
    "S, M, L, XL ve XXL beden seçenekleri": "مقاسات S, M, L, XL و XXL",
    "S, M, L, XL, XXL ve 3XL": "S, M, L, XL, XXL و 3XL",
    "S, M, L, XL, XXL ve 3XL beden seçenekleri": "مقاسات S, M, L, XL, XXL و 3XL",
    "S-M-L-XL": "S-M-L-XL",
    "S-M-L-XL-XXL": "S-M-L-XL-XXL",
    "Sezon renkler": "ألوان موسمية",
    "Siyah renk": "لون أسود",
    "Siyah ve Ten": "أسود وبيج",
    "Siyah ve Ten rengi alternatifleri": "بدائل الألوان الأسود والبيج",
    "Siyah, Beyaz ve Ten": "أسود وأبيض وبيج",
    "Siyah, Beyaz ve Ten rengi alternatifleri": "بدائل الألوان الأسود والأبيض والبيج",
    "Siyah, Beyaz ve Ten renkleri": "ألوان أسود وأبيض وبيج",
    "Siyah, Beyaz, Ten": "أسود، أبيض، بيج",
    "Sıklaştırıcı ve toparlayıcı etki": "تأثير مشدّ وموحّد للجسم",
    "Ten /Beyaz / Siyah": "بيج / أبيض / أسود",
    "Ultra yüksek bel": "خصر عالٍ للغاية",
    "Vücudu saran dikişsiz örgü sistemi": "نظام حياكة بلا خياطة يحتضن الجسم",
    "XS/S, M/L": "XS/S, M/L",
    "XS/S, M/L, L/XL": "XS/S, M/L, L/XL",
    "XS/S. M/L": "XS/S, M/L",
    "Yerli Üretim": "صناعة تركية",
    "Yüksek bel extra sıkılaştırıcı korse": "مشدّ بخصر عالٍ وتأثير شدّ إضافي",
    "yüksek bel": "خصر عالٍ",
    "Çift taraflı silikon bant": "شريط سيليكون مزدوج الجهة",
    "Çıkarılabilir askı": "حمالات قابلة للإزالة",
    "İnce kumaşı sayesinde iz yapmaz.": "قماشه الرقيق لا يترك أثرًا تحت الملابس.",
    "İpeksi dokunuş": "ملمس حريري",
}

with open(SRC, encoding="utf-8") as f:
    products = json.load(f)

def build(cat_map, color_map, feat_map):
    out = []
    for p in products:
        out.append({
            **p,
            "categories": [cat_map.get(c, c) for c in p["categories"]],
            "colors": [color_map.get(c, c) for c in p["colors"]],
            "features": [feat_map.get(ft, ft) for ft in p["features"]],
        })
    return out

en = build(CAT_EN, COLOR_EN, FEATURE_EN)
ar = build(CAT_AR, COLOR_AR, FEATURE_AR)

with open("/Users/macos/ErgenTekstil/src/data/products.en.json", "w", encoding="utf-8") as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
with open("/Users/macos/ErgenTekstil/src/data/products.ar.json", "w", encoding="utf-8") as f:
    json.dump(ar, f, ensure_ascii=False, indent=2)

# sanity: report any feature not translated
all_feats = set()
for p in products:
    all_feats.update(p["features"])
missing = [f for f in all_feats if f not in FEATURE_EN]
print("Çevrilmeyen özellik sayısı:", len(missing))
for m in missing:
    print(" -", m)
print("Tamam: products.en.json ve products.ar.json yazıldı")

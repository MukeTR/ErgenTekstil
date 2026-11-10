import type { Locale } from "@/i18n/routing";

/**
 * "Seamless (dikişsiz) tayt üreticisi" aramaları için hedef sayfa metinleri.
 * Yalnızca sitedeki doğrulanmış bilgilere dayanır (2004, Kapaklı fabrikası, 200.000 parça/ay,
 * üç kıtaya ihracat, özel marka üretim). Adet/termin gibi teklife bağlı konularda rakam verilmez.
 */
export type LeggingsLanding = {
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  intro: string;
  factsTitle: string;
  facts: { value: string; label: string }[];
  productsTitle: string;
  productsText: string;
  fabricTitle: string;
  fabricText: string;
  processTitle: string;
  processText: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
};

export const LEGGINGS_LANDING: Record<Locale, LeggingsLanding> = {
  tr: {
    navLabel: "Seamless Tayt Üreticisi",
    metaTitle: "Seamless Tayt Üreticisi | Dikişsiz Tayt Toptan ve Özel Marka Üretim",
    metaDescription:
      "Ergen Tekstil, 2004'ten beri Tekirdağ Kapaklı'daki kendi fabrikasında seamless (dikişsiz) tayt, biker şort ve spor takım üretiyor. Aylık 200.000 parça kapasite, özel marka (private label) ve toptan üretim.",
    kicker: "Dikişsiz tayt üretimi",
    h1: "Seamless Tayt Üreticisi",
    intro:
      "Ergen Tekstil, seamless (dikişsiz) tayt, kapri, biker şort, büstiyer ve spor takımlarını Tekirdağ Kapaklı'daki kendi fabrikasında üretir. Örmeden dikime, kalite kontrolden paketlemeye kadar süreç tek çatı altında yürür; markalar için özel marka (private label) ve toptan üretim yapıyoruz.",
    factsTitle: "Rakamlarla üretimimiz",
    facts: [
      { value: "2004", label: "Kuruluş yılı" },
      { value: "200.000", label: "Aylık parça üretim kapasitesi" },
      { value: "3", label: "Kıtaya ihracat: Avrupa, Afrika, Asya" },
      { value: "Kapaklı", label: "Kendi fabrikamız, Tekirdağ" },
    ],
    productsTitle: "Ürettiğimiz seamless tayt ve spor ürünleri",
    productsText:
      "Yüksek bel taytlar, fitilli ve melanj örgüler, toparlayıcı çift katlı modeller, kapri ve biker şortlar ile bunlarla takım olan büstiyer ve crop top'lar. Tüm modeller katalogda renk ve beden seçenekleriyle yer alır.",
    fabricTitle: "İplik ve kumaş seçenekleri",
    fabricText:
      "Poliamid ve elastan başta olmak üzere geri dönüştürülmüş, doğal ve fonksiyonel ipliklerle çalışıyoruz. Markanızın hedefine göre aşağıdaki özellikler ürüne kazandırılabilir.",
    processTitle: "Siparişiniz nasıl ilerler?",
    processText:
      "Talebinizi aldıktan sonra tasarım ve örgü geliştirme ile başlarız; ürün fabrikamızda örülür, dikilir, tek tek kontrol edilir ve paketlenerek sevk edilir. Boyama ve terbiye, hizmetimizin bir parçası olarak fabrika dışında yaptırılır.",
    faqTitle: "Sık sorulan sorular",
    faq: [
      {
        q: "Seamless (dikişsiz) tayt nedir?",
        a: "Seamless tayt, dairesel örme makinelerinde gövdesi tek parça olarak örülen tayttır. Yan dikiş bulunmadığı için vücuda daha iyi oturur, sürtünmeyi azaltır ve hareket halinde konfor sağlar.",
      },
      {
        q: "Kendi markam için (private label) tayt ürettirebilir miyim?",
        a: "Evet. Ergen Tekstil, markalar için özel marka üretim yapar; model, renk, beden ve iplik seçimi markanın talebine göre belirlenir.",
      },
      {
        q: "Üretim kapasiteniz nedir?",
        a: "Fabrikamızın üretim kapasitesi ayda 200.000 parçadır.",
      },
      {
        q: "Hangi iplikleri kullanıyorsunuz?",
        a: "Poliamid, elastan, geri dönüştürülmüş poliamid ve polyester, modal, bambu, pamuk, merinos yünü ile gümüş kaplamalı ve kozmetik poliamid gibi fonksiyonel iplikler kullanıyoruz.",
      },
      {
        q: "Minimum sipariş adedi ve termin süresi nedir?",
        a: "Minimum adet ve termin; modele, renk sayısına ve iplik seçimine göre değişir. Talebinizi iletişim formundan gönderdiğinizde size özel teklifle birlikte bildiriyoruz.",
      },
      {
        q: "Fabrikanız nerede?",
        a: "Genel merkezimiz ve fabrikamız Tekirdağ Kapaklı'da, Karaağaç Organize Sanayi Bölgesi'ndedir. İstanbul'da bir satış mağazamız bulunur.",
      },
      {
        q: "Hangi ülkelere ihracat yapıyorsunuz?",
        a: "Avrupa, Afrika ve Asya pazarlarındaki markalar için üretim ve ihracat yapıyoruz.",
      },
    ],
    ctaTitle: "Seamless tayt üretimi için teklif alın",
    ctaText: "Model, adet, beden ve renk bilgilerinizi gönderin; size özel teklif hazırlayalım.",
  },
  en: {
    navLabel: "Seamless Leggings Manufacturer",
    metaTitle: "Seamless Leggings Manufacturer in Turkey | Wholesale & Private Label",
    metaDescription:
      "Ergen Tekstil has manufactured seamless leggings, biker shorts and activewear sets in its own factory in Kapaklı, Tekirdağ, Turkey since 2004. 200,000 pieces per month, private label and wholesale production.",
    kicker: "Seamless leggings production",
    h1: "Seamless Leggings Manufacturer in Turkey",
    intro:
      "Ergen Tekstil manufactures seamless leggings, capris, biker shorts, sports bras and activewear sets in its own factory in Kapaklı, Tekirdağ, Turkey. From knitting to sewing, quality control and packaging, the process runs under one roof; we produce private label and wholesale orders for brands.",
    factsTitle: "Our production in numbers",
    facts: [
      { value: "2004", label: "Year founded" },
      { value: "200,000", label: "Pieces per month production capacity" },
      { value: "3", label: "Continents exported to: Europe, Africa, Asia" },
      { value: "Kapaklı", label: "Our own factory, Tekirdağ" },
    ],
    productsTitle: "Seamless leggings and activewear we produce",
    productsText:
      "High-waist leggings, ribbed and mélange knits, double-layer shaping styles, capris and biker shorts, with matching sports bras and crop tops. All styles are listed in the catalogue with colour and size options.",
    fabricTitle: "Yarn and fabric options",
    fabricText:
      "We work mainly with polyamide and elastane, as well as recycled, natural and functional yarns. Depending on your brand's goals, the following properties can be built into the product.",
    processTitle: "How your order progresses",
    processText:
      "After receiving your request we start with design and knit development; the product is knitted, sewn, inspected piece by piece, packed and shipped from our factory. Dyeing and finishing are provided as part of our service and carried out outside the factory.",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What are seamless leggings?",
        a: "Seamless leggings are knitted on circular knitting machines so that the body of the garment comes out in one piece. With no side seams they fit closer to the body, reduce chafing and stay comfortable in motion.",
      },
      {
        q: "Can I have leggings produced under my own brand (private label)?",
        a: "Yes. Ergen Tekstil produces private label orders for brands; style, colour, size range and yarn are defined according to the brand's request.",
      },
      {
        q: "What is your production capacity?",
        a: "Our factory has a production capacity of 200,000 pieces per month.",
      },
      {
        q: "Which yarns do you use?",
        a: "Polyamide, elastane, recycled polyamide and polyester, modal, bamboo, cotton, merino wool, and functional yarns such as silver-coated and cosmetic polyamide.",
      },
      {
        q: "What are the minimum order quantity and lead time?",
        a: "Minimum quantity and lead time depend on the style, number of colours and yarn. Send your request through the contact form and we will state them in a quote prepared for you.",
      },
      {
        q: "Where is your factory?",
        a: "Our headquarters and factory are in the Karaağaç Organized Industrial Zone in Kapaklı, Tekirdağ, Turkey. We also have a sales store in Istanbul.",
      },
      {
        q: "Which regions do you export to?",
        a: "We manufacture and export for brands in European, African and Asian markets.",
      },
    ],
    ctaTitle: "Request a quote for seamless leggings production",
    ctaText: "Send us your style, quantity, size and colour details and we will prepare a quote for you.",
  },
  de: {
    navLabel: "Seamless-Leggings-Hersteller",
    metaTitle: "Seamless-Leggings-Hersteller in der Türkei | Großhandel & Private Label",
    metaDescription:
      "Ergen Tekstil fertigt seit 2004 nahtlose (seamless) Leggings, Biker-Shorts und Sport-Sets im eigenen Werk in Kapaklı, Tekirdağ, Türkei. 200.000 Teile pro Monat, Private-Label- und Großhandelsproduktion.",
    kicker: "Seamless-Leggings-Fertigung",
    h1: "Seamless-Leggings-Hersteller in der Türkei",
    intro:
      "Ergen Tekstil fertigt nahtlose Leggings, Capris, Biker-Shorts, Sport-BHs und Sport-Sets im eigenen Werk in Kapaklı, Tekirdağ, Türkei. Vom Stricken über das Nähen und die Qualitätskontrolle bis zur Verpackung läuft der Prozess unter einem Dach; wir produzieren Private-Label- und Großhandelsaufträge für Marken.",
    factsTitle: "Unsere Produktion in Zahlen",
    facts: [
      { value: "2004", label: "Gründungsjahr" },
      { value: "200.000", label: "Teile Produktionskapazität pro Monat" },
      { value: "3", label: "Export-Kontinente: Europa, Afrika, Asien" },
      { value: "Kapaklı", label: "Eigenes Werk, Tekirdağ" },
    ],
    productsTitle: "Seamless-Leggings und Sportbekleidung aus unserer Fertigung",
    productsText:
      "High-Waist-Leggings, gerippte und melierte Strickarten, doppellagige figurformende Modelle, Capris und Biker-Shorts sowie passende Sport-BHs und Crop-Tops. Alle Modelle finden Sie im Katalog mit Farb- und Größenoptionen.",
    fabricTitle: "Garn- und Stoffoptionen",
    fabricText:
      "Wir arbeiten vor allem mit Polyamid und Elasthan sowie mit recycelten, natürlichen und funktionalen Garnen. Je nach Ziel Ihrer Marke können folgende Eigenschaften in das Produkt eingebracht werden.",
    processTitle: "So läuft Ihr Auftrag ab",
    processText:
      "Nach Eingang Ihrer Anfrage beginnen wir mit Design und Strickentwicklung; das Produkt wird in unserem Werk gestrickt, genäht, einzeln geprüft, verpackt und versandt. Färben und Veredeln gehören zu unserem Service und erfolgen außerhalb des Werks.",
    faqTitle: "Häufig gestellte Fragen",
    faq: [
      {
        q: "Was sind Seamless-Leggings?",
        a: "Seamless-Leggings werden auf Rundstrickmaschinen so gestrickt, dass der Körper des Kleidungsstücks in einem Stück entsteht. Ohne Seitennähte sitzen sie enger am Körper, reiben weniger und bleiben in Bewegung bequem.",
      },
      {
        q: "Kann ich Leggings unter meiner eigenen Marke (Private Label) fertigen lassen?",
        a: "Ja. Ergen Tekstil fertigt Private-Label-Aufträge für Marken; Modell, Farbe, Größenlauf und Garn werden nach Wunsch der Marke festgelegt.",
      },
      {
        q: "Wie hoch ist Ihre Produktionskapazität?",
        a: "Unser Werk hat eine Produktionskapazität von 200.000 Teilen pro Monat.",
      },
      {
        q: "Welche Garne verwenden Sie?",
        a: "Polyamid, Elasthan, recyceltes Polyamid und Polyester, Modal, Bambus, Baumwolle, Merinowolle sowie funktionale Garne wie silberbeschichtetes und kosmetisches Polyamid.",
      },
      {
        q: "Wie hoch sind Mindestbestellmenge und Lieferzeit?",
        a: "Mindestmenge und Lieferzeit hängen von Modell, Anzahl der Farben und Garn ab. Senden Sie Ihre Anfrage über das Kontaktformular; wir nennen beides in einem für Sie erstellten Angebot.",
      },
      {
        q: "Wo befindet sich Ihr Werk?",
        a: "Unser Hauptsitz und unser Werk befinden sich im Organisierten Industriegebiet Karaağaç in Kapaklı, Tekirdağ, Türkei. Außerdem haben wir ein Verkaufsgeschäft in Istanbul.",
      },
      {
        q: "In welche Regionen exportieren Sie?",
        a: "Wir fertigen und exportieren für Marken in Europa, Afrika und Asien.",
      },
    ],
    ctaTitle: "Angebot für Seamless-Leggings-Fertigung anfordern",
    ctaText: "Senden Sie uns Modell, Menge, Größen und Farben; wir erstellen ein Angebot für Sie.",
  },
  ru: {
    navLabel: "Производитель бесшовных леггинсов",
    metaTitle: "Производитель бесшовных леггинсов в Турции | Опт и private label",
    metaDescription:
      "Ergen Tekstil с 2004 года производит бесшовные (seamless) леггинсы, велосипедки и спортивные комплекты на собственной фабрике в Капаклы, Текирдаг, Турция. 200 000 изделий в месяц, производство под частной маркой и оптом.",
    kicker: "Производство бесшовных леггинсов",
    h1: "Производитель бесшовных леггинсов в Турции",
    intro:
      "Ergen Tekstil производит бесшовные леггинсы, капри, велосипедки, спортивные топы и комплекты на собственной фабрике в Капаклы, Текирдаг, Турция. От вязания до пошива, контроля качества и упаковки процесс идёт под одной крышей; мы выполняем заказы под частной маркой и оптовые заказы для брендов.",
    factsTitle: "Наше производство в цифрах",
    facts: [
      { value: "2004", label: "Год основания" },
      { value: "200 000", label: "Изделий в месяц — производственная мощность" },
      { value: "3", label: "Континента экспорта: Европа, Африка, Азия" },
      { value: "Капаклы", label: "Собственная фабрика, Текирдаг" },
    ],
    productsTitle: "Бесшовные леггинсы и спортивная одежда нашего производства",
    productsText:
      "Леггинсы с высокой талией, вязка в рубчик и меланж, двухслойные корректирующие модели, капри и велосипедки, а также подходящие к ним спортивные топы и кроп-топы. Все модели представлены в каталоге с вариантами цветов и размеров.",
    fabricTitle: "Пряжа и свойства полотна",
    fabricText:
      "Мы работаем в основном с полиамидом и эластаном, а также с переработанной, натуральной и функциональной пряжей. В зависимости от задач вашего бренда изделию можно придать следующие свойства.",
    processTitle: "Как выполняется ваш заказ",
    processText:
      "Получив запрос, мы начинаем с дизайна и разработки вязки; изделие вяжется, шьётся, проверяется поштучно, упаковывается и отгружается с нашей фабрики. Крашение и отделка входят в наш сервис и выполняются за пределами фабрики.",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Что такое бесшовные леггинсы?",
        a: "Бесшовные леггинсы вяжутся на кругловязальных машинах так, что основная часть изделия получается цельной. Без боковых швов они лучше облегают тело, меньше натирают и удобны в движении.",
      },
      {
        q: "Можно ли заказать леггинсы под собственной маркой (private label)?",
        a: "Да. Ergen Tekstil выполняет заказы под частной маркой; модель, цвет, размерный ряд и пряжа определяются по запросу бренда.",
      },
      {
        q: "Какова ваша производственная мощность?",
        a: "Мощность нашей фабрики — 200 000 изделий в месяц.",
      },
      {
        q: "Какую пряжу вы используете?",
        a: "Полиамид, эластан, переработанные полиамид и полиэстер, модал, бамбук, хлопок, мериносовую шерсть, а также функциональную пряжу — полиамид с серебряным покрытием и косметический полиамид.",
      },
      {
        q: "Каковы минимальный заказ и сроки?",
        a: "Минимальное количество и сроки зависят от модели, числа цветов и пряжи. Отправьте запрос через контактную форму, и мы укажем их в подготовленном для вас предложении.",
      },
      {
        q: "Где находится ваша фабрика?",
        a: "Наш головной офис и фабрика находятся в Организованной промышленной зоне Караагач в Капаклы, Текирдаг, Турция. В Стамбуле работает наш магазин продаж.",
      },
      {
        q: "В какие регионы вы экспортируете?",
        a: "Мы производим и экспортируем продукцию для брендов Европы, Африки и Азии.",
      },
    ],
    ctaTitle: "Запросите предложение на производство бесшовных леггинсов",
    ctaText: "Пришлите модель, количество, размеры и цвета — мы подготовим для вас предложение.",
  },
  ar: {
    navLabel: "مصنع ليقنز بلا خياطة",
    metaTitle: "مصنع ليقنز بلا خياطة في تركيا | جملة وعلامة خاصة",
    metaDescription:
      "تنتج أرجن تكستيل منذ عام 2004 الليقنز بلا خياطة (seamless) وشورتات البايكر والأطقم الرياضية في مصنعها الخاص في كاباكلي، تكيرداغ، تركيا. طاقة إنتاجية 200,000 قطعة شهرياً، إنتاج بعلامة خاصة وبالجملة.",
    kicker: "إنتاج الليقنز بلا خياطة",
    h1: "مصنع ليقنز بلا خياطة في تركيا",
    intro:
      "تنتج أرجن تكستيل الليقنز بلا خياطة والكابري وشورتات البايكر وحمالات الصدر الرياضية والأطقم الرياضية في مصنعها الخاص في كاباكلي، تكيرداغ، تركيا. من الحياكة إلى الخياطة ومراقبة الجودة والتعبئة تجري العملية تحت سقف واحد؛ وننفذ طلبات العلامة الخاصة والجملة للعلامات التجارية.",
    factsTitle: "إنتاجنا بالأرقام",
    facts: [
      { value: "2004", label: "سنة التأسيس" },
      { value: "200,000", label: "قطعة شهرياً طاقة إنتاجية" },
      { value: "3", label: "قارات نصدّر إليها: أوروبا، أفريقيا، آسيا" },
      { value: "كاباكلي", label: "مصنعنا الخاص، تكيرداغ" },
    ],
    productsTitle: "الليقنز والملابس الرياضية بلا خياطة التي ننتجها",
    productsText:
      "ليقنز بخصر عالٍ، حياكة مضلعة وميلانج، موديلات مشدّة بطبقتين، كابري وشورتات بايكر، مع حمالات صدر رياضية وكروب توب متناسقة معها. جميع الموديلات معروضة في الكتالوج مع خيارات الألوان والمقاسات.",
    fabricTitle: "خيارات الخيوط والأقمشة",
    fabricText:
      "نعمل أساساً بالبولي أميد والإيلاستين، إضافة إلى الخيوط المعاد تدويرها والطبيعية والوظيفية. وبحسب هدف علامتك يمكن إكساب المنتج الخصائص التالية.",
    processTitle: "كيف يسير طلبك؟",
    processText:
      "بعد استلام طلبك نبدأ بالتصميم وتطوير الحياكة؛ ثم يُحاك المنتج ويُخاط ويُفحص قطعة قطعة ويُعبأ ويُشحن من مصنعنا. أما الصباغة والتشطيب فهما جزء من خدمتنا ويُنفَّذان خارج المصنع.",
    faqTitle: "الأسئلة الشائعة",
    faq: [
      {
        q: "ما هو الليقنز بلا خياطة؟",
        a: "الليقنز بلا خياطة يُحاك على آلات الحياكة الدائرية بحيث يخرج جسم القطعة قطعة واحدة. ولعدم وجود درزات جانبية يلتصق بالجسم بشكل أفضل ويقلّل الاحتكاك ويبقى مريحاً أثناء الحركة.",
      },
      {
        q: "هل يمكنني إنتاج ليقنز بعلامتي الخاصة؟",
        a: "نعم. تنفذ أرجن تكستيل طلبات العلامة الخاصة للعلامات التجارية؛ ويُحدَّد الموديل واللون والمقاسات والخيط بحسب طلب العلامة.",
      },
      {
        q: "ما هي طاقتكم الإنتاجية؟",
        a: "تبلغ الطاقة الإنتاجية لمصنعنا 200,000 قطعة شهرياً.",
      },
      {
        q: "ما الخيوط التي تستخدمونها؟",
        a: "البولي أميد، الإيلاستين، البولي أميد والبوليستر المعاد تدويرهما، المودال، البامبو، القطن، صوف الميرينو، وخيوط وظيفية مثل البولي أميد المطلي بالفضة والبولي أميد التجميلي.",
      },
      {
        q: "ما الحد الأدنى للطلب ومدة التسليم؟",
        a: "يختلف الحد الأدنى ومدة التسليم بحسب الموديل وعدد الألوان ونوع الخيط. أرسل طلبك عبر نموذج الاتصال وسنذكرهما في عرض سعر خاص بك.",
      },
      {
        q: "أين يقع مصنعكم؟",
        a: "يقع مقرنا الرئيسي ومصنعنا في المنطقة الصناعية المنظمة كاراآغاتش في كاباكلي، تكيرداغ، تركيا. ولدينا متجر مبيعات في إسطنبول.",
      },
      {
        q: "إلى أي مناطق تصدّرون؟",
        a: "ننتج ونصدّر لعلامات تجارية في أسواق أوروبا وأفريقيا وآسيا.",
      },
    ],
    ctaTitle: "اطلب عرض سعر لإنتاج الليقنز بلا خياطة",
    ctaText: "أرسل لنا الموديل والكمية والمقاسات والألوان لنعدّ لك عرض سعر خاصاً.",
  },
};

import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import MetaContactLink from "./MetaContactLink";

const WHATSAPP_NUMBER = "905345936891";

export default async function WhatsAppButton({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <MetaContactLink
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      channel="whatsapp"
      label={t("whatsapp")}
      className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 fill-white"
      >
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.697 4.611 1.902 6.482L4 29l7.72-1.862A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3Zm6.988 16.87c-.297.836-1.47 1.53-2.41 1.73-.64.135-1.475.243-4.29-.92-3.6-1.49-5.916-5.14-6.098-5.378-.176-.239-1.463-1.948-1.463-3.716 0-1.768.928-2.638 1.257-3 .33-.362.72-.453.96-.453.24 0 .48.002.69.013.221.011.518-.084.81.618.298.717 1.014 2.485 1.104 2.666.09.18.15.393.03.632-.12.24-.18.39-.36.6-.18.21-.378.469-.54.63-.18.18-.367.375-.158.735.21.36.933 1.54 2.003 2.494 1.377 1.228 2.538 1.608 2.898 1.789.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.097.99 2.457 1.17.36.18.6.27.69.42.09.15.09.868-.207 1.705Z" />
      </svg>
    </MetaContactLink>
  );
}

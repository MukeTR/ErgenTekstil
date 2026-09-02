import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Ergen Tekstil Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${montserrat.variable} ${roboto.variable}`}>
      <body className="min-h-screen bg-brand-grey-light text-brand-navy antialiased">
        {children}
      </body>
    </html>
  );
}

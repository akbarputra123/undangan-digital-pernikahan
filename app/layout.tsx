
import "./globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import type { Metadata } from "next";

/* =========================================================
   💍 FONT — PLAYFAIR DISPLAY
   ========================================================= */

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

/* =========================================================
   💍 FONT — MONTSERRAT
   ========================================================= */

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* =========================================================
   📌 METADATA
   ========================================================= */

export const metadata: Metadata = {
  /*
   * 🌐 DOMAIN UTAMA
   */
  metadataBase: new URL(
    "https://undangan-pernikahan-bayani-faldi.vercel.app"
  ),

  /*
   * 📝 TITLE
   */
  title: "Undangan Pernikahan — Bayani & Faldi",

  /*
   * 📝 DESCRIPTION
   */
  description:
    "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk hadir dalam acara pernikahan Bayani Gusti A, Md, Kep & Faldi Kader pada Rabu, 23 September 2026.",

  /* =======================================================
     💍 FAVICON / ICON TAB
     ======================================================= */

  icons: {
    icon: "/2.jpeg",
  },

  /* =======================================================
     🌐 OPEN GRAPH
     ======================================================= */

  openGraph: {
    title: "Undangan Pernikahan — Bayani & Faldi",

    description:
      "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk hadir dalam acara pernikahan Bayani Gusti A, Md, Kep & Faldi Kader pada Rabu, 23 September 2026.",

    url: "https://undangan-pernikahan-bayani-faldi.vercel.app",

    siteName: "Undangan Digital Pernikahan",

    /*
     * 🔥 GAMBAR SHARE LINK
     *
     * File:
     * public/cover1.jpeg
     *
     * URL:
     * /cover1.jpeg
     */

    images: [
      {
        url: "/cover1.jpeg",
        width: 1200,
        height: 630,
        alt: "Undangan Pernikahan Bayani & Faldi",
      },
    ],

    locale: "id_ID",

    type: "website",
  },

  /* =======================================================
     🐦 TWITTER / X
     ======================================================= */

  twitter: {
    card: "summary_large_image",

    title: "Undangan Pernikahan — Bayani & Faldi",

    description:
      "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk hadir dalam acara pernikahan Bayani Gusti A, Md, Kep & Faldi Kader pada Rabu, 23 September 2026.",

    /*
     * 🔥 GAMBAR SHARE
     */

    images: ["/cover1.jpeg"],
  },

  /* =======================================================
     🤖 ROBOTS
     ======================================================= */

  robots: {
    index: true,
    follow: true,
  },
};

/* =========================================================
   💍 ROOT LAYOUT
   ========================================================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${playfair.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
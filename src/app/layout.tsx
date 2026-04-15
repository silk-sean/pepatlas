import type { Metadata } from "next";
import { Inter, Outfit, Pacifico } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Providers } from "@/components/providers";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

const pacifico = Pacifico({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — The Peptide Community`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — The Peptide Community`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${pacifico.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col relative"
        style={{ backgroundColor: "#111118", color: "#FFFFFF" }}
      >
        <Providers>
          <div className="texture-overlay" />
          <Navbar />
          <main className="flex-1 relative z-[1]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

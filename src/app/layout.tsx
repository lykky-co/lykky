import type { Metadata } from "next";
import { Cormorant_Garamond, Archivo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300"],
  style: ["italic"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["200", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lykky.co"),
  title: "Lykky — GTM Toolkit for Nordic Founders",
  description:
    "Open-source go-to-market playbooks, templates, and tools built for Nordic startup founders expanding across the Nordics and into Europe.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Lykky",
    url: "/",
    title: "Lykky — GTM Toolkit for Nordic Founders",
    description:
      "Open-source go-to-market playbooks, templates, and tools built for Nordic startup founders expanding across the Nordics and into Europe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lykky — GTM Toolkit for Nordic Founders",
    description:
      "Open-source go-to-market playbooks, templates, and tools built for Nordic startup founders expanding across the Nordics and into Europe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorantGaramond.variable} ${archivo.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

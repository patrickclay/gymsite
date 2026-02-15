import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitnesssite-six.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "A Fitness Program That Actually Sees You | Coming Soon to Atlanta",
  description: "Small group fitness classes with real coaching. Strength, kickboxing, and somatic movement in an intimate setting where coaches know your name. Help us build it.",
  openGraph: {
    title: "A Fitness Program That Actually Sees You | Coming Soon to Atlanta",
    description: "Small group fitness with real coaching. Strength, kickboxing, somatic movement. We're building something special—and we're building it with you.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

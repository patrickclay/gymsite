import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "New Fitness Studio Coming Soon | Atlanta Area",
  description: "Strength, conditioning, kickboxing, somatic movement. Two pros with 20+ years of experience are building something special. Get notified—and help us design the schedule.",
  openGraph: {
    title: "New Fitness Studio Coming Soon | Atlanta Area",
    description: "Strength, conditioning, kickboxing, somatic movement. We're building something special. Help us design it.",
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

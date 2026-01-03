import type { Metadata } from "next";
import { Inter, Space_Grotesk, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontBody = Inter({ subsets: ["latin"], variable: "--font-body" });
const fontHeadline = Space_Grotesk({ subsets: ["latin"], variable: "--font-headline" });
const fontCursive = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-cursive" });

export const metadata: Metadata = {
  title: "Loenora",
  description: "Styliste modéliste : Nour.Rabie",
};

export default function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontBody.variable,
          fontHeadline.variable,
          fontCursive.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

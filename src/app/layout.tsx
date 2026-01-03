import type { Metadata } from "next";
import { Inter, Space_Grotesk, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

const fontBody = Inter({ subsets: ["latin"], variable: "--font-body" });
const fontHeadline = Space_Grotesk({ subsets: ["latin"], variable: "--font-headline" });
const fontCursive = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-cursive" });

export const metadata: Metadata = {
  title: "Loenora",
  description: "Styliste modéliste : Nour.Rabie",
};

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

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
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

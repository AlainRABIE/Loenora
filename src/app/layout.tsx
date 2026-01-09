
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const fontBody = Inter({ subsets: ["latin"], variable: "--font-body" });
const fontHeadline = Space_Grotesk({ subsets: ["latin"], variable: "--font-headline" });
const fontCursive = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-cursive" });

export const metadata: Metadata = {
  title: "Loenora",
  description: "Styliste modéliste : Nour.Rabie",
};

type Props = {
  children: ReactNode;
};

function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<Props>) {

  return (
    <html lang="fr" suppressHydrationWarning>
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
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}

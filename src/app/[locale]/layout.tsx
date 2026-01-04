import { ReactNode } from "react";
import {NextIntlClientProvider, useMessages} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "@/components/theme-provider";
import ClientOnly from "@/components/client-only";
import { FirebaseClientProvider } from "@/firebase/client-provider";

type Props = {
    children: ReactNode;
    params: Promise<{locale: string}>;
};

function ClientLayout({ children, locale, messages }: { children: ReactNode, locale: string, messages: any }) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <FirebaseClientProvider>
            <ThemeProvider>
              <CartProvider>
                  <div className="relative flex min-h-dvh flex-col bg-background">
                    <ClientOnly>
                      <Header />
                    </ClientOnly>
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <Toaster />
              </CartProvider>
            </ThemeProvider>
          </FirebaseClientProvider>
        </NextIntlClientProvider>
    );
}


export default async function LocaleLayout({children, params}: Props) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <ClientLayout locale={locale} messages={messages}>
          {children}
        </ClientLayout>
    );
}

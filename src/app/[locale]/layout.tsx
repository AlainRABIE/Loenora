import { ReactNode } from "react";
import {NextIntlClientProvider, useMessages} from 'next-intl';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";

type Props = {
    children: ReactNode;
    params: {locale: string};
};

export default function LocaleLayout({children, params: {locale}}: Props) {
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
              <div className="relative flex min-h-dvh flex-col bg-background">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
          </CartProvider>
        </NextIntlClientProvider>
    );
}

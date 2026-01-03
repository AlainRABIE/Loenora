import { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from 'next-intl';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params }: Props) {
  const messages = useMessages();
  
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
    </NextIntlClientProvider>
  )
}

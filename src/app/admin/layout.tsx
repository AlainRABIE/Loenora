
import { ReactNode } from "react";
import Header from "@/components/layout/header";
import { CartProvider } from "@/context/cart-context";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";


export const dynamic = 'force-dynamic';
export const dynamicParams = true;

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function AdminLayout({ children, params }: Props) {
  const messages = await getMessages();
  const locale = params.locale || 'fr';
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <Header />
        {children}
      </CartProvider>
    </NextIntlClientProvider>
  );
}
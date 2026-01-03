"use client";

import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type Props = {
  children: ReactNode;
};

export default function LocaleLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
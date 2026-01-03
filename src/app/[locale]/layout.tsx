import { ReactNode } from "react";
import RootLayout from "../layout";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params }: Props) {
  return (
    <RootLayout params={params}>
        {children}
    </RootLayout>
  )
}

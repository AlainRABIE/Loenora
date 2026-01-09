import { ReactNode } from "react";

export const dynamic = 'force-dynamic';

type Props = {
  children: ReactNode;
};

export default function ProductsLayout({ children }: Props) {
  return <>{children}</>;
}

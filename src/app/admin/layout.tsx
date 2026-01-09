import { ReactNode } from "react";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return <>{children}</>;
}


import { ReactNode } from "react";
import Header from "@/components/layout/header";
import { CartProvider } from "@/context/cart-context";

export const dynamic = 'force-dynamic';

type Props = {
  children: ReactNode;
};

  return (
    <CartProvider>
      <Header />
      {children}
    </CartProvider>
  );
}
}

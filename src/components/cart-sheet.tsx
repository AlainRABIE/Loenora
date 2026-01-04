"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { X, Minus, Plus } from "lucide-react";
import { Separator } from "./ui/separator";
import { useTranslations } from "next-intl";

export default function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, totalItems } = useCart();
  const t = useTranslations('CartSheet');

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>{t('title', {count: totalItems})}</SheetTitle>
      </SheetHeader>
      <Separator />
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 px-6 py-4">
            {cartItems.map((item) => {
              const image = PlaceHolderImages.find(img => img.id === item.imageId);
              return (
                <div key={item.id} className="flex items-start gap-4">
                  {image && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image
                            src={image.imageUrl}
                            alt={item.name}
                            data-ai-hint={image.imageHint}
                            fill
                            className="object-cover"
                        />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Link href={`/products/${item.slug}`} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="h-7 w-12 text-center mx-2"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              );
            })}
            </div>
          </ScrollArea>
          <Separator />
          <SheetFooter className="px-6 py-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>{t('subtotal')}</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <SheetClose asChild>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/checkout">{t('continueToCheckout')}</Link>
                </Button>
            </SheetClose>
            <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/products">{t('continueShopping')}</Link>
                </Button>
            </SheetClose>
          </SheetFooter>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <h3 className="text-lg font-semibold">{t('emptyCartTitle')}</h3>
          <p className="text-muted-foreground text-center">
            {t('emptyCartMessage')}
          </p>
          <SheetClose asChild>
            <Button asChild>
                <Link href="/products">{t('startShopping')}</Link>
            </Button>
          </SheetClose>
        </div>
      )}
    </SheetContent>
  );
}

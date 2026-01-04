"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  // Utiliser les images du produit ou chercher dans PlaceHolderImages ou utiliser l'image par défaut
  const productImage = product.images?.[0]?.url || 
    PlaceHolderImages.find(img => img.id === product.imageId)?.imageUrl || 
    '/default-product.jpg';
  const t = useTranslations('ProductCard');

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="group">
        <CardHeader className="p-0">
          <div className="relative h-60 w-full overflow-hidden">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <CardTitle className="text-lg font-semibold leading-tight mb-1 truncate group-hover:text-primary">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{product.category}</CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-primary">{product.price.toFixed(2)} TND</p>
            {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">{product.originalPrice.toFixed(2)} TND</p>
            )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addToCart(product.id, 1)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
}

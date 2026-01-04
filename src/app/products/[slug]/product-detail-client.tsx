"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Truck, ShieldCheck } from "lucide-react";
import ProductImageCarousel from "@/components/product-image-carousel";
import AddToCartButton from "./add-to-cart-button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductDetailClientProps {
  product: Product;
  productImage: string;
  hasMultipleImages: boolean;
  translations: {
    reviews: string;
    colors: string;
    freeShipping: string;
    warranty: string;
  };
}

export default function ProductDetailClient({
  product,
  productImage,
  hasMultipleImages,
  translations,
}: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || ""
  );

  return (
    <>
      <div className="bg-card p-4 rounded-lg">
        {hasMultipleImages ? (
          <ProductImageCarousel
            images={product.images!}
            productName={product.name}
            colors={product.colors || []}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex text-accent">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current text-muted-foreground/30" />
            </div>
            <span className="text-sm text-muted-foreground">
              {translations.reviews}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-primary">
            {product.price.toFixed(2)} TND
          </p>
          {product.originalPrice && (
            <p className="text-xl text-muted-foreground line-through">
              {product.originalPrice.toFixed(2)} TND
            </p>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        {product.colors && product.colors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              {translations.colors}:
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const colorImage = product.images?.find(
                  (img) => img.color === color
                );
                return (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "transition-all",
                      selectedColor === color &&
                        "ring-2 ring-primary ring-offset-2"
                    )}
                  >
                    {colorImage && (
                      <div className="w-4 h-4 rounded-full mr-2 overflow-hidden border">
                        <Image
                          src={colorImage.url}
                          alt={color}
                          width={16}
                          height={16}
                          className="object-cover"
                        />
                      </div>
                    )}
                    {color}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <AddToCartButton productId={product.id} />

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-accent" />
            <p className="text-sm font-medium">{translations.freeShipping}</p>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <p className="text-sm font-medium">{translations.warranty}</p>
          </div>
        </div>
      </div>
    </>
  );
}

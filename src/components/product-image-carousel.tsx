"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductImage {
  color: string;
  url: string;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productName: string;
  colors: string[];
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}

export default function ProductImageCarousel({ 
  images, 
  productName,
  colors,
  selectedColor: externalSelectedColor,
  onColorChange
}: ProductImageCarouselProps) {
  const [internalSelectedColor, setInternalSelectedColor] = useState<string>(colors[0]);
  const selectedColor = externalSelectedColor || internalSelectedColor;
  
  const handleColorChange = (color: string) => {
    setInternalSelectedColor(color);
    onColorChange?.(color);
  };
  
  // Filtrer les images par couleur sélectionnée
  const filteredImages = selectedColor 
    ? images.filter(img => img.color === selectedColor)
    : images;

  return (
    <div className="space-y-4">
      {/* Carrousel d'images */}
      <Carousel className="w-full">
        <CarouselContent>
          {filteredImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="border-0">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.url}
                    alt={`${productName} - ${image.color}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {filteredImages.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Miniatures pour navigation rapide */}
      {filteredImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filteredImages.map((image, index) => (
            <button
              key={index}
              className="relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
            >
              <Image
                src={image.url}
                alt={`Miniature ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

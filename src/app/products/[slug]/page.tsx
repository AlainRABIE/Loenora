import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Star, Truck, ShieldCheck, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/product-card";
import AddToCartButton from "./add-to-cart-button";
import AIRecommendations from "@/components/ai-recommendations";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-card p-4 rounded-lg">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {image && (
              <Image
                src={image.imageUrl}
                alt={product.name}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex text-accent">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current text-muted-foreground/30" />
              </div>
              <span className="text-sm text-muted-foreground">(123 reviews)</span>
            </div>
          </div>
          
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <AddToCartButton productId={product.id} />

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-accent" />
              <p className="text-sm font-medium">Free shipping on orders over $50</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <p className="text-sm font-medium">2-Year manufacturer warranty</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20">
        <AIRecommendations currentProductId={product.id} />
      </div>
    </div>
  );
}

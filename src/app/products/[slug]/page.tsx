import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Star, Truck, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/product-card";
import AddToCartButton from "./add-to-cart-button";
import { getTranslations } from "next-intl/server";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const t = await getTranslations('ProductPage');
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === product.imageId);
  const relatedProducts = products.filter(p => p.id !== product.id);

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
              <span className="text-sm text-muted-foreground">{t('reviews', {count: 123})}</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-primary">{product.price.toFixed(2)} TND</p>
            {product.originalPrice && (
              <p className="text-xl text-muted-foreground line-through">{product.originalPrice.toFixed(2)} TND</p>
            )}
          </div>
          
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {product.colors && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">{t('colors')}:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <Button key={color} variant="outline" size="sm">{color}</Button>
                ))}
              </div>
            </div>
          )}
          
          <AddToCartButton productId={product.id} />

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-accent" />
              <p className="text-sm font-medium">{t('freeShipping')}</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <p className="text-sm font-medium">{t('warranty')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">{t('youMightAlsoLike')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>
    </div>
  );
}

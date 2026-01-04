import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import InitializeCollectionsButton from "@/components/admin/initialize-collections-button";

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] w-full">
        {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              Le Style Redéfini.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Découvrez des collections uniques et des pièces exclusives. L'avenir de votre garde-robe est ici.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/#featured-products">
                  Acheter maintenant <ShoppingCart className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">
                  Explorer les collections <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="mt-6">
              <InitializeCollectionsButton />
            </div>
          </div>
        </div>
      </section>

      <section id="featured-products" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Nos Créations</h2>
            <p className="text-muted-foreground mt-2">Découvrez notre sélection exclusive.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">Voir tous les produits</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

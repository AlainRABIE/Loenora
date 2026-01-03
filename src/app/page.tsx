import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Shirt, Hand, DraftingCompass } from "lucide-react";

const categories = [
  { name: "Tops", icon: <Shirt className="size-8" />, href: "#" },
  { name: "Pantalons", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 22a2.5 2.5 0 0 0-3-2H10.5a2.5 2.5 0 0 0-3 2"/><path d="M7 2a2 2 0 0 0-2 2v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2H7Z"/><path d="M12 11h.01"/><path d="M12 7h.01"/></svg>, href: "#" },
  { name: "Accessoires", icon: <Gem className="size-8" />, href: "#" },
  { name: "Robes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>, href: "#" },
];

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
                <Link href="#">
                  Explorer les collections <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Acheter par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-4 bg-accent/10 rounded-full text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  {category.icon}
                </div>
                <span className="text-lg font-semibold text-card-foreground">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-products" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Produits populaires</h2>
            <p className="text-muted-foreground mt-2">Découvrez notre sélection des meilleurs articles.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
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

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const categories = [
  { name: "Electronics", icon: <Zap className="size-8" />, href: "#" },
  { name: "Apparel", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.42 12.3-6.03-6.03c-1.17-1.17-3.07-1.17-4.24 0l-6.03 6.03c-1.17 1.17-1.17 3.07 0 4.24l6.03 6.03c1.17 1.17 3.07 1.17 4.24 0l6.03-6.03c1.17-1.17 1.17-3.07 0-4.24Z"/><path d="M16 9h-4"/><path d="M14 11v4"/><path d="M12 15h0"/></svg>, href: "#" },
  { name: "Home Goods", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, href: "#" },
  { name: "Books", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>, href: "#" },
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
              Next-Gen Style, Delivered.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Discover curated collections and exclusive pieces. The future of your wardrobe is here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/#featured-products">
                  Shop Now <ShoppingCart className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#">
                  Explore Collections <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Shop by Category</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Check out our hand-picked selection of the best items.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

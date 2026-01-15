'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useState, useEffect } from 'react';
import { getAllProducts } from '@/firebase/products';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Package, Users, ShoppingBag, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import InitializeCollectionsButton from "@/components/admin/initialize-collections-button";
import type { Product } from '@/lib/types';

export default function HomePageClient() {
  const { user, isAdmin, loading, userProfile } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    console.log('HomePageClient - user:', user?.email);
    console.log('HomePageClient - isAdmin:', isAdmin);
    console.log('HomePageClient - userProfile:', userProfile);
    console.log('HomePageClient - loading:', loading);
  }, [user, isAdmin, userProfile, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Chargement...</p>
      </div>
    );
  }

  // Affichage du dashboard admin si l'utilisateur est admin
  if (user && isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">Bienvenue {user?.displayName || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Produits actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">En attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Clients actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 TND</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Gérez rapidement votre boutique</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto py-6 flex-col">
              <Link href="/admin/products/new">
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-base">Ajouter un Produit</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col">
              <Link href="/admin/products">
                <Package className="h-8 w-8 mb-2" />
                <span className="text-base">Gérer les Produits</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col">
              <Link href="/admin/orders">
                <ShoppingBag className="h-8 w-8 mb-2" />
                <span className="text-base">Voir les Commandes</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Produits récents */}
        <Card>
          <CardHeader>
            <CardTitle>Produits Récents</CardTitle>
            <CardDescription>Vos derniers produits ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Button asChild variant="outline">
                <Link href="/admin/products">Voir tous les produits</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <InitializeCollectionsButton />
        </div>
      </div>
    );
  }

  // Affichage normal pour les visiteurs et utilisateurs réguliers
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

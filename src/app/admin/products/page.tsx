'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { getAllProducts, deleteProduct } from '@/firebase/products';
import { deleteMultipleImages } from '@/firebase/storage';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AdminProductsPage() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
      return;
    }

    if (!userLoading && user && !isAdmin) {
      router.push('/');
      toast({
        title: 'Accès refusé',
        description: 'Vous n\'avez pas les permissions pour accéder à cette page.',
        variant: 'destructive',
      });
    }
  }, [user, isAdmin, userLoading, router, toast]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les produits.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      // Supprimer les images du storage
      if (product.images && product.images.length > 0) {
        const imagePaths = product.images
          .map(img => (img as any).path)
          .filter(Boolean);
        
        if (imagePaths.length > 0) {
          await deleteMultipleImages(imagePaths);
        }
      }

      // Supprimer le produit
      await deleteProduct(product.id);

      toast({
        title: 'Produit supprimé',
        description: 'Le produit a été supprimé avec succès.',
      });

      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer le produit.',
      });
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestion des produits</h1>
          <p className="text-muted-foreground">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Aucun produit pour le moment</p>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Créer votre premier produit
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const firstImage = product.images?.[0]?.url || '/placeholder.svg';
            const isPublished = (product as any).published !== false;

            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={firstImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {isPublished ? (
                      <Badge variant="default" className="bg-green-500">
                        <Eye className="mr-1 h-3 w-3" />
                        Publié
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="mr-1 h-3 w-3" />
                        Brouillon
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{product.price} TND</p>
                      {product.originalPrice && (
                        <>
                          <p className="text-sm text-muted-foreground line-through">
                            {product.originalPrice} TND
                          </p>
                          <Badge variant="destructive" className="text-xs">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </Badge>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.colors?.map(color => (
                        <Badge key={color} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/admin/products/${product.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le produit "{product.name}" et toutes ses images seront supprimés définitivement.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

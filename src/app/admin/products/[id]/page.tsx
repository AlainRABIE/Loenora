'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { getProductById } from '@/firebase/products';
import ProductForm from '@/components/admin/product-form';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
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
    if (isAdmin && params.id) {
      loadProduct();
    }
  }, [isAdmin, params.id]);

  const loadProduct = async () => {
    try {
      const productId = params.id as string;
      const data = await getProductById(productId);
      
      if (!data) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Produit introuvable.',
        });
        router.push('/admin/products');
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger le produit.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAdmin || !product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Modifier le produit</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}

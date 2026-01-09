'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ProductForm from '@/components/admin/product-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewProductPage() {
  const { user, isAdmin, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user && !isAdmin) {
      router.push('/');
      toast({
        title: 'Accès refusé',
        description: 'Vous n\'avez pas les permissions pour accéder à cette page.',
        variant: 'destructive',
      });
    }
  }, [user, isAdmin, loading, router, toast]);

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Chargement...</p>
      </div>
    );
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Nouveau produit</h1>
        <p className="text-muted-foreground">Créez un nouveau produit pour votre boutique</p>
      </div>

      <ProductForm />
    </div>
  );
}

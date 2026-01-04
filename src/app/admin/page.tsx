'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { isUserAdmin } from '@/firebase/users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/user-management';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading && !user) {
        router.push('/login');
        return;
      }

      if (user) {
        const isAdmin = await isUserAdmin(user.uid);
        if (!isAdmin) {
          router.push('/');
          toast({
            title: 'Accès refusé',
            description: 'Vous n\'avez pas les permissions pour accéder à cette page.',
            variant: 'destructive',
          });
        }
      }
    };

    checkAdmin();
  }, [user, loading, router, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Administration</h1>
        <p className="text-muted-foreground">Gérez votre boutique en ligne</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="orders" asChild>
            <Link href="/admin/orders">Commandes</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

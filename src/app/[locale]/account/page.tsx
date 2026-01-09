'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { getUserOrders, type OrderData } from '@/firebase/orders';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, updateProfile } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { products } from '@/lib/data';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-green-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

function EditProfileDialog() {
  const { user } = useUser();
  const auth = useAuth();
  const t = useTranslations('AccountPage');
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName });
        toast({
          title: t('profileUpdatedTitle'),
          description: t('profileUpdatedDescription'),
        });
        setIsOpen(false);
      } catch (error: any) {
        console.error('Error updating profile:', error);
        toast({
          variant: 'destructive',
          title: t('updateErrorTitle'),
          description: error.message,
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t('editProfile')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdateProfile}>
          <DialogHeader>
            <DialogTitle>{t('editProfile')}</DialogTitle>
            <DialogDescription>{t('editProfileDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('nameLabel')}
              </Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t('cancelButton')}
              </Button>
            </DialogClose>
            <Button type="submit">{t('saveChangesButton')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default function AccountPage() {
  const { user, userProfile, isAdmin, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations('AccountPage');
  const [userOrders, setUserOrders] = useState<OrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.email) {
        try {
          const orders = await getUserOrders(user.email);
          setUserOrders(orders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('orderHistory')}</CardTitle>
              <CardDescription>{t('orderHistoryDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="text-center py-8">{t('loading')}</div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('noOrders') || 'Aucune commande pour le moment'}</p>
                  <Button asChild className="mt-4">
                    <Link href="/products">{t('startShopping') || 'Commencer vos achats'}</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((order: any) => {
                    const orderDate = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A';
                    return (
                      <div
                        key={order.id}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="space-y-1">
                            <p className="font-semibold">{t('orderNumber', {id: order.id}) || `Commande #${order.id.slice(0, 8)}`}</p>
                            <p className="text-sm text-muted-foreground">
                              {orderDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={statusColors[order.status] || 'bg-gray-500'}>
                              {order.status}
                            </Badge>
                            <p className="font-bold">{order.total.toFixed(2)} TND</p>
                          </div>
                        </div>
                        
                        {/* Afficher les articles de la commande */}
                        <div className="space-y-2 border-t pt-4">
                          {order.items.map((item: any, idx: number) => {
                            const product = products.find(p => p.id === item.id);
                            const productImage = product?.images?.[0]?.url || '/default-product.jpg';
                            return (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="relative h-12 w-12 rounded overflow-hidden">
                                  <Image
                                    src={productImage}
                                    alt={item.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} TND</p>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Bouton Voir détails */}
                        <div className="border-t pt-4">
                          <Button asChild variant="outline" className="w-full">
                            <Link href={`/account/orders/${order.id}`}>
                              Voir les informations complètes
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('accountDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="font-medium">
                <div className="flex items-center gap-2 mb-1">
                  <p>{user.displayName || t('noName')}</p>
                  {isAdmin && (
                    <Badge variant="default" className="bg-amber-500">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {user.email}
                </p>
              </div>
              {isAdmin && (
                <div className="pt-4 border-t">
                  <Button asChild className="w-full" variant="secondary">
                    <Link href="/admin">
                      {t('adminPanel') || 'Panneau d\'administration'}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <EditProfileDialog />
              <Button variant="outline" onClick={handleLogout}>{t('logOut')}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

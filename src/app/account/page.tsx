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
import { orders } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { OrderStatus } from '@/lib/types';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, updateProfile } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Shipped: 'bg-green-500',
  Delivered: 'bg-gray-500',
  Cancelled: 'bg-red-500',
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
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations('AccountPage');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  const userOrders = orders.slice(0, 3); // Mock: show first 3 orders for this user

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
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{t('orderNumber', {id: order.id})}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('orderDate', {date: order.date})}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('orderTotal', {total: order.total.toFixed(2)})}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            statusColors[order.status]
                          }`}
                        ></span>
                        {order.status}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="#">{t('viewDetails')}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">{t('viewAllOrders')}</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('accountDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="font-medium">
                <p>{user.displayName || t('noName')}</p>
                <p className="text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">{t('shippingAddress')}</p>
                <p className="text-muted-foreground">
                  123 Main St
                  <br />
                  Anytown, USA 12345
                </p>
              </div>
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

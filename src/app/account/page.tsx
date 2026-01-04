'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { orders } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { OrderStatus } from '@/lib/types';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useTranslations } from 'next-intl';

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Shipped: 'bg-green-500',
  Delivered: 'bg-gray-500',
  Cancelled: 'bg-red-500',
};

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
              <Button>{t('editProfile')}</Button>
              <Button variant="outline" onClick={handleLogout}>{t('logOut')}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

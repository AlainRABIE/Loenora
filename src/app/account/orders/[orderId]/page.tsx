'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { getOrderById, type OrderData } from '@/firebase/orders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, MapPin, Calendar, CreditCard } from 'lucide-react';
import { products } from '@/lib/data';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-green-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function OrderDetailPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const orderData = await getOrderById(orderId);
          
          // Vérifier que la commande appartient à l'utilisateur
          if (orderData && user && orderData.userEmail === user.email) {
            setOrder(orderData);
          } else {
            setError('Commande non trouvée ou accès non autorisé');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          setError('Erreur lors du chargement de la commande');
        } finally {
          setLoadingOrder(false);
        }
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [orderId, user]);

  if (loading || loadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Commande non trouvée</h1>
          <p className="text-muted-foreground mb-6">{error || 'Cette commande n\'existe pas'}</p>
          <Button asChild>
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à mon compte
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date();
  const formattedDate = orderDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à mon compte
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Commande #{orderId.slice(0, 8)}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <Badge className={`${statusColors[order.status]} text-white h-fit`}>
              {statusLabels[order.status] || order.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Articles */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <CardTitle>Articles commandés</CardTitle>
                </div>
                <CardDescription>{order.items.length} article(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item: any, idx: number) => {
                  const product = products.find(p => p.id === item.id);
                  const productImage = product?.images?.[0]?.url || '/default-product.jpg';
                  
                  return (
                    <div key={idx}>
                      {idx > 0 && <Separator className="my-4" />}
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={productImage}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          {item.color && (
                            <p className="text-sm text-muted-foreground">Couleur: {item.color}</p>
                          )}
                          {item.size && (
                            <p className="text-sm text-muted-foreground">Taille: {item.size}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} TND</p>
                          <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} TND / unité</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Adresse de livraison */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <CardTitle>Adresse de livraison</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-semibold">
                    {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{order.shippingInfo.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingInfo.zip} {order.shippingInfo.city}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingInfo.state}, {order.shippingInfo.country}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{order.shippingInfo.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Résumé */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Résumé</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{order.subtotal.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{order.shipping.toFixed(2)} TND</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} TND</span>
                </div>
              </CardContent>
            </Card>

            {/* Statut de livraison */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <CardTitle>Suivi</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${order.status === 'pending' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <div className={`h-2 w-2 rounded-full ${order.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">En attente</span>
                  </div>
                  <div className={`flex items-center gap-2 ${order.status === 'processing' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <div className={`h-2 w-2 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">En traitement</span>
                  </div>
                  <div className={`flex items-center gap-2 ${order.status === 'shipped' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <div className={`h-2 w-2 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Expédiée</span>
                  </div>
                  <div className={`flex items-center gap-2 ${order.status === 'delivered' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <div className={`h-2 w-2 rounded-full ${order.status === 'delivered' ? 'bg-gray-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Livrée</span>
                  </div>
                  {order.status === 'cancelled' && (
                    <div className="flex items-center gap-2 text-red-500 font-semibold">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-sm">Annulée</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

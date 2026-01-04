'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { getAllOrders, updateOrderStatus, type OrderData } from '@/firebase/orders';
import { products } from '@/lib/data';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye } from 'lucide-react';

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

export default function AdminOrdersPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Vérifier si l'utilisateur est admin (à personnaliser selon votre logique)
  const isAdmin = user?.email === 'admin@loenora.com' || user?.email?.endsWith('@admin.com');

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    } else if (!userLoading && user && !isAdmin) {
      router.push('/');
      toast({
        title: 'Accès refusé',
        description: 'Vous n\'avez pas les permissions pour accéder à cette page.',
        variant: 'destructive',
      });
    }
  }, [user, userLoading, isAdmin, router, toast]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (isAdmin) {
        try {
          const allOrders = await getAllOrders();
          setOrders(allOrders);
          setFilteredOrders(allOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les commandes.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    if (!userLoading && isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, userLoading, toast]);

  // Filtrer les commandes
  useEffect(() => {
    let filtered = orders;

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderData['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Mettre à jour localement
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: 'Succès',
        description: 'Le statut de la commande a été mis à jour.',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut.',
        variant: 'destructive',
      });
    }
  };

  const viewOrderDetails = (order: OrderData) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestion des commandes</h1>
        <p className="text-muted-foreground">Gérez toutes les commandes de la boutique</p>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID, email ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
                <SelectItem value="shipped">Expédiée</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <span className="font-semibold">Total:</span> {filteredOrders.length} commande(s)
            </div>
            <div>
              <span className="font-semibold">Montant total:</span> {filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)} TND
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
          <CardDescription>
            {filteredOrders.length} commande(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune commande trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order: any) => {
                    const orderDate = order.createdAt?.toDate?.() 
                      ? order.createdAt.toDate().toLocaleDateString('fr-FR')
                      : 'N/A';
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">
                          {order.id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{order.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{orderDate}</TableCell>
                        <TableCell>{order.items.length} article(s)</TableCell>
                        <TableCell className="font-semibold">{order.total.toFixed(2)} TND</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value as OrderData['status'])}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>
                                <Badge className={statusColors[order.status]}>
                                  {statusLabels[order.status]}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="processing">En traitement</SelectItem>
                              <SelectItem value="shipped">Expédiée</SelectItem>
                              <SelectItem value="delivered">Livrée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour les détails de la commande */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la commande</DialogTitle>
                <DialogDescription>
                  Commande #{selectedOrder.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Informations client */}
                <div>
                  <h3 className="font-semibold mb-2">Informations client</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                    <p><span className="font-medium">Nom:</span> {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.userEmail}</p>
                    <p><span className="font-medium">Adresse:</span> {selectedOrder.shippingInfo.address}</p>
                    <p><span className="font-medium">Ville:</span> {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.zip}</p>
                    <p><span className="font-medium">Pays:</span> {selectedOrder.shippingInfo.country}</p>
                  </div>
                </div>

                {/* Articles commandés */}
                <div>
                  <h3 className="font-semibold mb-2">Articles</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, idx: number) => {
                      const product = products.find(p => p.id === item.id);
                      const productImage = product?.images?.[0]?.url || '/default-product.jpg';
                      return (
                        <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="relative h-16 w-16 rounded overflow-hidden">
                            <Image
                              src={productImage}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toFixed(2)} TND × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {(item.price * item.quantity).toFixed(2)} TND
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Récapitulatif */}
                <div>
                  <h3 className="font-semibold mb-2">Récapitulatif</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{selectedOrder.subtotal.toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de port:</span>
                      <span>{selectedOrder.shipping.toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total:</span>
                      <span>{selectedOrder.total.toFixed(2)} TND</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

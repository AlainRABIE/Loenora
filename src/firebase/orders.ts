import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
  type DocumentData 
} from 'firebase/firestore';
import { firestore } from './index';
import type { CartItem } from '@/lib/types';

export interface OrderData {
  userId?: string;
  userEmail: string;
  items: CartItem[];
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
}

// Créer une nouvelle commande
export async function createOrder(orderData: Omit<OrderData, 'createdAt' | 'status'>): Promise<string> {
  try {
    const ordersCollection = collection(firestore, 'orders');
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      status: 'pending',
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Récupérer les commandes d'un utilisateur
export async function getUserOrders(userEmail: string): Promise<OrderData[]> {
  try {
    const ordersCollection = collection(firestore, 'orders');
    const q = query(
      ordersCollection,
      where('userEmail', '==', userEmail)
    );
    
    const querySnapshot = await getDocs(q);
    const orders: OrderData[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderData);
    });
    
    // Trier les commandes par date décroissante côté client
    orders.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || 0;
      const dateB = b.createdAt?.toMillis?.() || 0;
      return dateB - dateA;
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

// Récupérer toutes les commandes (admin)
export async function getAllOrders(): Promise<OrderData[]> {
  try {
    const ordersCollection = collection(firestore, 'orders');
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const orders: OrderData[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderData);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
}

// Mettre à jour le statut d'une commande
export async function updateOrderStatus(
  orderId: string, 
  status: OrderData['status']
): Promise<void> {
  try {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Récupérer une commande par ID
export async function getOrderById(orderId: string): Promise<OrderData | null> {
  try {
    const orderRef = doc(firestore, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as OrderData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

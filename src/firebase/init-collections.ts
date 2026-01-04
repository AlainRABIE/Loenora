import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { firestore } from './index';
import { createUserProfile } from './users';

export async function initializeCollections(): Promise<{
  success: boolean;
  message: string;
  details: string[];
}> {
  const details: string[] = [];
  
  try {
    // Vérifier si les collections existent déjà
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    const addressesSnapshot = await getDocs(collection(firestore, 'shippingAddresses'));
    const ordersSnapshot = await getDocs(collection(firestore, 'orders'));
    
    details.push(`✅ Collection 'users' - ${usersSnapshot.size} documents existants`);
    details.push(`✅ Collection 'shippingAddresses' - ${addressesSnapshot.size} documents existants`);
    details.push(`✅ Collection 'orders' - ${ordersSnapshot.size} documents existants`);
    
    // Les collections sont créées automatiquement lors du premier ajout de document
    // Firestore ne nécessite pas de création explicite de collections
    
    return {
      success: true,
      message: 'Collections Firestore vérifiées et prêtes !',
      details,
    };
  } catch (error) {
    console.error('Error initializing collections:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'initialisation des collections',
      details: [(error as Error).message],
    };
  }
}

export async function getCollectionsInfo(): Promise<{
  users: number;
  addresses: number;
  orders: number;
}> {
  try {
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    const addressesSnapshot = await getDocs(collection(firestore, 'shippingAddresses'));
    const ordersSnapshot = await getDocs(collection(firestore, 'orders'));
    
    return {
      users: usersSnapshot.size,
      addresses: addressesSnapshot.size,
      orders: ordersSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting collections info:', error);
    return {
      users: 0,
      addresses: 0,
      orders: 0,
    };
  }
}

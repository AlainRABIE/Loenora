import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from './index';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ShippingAddress {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ========== USERS ==========

// Créer ou mettre à jour un profil utilisateur
export async function createUserProfile(
  uid: string,
  email: string,
  role: 'admin' | 'user' = 'user',
  additionalData?: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(firestore, 'users', uid);
    const userData: UserProfile = {
      uid,
      email,
      role,
      displayName: additionalData?.displayName || '',
      phone: additionalData?.phone || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ...additionalData,
    };
    
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Récupérer le profil d'un utilisateur
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(firestore, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Mettre à jour le rôle d'un utilisateur
export async function updateUserRole(uid: string, role: 'admin' | 'user'): Promise<void> {
  try {
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, {
      role,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Vérifier si un utilisateur est admin
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(uid);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Récupérer tous les utilisateurs (admin)
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersCollection = collection(firestore, 'users');
    const querySnapshot = await getDocs(usersCollection);
    const users: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

// ========== SHIPPING ADDRESSES ==========

// Créer une nouvelle adresse de livraison
export async function createShippingAddress(
  userId: string,
  addressData: Omit<ShippingAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    // Si c'est l'adresse par défaut, retirer le flag des autres adresses
    if (addressData.isDefault) {
      await setDefaultAddress(userId, null);
    }

    const addressesCollection = collection(firestore, 'shippingAddresses');
    const docRef = await addDoc(addressesCollection, {
      ...addressData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating shipping address:', error);
    throw error;
  }
}

// Récupérer les adresses d'un utilisateur
export async function getUserAddresses(userId: string): Promise<ShippingAddress[]> {
  try {
    const addressesCollection = collection(firestore, 'shippingAddresses');
    const q = query(addressesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const addresses: ShippingAddress[] = [];
    querySnapshot.forEach((doc) => {
      addresses.push({ id: doc.id, ...doc.data() } as ShippingAddress);
    });
    
    return addresses;
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
}

// Mettre à jour une adresse
export async function updateShippingAddress(
  addressId: string,
  userId: string,
  addressData: Partial<ShippingAddress>
): Promise<void> {
  try {
    // Si on met cette adresse en défaut, retirer le flag des autres
    if (addressData.isDefault) {
      await setDefaultAddress(userId, addressId);
    }

    const addressRef = doc(firestore, 'shippingAddresses', addressId);
    await updateDoc(addressRef, {
      ...addressData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating shipping address:', error);
    throw error;
  }
}

// Supprimer une adresse
export async function deleteShippingAddress(addressId: string): Promise<void> {
  try {
    const addressRef = doc(firestore, 'shippingAddresses', addressId);
    await deleteDoc(addressRef);
  } catch (error) {
    console.error('Error deleting shipping address:', error);
    throw error;
  }
}

// Définir une adresse par défaut
async function setDefaultAddress(userId: string, newDefaultId: string | null): Promise<void> {
  try {
    const addresses = await getUserAddresses(userId);
    
    // Retirer le flag isDefault de toutes les adresses
    for (const address of addresses) {
      if (address.id && address.id !== newDefaultId && address.isDefault) {
        const addressRef = doc(firestore, 'shippingAddresses', address.id);
        await updateDoc(addressRef, { isDefault: false });
      }
    }
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
}

// Récupérer l'adresse par défaut d'un utilisateur
export async function getDefaultAddress(userId: string): Promise<ShippingAddress | null> {
  try {
    const addresses = await getUserAddresses(userId);
    const defaultAddress = addresses.find(addr => addr.isDefault);
    return defaultAddress || (addresses.length > 0 ? addresses[0] : null);
  } catch (error) {
    console.error('Error fetching default address:', error);
    throw error;
  }
}

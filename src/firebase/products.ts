import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where
} from 'firebase/firestore';
import { firestore } from './index';
import type { Product } from '@/lib/types';

export interface ProductImage {
  color: string;
  url: string;
  path?: string; // Chemin dans Firebase Storage
}

export interface ProductData extends Omit<Product, 'id'> {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  published?: boolean;
  stock?: number;
}

const PRODUCTS_COLLECTION = 'products';

/**
 * Récupérer tous les produits
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(firestore, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Récupérer les produits publiés uniquement
 */
export async function getPublishedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(firestore, PRODUCTS_COLLECTION);
    const q = query(
      productsRef, 
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching published products:', error);
    throw error;
  }
}

/**
 * Récupérer un produit par son ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(firestore, PRODUCTS_COLLECTION, productId);
    const snapshot = await getDoc(productRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Récupérer un produit par son slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const productsRef = collection(firestore, PRODUCTS_COLLECTION);
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
}

/**
 * Créer un nouveau produit
 */
export async function createProduct(productData: ProductData): Promise<string> {
  try {
    const productsRef = collection(firestore, PRODUCTS_COLLECTION);
    
    const newProduct = {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      published: productData.published ?? false,
    };
    
    const docRef = await addDoc(productsRef, newProduct);
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Mettre à jour un produit
 */
export async function updateProduct(
  productId: string,
  productData: Partial<ProductData>
): Promise<void> {
  try {
    const productRef = doc(firestore, PRODUCTS_COLLECTION, productId);
    
    await updateDoc(productRef, {
      ...productData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Supprimer un produit
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const productRef = doc(firestore, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Générer un slug unique à partir du nom du produit
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, ''); // Enlever les tirets au début et à la fin
}

/**
 * Vérifier si un slug existe déjà
 */
export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const product = await getProductBySlug(slug);
    if (!product) return false;
    if (excludeId && product.id === excludeId) return false;
    return true;
  } catch (error) {
    console.error('Error checking slug:', error);
    return false;
  }
}

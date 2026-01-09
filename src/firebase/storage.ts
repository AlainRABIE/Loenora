import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  type StorageReference 
} from 'firebase/storage';
import { storage } from './index';

export interface UploadedImage {
  url: string;
  path: string;
  name: string;
}

/**
 * Upload une image vers Firebase Storage
 * @param file - Le fichier image à uploader
 * @param folder - Le dossier dans lequel uploader (ex: 'products/jackets')
 * @returns Les informations de l'image uploadée
 */
export async function uploadImage(
  file: File,
  folder: string = 'products'
): Promise<UploadedImage> {
  try {
    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${folder}/${fileName}`;
    
    // Créer la référence et uploader
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL de téléchargement
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path: filePath,
      name: fileName,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload plusieurs images
 * @param files - Liste des fichiers à uploader
 * @param folder - Le dossier dans lequel uploader
 * @returns Liste des images uploadées
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'products'
): Promise<UploadedImage[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

/**
 * Supprimer une image de Firebase Storage
 * @param path - Le chemin de l'image dans Storage
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Supprimer plusieurs images
 * @param paths - Liste des chemins des images à supprimer
 */
export async function deleteMultipleImages(paths: string[]): Promise<void> {
  try {
    const deletePromises = paths.map(path => deleteImage(path));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw error;
  }
}

/**
 * Lister toutes les images dans un dossier
 * @param folder - Le dossier à lister
 * @returns Liste des références des images
 */
export async function listImages(folder: string): Promise<StorageReference[]> {
  try {
    const folderRef = ref(storage, folder);
    const result = await listAll(folderRef);
    return result.items;
  } catch (error) {
    console.error('Error listing images:', error);
    throw error;
  }
}

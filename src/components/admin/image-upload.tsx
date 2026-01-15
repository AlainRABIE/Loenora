'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export interface ImageWithColor {
  color: string;
  url: string;
  path?: string;
  file?: File;
  preview?: string;
}

interface ImageUploadProps {
  images: ImageWithColor[];
  onImagesChange: (images: ImageWithColor[]) => void;
  availableColors: string[];
}

export default function ImageUpload({ images, onImagesChange, availableColors }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    setUploading(true);

    try {
      // Uploader chaque fichier immédiatement
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'upload');
        }

        const uploaded = await response.json();
        
        return {
          color: availableColors[0] || '',
          url: uploaded.url,
          path: uploaded.path,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Ajouter les images uploadées à la liste
      onImagesChange([...images, ...uploadedImages]);

      toast({
        title: 'Images uploadées',
        description: `${files.length} image(s) uploadée(s) avec succès.`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'uploader les images.',
      });
    } finally {
      setUploading(false);
      // Réinitialiser l'input pour pouvoir resélectionner les mêmes fichiers
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadImages = async () => {
    const imagesToUpload = images.filter(img => img.file && !img.url);
    
    if (imagesToUpload.length === 0) {
      toast({
        title: 'Aucune image à uploader',
        description: 'Toutes les images sont déjà uploadées.',
      });
      return;
    }

    setUploading(true);
    
    try {
      alert(`Début upload de ${imagesToUpload.length} image(s)`);
      
      const uploadPromises = imagesToUpload.map(async (img, index) => {
        if (!img.file) return img;
        
        // Upload vers l'API locale
        const formData = new FormData();
        formData.append('file', img.file);
        formData.append('folder', 'products');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'upload');
        }

        const uploaded = await response.json();
        alert(`Image ${index + 1} uploadée:\nURL: ${uploaded.url}\nPath: ${uploaded.path}`);
        
        return {
          ...img,
          url: uploaded.url,
          path: uploaded.path,
          file: undefined,
          preview: undefined,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      alert(`Toutes les images uploadées:\n${uploadedImages.map((img, i) => `${i+1}. URL: ${img.url}`).join('\n')}`);
      
      // Remplacer les images uploadées dans la liste
      const updatedImages = images.map(img => {
        const uploaded = uploadedImages.find(u => u.preview === img.preview);
        return uploaded || img;
      });

      alert(`Images finales après update:\n${updatedImages.map((img, i) => `${i+1}. URL: ${img.url || 'VIDE'}`).join('\n')}`);
      
      onImagesChange(updatedImages);

      toast({
        title: 'Images uploadées',
        description: `${imagesToUpload.length} image(s) uploadée(s) avec succès.`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Erreur d'upload: ${error}`);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'uploader les images.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const handleColorChange = (index: number, color: string) => {
    const newImages = [...images];
    newImages[index].color = color;
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Upload en cours...' : 'Sélectionner et uploader des images'}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Aucune image sélectionnée
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group border rounded-lg p-2 space-y-2">
              <div className="relative aspect-square bg-muted rounded overflow-hidden">
                <Image
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label className="text-xs">Couleur</Label>
                <select
                  value={image.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-full text-sm border rounded px-2 py-1"
                >
                  {availableColors.map(color => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

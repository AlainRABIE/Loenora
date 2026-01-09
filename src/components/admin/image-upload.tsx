'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImage, uploadMultipleImages } from '@/firebase/storage';
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Créer des previews pour les nouvelles images
    const newImages: ImageWithColor[] = files.map(file => ({
      color: availableColors[0] || '',
      url: '',
      file,
      preview: URL.createObjectURL(file),
    }));

    onImagesChange([...images, ...newImages]);
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
      const uploadPromises = imagesToUpload.map(async (img) => {
        if (!img.file) return img;
        
        const uploaded = await uploadImage(img.file, 'products');
        return {
          ...img,
          url: uploaded.url,
          path: uploaded.path,
          file: undefined,
          preview: undefined,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Remplacer les images uploadées dans la liste
      const updatedImages = images.map(img => {
        const uploaded = uploadedImages.find(u => u.preview === img.preview);
        return uploaded || img;
      });

      onImagesChange(updatedImages);

      toast({
        title: 'Images uploadées',
        description: `${imagesToUpload.length} image(s) uploadée(s) avec succès.`,
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
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    
    // Révoquer l'URL de preview si elle existe
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview!);
    }
    
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const handleColorChange = (index: number, color: string) => {
    const newImages = [...images];
    newImages[index].color = color;
    onImagesChange(newImages);
  };

  const pendingUploads = images.filter(img => img.file && !img.url).length;

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
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Sélectionner des images
          </Button>
        </div>
        
        {pendingUploads > 0 && (
          <Button
            type="button"
            onClick={handleUploadImages}
            disabled={uploading}
          >
            {uploading ? 'Upload en cours...' : `Uploader ${pendingUploads} image(s)`}
          </Button>
        )}
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
                  src={image.preview || image.url}
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
                {image.file && !image.url && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs">En attente d'upload</span>
                  </div>
                )}
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

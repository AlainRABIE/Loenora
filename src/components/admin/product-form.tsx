'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct, generateSlug, slugExists, type ProductData } from '@/firebase/products';
import ImageUpload, { type ImageWithColor } from './image-upload';
import type { Product } from '@/lib/types';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Vestes',
  'Pantalons',
  'Robes',
  'Accessoires',
  'Chaussures',
  'Sacs',
];

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Formulaire
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || '');
  const [category, setCategory] = useState(product?.category || CATEGORIES[0]);
  const [slug, setSlug] = useState(product?.slug || '');
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [newColor, setNewColor] = useState('');
  const [images, setImages] = useState<ImageWithColor[]>(
    product?.images?.map(img => ({ color: img.color, url: img.url })) || []
  );
  const [published, setPublished] = useState(product ? (product as any).published !== false : true);
  const [stock, setStock] = useState(((product as any)?.stock || 100).toString());

  // Auto-générer le slug depuis le nom
  useEffect(() => {
    if (!product && name) {
      const generatedSlug = generateSlug(name);
      setSlug(generatedSlug);
    }
  }, [name, product]);

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter(c => c !== colorToRemove));
    // Mettre à jour les images pour retirer cette couleur
    setImages(images.map(img => 
      img.color === colorToRemove ? { ...img, color: colors[0] || '' } : img
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validations
      if (!name || !description || !price || !category || !slug) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Veuillez remplir tous les champs obligatoires.',
        });
        setLoading(false);
        return;
      }

      if (colors.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Veuillez ajouter au moins une couleur.',
        });
        setLoading(false);
        return;
      }

      // Vérifier que toutes les images sont uploadées
      const pendingImages = images.filter(img => !img.url);
      if (pendingImages.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Veuillez uploader toutes les images avant de sauvegarder.',
        });
        setLoading(false);
        return;
      }

      // Vérifier le slug
      if (!product) {
        const exists = await slugExists(slug);
        if (exists) {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Ce slug existe déjà. Veuillez en choisir un autre.',
          });
          setLoading(false);
          return;
        }
      }

      const productData: ProductData = {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        category,
        slug,
        colors,
        images: images.map(img => ({ color: img.color, url: img.url })),
        published,
        stock: parseInt(stock),
      };

      if (product) {
        await updateProduct(product.id, productData);
        toast({
          title: 'Produit mis à jour',
          description: 'Le produit a été mis à jour avec succès.',
        });
      } else {
        const productId = await createProduct(productData);
        toast({
          title: 'Produit créé',
          description: 'Le produit a été créé avec succès.',
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder le produit.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Les informations de base du produit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Veste en cuir"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le produit..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: veste-en-cuir"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL du produit: /products/{slug || 'slug'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prix et stock</CardTitle>
          <CardDescription>Gérez les prix et la disponibilité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (TND) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Prix original (TND)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="52.00"
              />
              <p className="text-xs text-muted-foreground">
                Pour afficher une promotion
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          {originalPrice && parseFloat(originalPrice) > 0 && parseFloat(price) > 0 && (
            <div className="text-sm text-green-600">
              Réduction: {Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100)}%
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Couleurs disponibles</CardTitle>
          <CardDescription>Ajoutez les couleurs disponibles pour ce produit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Ex: Rouge, Bleu, Vert..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddColor();
                }
              }}
            />
            <Button type="button" onClick={handleAddColor}>
              Ajouter
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <Badge key={color} variant="secondary" className="gap-1">
                {color}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {colors.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune couleur ajoutée</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images du produit</CardTitle>
          <CardDescription>Ajoutez des images pour chaque couleur</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            availableColors={colors}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publication</CardTitle>
          <CardDescription>Contrôlez la visibilité du produit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">
              {published ? 'Produit publié' : 'Produit en brouillon'}
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {published 
              ? 'Le produit est visible sur le site' 
              : 'Le produit n\'est pas visible sur le site'}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer le produit'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

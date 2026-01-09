import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import ProductCard from "@/components/product-card";
import ProductDetailClient from "../../../products/[slug]/product-detail-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const t = await getTranslations('ProductPage');
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Utiliser les images du produit ou chercher dans PlaceHolderImages ou utiliser l'image par défaut
  const productImage = product.images?.[0]?.url || 
    PlaceHolderImages.find((img) => img.id === product.imageId)?.imageUrl || 
    '/default-product.jpg';
  const relatedProducts = products.filter(p => p.id !== product.id);
  
  // Vérifier si le produit a plusieurs images
  const hasMultipleImages = product.images && product.images.length > 0;

  // Préparer les traductions pour le composant client
  const translations = {
    reviews: t('reviews', { count: 123 }),
    colors: t('colors'),
    freeShipping: t('freeShipping'),
    warranty: t('warranty'),
    youMightAlsoLike: t('youMightAlsoLike'),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <ProductDetailClient
          product={product}
          productImage={productImage}
          hasMultipleImages={hasMultipleImages}
          translations={translations}
        />
      </div>
      
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">{t('youMightAlsoLike')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>
    </div>
  );
}

import { redirect } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  redirect('/fr/products');
}

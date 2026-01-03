'use client'

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AddToCartButton({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const t = useTranslations('ProductPage');

  const handleAddToCart = () => {
    addToCart(productId, quantity);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          aria-label={t('decreaseQuantity')}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="h-10 w-16 text-center mx-2"
          min="1"
          aria-label={t('quantity')}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => setQuantity(q => q + 1)}
          aria-label={t('increaseQuantity')}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button size="lg" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        {t('addToCart')}
      </Button>
    </div>
  );
}

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <ShoppingBag className="h-7 w-7 text-accent" />
      <span className="text-xl font-bold font-headline text-primary">
        eCommerce Pro
      </span>
    </Link>
  );
}

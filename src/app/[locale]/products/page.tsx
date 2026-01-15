import ProductCard from "@/components/product-card";
import ProductsList from "@/components/products-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const t = await getTranslations('ProductsPage');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-4 bg-card rounded-lg shadow-sm">
        <div className="relative w-full md:max-w-sm">
          <Input type="search" placeholder={t('searchPlaceholder')} className="pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              <SelectItem value="tops">Tops</SelectItem>
              <SelectItem value="pantalons">Pantalons</SelectItem>
              <SelectItem value="robes">Robes</SelectItem>
              <SelectItem value="accessoires">Accessoires</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('featured')}</SelectItem>
              <SelectItem value="price-asc">{t('priceAsc')}</SelectItem>
              <SelectItem value="price-desc">{t('priceDesc')}</SelectItem>
              <SelectItem value="newest">{t('newest')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductsList />
    </div>
  );
}

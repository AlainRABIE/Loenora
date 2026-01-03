import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">Tous les produits</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Parcourez notre collection complète de vêtements et accessoires de haute qualité.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-4 bg-card rounded-lg shadow-sm">
        <div className="relative w-full md:max-w-sm">
          <Input type="search" placeholder="Rechercher des produits..." className="pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="tops">Tops</SelectItem>
              <SelectItem value="pantalons">Pantalons</SelectItem>
              <SelectItem value="robes">Robes</SelectItem>
              <SelectItem value="accessoires">Accessoires</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Populaires</SelectItem>
              <SelectItem value="price-asc">Prix : Croissant</SelectItem>
              <SelectItem value="price-desc">Prix : Décroissant</SelectItem>
              <SelectItem value="newest">Nouveautés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

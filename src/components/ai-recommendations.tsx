"use client";

import { useState, useEffect } from "react";
import { products as allProducts } from "@/lib/data";
import { recommendProducts } from "@/ai/flows/ai-product-recommendation";
import ProductCard from "./product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "./ui/skeleton";

export default function AIRecommendations({ currentProductId }: { currentProductId: string }) {
  const [recommendedProducts, setRecommendedProducts] = useState<typeof allProducts>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getRecommendations() {
      try {
        setLoading(true);
        // Mock user data
        const mockUserId = "user_123";
        const mockBrowsingHistory = ["prod_2", "prod_5"];
        const mockPurchaseHistory = ["prod_7"];

        const result = await recommendProducts({
          user_id: mockUserId,
          browsing_history: [...mockBrowsingHistory, currentProductId],
          purchase_history: mockPurchaseHistory,
          product_catalog: JSON.stringify(allProducts),
        });

        if (result.recommended_products) {
          const filteredProducts = allProducts.filter(p => result.recommended_products.includes(p.id) && p.id !== currentProductId);
          setRecommendedProducts(filteredProducts);
        }
      } catch (e) {
        console.error("Failed to get AI recommendations:", e);
        setError("Could not load recommendations.");
      } finally {
        setLoading(false);
      }
    }

    getRecommendations();
  }, [currentProductId]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">You Might Also Like</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-60 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-muted-foreground">{error}</p>
      ) : recommendedProducts.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recommendedProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex"/>
          <CarouselNext className="hidden md:flex"/>
        </Carousel>
      ) : (
        <p className="text-center text-muted-foreground">No recommendations available at this time.</p>
      )}
    </div>
  );
}

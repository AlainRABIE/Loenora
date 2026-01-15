import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import InitializeCollectionsButton from "@/components/admin/initialize-collections-button";
import HomePageClient from "./home-page-client";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <HomePageClient />;
}

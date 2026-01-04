export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageId?: string;
  images?: { color: string; url: string }[];
  slug: string;
  colors?: string[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageId: string;
  slug: string;
};

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};

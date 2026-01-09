"use client";

export const dynamic = 'force-dynamic';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { products } from "@/lib/data";
import { createOrder } from "@/firebase/orders";
import { useUser } from "@/firebase/auth/use-user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const shippingSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvc: z.string().length(3, "CVC must be 3 digits"),
});

const checkoutSchema = shippingSchema.merge(paymentSchema);

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations('CheckoutPage');
  const { user } = useUser();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const total = cartTotal + shippingCost;

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    try {
      // Créer la commande dans Firebase
      const orderId = await createOrder({
        userId: user?.uid,
        userEmail: values.email,
        items: cartItems,
        shippingInfo: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
        },
        subtotal: cartTotal,
        shipping: shippingCost,
        total: total,
      });

      toast({
        title: t('orderPlacedTitle'),
        description: t('orderPlacedDescription') + ` (ID: ${orderId})`,
      });

      clearCart();
      router.push("/account");
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre commande.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('title')}</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>{t('orderSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => {
              const product = products.find(p => p.id === item.id);
              const productImage = product?.images?.[0]?.url ||
                PlaceHolderImages.find(img => img.id === item.imageId)?.imageUrl ||
                '/default-product.jpg';
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                      <Image src={productImage} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{t('quantity', { count: item.quantity })}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} TND</p>
                </div>
              );
            })}
            <Separator />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <p className="text-muted-foreground">{t('subtotal')}</p>
                    <p>{cartTotal.toFixed(2)} TND</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-muted-foreground">{t('shipping')}</p>
                    <p>{shippingCost === 0 ? t('free') : `${shippingCost.toFixed(2)} TND`}</p>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-lg font-bold">
            <p>{t('total')}</p>
            <p>{total.toFixed(2)} TND</p>
          </CardFooter>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader><CardTitle>{t('shippingInfo')}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>{t('email')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>{t('firstName')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel>{t('lastName')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>{t('address')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>{t('city')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>{t('state')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                        <FormItem><FormLabel>{t('zipCode')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem><FormLabel>{t('country')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>{t('paymentDetails')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem><FormLabel>{t('cardNumber')}</FormLabel><FormControl><Input {...field} placeholder="XXXX XXXX XXXX XXXX"/></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="expiryDate" render={({ field }) => (
                            <FormItem><FormLabel>{t('expiryDate')}</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="cvc" render={({ field }) => (
                            <FormItem><FormLabel>{t('cvc')}</FormLabel><FormControl><Input {...field} placeholder="XXX" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{t('placeOrder')}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
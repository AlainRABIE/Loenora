"use client";

import Link from 'next-intl';
import { Search, ShoppingCart, User, Menu, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../logo";
import { useCart } from "@/context/cart-context";
import CartSheet from "../cart-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/products", labelKey: "allProducts" },
  { href: "#", labelKey: "electronics" },
  { href: "#", labelKey: "apparel" },
  { href: "#", labelKey: "homeGoods" },
];

function LanguageSwitcher() {
    const t = useTranslations("Header");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (newLocale: string) => {
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.replace(newPath);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
            <span className="sr-only">{t('changeLanguage')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleLocaleChange('fr')}>
            {t('french')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleLocaleChange('en')}>
            {t('english')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleLocaleChange('tn')}>
            {t('tunisian')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

export default function Header() {
  const { totalItems } = useCart();
  const t = useTranslations('Header');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="hidden md:flex md:ml-6 md:items-center md:gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {t(link.labelKey as any)}
            </Link>
          ))}
          <Link
            href="/admin/orders"
            className="text-accent/80 transition-colors hover:text-accent"
          >
            {t('adminPanel')}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex flex-1 max-w-xs items-center gap-2">
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="w-full"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
                <Button size="icon" variant="ghost" asChild={false}>
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('myAccount')}</span>
                </Button>
            </Link>
            <LanguageSwitcher />
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">{t('shoppingCart')}</span>
                </Button>
              </SheetTrigger>
              <CartSheet />
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t('toggleNavigation')}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle><Logo /></SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8 text-lg font-medium">
                  {navLinks.map((link) => (
                    <Link
                      key={link.labelKey}
                      href={link.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {t(link.labelKey as any)}
                    </Link>
                  ))}
                   <Link
                    href="/admin/orders"
                    className="text-accent/80 transition-colors hover:text-accent"
                  >
                    {t('adminPanel')}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

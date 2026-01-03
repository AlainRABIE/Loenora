"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Globe } from "lucide-react";

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
  { href: "/products", label: "All Products" },
  { href: "#", label: "Electronics" },
  { href: "#", label: "Apparel" },
  { href: "#", label: "Home Goods" },
];

function LanguageSwitcher() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Changer de langue</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            Français
          </DropdownMenuItem>
          <DropdownMenuItem>
            English
          </DropdownMenuItem>
          <DropdownMenuItem>
            Tunisien
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="hidden md:flex md:ml-6 md:items-center md:gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/orders"
            className="text-accent/80 transition-colors hover:text-accent"
          >
            Admin Panel
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex flex-1 max-w-xs items-center gap-2">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">My Account</span>
              </Link>
            </Button>
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
                  <span className="sr-only">Shopping Cart</span>
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
                  aria-label="Toggle Navigation"
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
                      key={link.label}
                      href={link.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                   <Link
                    href="/admin/orders"
                    className="text-accent/80 transition-colors hover:text-accent"
                  >
                    Admin Panel
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

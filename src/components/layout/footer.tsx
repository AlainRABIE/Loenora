import Logo from "../logo";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const footerLinks = {
  shop: [
    { title: "All Products", href: "/products" },
    { title: "Electronics", href: "#" },
    { title: "Apparel", href: "#" },
    { title: "Home Goods", href: "#" },
  ],
  support: [
    { title: "Contact Us", href: "#" },
    { title: "FAQ", href: "#" },
    { title: "Shipping & Returns", href: "#" },
    { title: "Track Order", href: "#" },
  ],
  company: [
    { title: "About Us", href: "#" },
    { title: "Careers", href: "#" },
    { title: "Press", href: "#" },
    { title: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: "#", name: "Twitter" },
  { icon: <Github className="h-5 w-5" />, href: "#", name: "GitHub" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#", name: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-md">
              The next generation of online shopping. Discover curated collections and exclusive pieces.
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Subscribe to our newsletter</p>
              <form className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="max-w-xs" />
                <Button type="submit" variant="default">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2 lg:col-span-3">
            <div>
              <h4 className="font-headline font-semibold mb-4">Shop</h4>
              <ul className="space-y-2">
                {footerLinks.shop.map(link => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map(link => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map(link => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} eCommerce Pro. All rights reserved.</p>
          <div className="flex gap-2">
            {socialLinks.map(link => (
              <Button key={link.name} variant="ghost" size="icon" asChild>
                <a href={link.href} aria-label={link.name}>
                  {link.icon}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

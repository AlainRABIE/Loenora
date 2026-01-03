import { cn } from '@/lib/utils';
import Link from 'next-intl';

const LoenoraLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("h-8 w-auto", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l-4 4-1 6 2 4 4 2 4-2 2-4-1-6-4-4z" />
    <path d="M12 2v20" />
    <path d="M4.2 8.5L19.8 15.5" />
    <path d="M4.2 15.5L19.8 8.5" />
  </svg>
);


export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
       <LoenoraLogo className="h-6 w-6 text-accent" />
      <span className="text-3xl font-cursive text-primary">
        Loenora
      </span>
    </Link>
  );
}

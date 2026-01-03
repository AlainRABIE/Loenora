import { cn } from '@/lib/utils';
import Link from 'next/link';

const LoenoraLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 50"
    className={cn("h-8 w-auto", className)}
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50.5,1.8c-1.3,1.3-2.3,2.9-3,4.6c-0.6,1.4-0.9,3-0.9,4.6c0,2.1,0.5,4,1.4,5.8c0.9,1.8,2.2,3.3,3.8,4.5
      c-3.1-0.2-6.1-0.8-8.9-2c-2.8-1.2-5.3-2.9-7.5-5.1C32,10.9,32.6,7,34.8,4.2c0.4-0.5,0.8-1,1.3-1.4L50.5,1.8z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M55,30.8c0,1.3-0.3,2.6-0.8,3.9c-0.6,1.2-1.3,2.3-2.2,3.3c-1,1-2.2,1.8-3.5,2.4c-1.3,0.6-2.8,1-4.3,1.1V49
      c2,0,4-0.2,5.9-0.7c1.9-0.5,3.7-1.2,5.3-2.1c1.6-1,3.1-2.1,4.4-3.5c1.3-1.4,2.3-2.9,3.1-4.7c0.8-1.7,1.2-3.6,1.2-5.5v-0.2h-14.5
      L55,30.8z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M37.1,1.1L36,2.6c-2.4,2.9-3.2,6.5-2.2,10c1,3.5,3.5,6.4,6.9,8.2c2.7,1.4,5.6,2.2,8.6,2.5
      c-1.5-1.3-2.8-2.9-3.8-4.7c-1-1.8-1.5-3.8-1.5-6c0-1.8,0.4-3.5,1.1-5.1c0.7-1.6,1.7-3,3-4.3l0.1-0.1L62.7,39.3l1.1-1.6
      L37.1,1.1z"
    />
  </svg>
);


export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
       <LoenoraLogo className="h-7 w-7 text-accent" />
      <span className="text-xl font-bold font-headline text-primary">
        loenora
      </span>
    </Link>
  );
}

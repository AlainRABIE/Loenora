import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page non trouvée</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button asChild size="lg">
        <Link href="/fr">
          Retour à l'accueil
        </Link>
      </Button>
    </div>
  );
}

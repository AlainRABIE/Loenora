'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { initializeCollections, getCollectionsInfo } from '@/firebase/init-collections';
import { useToast } from '@/hooks/use-toast';
import { Database, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

export default function InitializeCollectionsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [collectionsInfo, setCollectionsInfo] = useState<any>(null);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const initResult = await initializeCollections();
      const info = await getCollectionsInfo();
      
      setResult(initResult);
      setCollectionsInfo(info);
      
      if (initResult.success) {
        toast({
          title: 'Succès !',
          description: initResult.message,
        });
      } else {
        toast({
          title: 'Erreur',
          description: initResult.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'initialisation.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInfo = async () => {
    const info = await getCollectionsInfo();
    setCollectionsInfo(info);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="gap-2"
          onClick={loadInfo}
        >
          <Database className="h-5 w-5" />
          Initialiser les Collections
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Initialisation des Collections Firestore</DialogTitle>
          <DialogDescription>
            Vérifiez et initialisez les collections de la base de données
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* État actuel des collections */}
          {collectionsInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">État actuel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">📁 Collection <code className="bg-muted px-2 py-0.5 rounded">users</code></span>
                  <Badge variant="secondary">{collectionsInfo.users} documents</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">📦 Collection <code className="bg-muted px-2 py-0.5 rounded">shippingAddresses</code></span>
                  <Badge variant="secondary">{collectionsInfo.addresses} documents</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🛒 Collection <code className="bg-muted px-2 py-0.5 rounded">orders</code></span>
                  <Badge variant="secondary">{collectionsInfo.orders} documents</Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadInfo}
                  className="w-full mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Informations sur les collections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Collections Firestore</CardTitle>
              <CardDescription>
                Les collections suivantes seront vérifiées :
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div>
                  <p className="font-semibold">📁 users</p>
                  <p className="text-muted-foreground ml-4">Profils utilisateurs avec rôles (admin/user)</p>
                </div>
                <div>
                  <p className="font-semibold">📦 shippingAddresses</p>
                  <p className="text-muted-foreground ml-4">Adresses de livraison des clients</p>
                </div>
                <div>
                  <p className="font-semibold">🛒 orders</p>
                  <p className="text-muted-foreground ml-4">Commandes avec articles et statuts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultat de l'initialisation */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Succès
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      Erreur
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{result.message}</p>
                {result.details && result.details.length > 0 && (
                  <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                    {result.details.map((detail: string, idx: number) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bouton d'action */}
          <Button 
            onClick={handleInitialize} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification en cours...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Vérifier et Initialiser
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Note : Les collections Firestore sont créées automatiquement lors du premier ajout de document.
            Cette action vérifie l'existence des collections et affiche leur état.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

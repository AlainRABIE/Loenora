'use client';

import { useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { createUserProfile, updateUserRole, getAllUsers, type UserProfile } from '@/firebase/users';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Shield, User as UserIcon } from 'lucide-react';

export default function UserManagement() {
  const { user } = useUser();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUserProfile = async () => {
    if (!user) return;
    
    try {
      await createUserProfile(user.uid, user.email || '', 'user');
      
      toast({
        title: 'Succès',
        description: 'Votre profil utilisateur a été créé dans la collection users.',
      });
      
      loadUsers();
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création du profil.',
        variant: 'destructive',
      });
    }
  };

  const handleRoleChange = async (uid: string, newRole: 'admin' | 'user') => {
    try {
      await updateUserRole(uid, newRole);
      
      setUsers(users.map(u => 
        u.uid === uid ? { ...u, role: newRole } : u
      ));
      
      toast({
        title: 'Succès',
        description: `Le rôle a été mis à jour en ${newRole}.`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le rôle.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Créez et gérez les profils utilisateurs et leurs rôles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={handleCreateUserProfile}>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer mon profil utilisateur
            </Button>
            <Button onClick={loadUsers} variant="outline">
              Charger tous les utilisateurs
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : users.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userProfile) => {
                    const createdDate = userProfile.createdAt?.toDate?.() 
                      ? userProfile.createdAt.toDate().toLocaleDateString('fr-FR')
                      : 'N/A';
                    
                    return (
                      <TableRow key={userProfile.uid}>
                        <TableCell className="font-medium">{userProfile.email}</TableCell>
                        <TableCell>{userProfile.displayName || '-'}</TableCell>
                        <TableCell>{userProfile.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                            {userProfile.role === 'admin' ? (
                              <><Shield className="h-3 w-3 mr-1" /> Admin</>
                            ) : (
                              <><UserIcon className="h-3 w-3 mr-1" /> User</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>{createdDate}</TableCell>
                        <TableCell>
                          <Select
                            value={userProfile.role}
                            onValueChange={(value) => handleRoleChange(userProfile.uid, value as 'admin' | 'user')}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur chargé. Cliquez sur "Charger tous les utilisateurs" pour voir la liste.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collections créées</CardTitle>
          <CardDescription>
            Informations sur les collections Firestore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📁 Collection: users</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• uid (string) - ID unique de l'utilisateur</li>
                <li>• email (string) - Adresse email</li>
                <li>• role (string) - "admin" ou "user"</li>
                <li>• displayName (string) - Nom d'affichage</li>
                <li>• phone (string) - Numéro de téléphone</li>
                <li>• createdAt (timestamp) - Date de création</li>
                <li>• updatedAt (timestamp) - Date de mise à jour</li>
              </ul>
            </div>

            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📦 Collection: shippingAddresses</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• userId (string) - ID de l'utilisateur</li>
                <li>• firstName (string) - Prénom</li>
                <li>• lastName (string) - Nom</li>
                <li>• company (string) - Entreprise (optionnel)</li>
                <li>• address (string) - Adresse ligne 1</li>
                <li>• addressLine2 (string) - Adresse ligne 2 (optionnel)</li>
                <li>• city (string) - Ville</li>
                <li>• state (string) - État/Province</li>
                <li>• postalCode (string) - Code postal</li>
                <li>• country (string) - Pays</li>
                <li>• phone (string) - Téléphone</li>
                <li>• isDefault (boolean) - Adresse par défaut</li>
                <li>• createdAt (timestamp) - Date de création</li>
                <li>• updatedAt (timestamp) - Date de mise à jour</li>
              </ul>
            </div>

            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🛒 Collection: orders</h3>
              <p className="text-sm text-muted-foreground">
                Déjà créée - Contient toutes les commandes avec articles, informations de livraison, et statuts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

# Système de Rôles - Guide Complet

## ✅ Implémentation Terminée

Le système de gestion des rôles est maintenant complètement opérationnel avec les fonctionnalités suivantes :

### 🎯 Fonctionnalités

1. **Deux rôles utilisateur**
   - `admin` : Accès complet à l'administration
   - `user` : Utilisateur standard

2. **Interface différenciée**
   - Badge "Admin" visible dans la page compte
   - Bouton d'administration dans le header (icône bouclier) pour les admins
   - Accès au panneau d'administration via `/admin`

3. **Sécurité renforcée**
   - Règles Firestore mises à jour pour contrôler l'accès
   - Protection des routes admin côté client et serveur
   - Impossibilité pour un utilisateur de s'auto-promouvoir admin

4. **Hook amélioré**
   - `useUser()` expose maintenant :
     - `user` : Utilisateur Firebase Auth
     - `userProfile` : Profil complet avec rôle
     - `isAdmin` : Boolean pour vérifier facilement le statut admin
     - `loading` : État de chargement

## 📝 Comment créer le premier administrateur

### Méthode 1 : Console Firebase (Recommandé pour production)

1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet "loenora-5be91"
3. Dans le menu, cliquez sur **Firestore Database**
4. Cliquez sur la collection `users`
5. Trouvez le document correspondant à votre utilisateur (l'ID du document = UID de l'utilisateur)
6. Modifiez le champ `role` de `user` à `admin`
7. Cliquez sur **Update**

### Méthode 2 : Directement dans le code (Développement uniquement)

Pour votre première connexion, modifiez temporairement le fichier [src/app/signup/page.tsx](src/app/signup/page.tsx) :

```typescript
// Ligne ~62
await createUserProfile(
  userCredential.user.uid,
  email,
  'admin', // 👈 Changez 'user' en 'admin' temporairement
  {
    displayName: `${firstName} ${lastName}`,
  }
);
```

**⚠️ Après avoir créé votre compte admin, remettez `'user'` !**

### Méthode 3 : Script Node.js (Pour plusieurs admins)

1. Téléchargez votre clé de service Firebase :
   - Firebase Console > ⚙️ Project Settings > Service Accounts
   - Cliquez sur "Generate new private key"
   - Sauvegardez le fichier comme `serviceAccountKey.json` à la racine du projet

2. Installez les dépendances :
```bash
npm install firebase-admin tsx
```

3. Modifiez [scripts/make-admin.ts](scripts/make-admin.ts) :
```typescript
const USER_EMAIL = 'votre-email@example.com'; // 👈 Changez ici
```

4. Exécutez le script :
```bash
npx tsx scripts/make-admin.ts
```

## 🔒 Structure de sécurité

### Règles Firestore

Les règles dans [firestore.rules](firestore.rules) contrôlent :

- ✅ Les utilisateurs peuvent créer leur propre profil avec le rôle `user`
- ✅ Les utilisateurs peuvent modifier leur profil (sauf le rôle)
- ✅ Seuls les admins peuvent modifier les rôles
- ✅ Les utilisateurs voient uniquement leurs propres commandes
- ✅ Les admins voient toutes les commandes
- ✅ Les produits sont en lecture seule, modifiables uniquement par les admins

### Déploiement des règles

Pour déployer les nouvelles règles Firestore en production :

```bash
# Installer Firebase CLI si nécessaire
npm install -g firebase-tools

# Se connecter
firebase login

# Déployer uniquement les règles
firebase deploy --only firestore:rules
```

## 🎨 Utilisation dans le code

### Vérifier si un utilisateur est admin

```typescript
import { useUser } from '@/firebase/auth/use-user';

function MyComponent() {
  const { isAdmin, userProfile } = useUser();

  if (isAdmin) {
    return <AdminContent />;
  }

  return <UserContent />;
}
```

### Protéger une route

```typescript
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isAdmin, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) return null;

  return <YourAdminContent />;
}
```

## 📂 Fichiers modifiés

- ✅ [src/firebase/auth/use-user.tsx](src/firebase/auth/use-user.tsx) - Hook amélioré avec profil et rôle
- ✅ [src/lib/types.ts](src/lib/types.ts) - Type User mis à jour
- ✅ [firestore.rules](firestore.rules) - Règles de sécurité basées sur les rôles
- ✅ [src/app/admin/page.tsx](src/app/admin/page.tsx) - Page admin simplifiée
- ✅ [src/components/layout/header.tsx](src/components/layout/header.tsx) - Bouton admin pour les admins
- ✅ [src/app/[locale]/account/page.tsx](src/app/[locale]/account/page.tsx) - Badge admin et lien vers le panneau
- ✅ [.gitignore](.gitignore) - Protection des clés de service
- ✅ [scripts/make-admin.ts](scripts/make-admin.ts) - Script pour promouvoir des utilisateurs
- ✅ [ADMIN_SETUP.md](ADMIN_SETUP.md) - Documentation détaillée

## 🚀 Prochaines étapes

1. **Créer votre premier admin** (utilisez une des méthodes ci-dessus)
2. **Déployer les règles Firestore** : `firebase deploy --only firestore:rules`
3. **Tester l'accès** :
   - Connectez-vous avec le compte admin
   - Vérifiez que le badge "Admin" apparaît sur la page compte
   - Vérifiez que l'icône bouclier apparaît dans le header
   - Accédez à `/admin` et vérifiez que vous pouvez gérer les utilisateurs

## ⚠️ Sécurité importante

- ❌ Ne committez JAMAIS `serviceAccountKey.json` dans Git
- ❌ Ne laissez JAMAIS `'admin'` en dur dans le code de signup
- ✅ Déployez toujours les règles Firestore après modification
- ✅ Testez les permissions avant de passer en production

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que les règles Firestore sont déployées
2. Vérifiez que le profil utilisateur existe dans la collection `users`
3. Vérifiez que le champ `role` est bien défini sur `admin`
4. Rechargez la page après avoir modifié le rôle

---

✨ **Le système est maintenant prêt à l'emploi !**

# Configuration du système d'administration

## Fonctionnalités mises en place

### 1. Système de rôles
- **admin** : Accès complet à l'interface d'administration
- **user** : Utilisateur standard avec accès limité

### 2. Sécurité Firestore
Les règles Firestore ont été mises à jour pour :
- Limiter l'accès aux données sensibles
- Permettre aux admins de gérer les utilisateurs et les commandes
- Permettre aux utilisateurs de gérer uniquement leurs propres données

### 3. Hook useUser amélioré
Le hook `useUser` fournit maintenant :
- `user` : L'utilisateur Firebase Auth
- `userProfile` : Le profil complet avec le rôle
- `isAdmin` : Boolean pour vérifier facilement si l'utilisateur est admin
- `loading` : État de chargement

## Comment créer un administrateur

### Méthode 1 : Via la console Firebase (Recommandé)

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet
3. Allez dans **Firestore Database**
4. Trouvez la collection `users`
5. Trouvez ou créez le document avec l'UID de l'utilisateur
6. Ajoutez/modifiez le champ `role` à `admin`

### Méthode 2 : Via le script Node.js

1. Téléchargez votre clé de compte de service :
   - Firebase Console > Project Settings > Service Accounts
   - Cliquez sur "Generate new private key"
   - Sauvegardez le fichier comme `serviceAccountKey.json` à la racine du projet

2. Installez les dépendances :
   ```bash
   npm install firebase-admin tsx
   ```

3. Modifiez le script `scripts/make-admin.ts` :
   - Remplacez `USER_EMAIL` par l'email de l'utilisateur

4. Exécutez le script :
   ```bash
   npx tsx scripts/make-admin.ts
   ```

### Méthode 3 : Directement dans le code (Développement uniquement)

Lors de l'inscription, vous pouvez temporairement modifier le rôle par défaut dans `src/app/signup/page.tsx` :

```typescript
await createUserProfile(
  userCredential.user.uid,
  email,
  'admin', // ⚠️ Changez 'user' en 'admin'
  {
    displayName: `${firstName} ${lastName}`,
  }
);
```

**⚠️ N'oubliez pas de remettre 'user' après !**

## Accès à l'interface admin

Une fois qu'un utilisateur a le rôle admin :
1. Connectez-vous avec ce compte
2. Accédez à `/admin`
3. L'interface d'administration sera accessible

## Vérifier les rôles dans votre code

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

## Structure de la base de données

### Collection `users`
```typescript
{
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Déploiement des règles Firestore

Après avoir modifié `firestore.rules`, déployez-les :

```bash
firebase deploy --only firestore:rules
```

## Sécurité importante

⚠️ **NE JAMAIS** committer `serviceAccountKey.json` dans Git !

Ajoutez-le au `.gitignore` :
```
serviceAccountKey.json
```

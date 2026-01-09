# Gestion des Produits - Interface d'Administration

## ✅ Fonctionnalités Implémentées

L'interface d'administration pour la gestion des produits est maintenant complète avec toutes les fonctionnalités demandées :

### 🎯 Fonctionnalités principales

1. **Upload d'images**
   - Upload multiple d'images vers Firebase Storage
   - Prévisualisation en temps réel
   - Attribution de couleurs à chaque image
   - Validation des formats et tailles (max 5MB)
   - Suppression d'images

2. **Gestion des produits**
   - Création de nouveaux produits
   - Modification de produits existants
   - Suppression de produits (avec confirmation)
   - Liste complète des produits

3. **Gestion des prix**
   - Prix de vente
   - Prix original (pour afficher les promotions)
   - Calcul automatique du pourcentage de réduction
   - Affichage visuel des promotions

4. **Gestion des couleurs**
   - Ajout dynamique de couleurs
   - Suppression de couleurs
   - Association images-couleurs

5. **Options avancées**
   - Catégories prédéfinies
   - Gestion du stock
   - Publication/Brouillon
   - Génération automatique de slug (URL)
   - Description détaillée

### 📂 Structure des fichiers

#### Services Firebase

- **[src/firebase/storage.ts](src/firebase/storage.ts)** - Gestion des uploads d'images
  - `uploadImage()` - Upload d'une image
  - `uploadMultipleImages()` - Upload multiple
  - `deleteImage()` - Suppression d'image
  - `listImages()` - Liste des images

- **[src/firebase/products.ts](src/firebase/products.ts)** - Gestion des produits
  - `getAllProducts()` - Récupérer tous les produits
  - `getPublishedProducts()` - Produits publiés uniquement
  - `getProductById()` - Produit par ID
  - `getProductBySlug()` - Produit par slug
  - `createProduct()` - Créer un produit
  - `updateProduct()` - Mettre à jour
  - `deleteProduct()` - Supprimer
  - `generateSlug()` - Génération de slug

#### Composants

- **[src/components/admin/image-upload.tsx](src/components/admin/image-upload.tsx)**
  - Composant d'upload avec drag & drop
  - Prévisualisation des images
  - Attribution des couleurs
  - Gestion des états de chargement

- **[src/components/admin/product-form.tsx](src/components/admin/product-form.tsx)**
  - Formulaire complet de produit
  - Validation des données
  - Gestion des images et couleurs
  - Switch publication

#### Pages Admin

- **[src/app/admin/products/page.tsx](src/app/admin/products/page.tsx)**
  - Liste tous les produits
  - Affichage en grille avec images
  - Badges de statut (Publié/Brouillon)
  - Actions (Modifier/Supprimer)

- **[src/app/admin/products/new/page.tsx](src/app/admin/products/new/page.tsx)**
  - Page de création de produit
  - Protection par rôle admin

- **[src/app/admin/products/[id]/page.tsx](src/app/admin/products/[id]/page.tsx)**
  - Page d'édition de produit
  - Chargement des données existantes

#### Règles de sécurité

- **[storage.rules](storage.rules)** - Règles Firebase Storage
  - Seuls les admins peuvent uploader/supprimer dans `/products`
  - Validation de la taille (5MB max)
  - Validation du type (images uniquement)

### 🚀 Comment utiliser

#### 1. Accéder à l'interface

En tant qu'administratrice, accédez à :
- `/admin` puis cliquez sur l'onglet "Produits"
- Ou directement `/admin/products`

#### 2. Créer un produit

1. Cliquez sur **"Nouveau produit"**
2. Remplissez les informations :
   - **Nom** : Ex: "Cape élégante"
   - **Catégorie** : Choisissez dans la liste
   - **Description** : Décrivez le produit
   - **Prix** : Prix de vente en TND
   - **Prix original** (optionnel) : Pour afficher une promotion
   - **Stock** : Quantité disponible

3. Ajoutez les **couleurs** :
   - Tapez le nom de la couleur
   - Cliquez "Ajouter"
   - Répétez pour chaque couleur

4. Ajoutez les **images** :
   - Cliquez "Sélectionner des images"
   - Choisissez plusieurs images
   - Assignez une couleur à chaque image
   - Cliquez "Uploader X image(s)"
   - Attendez que l'upload se termine

5. Choisissez le statut :
   - **Publié** : Visible sur le site
   - **Brouillon** : Non visible

6. Cliquez **"Créer le produit"**

#### 3. Modifier un produit

1. Dans la liste des produits, cliquez sur **"Modifier"**
2. Modifiez les informations souhaitées
3. Cliquez **"Mettre à jour"**

#### 4. Supprimer un produit

1. Cliquez sur l'icône **poubelle** (🗑️)
2. Confirmez la suppression
3. Le produit et toutes ses images seront supprimés

### 💡 Exemples d'utilisation

#### Créer une promotion

```
Prix original: 100 TND
Prix de vente: 75 TND
→ Affichera automatiquement: -25%
```

#### Gérer les couleurs

```
1. Ajoutez les couleurs disponibles : Beige, Marron, Rose
2. Uploadez des images pour chaque couleur
3. Les clients pourront filtrer par couleur
```

#### Brouillon vs Publié

- **Brouillon** : Idéal pour préparer un produit avant le lancement
- **Publié** : Le produit apparaît immédiatement sur le site

### 🔐 Sécurité

Les règles de sécurité garantissent que :
- ✅ Seuls les admins peuvent créer/modifier/supprimer des produits
- ✅ Les images sont limitées à 5MB
- ✅ Seuls les formats d'images sont acceptés
- ✅ Les utilisateurs normaux ne peuvent pas accéder aux pages admin

### 📊 Déploiement

#### Déployer les règles Storage

```bash
firebase deploy --only storage:rules
```

#### Déployer les règles Firestore (si pas déjà fait)

```bash
firebase deploy --only firestore:rules
```

### 🎨 Interface utilisateur

L'interface inclut :
- Grille responsive de produits
- Badges visuels (Publié/Brouillon, Réductions)
- Prévisualisation des images en temps réel
- Confirmations de suppression
- Messages de succès/erreur
- Chargement progressif

### 📱 Responsive

L'interface s'adapte à tous les écrans :
- Mobile : 1 colonne
- Tablette : 2 colonnes
- Desktop : 3 colonnes

### 🔄 Intégration avec le frontend

Les produits créés dans l'admin sont automatiquement :
- Stockés dans Firestore collection `products`
- Accessibles via les fonctions de [src/firebase/products.ts](src/firebase/products.ts)
- Affichables sur le site si publiés

### ⚙️ Configuration

Les catégories peuvent être modifiées dans [src/components/admin/product-form.tsx](src/components/admin/product-form.tsx) :

```typescript
const CATEGORIES = [
  'Vestes',
  'Pantalons',
  'Robes',
  'Accessoires',
  'Chaussures',
  'Sacs',
];
```

### 🎯 Prochaines améliorations possibles

- Import en masse de produits (CSV)
- Édition d'images (recadrage, filtres)
- Gestion des variantes de taille
- Statistiques de vente par produit
- Historique des modifications

---

✨ **L'interface d'administration est prête à l'emploi !**

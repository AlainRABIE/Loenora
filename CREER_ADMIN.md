# Comment créer votre premier administrateur

## Option la plus rapide (Temporaire - pour le premier admin)

1. **Ouvrez le fichier** [src/app/signup/page.tsx](src/app/signup/page.tsx)

2. **Trouvez ces deux lignes** (environ ligne 67 et 88):
   ```typescript
   await createUserProfile(
     userCredential.user.uid,
     email,
     'user', // ← Changez temporairement en 'admin'
   ```

3. **Changez `'user'` en `'admin'`** dans les deux endroits :
   - Ligne ~67 (inscription par email/mot de passe)
   - Ligne ~88 (inscription par Google)

4. **Créez un nouveau compte** via la page `/signup`

5. **IMPORTANT : Remettez `'admin'` en `'user'`** après avoir créé votre compte admin !

---

## Vérifier que ça marche

Après avoir créé votre compte admin :
1. Connectez-vous
2. Allez sur la page d'accueil `/`
3. Vous devriez voir le **Dashboard Administrateur** au lieu de la page normale

---

## Alternative : Via Firebase Console (Sans modifier le code)

Si vous préférez ne pas modifier le code :

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. Sélectionnez votre projet Loenora
3. Cliquez sur **Firestore Database** dans le menu
4. Trouvez la collection `users`
5. Cliquez sur le document de votre utilisateur (identifié par son UID)
6. Cliquez sur **Modifier le document**
7. Trouvez le champ `role` et changez sa valeur de `user` à `admin`
8. Cliquez sur **Mettre à jour**
9. Rechargez votre page web

---

## Besoin d'aide ?

Si vous voyez des logs dans la console du navigateur (F12), ils vous indiqueront :
- Si l'utilisateur est connecté
- Si le rôle est bien "admin"
- Si le profil utilisateur est chargé correctement

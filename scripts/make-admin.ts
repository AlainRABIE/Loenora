/**
 * Script pour attribuer le rôle d'administrateur à un utilisateur
 * 
 * ⚠️ CE SCRIPT EST OPTIONNEL - Utilisez la console Firebase pour créer votre premier admin
 * 
 * Pour utiliser ce script:
 * 1. Installez les dépendances: npm install firebase-admin tsx dotenv
 * 2. Téléchargez serviceAccountKey.json depuis Firebase Console
 * 3. Remplacez USER_EMAIL par l'email de l'utilisateur
 * 4. Exécutez: npx tsx scripts/make-admin.ts
 * 
 * Alternative (RECOMMANDÉ): Utilisez la console Firebase directement
 * - console.firebase.google.com > Firestore > Collection users > Modifier le champ role
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuration Firebase Admin
// Vous devez avoir un fichier serviceAccountKey.json à la racine
// Téléchargeable depuis Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();
const db = getFirestore();

// ⚠️ REMPLACEZ PAR L'EMAIL DE L'UTILISATEUR À PROMOUVOIR ADMIN
const USER_EMAIL = 'admin@example.com';

async function makeUserAdmin(email: string) {
  try {
    // Récupérer l'utilisateur par email
    const userRecord = await auth.getUserByEmail(email);
    console.log(`✓ Utilisateur trouvé: ${userRecord.email} (UID: ${userRecord.uid})`);

    // Mettre à jour le profil dans Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      role: 'admin',
      displayName: userRecord.displayName || '',
      phone: userRecord.phoneNumber || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    console.log(`✓ Rôle admin attribué à ${email}`);
    console.log(`✓ L'utilisateur peut maintenant accéder à /admin`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

// Exécuter le script
makeUserAdmin(USER_EMAIL)
  .then(() => {
    console.log('\n✅ Opération terminée avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Échec de l\'opération:', error);
    process.exit(1);
  });

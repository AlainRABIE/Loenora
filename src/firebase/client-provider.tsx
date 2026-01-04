'use client';
import { ReactNode } from 'react';
import { firebaseApp, auth, firestore } from '.';
import { FirebaseProvider } from './provider';
import { UserProvider } from './auth/use-user';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider value={{ firebaseApp, auth, firestore }}>
      <UserProvider>
        {children}
      </UserProvider>
    </FirebaseProvider>
  );
}

import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  currentUser = signal<User | null>(null);

  constructor() {
    this.auth.onAuthStateChanged(user => {
      this.currentUser.set(user);
    })
  }

  async registerUser(authData: any, profileData: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        authData.email,
        authData.password
      );
      const uid = userCredential.user.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, {
        ...profileData,
        uid: uid,
        createdAt: new Date().toISOString()
      });

      return userCredential.user;
    } catch(error) {
        console.error('Registration failed:', error);
        throw error;
    }
  }

  async loginUser(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async logoutUser() {
    return this.auth.signOut();
  }

}

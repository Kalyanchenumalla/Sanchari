import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

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
}

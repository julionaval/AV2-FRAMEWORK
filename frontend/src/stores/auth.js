import { defineStore } from 'pinia';
import { getAuth, signOut } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    idToken: null
  }),

  actions: {
    async setUser(firebaseUser) {
      if (firebaseUser) {
        this.user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        };

        // guarda idToken para API
        this.idToken = await firebaseUser.getIdToken();
      } else {
        this.user = null;
        this.idToken = null;
      }
    },

    async logout() {
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      this.idToken = null;
    }
  }
});

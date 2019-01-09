import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private user: firebase.User;
  constructor(public afAuth: AngularFireAuth){
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  signInWithEmail(credentials){
    console.log('Sign In with Email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
  
  signUp(credentials){
    console.log('Signing Up');
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }
  
  get authenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }

  getUID() {
    return this.user && this.user.uid;
  }
}
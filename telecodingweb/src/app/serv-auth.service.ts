import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/database';
import {auth} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ServAuthService {

  email = '';
  pass = '';
  authUser = null;

  constructor(public  miauth: AngularFireAuth) { }

  user = this.miauth.authState;

  // logueo con cuenta de google
  glogin() {
    console.log('google login!');
    this.miauth.signInWithPopup( new auth.GoogleAuthProvider() )
      .then( user => {
        console.log('user logado: ', user);
        this.authUser = user.user;
      })
      .catch( error => {
        console.log('error en google login: ', error);
      });
  }
  logout() {
    console.log('logout!');
    this.miauth.signOut();
  }
}

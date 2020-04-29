import { Injectable } from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';

// importamos el servicio de acceso a la BD
import {FireDBService} from './fire-db.service';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  // objeto local para los datos del usuario
  authUser = null;

  constructor(public miAuth: AngularFireAuth,
              public miDB: FireDBService) {
  }

  user = this.miAuth.authState;

  // logueo con cuenta de google
  glogin() {
    console.log('google login!');
    this.miAuth.signInWithPopup( new auth.GoogleAuthProvider() )
      .then( user => {
        console.log('user logado: ', user);
        this.authUser = user.user;
        // actualizamos la base de datos
        this.miDB.altausuario(user.user.uid, user.user.email);
      })
      .catch( error => {
        console.log('error en google login: ', error);
      });
  }
  logout() {
    console.log('logout!');
    this.miAuth.signOut();
  }
}

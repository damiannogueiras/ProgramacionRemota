import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

// autenticacion por firebase
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
// importamos el servicio de acceso a la BD
import {FireDBService} from './fire-db.service';
import {AngularFireDatabase} from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  private currentUser: firebase.User = null;

  constructor(public miAuth: AngularFireAuth,
              public miDB: FireDBService) {

    // nos suscribimos a los cambios del estado de la autenticacion
    // de esta manera sabemos si el usuario está logueado o no
    this.miAuth.authState.subscribe(user => {
        if (user) {
          this.currentUser = user;
          console.log('Usuario autenticado:', user);
        } else {
          this.currentUser = null;
        }
      },
      err => {
        console.log(`${err.status} ${err.statusText} (${err.error.message})`, 'Please try again')
      });
  }

  // logueo con cuenta de google
  glogin() {
    console.log('google login!');
    this.miAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(user => {
        console.log('user logado: ', user);
        // actualizamos la base de datos
        this.miDB.altausuario(user.user.uid, user.user.email, user.user.photoURL);
      })
      .catch(error => {
        console.log('error en google login: ', error);
      });
  }

  // salimos
  logout() {
    console.log('logout!');
    this.miAuth.signOut();
    this.miDB.bajausuario(this.currentUser.uid);
  }

  // esta logueado?
  isLogueado(): boolean {
    console.log('islog?');
    console.log(this.currentUser);
    return (this.currentUser !== null);
    }

    // obtenemos foto perfil
  getPhoto(){
    return this.currentUser.photoURL;
  }
  // obtenemos correo
  getEmail() {
    return this.currentUser.email;
  }
  // obtenemos uid
  getUID() {
    return this.currentUser.uid;
  }
}

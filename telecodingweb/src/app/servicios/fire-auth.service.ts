import {Injectable} from '@angular/core';

// autenticacion por firebase
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
// importamos el servicio de acceso a la BD
import {FireDBService} from './fire-db.service';
import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  private currentUser: firebase.User = null;

  constructor(public miAuth: AngularFireAuth,
              public miDB: FireDBService,
              private dialog: MatDialog) {

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
        console.log(`${err.status} ${err.statusText} (${err.error.message})`, 'Please try again');
      });
  }

  // logueo con cuenta de google
  glogin() {
    console.log('google login!');
    this.miAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(user => {
        console.log('user logado: ', user);
        // actualizamos la base de datos
        // TODO pasarlo a express
        this.miDB.altausuario(user.user.uid, user.user.email, user.user.photoURL);
      })
      .catch(error => {
        console.log('error en google login: ', error);
        this.dialog.open(MessageComponent, {
          data: {
            tipo: 'Error',
            message: 'Error al autenticar. Ponte en contacto con el administrador.',
            id: 'error'
          }
        });
      });
  }

  // salimos
  logout() {
    console.log('logout!');
    // borramos la sesion de google
    this.miAuth.signOut();
    // pedimos borrar los datos de la base de datos
    this.miDB.bajausuario(this.currentUser.uid, this.currentUser.email);
  }

  // esta logueado?
  isLogueado(): boolean {
    return (this.currentUser !== null);
  }

  // obtenemos foto perfil
  getPhoto(){
    return (this.isLogueado() ? this.currentUser.photoURL : '');
  }
  // obtenemos correo
  getEmail() {
    return (this.isLogueado() ? this.currentUser.email : '');
  }
  // obtenemos uid
  getUID() {
    return (this.isLogueado() ? this.currentUser.uid : '');
  }
}

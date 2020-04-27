import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FireDBService {

  /**
   * Constructor de la clase
   * @param db objeto para manejar datos en la Database RealTime
   */
  constructor(public db: AngularFireDatabase) { }

  /**
   * Crea entrada según la uid del usuario
   * @param usuarioNuevoUID entrada nueva
   */
  altausuario(usuarioNuevoUID: string, usuarioNuevoMail: string) {
    this.db.object('users/' + usuarioNuevoUID.toString()).update({mail: usuarioNuevoMail});
    console.log('Insertado uid');
  }

  /**
   * Borra la entrada segun el UID del usuario
   * @param uidBorrar uid del usuario logueado
   */
  bajausuario(uidBorrar: string) {
    // borra entrada
    this.db.object('users/' + uidBorrar).remove();
  }

  /**
   * recorre todos los workbenchs
   */
  getWorkbenchs() {

    // tslint:disable-next-line:only-arrow-functions
    this.db.database.ref('/workbenchs').once('value').then(function(snapshot) {
      console.log(snapshot.val());
      return (snapshot.val()) || 'Anything';
    });
  }
}

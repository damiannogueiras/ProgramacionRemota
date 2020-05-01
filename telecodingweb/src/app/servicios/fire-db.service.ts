import { Injectable } from '@angular/core';
// las clases para trabajar con bases de datos
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

// la interface para guardar los datos
import { Wbs } from '../interfaces/wbs';

@Injectable({
  providedIn: 'root'
})

export class FireDBService {

  // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
  wbsRef: AngularFireList<any>;

  /**
   * Constructor de la clase
   * @param db objeto para manejar datos en la Database RealTime
   */
  constructor(public db: AngularFireDatabase) { }

  /**
   * especificamos la colección de datos de Firebase Database Realtime
   * que queremos listar 'workbenchs'
   * @return todos los workbenchs de la db
   */
  listarWbs() {
    this.wbsRef = this.db.list('workbenchs');
    return this.wbsRef;
  }

  /**
   * Crea entrada según la uid del usuario
   * @param usuarioNuevoUID entrada nueva
   */
  altausuario(usuarioNuevoUID: string, usuarioNuevoMail: string, photo: string) {
    this.db.object('users/' + usuarioNuevoUID.toString()).update({mail: usuarioNuevoMail, photoURL: photo});
    console.log('Insertado uid');
  }

  /**
   * Borra la entrada segun el UID del usuario
   * Lo quita de los bancos?
   * @param uidBorrar uid del usuario logueado
   */
  bajausuario(uidBorrar: string) {
    // ¿borra entrada?
    // si el usuario está trabajando y por error sale de la sesion
    // lo hechamos del banco o ¿solo contamos el tiempo?
    // this.db.object('users/' + uidBorrar).remove();
  }

  /**
   * ocupa un banco
   */
  enter(banco: string, peticionario: string, email: string, photo) {
    this.db.object('workbenchs/' + banco).update({usuarioLogueado: email, photo: photo, status: "busy"});
    this.db.object('users/' + peticionario).update({banco: banco});
  }
}

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
}

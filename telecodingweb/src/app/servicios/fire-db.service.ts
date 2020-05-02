import {Injectable, OnInit} from '@angular/core';

// las clases para trabajar con bases de datos
import {AngularFireAction, AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {IUsers} from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})

export class FireDBService implements OnInit {

  workbenchs: Observable<any[]>;
  users: Observable<any[]>;

  usersList: AngularFireList<any>;

  mail$: BehaviorSubject<string | null>;
  banco$: BehaviorSubject<string | null>;
  usersItems$: Observable<any[]>;

  user: IUsers[];

  /**
   * Constructor de la clase
   * db objeto para manejar datos en la Database RealTime
   */
  constructor(public miDB: AngularFireDatabase) {

    // recuperamos los bancos y estamos pendiente de los cambios
    //this.workbenchs = miDB.list('workbenchs').valueChanges();

    // recuperamos los usuarios y estamos pendiente de los cambios
    this.users = miDB.list('users').valueChanges().pipe(
      switchMap(nombre =>
        this.miDB.list('/users', ref =>
          nombre ? ref.orderByKey() : ref
        ).snapshotChanges()
      )
    );

    // recuperamos los bancos por orden de las key
    this.workbenchs = miDB.list('workbenchs').valueChanges().pipe(
      switchMap(nombre =>
        this.miDB.list('/workbenchs', ref =>
          nombre ? ref.orderByKey() : ref
        ).snapshotChanges()
      )
    );

    // lista de usuarios (no Observable, solo lista)
    this.usersList = this.miDB.list('/users');

    /*
    // recuperamos usuario por mail
    this.mail$ = new BehaviorSubject(null);
    this.usersItems$ = this.mail$.pipe(
      switchMap(mail => {
        return this.miDB.list(
          '/users',
          ref =>
            mail ? ref.orderByChild('mail').equalTo(mail) : ref
        ).valueChanges()
      })
     */

  } // fin del constructor

  ngOnInit(): void {
  }

  /**
   * Crea entrada según la uid del usuario
   * @param usuarioNuevoUID entrada nueva
   */
  altausuario(usuarioNuevoUID: string, usuarioNuevoMail: string, photo: string) {
    this.miDB.object('users/' + usuarioNuevoUID.toString()).update({mail: usuarioNuevoMail, photoURL: photo});
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
   * @banco: id del workbench
   * @email: del peticionario
   * @photo: avatar del peticionario
   */
  enter(banco: string, peticionario: string, email: string, photo) {
    this.miDB.object('workbenchs/' + banco).update({usuarioLogueado: email, photo, status: 'busy'});
    this.miDB.object('users/' + peticionario).update({banco: banco});
  }

  /**
   * devuelve user por UID
   * @param uid user
   */
  getUser(mail: string) {
    return this.miDB.list(
      '/users',
      ref => ref.orderByChild("mail").equalTo(mail)
    ).valueChanges();
    console.log('Filtro por mail: ' + mail);
  }

  /**
   * comprobamos si esta en un banco
   * @param mail del solicitante
   * @return si está en un banco
   */
  isAtWB(mail: string) {
    var esta = true;
    console.log('¿ ' + mail + ' esta en un banco?');
    /*this.mail$.next(mail);
    this.usersItems$.map*/
    return esta;
  }
}

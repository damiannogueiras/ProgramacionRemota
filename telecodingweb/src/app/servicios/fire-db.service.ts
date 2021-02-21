import {Injectable, OnInit} from '@angular/core';

// las clases para trabajar con bases de datos
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {IUsers} from '../interfaces/users';
import {IWbs} from '../interfaces/wbs';
import {IServers} from '../interfaces/servers';

@Injectable({
  providedIn: 'root'
})

export class FireDBService {

  servers: Observable<any[]>;
  workbenchs: Observable<any[]>;
  users: Observable<any[]>;
  user: Observable<any[]>;
  usersList: AngularFireList<any>;

  mail$: BehaviorSubject<string | null>;
  banco$: BehaviorSubject<string | null>;
  usersItems$: Observable<any[]>;

  // arrays con los datos
  serverArray: IServers[];
  userArray: IUsers[];
  workbenchsArray: IWbs[] = [];

  /*avatarList: Array<string> = [
    'https://ssl.gstatic.com/docs/common/profile/alligator_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/anteater_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/axolotl_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/badger_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/bat_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/beaver_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/buffalo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/camel_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/capybara_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chameleon_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/cheetah_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chinchilla_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chipmunk_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chupacabra_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/cormorant_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/coyote_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/crow_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/dingo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/dinosaur_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/dolphin_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/duck_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/elephant_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/ferret_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/frog_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/giraffe_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/grizzly_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/hedgehog_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/hippo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/ibex_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/ifrit_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/jackal_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/jackalope_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/kangaroo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/koala_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/kraken_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/lemur_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/leopard_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/liger_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/llama_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/mink_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/monkey_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/narwhal_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/nyancat_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/orangutan_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/panda_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/penguin_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/pumpkin_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/python_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/quagga_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/rabbit_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/raccoon_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/rhino_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/sheep_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/shrew_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/skunk_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/squirrel_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/tiger_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/turtle_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/walrus_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/wolverine_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/wombat_lg.png'
  ];*/

  /**
   * Constructor de la clase
   * db objeto para manejar datos en la Database RealTime
   */
  constructor(public miDB: AngularFireDatabase) {

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
    // this.usersList = this.miDB.list('/users');

    // guardamos los servers en el array
    this.miDB.list('servers').snapshotChanges().subscribe(
      data => {
        this.serverArray = [];
        data.forEach(item => {
          const a = item.payload.toJSON();
          // @ts-ignore
          a.$key = item.key;
          // console.log(item);
          // console.log(a);
          this.serverArray.push(a as IServers);
        });
        // console.log(this.serverArray);
      }
    );

    // guardamos los users en el array
    this.miDB.list('users').snapshotChanges().subscribe(
      data => {
        this.userArray = [];
        data.forEach(item => {
          const a = item.payload.toJSON();
          // @ts-ignore
          a.$key = item.key;
          // console.log(item);
          // console.log(a);
          this.userArray.push(a as IUsers);
        });
        // console.log(this.userArray);
      }
    );

    // guardamos los workbenchs en el array
    this.miDB.list('workbenchs').snapshotChanges().subscribe(
      data => {
        this.workbenchsArray = [];
        data.forEach(item => {
          const a = item.payload.toJSON();
          // @ts-ignore
          a.$key = item.key;
          // console.log(item);
          // console.log(a);
          this.workbenchsArray.push(a as IWbs);
        });
        // console.log(this.workbenchsArray);
      }
    );
    // console.log('Fin del constructor');
  } // fin del constructor


  /**
   * Crea entrada según la uid del usuario
   * @param usuarioNuevoUID entrada nueva
   */
  altausuario(usuarioNuevoUID: string, usuarioNuevoMail: string, photo: string) {
    // TODO manejar re-entrada sin borrar el banco donde esté
    this.user = this.miDB.list('users/' + usuarioNuevoUID).valueChanges();
    console.log('Alta usuario?');
    console.log(this.user);
    this.miDB.object('users/' + usuarioNuevoUID.toString()).update({banco: '-', bancoNombre: '-', mail: usuarioNuevoMail, photoURL: photo});
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
   * devuelve dominio del servidor Express segun el banco
   * @param id del banco
   */
  getDominio(bancoID: string) {
    // console.log(bancoID.substr(0, 2));
    // tslint:disable-next-line:only-arrow-functions
    const index = this.serverArray.findIndex(function(item, i){
      // @ts-ignore
      return item.$key === bancoID.substr(0, 2);
    });
    return this.serverArray[index].dominio;
  }

  /**
   * devuelve puerto Express segun el banco
   * @param id del banco
   */
  getPortExpress(bancoID: string) {
    // console.log(bancoID.substr(0, 2));
    // tslint:disable-next-line:only-arrow-functions
    const index = this.serverArray.findIndex(function(item, i){
      // @ts-ignore
      return item.$key === bancoID.substr(0, 2);
    });
    return this.serverArray[index].portExpress;
  }

  /**
   * devuelve user por UID, antes check que el array está definido
   * @param mail user
   * @return objeto user
   */
  getUserByMail(mail: string) {
    if (!this.userArray) {
      // devuelvo objeto vacio
      return null;
    } else {
      // tslint:disable-next-line:only-arrow-functions
      const index = this.userArray.findIndex(function(item, i){
        // @ts-ignore
        return item.mail === mail;
      });
      return this.userArray[index];
    }

  }

  /**
   * devuelve wb por mail, antes check que el array está definido
   * @param mail user
   * @return objeto wb
   */
  getWbByMail(mail: string) {
    if (!this.workbenchsArray) {
      // devuelvo objeto vacio
      return null;
    } else {
      // tslint:disable-next-line:only-arrow-functions
      const index = this.workbenchsArray.findIndex(function(item, i){
        // @ts-ignore
        return item.userLogueado === mail;
      });
      return this.workbenchsArray[index];
    }
  }

  /**
   * comprobamos si esta en un banco comprueba antes si no es null
   * @param mail del solicitante
   * @return si está en un banco true
   */
  isAtWB(mail: string): boolean {
    if (!this.getUserByMail(mail)) {
      return false;
    } else {
      return (this.getUserByMail(mail).banco !== '-');
    }
  }
}

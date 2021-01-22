import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// las clases para trabajar con bases de datos
import {AngularFireAction, AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
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

  avatarList: Array<string> = [
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
  ];

  /**
   * Constructor de la clase
   * db objeto para manejar datos en la Database RealTime
   */
  constructor(public miDB: AngularFireDatabase) {

    // recuperamos los bancos y estamos pendiente de los cambios
    // this.workbenchs = miDB.list('workbenchs').valueChanges();

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
        console.log(this.serverArray);
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

    console.log('Fin del constructor');
  } // fin del constructor


  /**
   * Obtiene toda la informacion del fichero avatarlist.json
   */
  public getAvatar() {
    // console.log(Math.round(Math.random() * this.avatarList.length) );
    return (this.avatarList[Math.round(Math.random() * this.avatarList.length)]);
  }

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
   * ocupa un banco
   * @banco: id del workbench
   * @bancoNombre: nombre del banco a ocupar
   * @email: del peticionario
   * @avatar: avatar del peticionario
   */
  enter(banco: string, bancoNombre: string, peticionario: string, email: string, avatar) {
    this.miDB.object('workbenchs/' + banco).update({userLogueado: email, avatar, status: 'busy'});
    this.miDB.object('users/' + peticionario).update({banco, bancoNombre});
  }

  /**
   * salir de un banco, resetearlo
   * @param bancoID a resetear
   * @param bancoNombre nombre del banco
   * @param peticionario no procede
   */

  salir(bancoID: string, bancoNombre: string, peticionario: string) {
    console.log('salir: ' + bancoNombre + ' ' + peticionario);
    console.log(this.workbenchsArray);
    const index = this.workbenchsArray.findIndex(function(item, i){
      return item.nombre === bancoNombre;
    });
    console.log(index);
    this.getAvatar();
    this.miDB.object('workbenchs/' + bancoID).update({
      status: 'free',
      t_remaining: this.workbenchsArray[index].t_total, userLogueado: '',
      avatar: this.getAvatar()});
    this.miDB.object('users/' + peticionario).update({banco: '-', bancoNombre: '-'});
  }

  /**
   * devuelve dominio segun el banco
   * @param id del banco
   */
  getDominio(bancoID: string) {
    // console.log(bancoID.substr(0, 2));
    const index = this.serverArray.findIndex(function(item, i){
      // @ts-ignore
      return item.$key === bancoID.substr(0, 2);
    });
    return this.serverArray[index].dominio;
  }

  /**
   * devuelve user por UID
   * @param uid user
   */
  getUser(mail: string) {
    return this.miDB.list(
      '/users',
      ref => ref.orderByChild('mail').equalTo(mail)
    ).valueChanges();
    console.log('Filtro por mail: ' + mail);
  }

  /**
   * comprobamos si esta en un banco
   * @param mail del solicitante
   * @return si está en un banco
   */
  isAtWB(mail: string) {
    const esta = true;
    console.log('¿ ' + mail + ' esta en un banco?');
    /*this.mail$.next(mail);
    this.usersItems$.map*/
    return esta;
  }
}

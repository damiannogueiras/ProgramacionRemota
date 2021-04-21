import {AfterContentInit, AfterViewChecked, Component, OnInit} from '@angular/core';
import { FireDBService } from '../servicios/fire-db.service';
import { FireAuthService } from '../servicios/fire-auth.service';
// comunicacion con el servidor express
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-userbar',
  templateUrl: './userbar.component.html',
  styleUrls: ['./userbar.component.scss']
})
export class UserbarComponent {
  // tslint:disable:variable-name
  public _user = null;
  public _nombreBanco = '';
  public _puerto = '';
  public _keytopic = '';
  public _t_remaining = '';
  public _status = '-';
  public _wb;

  showFiller = false;

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService,
              private http: HttpClient) {
  }

  /**
   * una vez creada la vista actualizamos datos
   */
  /*ngAfterViewChecked(): void {

    this._user = this.miServDb.getUserByMail(this.miServAuth.getEmail());
    this._wb = this.miServDb.getWbByMail(this.miServAuth.getEmail());
    console.log('Userbar ');
    console.log(this._wb);
    this._nombreBanco = this._user.bancoNombre;
    this._puerto = this._user.banco.substr(2, this._user.banco.length);
    //this._keytopic = this._wb.userNodeRED;
    this._status = this._wb.status;
    this._t_remaining = this._wb.t_remaining;

  }*/

  /**
   * Salir del banco.
   * @param user registro
   */
  salir(user) {
    const bancoID = user.banco;
    // recojo dominio
    const express = this.miServDb.getDominio(bancoID);
    const portExpress = this.miServDb.getPortExpress(bancoID);
    this.http.get<any>('http://' + express + ':' + portExpress + '/cierre' +
      '?uid=' + this.miServAuth.getUID() +
      '&bancoid=' + bancoID).subscribe(
      data => {
        console.log('Respuesta express:' + data.code);
      },
      error => {
        console.error('Error al cerrar banco', error);
      }
    );
  }

  createURL() {
    //console.log("[MiNodeRed] create url");
    if (this.miServDb.isAtWB(this.miServAuth.getEmail())) {
      const banco = this.miServDb.getUserByMail(this.miServAuth.getEmail()).banco;
      const puerto = banco.substr(2, banco.length);
      //console.log("[minored]" + 'http://programacionremota.danielcastelao.org:' + puerto);
      return 'http://remote.danielcastelao.org:' + puerto;
    } else {
      return '';
      //console.log("[minodered]No estas en ningun ");
    }

  }
}

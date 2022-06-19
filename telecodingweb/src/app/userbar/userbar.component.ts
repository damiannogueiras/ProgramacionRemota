import {AfterContentInit, AfterViewChecked, Component, OnInit} from '@angular/core';
import { FireDBService } from '../servicios/fire-db.service';
import { FireAuthService } from '../servicios/fire-auth.service';
// comunicacion con el servidor express
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {IWbs} from "../interfaces/wbs";

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
    // recargamos la pagina para ir al home
    window.location.reload()
  }

  /**
   * Obtener tiempo restante
   */
  tiempoRestante() {
    return this.miServDb.getWbByMail(this.miServAuth.getEmail()).t_remaining
  }

  /**
   * URl de la camara
   * @param WB
   * @return URL camera
   */
  getURLcamera() {
    let _url = this.miServDb.getWbByMail(this.miServAuth.getEmail()).camera + "/stream"
    // console.log("[userbar] " + _url)
    return _url
  }
}

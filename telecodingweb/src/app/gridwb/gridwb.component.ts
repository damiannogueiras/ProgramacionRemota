import {Component, OnInit} from '@angular/core';

import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';

// comunicacion con el servidor express
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

import {FireAuthService} from '../servicios/fire-auth.service';
import {FireDBService} from '../servicios/fire-db.service';

@Component({
  selector: 'app-gridwb',
  templateUrl: './gridwb.component.html',
  styleUrls: ['./gridwb.component.scss']
})
export class GridwbComponent {
  // tslint:disable:variable-name
  private _express = '';
  // default port
  private _portExpress = '4100';
  private _portBanco: string;

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService,
              private dialog: MatDialog,
              private http: HttpClient) {
  }


  /**
   * Solicitud de entrada a un banco
   * @param bancoIDSolicitado key en la base de datos
   * @param bancoSolicitado nombre del banco
   * @param bancoUsuario key del banco en la entrada del usuario logueado
   * @param bancoUsuarioNombre nombre del banco en la entrada del usario loguedo
   */
  solicitud(bancoIDSolicitado, bancoSolicitado, bancoUsuario, bancoUsuarioNombre) {
    console.log('Solicitando banco: ' + bancoSolicitado);
    // recojo dominio
    this._express = this.miServDb.getDominio(bancoIDSolicitado);
    this._portExpress = this.miServDb.getPortExpress(bancoIDSolicitado);
    // console.log(this._portExpress);
    // comprobamos si esta en un banco
    if (bancoUsuario !== '-') {
      // esta en un banco
      this.dialog.open(MessageComponent, {
        data: {
          tipo: 'Aviso',
          message: '<p>Ya estás en el banco ' + bancoUsuarioNombre + '.</p><p>Si quieres entrar en otro debes abandonarlo.</p>',
          id: 'yaestas'
        }
      });
    }
    // esta logueado y NO esta en ningun banco
    else {
      console.log('Logueado y en ningun banco. Autorizado para ' + bancoSolicitado);
      // peticion al servidor
      const headers = {Authorization: 'Bearer my-token', 'My-Custom-Header': 'foobar'};
      // console.log('Puerto: ' + bancoIDSolicitado.substr(2, bancoIDSolicitado.length));
      this._portBanco = bancoIDSolicitado.substr(2, bancoIDSolicitado.length);
      const _urlPeticion = 'http://' + this._express + ':' + this._portExpress +
        '/solicitud/?bancoid=' + bancoIDSolicitado +
        '&banconombre=' + bancoSolicitado +
        '&user=' + this.miServAuth.getEmail() +
        '&avatar=' + this.miServAuth.getPhoto() +
        '&uid=' + this.miServAuth.getUID();
      // console.log(_urlPeticion);
      this.http.get<any>(_urlPeticion,
        {headers}).subscribe(
        data => {
          console.log('Respuesta express: ' + data.code + ', ' + data.puerto);
          // code = 0 es ejecución correcta
          if (data.code === 0){
            this.dialog.open(MessageComponent, {
              data: {
                tipo: 'Info',
                message:
                // problemas con unsafe URL
                // '<a target="_blank" href="' + this._urlBanco + '">' + bancoSolicitado + '</a>',
                  '<p>Puedes abrir el banco: ' + bancoSolicitado + '</p></p>http://' + this._express + ':' + data.puerto + '</p>',
                id: 'puedes'
              }
            });
          }
          /*Realizamos esta tarea en el express
            this.miServDb.enter(
            bancoIDSolicitado,
            bancoSolicitado,
            this.miServAuth.getUID(),
            this.miServAuth.getEmail(),
            this.miServAuth.getPhoto());*/
        },
        // error cuando el servidor intentó levantar el banco
        error => {
          console.error('Error al levantar banco', error);
          this.dialog.open(MessageComponent, {
            data: {
              tipo: 'Error',
              message: 'Error al intentar lenvantar banco',
              id: 'error'
            }
          });
        }
      );
    }
  }

  /**
   * Salir del banco.
   * @param bancoID identificacion del banco a cerrar
   */
  salir(bancoID) {
    // recojo dominio
    this._express = this.miServDb.getDominio(bancoID);
    this._portExpress = this.miServDb.getPortExpress(bancoID);

    // this.miServDb.salir(bancoID, bancoNombreSolicitado, this.miServAuth.getUID());
    this.http.get<any>('http://' + this._express + ':' + this._portExpress + '/cierre/' +
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

  /**
   * avisamos que se tiene que loguear
   */
  noLogueadoAviso() {
    this.dialog.open(MessageComponent, {
      data: {
        tipo: 'Aviso',
        message: 'Logueate!!!',
        id: 'logueate'
      }
    });
  }
}

import {Component, OnInit} from '@angular/core';

import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';

// comunicacion con el servidor express
import {HttpClient} from '@angular/common/http';
// servicios de auth y acceso a db
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
                'Ya puedes entrar en <a href="minodered">' + bancoSolicitado + '</a>',
                id: 'puedes'
              }
            });
            // reenviamos a mi nodered
          }
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

  showWB(workbench: any): boolean {
    return (workbench.payload.val().show);
  }
}

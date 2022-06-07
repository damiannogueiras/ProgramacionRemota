import {Component} from '@angular/core';
// dialogos modales
import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';
// comunicacion con el servidor express
import {HttpClient} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';
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
              private http: HttpClient) {}

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

    // comprobamos si esta en un banco
    if (bancoUsuario !== '-') {
      // ya esta en un banco
      console.log("[gridwb] Ya estas en un banco")
      this.avisoYaEstas(bancoUsuarioNombre);
    }
    // esta logueado y NO esta en ningun banco
    else {
      console.log('Logueado y en ningun banco. Autorizado para ' + bancoSolicitado);
      // peticion al servidor

      this._portBanco = bancoIDSolicitado.substr(2, bancoIDSolicitado.length);
      const _urlPeticion = 'http://' + this._express + ':' + this._portExpress +
        '/solicitud/?bancoid=' + bancoIDSolicitado +
        '&banconombre=' + bancoSolicitado +
        '&user=' + this.miServAuth.getEmail() +
        '&avatar=' + this.miServAuth.getPhoto() +
        '&uid=' + this.miServAuth.getUID();
      console.log(_urlPeticion);

      // cabeceras de la peticion
      const headers = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Access-Control-Allow-Headers', 'Content-Type')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*');

      this.http.get<any>(_urlPeticion, {headers}).subscribe(
        data => {
          console.log('[gridwb] Respuesta express: ' + data.code + ', ' + data.puerto);
          // code = 0 es ejecución correcta
          if (data.code === 0){
            // avisamos al usuario que va a tardar la carga de node-red
           this.avisoEspera10sg();
          }
        },
        // error cuando el servidor intentó levantar el banco
        error => {
          console.error('[gridwb] Error al levantar banco', error);
          this.avisoErrorLevantando();
        }
      );
    }
  }

  /**
   * Aviso ya estas en un banco
   * @param bancoUsuarioNombre
   * @private
   */
  private avisoYaEstas(bancoUsuarioNombre) {
    this.dialog.open(MessageComponent, {
      data: {
        tipo: 'Aviso',
        message: '<p>Ya estás en el banco ' + bancoUsuarioNombre + '.</p><p>Si quieres entrar en otro debes abandonarlo.</p>',
        id: 'yaestas'
      }
    });
  }

  /**
   * Aviso de error al levantar el banco
   * @private
   */
  private avisoErrorLevantando() {
    this.dialog.open(MessageComponent, {
      data: {
        tipo: 'Error',
        message: 'Error al intentar lenvantar banco',
        id: 'error'
      }
    });
  }

  /**
   * Aviso de espera de 10sg
   * para que le de tiempo a levantar el node-red
   * TODO esperar aviso de pm2 de que está levantado realmente
   * @private
   */
  private avisoEspera10sg() {
    console.log("[gridwb] esperando 10sg")
    const timeout = 3000;
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '300px',
      data: {
        tipo: 'Aviso',
        message: 'Esto puede tardar unos 10sg...',
        id: 'aviso'
      }
    })
    dialogRef.afterOpened().subscribe(_ => {
      setTimeout(() => {
        // cerramos el dialogo a los 10sg
        dialogRef.close();
        // recargamos la pagina luego de esperar 10sg
        location.reload()
      }, timeout)
    })

  }

  /**
   * Aviso que se tiene que loguear
   */
  avisoNoLogueadoAviso() {
    this.dialog.open(MessageComponent, {
      data: {
        tipo: 'Aviso',
        message: 'Logueate!!!',
        id: 'logueate'
      }
    });
  }

  /**
   * Devuelve si el banco tiene que aparecer en el grid
   * @param workbench
   * @return el banco tiene que aparecer en el grid
   */
  showWB(workbench: any): boolean {
    return (workbench.payload.val().show);
  }

  /**
   * Devuelve el status del banco
   * @param workbench
   * @return el satus
   */
  getSatusWB(workbench: any): String {
    return (workbench.payload.val().status);
  }
}

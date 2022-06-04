import {Component, OnInit} from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

import {FireAuthService} from '../servicios/fire-auth.service';
import {FireDBService} from '../servicios/fire-db.service';
import {HttpClient} from '@angular/common/http';
import {response} from 'express';


@Component({
  selector: 'app-minodered',
  templateUrl: './minodered.component.html',
  styleUrls: ['../app.component.scss']
})
export class MinoderedComponent{

  public noderedURL = '';
  noderedReady: boolean;

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService,
              private http: HttpClient) {
    // iniciamos a false ya que tenemos que comprobar que el node esta listo
    this.noderedReady = false;
  }

  /**
   * crea la url segun el puerto del nodered y el servidor
   */
  createURL(){
    // console.log("[MiNodeRed] create url");
    let _URL = "";
    if (this.miServDb.isAtWB(this.miServAuth.getEmail())){
      const banco = this.miServDb.getUserByMail(this.miServAuth.getEmail()).banco;
      const dominio = this.miServDb.getDominio(banco);
      const puerto = banco.substr(2, banco.length);
      _URL = 'http://' + dominio + ':' + puerto;
      // console.log("[minored] " + _URL);
    } else {
      // console.log("[minodered] No estas en ningun banco");
    }

    return _URL;
  }


  //traigo una url
  getURL(url: string): Observable<any> {
    return this.http.get(url)
  }

  /**
   * Comprueba que el nodered está listo para ser usado
   * actualiza la variable noderedReady this.createURL()
   */
  isNodeREDReady(): boolean {
    if (!this.noderedReady) {
      // console.log("Compruebo nodeRed funcionando");
      this.getURL(this.createURL())
        .subscribe(
          (response) => {
            console.log('RESPONSE');
            //this.noderedReady = true;
          },
          (error) => {
            // console.log('Error: ' + error.status);
            switch (error.status) {
              case 0:
                this.noderedReady = false;
                break;
              case 200:
                this.noderedReady = true;
                break;
              default:
                this.noderedReady = false;
                break;
            }
          },
          () => {
            console.log('COMPLETADO');
            this.noderedReady = true;
          }
        );
    }
    return this.noderedReady;
  }
}

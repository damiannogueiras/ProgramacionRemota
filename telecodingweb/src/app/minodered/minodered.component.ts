import {Component, OnInit} from '@angular/core';

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
   * crea la url segun el puerto del nodered
   */
  createURL(){
    // console.log("[MiNodeRed] create url");
    if (this.miServDb.isAtWB(this.miServAuth.getEmail())){
      const banco = this.miServDb.getUserByMail(this.miServAuth.getEmail()).banco;
      const puerto = banco.substr(2, banco.length);
      // console.log("[minored]" + 'http://programacionremota.danielcastelao.org:' + puerto);
      return 'http://remote.danielcastelao.org:' + puerto;
    } else {
      return null;
      // console.log("[minodered]No estas en ningun ");
    }
  }

  /**
   * Comprueba que el nodered está listo para ser usado
   * actualiza la variable noderedReady
   */
  isNodeREDReady(): boolean {
    if (!this.noderedReady) {
      // console.log("Compruebo link");
      this.http
        .get<any>(this.createURL(), {observe: 'response'})
        .subscribe(
        error => {
            console.log('Error: ' + error.status);
            if( error.status === 200 ) {
              this.noderedReady = true;
            } else {
              this.noderedReady = false;
            }
        },
          response => {
          console.log('Response ' + response.status);
            if( response.status === 200 ) {
              this.noderedReady = true;
            } else {
              this.noderedReady = false;
            }
          }
          );
    }
    return this.noderedReady;
  }
}

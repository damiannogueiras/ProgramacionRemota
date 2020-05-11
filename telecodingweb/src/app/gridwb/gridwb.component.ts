import {Component, OnInit} from '@angular/core';

import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';

// comunicacion con el servidor express
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import {FireAuthService} from '../servicios/fire-auth.service';
import {FireDBService} from '../servicios/fire-db.service';



@Component({
  selector: 'app-gridwb',
  templateUrl: './gridwb.component.html',
  styleUrls: ['./gridwb.component.scss']
})
export class GridwbComponent {

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService,
              private dialog: MatDialog,
              private http: HttpClient) {}


  // solicitud de banco
  solicitud(bancoIDSolicitado, bancoSolicitado, bancoURLSolicitado, bancoUsuario, bancoUsuarioNombre){
    console.log('solicitando banco ' + bancoSolicitado);
    // comprobamos que esté logueado
    if (this.miServAuth.isLogueado()) {
      // comprobamos si esta en un banco
      if(bancoUsuario !== "") {
        // esta en un banco
        this.dialog.open(MessageComponent, {
          data: {
            tipo: 'Aviso',
            message: '<p>Ya estás en el banco ' + bancoUsuarioNombre + '.</p><p>Si quieres entrar en otro debes abandonarlo.</p>',
            id:'yaestas'
          }
        });
        // esta logueado y no esta en ningun banco
      } else {
        console.log('Logueado y en ningun banco, Autorizado para '+ bancoSolicitado);
        if (this.levantarBanco(bancoIDSolicitado)) {
          this.miServDb.enter(bancoIDSolicitado, bancoSolicitado, this.miServAuth.getUID(), this.miServAuth.getEmail(), this.miServAuth.getPhoto());
          this.dialog.open(MessageComponent, {
            data: {
              tipo: 'Info',
              message:
                '<a target=”_blank” href=\"' + bancoURLSolicitado + '\">' + bancoURLSolicitado + '</a>',
              id:'puedes'
            }
          });
        } else {
          this.dialog.open(MessageComponent, {
            data: {
              tipo: 'Error',
              message: 'Error al intentar habilitar banco',
              id:'error'
            }
          });
        };
      }
      // no está logueado
    } else {
      console.log('Sin loguear');
    }
  }

  /**
   * Solicita al servidor express que levante el banco
   * @return si la operacion no dio error
   */
  levantarBanco(bancoID): boolean {
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' }
    var todoOK = true;
    this.http.get<any>('http://telecoding.duckdns.org:4100/solicitud/' + bancoID, { headers }).subscribe(
      data => {
        console.log("Peticion realizada:" + data);
        todoOK = true;
      },
      error => {
        console.error("Error al levantar banco", error);
        todoOK = false
      }
    );
    // da un error el get
    // provisionalmente devolvemos siempre true
    // para seguir trabajando
    return true; //todoOK;
  }

  /**
   * Salir del banco. Para uso de pruebas
   * @param bancoID
   * @param bancoNombreSolicitado
   */
  salir(bancoID, bancoNombreSolicitado){
    this.miServDb.salir(bancoID, bancoNombreSolicitado, this.miServAuth.getUID());
  }

  /**
   * avisamos que se tiene que loguear
   */
  noLogueadoAviso(){
    this.dialog.open(MessageComponent, {
      data: {
        tipo: 'Aviso',
        message: 'Logueate!!!',
        id:'logueate'
      }
    });
  }
}

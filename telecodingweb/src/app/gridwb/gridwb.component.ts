import {Component, OnInit} from '@angular/core';

import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {FireAuthService} from '../servicios/fire-auth.service';
import {FireDBService} from '../servicios/fire-db.service';

import {Observable} from 'rxjs';

@Component({
  selector: 'app-gridwb',
  templateUrl: './gridwb.component.html',
  styleUrls: ['./gridwb.component.scss']
})
export class GridwbComponent {

  userWB: string;

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService,
              private dialog: MatDialog, private router: Router) {}


  // solicitud de banco
  solicitud(bancoSolicitado,bancoUsuario){
    console.log('solicitando banco ' + bancoSolicitado);
    // comprobamos que esté logueado
    if (this.miServAuth.isLogueado()) {
      // comprobamos si esta en un banco
      if(bancoUsuario !== "") {
        // esta en un banco
        this.dialog.open(MessageComponent, {
          data: {
            tipo: 'Aviso',
            message: 'Ya estás en el banco '+bancoUsuario+'\nSi quieres entrar en otro debes abandonarlo.'
          }
        });
        // esta logueado y no esta en ningun banco
      } else {
        console.log('Logueado y en ningun banco, Autorizado para '+ bancoSolicitado);
        this.miServDb.enter(bancoSolicitado, this.miServAuth.getUID(), this.miServAuth.getEmail(), this.miServAuth.getPhoto());
      }
      // no está logueado
    } else {
      console.log('Sin loguear');
      this.dialog.open(MessageComponent, {
        data: {
          tipo: 'Info',
          message: 'Logueate!!!'
        }
      });
    }
  }
}

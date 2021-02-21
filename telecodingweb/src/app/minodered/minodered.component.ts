import {Component, OnInit} from '@angular/core';

import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';

// comunicacion con el servidor express
import {HttpClient} from '@angular/common/http';

import {FireAuthService} from '../servicios/fire-auth.service';
import {FireDBService} from '../servicios/fire-db.service';


@Component({
  selector: 'app-minodered',
  templateUrl: './minodered.component.html',
  styleUrls: ['../app.component.scss']
})
export class MinoderedComponent {

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService) {}

  createURL(){
    if (this.miServDb.isAtWB(this.miServAuth.getEmail())){
      const banco = this.miServDb.getUserByMail(this.miServAuth.getEmail()).banco;
      const puerto = banco.substr(2, banco.length);
      return 'http://programacionremota.danielcastelao.org:' + puerto;
    } else {
      return '';
    }
  }
}

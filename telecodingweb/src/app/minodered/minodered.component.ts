import {Component, OnInit} from '@angular/core';

import {FireAuthService} from '../servicios/fire-auth.service';
import {FireDBService} from '../servicios/fire-db.service';


@Component({
  selector: 'app-minodered',
  templateUrl: './minodered.component.html',
  styleUrls: ['../app.component.scss']
})
export class MinoderedComponent {

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService) {
  }

  createURL(){
    //console.log("[MiNodeRed] create url");
    if (this.miServDb.isAtWB(this.miServAuth.getEmail())){
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

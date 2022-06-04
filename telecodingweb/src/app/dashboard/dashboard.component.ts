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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.scss']
})
export class DashboardComponent {

  constructor(public miServDb: FireDBService,
              public miServAuth: FireAuthService) {}

  createURL() {
    // console.log("[dash] create url");
    let _URL = "";
    if (this.miServDb.isAtWB(this.miServAuth.getEmail())) {
      const banco = this.miServDb.getUserByMail(this.miServAuth.getEmail()).banco;
      const dominio = this.miServDb.getDominio(banco);
      const puerto = banco.substr(2, banco.length);
      _URL = 'http://' + dominio + ':' + puerto + '/ui';
    } else {
      // console.log("[dash] No estas en ningun banco");
    }
    return _URL;
  }
}

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
  selector: 'app-minodered',
  templateUrl: './minodered.component.html',
  styleUrls: ['./minodered.component.scss']
})
export class MinoderedComponent {
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

createURL(){
    return 'http://programacionremota.danielcastelao.org:2002';
  }
}

import {Component, Inject, Injectable} from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {FireAuthService} from '../servicios/fire-auth.service';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-messsage',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent {
  constructor(private  dialogRef: MatDialogRef<MessageComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public miServAuth: FireAuthService,
              private sanitizer: DomSanitizer) {
  }

 dataSanitizado = this.sanitizer.bypassSecurityTrustHtml(this.data.message);

  // boton de cerrar en el aviso
  public closeMe() {
    this.dialogRef.close();
  }

  // accion de entrar en el aviso
  public glogin(){
    this.dialogRef.close();
    this.miServAuth.glogin();
  }
}

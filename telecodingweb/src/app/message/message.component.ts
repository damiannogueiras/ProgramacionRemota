import {Component, Inject, Injectable} from  '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from  '@angular/material/dialog';
import {FireAuthService} from '../servicios/fire-auth.service';

@Component({
  templateUrl:  'message.component.html'
})

export class MessageComponent {
  constructor(private  dialogRef:  MatDialogRef<MessageComponent>,
              @Inject(MAT_DIALOG_DATA) public  data:  any,
              public miServAuth: FireAuthService) {
  }
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

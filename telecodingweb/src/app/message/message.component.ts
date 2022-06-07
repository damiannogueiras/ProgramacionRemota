import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-messsage',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent {
  constructor(private dialogRef: MatDialogRef<MessageComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any) {}

  // boton de cerrar en el aviso
  public closeMe() {
    this.dialogRef.close();
    // ¿recargamos? location.reload();
  }
}

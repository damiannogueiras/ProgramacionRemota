import {Component, OnInit} from '@angular/core';
import {FireDBService} from '../servicios/fire-db.service';
import {Wbs} from '../interfaces/wbs';
import {MessageComponent} from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FireAuthService} from '../servicios/fire-auth.service';

@Component({
  selector: 'app-gridwb',
  templateUrl: './gridwb.component.html',
  styleUrls: ['./gridwb.component.css']
})
export class GridwbComponent implements OnInit {
  // array de la interface
  Workbenchs: Wbs[];

  constructor(public dbApp: FireDBService,
              public miServAuth: FireAuthService,
              private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    // listamos datos
    this.dataState();

    // recojemos todos los workbenchs en w
    const w = this.dbApp.listarWbs();

    // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
    // ultimo pasamos los datos a JSON

    w.snapshotChanges().subscribe(data => {
      this.Workbenchs = [];
      data.forEach(item => {
        const a = item.payload.toJSON();
        a['$key'] = item.key;
        // añade workbench al array
        this.Workbenchs.push(a as Wbs);
      })
    })
  }

  // listamos los datos y cada ves que haya cambios en la base de
  // datos de Firebase, muestra esos cambios en la vista con la propiedad '.ValueChanges()'
  dataState() {
    this.dbApp.listarWbs().valueChanges().subscribe(data => {
      // aqui realizamos algo con los cambios de datos en la db
    })
  }

  // solicitud de banco
  solicitud(banco){
    console.log('solicitando banco ' + banco);
    if (this.miServAuth.isLogueado()) {
      console.log(banco);
      this.dbApp.enter(banco, this.miServAuth.getUID(), this.miServAuth.getEmail(), this.miServAuth.getPhoto());
    } else {
      this.dialog.open(MessageComponent, {
        data: {
          message: 'Logueate!!!'
        }
      });
    }
  }
}

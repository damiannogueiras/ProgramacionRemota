import { Component,  OnInit, AfterViewInit } from '@angular/core';

// importamos el servicio de autenticacion
import {FireAuthService} from './servicios/fire-auth.service';
// importamos el servicio de acceso a la BD
import {FireDBService} from './servicios/fire-db.service';

// importamos la interface para guardar los datos
import { Wbs } from './interfaces/wbs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // array de la interface
  Workbenchs: Wbs[];

  // inicializamos los objetos para poder usarlos en el html y aqui
  constructor( public authApp: FireAuthService,
               public dbApp: FireDBService) { }

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
}

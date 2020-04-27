import { Component } from '@angular/core';
// importamos el servicio de autenticacion
import {ServAuthService} from './serv-auth.service';
// importamos el servicio de acceso a la BD
import {FireDBService} from './fire-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'telecodingweb';
  // todos los bancos
  public workbenchs;

  // inicializamos los objetos para poder usarlos en el html
  constructor( public authApp: ServAuthService,
               public dbApp: FireDBService) {

    // recogemos todos los workbench de la base de datos
    this.workbenchs = dbApp.getWorkbenchs();

  }
}

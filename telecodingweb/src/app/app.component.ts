import { Component } from '@angular/core';

// importamos el servicio de autenticacion
import { FireAuthService } from './servicios/fire-auth.service';
// importamos el servicio de acceso a la BD
import { FireDBService } from './servicios/fire-db.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // inicializamos los objetos para poder usarlos en el html y aqui
  constructor( public miServAuth: FireAuthService,
               public miServDb: FireDBService) {}
}

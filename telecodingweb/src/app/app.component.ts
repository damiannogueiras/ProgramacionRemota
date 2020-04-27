import { Component } from '@angular/core';
// importamos el servicio de autenticacion
import {ServAuthService} from './serv-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'telecodingweb';

  // inicializamos los objetos para poder usarlos en el html
  constructor( public authApp: ServAuthService/*,
               public dbApp: FireDBService*/) {
  }
}

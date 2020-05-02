import { Component,  OnInit, AfterViewInit } from '@angular/core';

// importamos el servicio de autenticacion
import {FireAuthService} from './servicios/fire-auth.service';
// importamos el servicio de acceso a la BD
import {FireDBService} from './servicios/fire-db.service';

// importamos la interface para guardar los datos
import { IWbs } from './interfaces/wbs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  // inicializamos los objetos para poder usarlos en el html y aqui
  constructor( public miServAuth: FireAuthService,
               public miServDb: FireDBService) { }

  ngOnInit(): void {
  }

}

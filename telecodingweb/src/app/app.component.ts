import { Component, Input, ChangeDetectionStrategy} from '@angular/core';

// importamos el servicio de autenticacion
import { FireAuthService } from './servicios/fire-auth.service';
// importamos el servicio de acceso a la BD
import { FireDBService } from './servicios/fire-db.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // Solo actualiza cuando hay cambios
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  // variable para cambiar el HTML
  _isUserOnWB = false;
  // array para observar si hay cambios, tiene que estar decorada con @Input() para onChanges
  @Input() _workbenchsArray = [];

  @Input() person: { firstName: string, lastName: string };

  public fullName = '';
  public fullNameViaGetterCounter = 0;
  public calculateFullNameCounter = 0;

  // inicializamos los objetos para poder usarlos en el html y aqui
  constructor( public miServAuth: FireAuthService,
               public miServDb: FireDBService) {
  }

  /**
   * Comprueba que el usuario está en el banco
   */
  isUserOnWB(){
    // console.log("[App.component] comprobando que el usuario está en el WB");
    return this.miServDb.isAtWB(this.miServAuth.getEmail())
  }
}

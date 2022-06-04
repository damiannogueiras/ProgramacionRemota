import {Injectable} from '@angular/core';

// para las llamadas a express
import { Observable, throwError } from 'rxjs';

import {
  HttpClient, HttpEvent, HttpEventType, HttpProgressEvent,
  HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) { }

  getExpressBorrar(dominio: string, portExpress: string, uid: string, bancoid: string){
    // Hacemos la peticion a express para borrar los datos de firebase
    console.log("Llamando a express desde Angular");
    this.http.get<any>('http://' + dominio + ':' + portExpress + '/cierre' +
      '?uid=' + uid +
      '&bancoid=' + bancoid).subscribe(
      data => {
        console.log('Respuesta express:' + data.code);
      },
      error => {
        console.error('Error al cerrar banco', error);
      }
    );
    const options = {
      responseType: 'text' as const,
    };
  }
}

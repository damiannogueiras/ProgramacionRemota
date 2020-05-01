import {Component, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {FireDBService} from '../servicios/fire-db.service';
import {Wbs} from '../interfaces/wbs';

@Component({
  selector: 'app-gridwb',
  templateUrl: './gridwb.component.html',
  styleUrls: ['./gridwb.component.css']
})
export class GridwbComponent implements OnInit {
  // array de la interface
  Workbenchs: Wbs[];

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return this.Workbenchs;
      }
      return this.Workbenchs;
    })
  );

  constructor(private breakpointObserver: BreakpointObserver,
              public dbApp: FireDBService) {}

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
}

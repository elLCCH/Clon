import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina-detalle-inscripciones',
  templateUrl: './pagina-detalle-inscripciones.component.html',
  styleUrls: ['./pagina-detalle-inscripciones.component.css']
})
export class PaginaDetalleInscripcionesComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
  }

}

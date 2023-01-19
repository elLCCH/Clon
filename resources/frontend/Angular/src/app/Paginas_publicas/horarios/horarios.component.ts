import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  esAdmin;
  // CursoListar;
  est = [];
  constructor(private router: Router) { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.consultarlog();
  }
  private consultarlog() {
    if (localStorage.getItem('sesion') != null && (localStorage.l == 'службаданныхlcch')) {
      this.esAdmin = true;  
    }
    else
    {
      this.esAdmin = false;
    }
  }
  OpenPDF(UrlDoc)
  {
    var puntoPDF = ".pdf";
    sessionStorage.setItem('PDF', UrlDoc+puntoPDF);
    this.router.navigate(['/Documento']);
    // window.open('Documento', '_blank');
  }
  ParaCargarListadoEstudiantes(CursoListar) {
    // NiveldeCurso='SEGUNDO MEDIO';
    sessionStorage.setItem('CursoParalelo', CursoListar);
    this.router.navigate(['/Paralelos']);
    // window.open('Paralelos', '_blank');
  }
  //PARA ADMINISTRADORES
  OpenPDFAdmin(UrlDoc)
  {
    var puntoPDF = ".pdf";
    sessionStorage.setItem('PDF', UrlDoc+puntoPDF);
    // this.router.navigate(['/Documento']);
    window.open('Documento', '_blank');
  }
  ParaCargarListadoEstudiantesAdmin(CursoListar) {
    // NiveldeCurso='SEGUNDO MEDIO';
    sessionStorage.setItem('CursoParalelo', CursoListar);
    // this.router.navigate(['/Paralelos']);
    window.open('Paralelos', '_blank');
  }
}

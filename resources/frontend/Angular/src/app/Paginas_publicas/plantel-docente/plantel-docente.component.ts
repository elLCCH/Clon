import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-plantel-docente',
  templateUrl: './plantel-docente.component.html',
  styleUrls: ['./plantel-docente.component.css']
})
export class PlantelDocenteComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  docentes=[ ];
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.CargarDocentes();
  }
  CargarDocentes() {
    axios.get(this.ruta+'api/DiferenciadorIndex?tipo=Docente')
    .then(res => {
      console.log(res.data);
      this.docentes = res.data;
      
    }).catch(err =>  {
    console.log("err");
    });
  }
}

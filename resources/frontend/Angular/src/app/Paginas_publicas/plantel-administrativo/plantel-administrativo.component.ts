import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-plantel-administrativo',
  templateUrl: './plantel-administrativo.component.html',
  styleUrls: ['./plantel-administrativo.component.css']
})
export class PlantelAdministrativoComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  docentes=[ ];
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.CargarAdmins();
  }
  CargarAdmins() {
    axios.get(this.ruta+'api/DiferenciadorIndex?tipo=Administrativo')
    .then(res => {
      console.log(res.data);
      this.docentes = res.data;
      
    }).catch(err =>  {
    console.log("err");
    });
  }
}

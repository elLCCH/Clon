import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-lista-nuevos',
  templateUrl: './lista-nuevos.component.html',
  styleUrls: ['./lista-nuevos.component.css']
})
export class ListaNuevosComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  // columnsOnly = ["name", "id", "rank"]; 
  // columnsOnly = [
  //   {label:'name',field:'name'},
  //   {label:'Sur Name',field:'surname'}, 
  //   {label:'id',field:'id'},
  //   {label:'placee',field:'place'}
  // ];
  // items = [
  //   { name: "jean", surname: "kruger", id: 1, place: "ckh", rank: null },
  //   { name: "bobby2", surname: "marais2", id: 2, place: "ckh", rank: null },
  //   { name: "jean3", surname: "kruger3", id: 3, place: "ckh", rank: null },
  //   { name: "bobby4", surname: "marais4", id: 4, place: "ckh", rank: null },
  //   { name: "jean5", surname: "kruger5", id: 5, place: "ckh", rank: null },
  //   { name: "bobby6", surname: "marais6", id: 6, place: "ckh", rank: null }
  // ];
  // // SI FUNCIONA
  // columnasConsulta = [
  //   {label:'Ap_Paterno',field:'Ap_Paterno'},
  //   {label:'Ap_Materno',field:'Ap_Materno'}
  // ]
  // SI FUNCIONA
  // columnasConsulta = [
  //   {titulo:'Ap_Paterno'},
  //   {titulo:'Ap_Materno'}
  // ]
  Columnas: Array<{titulo: string}> = []; 
  admin =[ ];
  consulta;
  filterpost= '';
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    // var myObject = { a: 'c', b: 'a', c: 'b' };
    // var keyNames = Object.keys(myObject);
    // console.log(keyNames); // Outputs ["a","b","c"]
    this.Consultar();
  }
  Consultar() {
    this.admin=[ ];
    this.Columnas = [ ];
    
    console.log(this.consulta);
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT @No := @No + 1 as No, CONCAT(Ap_Paterno, ' ', Ap_Materno, ' ', Nombre) Nombre_Completo , CI, Especialidad, Observacion  FROM estudiantes , (SELECT @No := 0) r WHERE Categoria='NUEVO' order by Ap_Paterno, Ap_Materno, Nombre"
    })
    .then(res => {
      console.log(res.data);
      this.admin = res.data;
      var keyNames = Object.keys(res.data[0] );
      keyNames.forEach(element => {
        this.Columnas.push({'titulo':element});
        // console.log('KEY', element);
      });
      console.log('KEY', this.Columnas);
      // console.log(keyNames); // Outputs ["a","b","c"]
      res.data.forEach(element => {
        element.Editando=false;
      });
    }).catch(err =>  {
    console.log("err");
    });
  }
}

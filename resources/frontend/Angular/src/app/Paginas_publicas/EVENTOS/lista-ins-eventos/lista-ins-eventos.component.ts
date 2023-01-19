import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-lista-ins-eventos',
  templateUrl: './lista-ins-eventos.component.html',
  styleUrls: ['./lista-ins-eventos.component.css']
})
export class ListaInsEventosComponent implements OnInit {
  ruta = 'http://localhost:8000/';

  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.Consultar()
  }
  Columnas: Array<{titulo: string}> = [];
  admin =[ ];
  consulta;
  filterpost= '';
  Consultar() {
    this.admin=[ ];
    this.Columnas = [ ];

    console.log(this.consulta);
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT @No := @No + 1 as No, CONCAT(Ap_Paterno, ' ', Ap_Materno, ' ', Nombre) Nombre_Completo , CI, eventos.Nombre_Evento as Evento, Observacion FROM `ins_eventos` LEFT JOIN `eventos` ON `ins_eventos`.`id_evento` = `eventos`.`id` , (SELECT @No := 0) r  order by Ap_Paterno, Ap_Materno, Nombre"
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

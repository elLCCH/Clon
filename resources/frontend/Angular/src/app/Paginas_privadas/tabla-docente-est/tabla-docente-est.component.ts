import { HerramientasService } from 'src/app/services/herramientas.service';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-tabla-docente-est',
  templateUrl: './tabla-docente-est.component.html',
  styleUrls: ['./tabla-docente-est.component.css']
})
export class TablaDocenteEstComponent implements OnInit {
  ruta = 'http://localhost:8000/';

  Columnas: Array<{titulo: string}> = [];
  admin =[ ];
  est =[ ];
  consulta;
  filterpost= '';
  esAdmin;
  doc;
  constructor(protected _tools:HerramientasService) { }

  ngOnInit(): void {
    // this.curso_sol = JSON.parse(localStorage.getItem('Curso_Sol'));
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    // var myObject = { a: 'c', b: 'a', c: 'b' };
    // var keyNames = Object.keys(myObject);
    // console.log(keyNames); // Outputs ["a","b","c"]
    this.CargarAdministrativo();
    this.consultarlog();
  }
 //#region SECCION DE COPIAS
 copiadoNombres = false;
 AccionCopiarNombres(){
   console.log('VALOR EST',JSON.parse( JSON.stringify(this.est[1])));
   // this._tools.copyText(JSON.parse( JSON.stringify(this.est[0].Ap_Paterno)));
   var res = '';
   this.est.forEach(e => {
     var NomCompleto = e.Nombre_Completo;
     res = res + NomCompleto+'\n';
   });
   this._tools.copyText(res);
   this.copiadoNombres = true;
   setTimeout(() => {
     this.copiadoNombres = false;
    }, 1500);
 }
 copiadoEspecialidades = false;
 AccionCopiarEspecialidades(){
   var res = '';
   this.est.forEach(e => {
     var Especialidad = e.Especialidad;
     res = res + Especialidad+'\n';
   });
   this._tools.copyText(res);
   this.copiadoEspecialidades = true;
   setTimeout(() => {
     this.copiadoEspecialidades = false;
    }, 1500);
 }

 copiadoSexos = false;
 AccionCopiarSexos(){
   var res = '';
   this.est.forEach(e => {
     var Sexo= e.Sexo;
     res = res + Sexo+'\n';
   });
   this._tools.copyText(res);
   this.copiadoSexos = true;
   setTimeout(() => {
     this.copiadoSexos = false;
    }, 1500);
 }

 copiadoTodos = false;
 AccionCopiarTodos(){
   var res = '';
   this.est.forEach(e => {
     var Carnet = e.CI;
     var Especialidad = e.Especialidad;
     var Sexo= e.Sexo;
     var NomC = e.Nombre_Completo;
     var curso = e.NivelCurso;
     res = res + NomC+'\t'+Carnet+'\t'+Sexo+'\t'+Especialidad+'\t'+curso+'\n';
     // res = res + Carnet+'\n';
   });
   this._tools.copyText(res);
   this.copiadoTodos = true;
   setTimeout(() => {
     this.copiadoTodos = false;
    }, 1500);
 }

 copiadoCarnets = false;
 AccionCopiarCarnets(){
   var res = '';
   this.est.forEach(e => {
     var Carnet = e.CI;
     res = res + Carnet+'\n';
   });
   this._tools.copyText(res);
   this.copiadoCarnets = true;
   setTimeout(() => {
     this.copiadoCarnets = false;
    }, 1500);
 }



   //#endregion SECCION DE COPIAS





  // copiado = false;
  // AccionCopiar(){
  //   console.log('VALOR EST',JSON.parse( JSON.stringify(this.est[1])));
  //   // this._tools.copyText(JSON.parse( JSON.stringify(this.est[0].Ap_Paterno)));
  //   var res = '';
  //   this.est.forEach(e => {
  //     var Datos = e.Nombre_Completo + '\t' + e.NivelCurso;
  //     res = res + Datos +'\n';
  //   });
  //   this._tools.copyText(res);
  //   this.copiado = true;
  //   setTimeout(() => {
  //     this.copiado = false;
  //    }, 1500);
  // }
  // respuesta: string;
  // copy: boolean;
  // _tools.copyText(val){
  //   let selBox = document.createElement('textarea');
  //     selBox.style.position = 'fixed';
  //     selBox.style.left = '0';
  //     selBox.style.top = '0';
  //     selBox.style.opacity = '0';
  //     selBox.value = val;
  //     document.body.appendChild(selBox);
  //     selBox.focus();
  //     selBox.select();
  //     document.execCommand('copy');
  //     document.body.removeChild(selBox);
  //     this.copy = true;
  //     setTimeout(()=>{
  //       this.copy = false;
  //     }, 2000)
  //   }
  private consultarlog() {
    if (localStorage.getItem('sesion') != null && (localStorage.l == 'службаданныхlcch' || localStorage.l == 'службаданныхellcch')) {
      this.esAdmin = true;
    }
    else
    {
      this.esAdmin = false;
    }
  }
  CargarAdministrativo() {
    axios.get(this.ruta+'api/Administrativo')
    .then(res => {
      console.log(res.data);
      this.admin = res.data;
    }).catch(err =>  {
    console.log("err");
    });
  }
  CambioDocente()
  {
    console.log(this.doc);
    this.Consultar(this.doc);
  }
  Consultar(idAdmin) {
    this.est=[ ];
    this.Columnas = [ ];
    axios.post(this.ruta+'api/ConsultarApi',{
      //consultasql:"SELECT  CONCAT(Ap_Paterno, ' ', Ap_Materno, ' ', Nombre) Nombre_Completo , CI, Categoria, Curso_Solicitado,Especialidad,Sexo,Turno , FechNac as F_Nacimiento,Edad,Celular,NumCelM,Matricula, Observacion FROM estudiantes , (SELECT @row := 0) r WHERE (Categoria='ANTIGUO' or Categoria = 'NUEVO') and Curso_Solicitado like '%"+CSolicitado+"%' order by Ap_Paterno, Ap_Materno, Nombre"
      // consultasql:"SELECT calificaciones.id,  CONCAT(estudiantes.Ap_Paterno, ' ', estudiantes.Ap_Materno, ' ', estudiantes.Nombre) Nombre_Completo , estudiantes.CI, estudiantes.Categoria, estudiantes.Curso_Solicitado, cursos.NivelCurso, cursos.NombreCurso,estudiantes.Especialidad, CONCAT(administrativos.Ap_Paterno, ' ', administrativos.Ap_Materno, ' ', administrativos.Nombre) Nombre_Docente, estudiantes.Sexo,estudiantes.Turno,estudiantes.FechNac as F_Nacimiento,estudiantes.Edad,estudiantes.Celular,estudiantes.NumCelM,estudiantes.Matricula,estudiantes.Observacion,estudiantes.Admin_id, estudiantes.id FROM `cursos` LEFT JOIN `calificaciones` ON `calificaciones`.`curso_id` = `cursos`.`id` LEFT JOIN `estudiantes` ON `calificaciones`.`estudiante_id` = `estudiantes`.`id` LEFT JOIN `administrativos` ON `estudiantes`.`Admin_id` = `administrativos`.`id`, (SELECT @row := 0) r  WHERE (Categoria='ANTIGUO' or Categoria = 'NUEVO') order by estudiantes.Ap_Paterno, estudiantes.Ap_Materno,estudiantes.Nombre"


      // consultasql:"SELECT CONCAT(estudiantes.Ap_Paterno, ' ', estudiantes.Ap_Materno, ' ', estudiantes.Nombre) Nombre_Completo , estudiantes.CI, estudiantes.Categoria, estudiantes.Curso_Solicitado, estudiantes.Especialidad, CONCAT(administrativos.Ap_Paterno, ' ', administrativos.Ap_Materno, ' ', administrativos.Nombre) Nombre_Docente, estudiantes.Turno,estudiantes.Edad,estudiantes.Celular,estudiantes.NumCelM FROM estudiantes LEFT JOIN administrativos ON estudiantes.Admin_id = administrativos.id, (SELECT @row := 0) r  WHERE Admin_id = "+idAdmin+" order by estudiantes.Curso_Solicitado, estudiantes.Ap_Paterno, estudiantes.Ap_Materno,estudiantes.Nombre"
      consultasql:"select concat(estudiantes.Ap_Paterno, ' ', estudiantes.Ap_Materno, ' ', estudiantes.Nombre) Nombre_Completo , cursos.NivelCurso, estudiantes.CI, estudiantes.Categoria, estudiantes.Sexo, estudiantes.Especialidad, concat(administrativos.Ap_Paterno, ' ', administrativos.Ap_Materno, ' ', administrativos.Nombre) Nombre_Docente, estudiantes.Turno,estudiantes.Edad,estudiantes.Celular,estudiantes.NumCelM from estudiantes left join administrativos on estudiantes.Admin_id = administrativos.id left join calificaciones on calificaciones.estudiante_id = estudiantes.id left join cursos on calificaciones.curso_id = cursos.id where NombreCurso like '%INSTRUMENTO DE ESPECIALIDAD%' and administrativos.id = "+idAdmin+" order by cursos.NivelCurso, estudiantes.Ap_Paterno, estudiantes.Ap_Materno,estudiantes.Nombre"
    })
    .then(res => {
      console.log(res.data);
      this.est = res.data;
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

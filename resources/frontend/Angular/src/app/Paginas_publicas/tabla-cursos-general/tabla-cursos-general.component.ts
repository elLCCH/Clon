import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-tabla-cursos-general',
  templateUrl: './tabla-cursos-general.component.html',
  styleUrls: ['./tabla-cursos-general.component.css']
})
export class TablaCursosGeneralComponent implements OnInit {
  @ViewChild('cerrarBtnMod') cerrarBtnMod;
  @ViewChild('CI_PDF') CI_PDF: ElementRef;
  @ViewChild('FOTO_IMG') FOTO_IMG: ElementRef;
  @ViewChild('CERTIFICADO_PDF') CERTIFICADO_PDF: ElementRef;
  @ViewChild('LIBRETA_PDF') LIBRETA_PDF: ElementRef;
  @ViewChild('BOLETA_PDF') BOLETA_PDF: ElementRef;
  @ViewChild('cmbCurso') cmbCurso: ElementRef;
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
  est =[ ];
  consulta;
  filterpost= '';


  EstudianteSeleccionado = {
    Nombre_Completo:'',
    Foto: '',
    Ap_Paterno: '',
    Ap_Materno: '',
    Nombre: '',
    Sexo: '',
    FechNac: '',
    Edad: '',
    CI: '',
    Nombre_Padre: '',
    OcupacionP: '',
    NumCelP:'',
    Nombre_Madre: '',
    OcupacionM: '',
    NumCelM: '',
    Direccion: '',
    Telefono: '',
    Celular: '',
    NColegio: '',
    TipoColegio: '',
    CGrado: '',
    CNivel: '',
    Especialidad: '',
    Correo: '' ,
    Password: '',
    Estado: '',
    Matricula: '',
    Observacion: '',
    Carrera: '',
    Categoria: '',
    Turno: '',
    Certificado: '',
    DocColUni: '',
    CIDoc: '',
    Boleta: '',
    Curso_Solicitado:'',
    Correo_Institucional:'',
    Admin_id:'',
    Mension:'',
    Area:''
  };
  EstudianteSeleccionadoSave = {
    Foto: '',
    Ap_Paterno: '',
    Ap_Materno: '',
    Nombre: '',
    Sexo: '',
    FechNac: '',
    Edad: '',
    CI: '',
    Nombre_Padre: '',
    OcupacionP: '',
    NumCelP:'',
    Nombre_Madre: '',
    OcupacionM: '',
    NumCelM: '',
    Direccion: '',
    Telefono: '',
    Celular: '',
    NColegio: '',
    TipoColegio: '',
    CGrado: '',
    CNivel: '',
    Especialidad: '',
    Correo: '' ,
    Password: '',
    Estado: '',
    Matricula: '',
    Observacion: '',
    Carrera: '',
    Categoria: '',
    Turno: '',
    Certificado: '',
    DocColUni: '',
    CIDoc: '',
    Boleta: '',
    Curso_Solicitado:'',
    Correo_Institucional:'',
    Admin_id:'',
    Mension:'',
    Area:''
  };
  modEstudiante;
  datosparaCalif;
  newEstudiante = new FormGroup({

    Foto: new FormControl(''),
    Ap_Paterno: new FormControl(''),
    Ap_Materno: new FormControl(''),
    Nombre: new FormControl(''),
    Sexo: new FormControl(''),
    FechNac: new FormControl(''),
    Edad: new FormControl(''),
    CI: new FormControl(''),
    Nombre_Padre: new FormControl(''),
    OcupacionP: new FormControl(''),
    NumCelP: new FormControl(''),
    Nombre_Madre: new FormControl(''),
    OcupacionM: new FormControl(''),
    NumCelM: new FormControl(''),
    Direccion: new FormControl(''),
    Telefono: new FormControl(''),
    Celular: new FormControl(''),
    NColegio: new FormControl(''),
    TipoColegio: new FormControl(''),
    CGrado: new FormControl(''),
    CNivel: new FormControl(''),
    Especialidad: new FormControl(''),
    Correo: new FormControl(''),
    Password: new FormControl(''),
    Estado: new FormControl(''),
    Matricula: new FormControl(''),
    Observacion: new FormControl(''),
    Carrera: new FormControl(''),
    Categoria: new FormControl(''),
    Turno: new FormControl(''),
    Certificado: new FormControl(''),
    DocColUni: new FormControl(''),
    CIDoc: new FormControl(''),
    Boleta: new FormControl(''),
    Curso_Solicitado:new FormControl(''),
    Correo_Institucional:new FormControl(''),
    Admin_id:new FormControl(''),
    Mension:new FormControl(''),
    Area:new FormControl('')
  });
  constructor() {
   }
curso_sol;
  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;

    // this.curso_sol = JSON.parse(localStorage.getItem('Curso_Sol'));
    this.curso_sol = sessionStorage.getItem('Curso_Sol');
    this.Consultar(this.curso_sol);
    // var myObject = { a: 'c', b: 'a', c: 'b' };
    // var keyNames = Object.keys(myObject);
    // console.log(keyNames); // Outputs ["a","b","c"]
    this.CargarAdministrativo(); 
  }
  copiarAlPortapapeles(id_elemento) {
    var aux = document.createElement("input");
    aux.setAttribute("value", document.getElementById(id_elemento).innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
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
  ModificarEstudiante(Estudiante) {
    // console.log("modificacion");
    // console.log(this.EstudianteSeleccionado);
    Estudiante.Editando = false;

    // const formData = new FormData();
    // formData.append('Foto', this.newEstudiante.value.Foto);
    // formData.append('Ap_Paterno', Estudiante.Ap_Paterno);
    // formData.append('Ap_Materno', Estudiante.Ap_Materno);
    // formData.append('Nombre', Estudiante.Nombre);
    // formData.append('Sexo', Estudiante.Sexo);
    // if (Estudiante.FechNac==null) {
    //   // var Fech = '1800-01-01';
    //   // formData.append('FechNac', Fech);
    // }else{
    //   formData.append('FechNac', Estudiante.FechNac);
    // }

    // if (Estudiante.Edad==null) {
    //   var edad = 0;
    //   Estudiante.Edad = edad;
    //   formData.append('Edad', Estudiante.Edad);
    // } else {
    //   formData.append('Edad', Estudiante.Edad);  
    // }

    // if (Estudiante.Celular==null) {
    //   var celular =0; Estudiante.Celular = celular;
    //   formData.append('Celular', Estudiante.Celular); 
    // } else {
    //   formData.append('Celular', Estudiante.Celular); 
    // }

    // if (Estudiante.Telefono==null) {
    //   var telf = 0;Estudiante.Telefono = telf;
    //   formData.append('Telefono', Estudiante.Telefono);
    //  } else {
    //   formData.append('Telefono', Estudiante.Telefono);
    // }

    // if (Estudiante.NumCelP==null) {
    //   var telfP = 0; Estudiante.NumCelP=telfP;
    //   formData.append('NumCelP', Estudiante.NumCelP);
    //  } else {
    //   formData.append('NumCelP', Estudiante.NumCelP);
    // }
    
    // if (Estudiante.NumCelM==null) {
    //   var telfM =0; Estudiante.NumCelM = telfM;
    //   formData.append('NumCelM', Estudiante.NumCelM);
    //  } else {
    //   formData.append('NumCelM', Estudiante.NumCelM);
    // }
    // if (Estudiante.Admin_id==null)
    // {
    //   Estudiante.Admin_id = 'null';
    // }
    // formData.append('CI', Estudiante.CI);
    // formData.append('Nombre_Padre', Estudiante.Nombre_Padre);
    // formData.append('OcupacionP', Estudiante.OcupacionP);
    
    // formData.append('Nombre_Madre', Estudiante.Nombre_Madre);
    // formData.append('OcupacionM', Estudiante.OcupacionM);
    
    // formData.append('Direccion', Estudiante.Direccion);
    
    
    // formData.append('NColegio', Estudiante.NColegio);
    // formData.append('TipoColegio', Estudiante.TipoColegio);
    // formData.append('CGrado', Estudiante.CGrado);
    // formData.append('CNivel', Estudiante.CNivel);
    // formData.append('Especialidad', Estudiante.Especialidad);
    // formData.append('Correo', Estudiante.Correo);
    // formData.append('Password', Estudiante.Password);
    // formData.append('Estado', Estudiante.Estado);
    // formData.append('Matricula', Estudiante.Matricula);
    // formData.append('Observacion', Estudiante.Observacion);
    // formData.append('Carrera', Estudiante.Carrera);
    // formData.append('Categoria', Estudiante.Categoria);
    // formData.append('Turno', Estudiante.Turno);
    // formData.append('Certificado', this.newEstudiante.value.Certificado);
    // formData.append('DocColUni',   this.newEstudiante.value.DocColUni);
    // formData.append('CIDoc',       this.newEstudiante.value.CIDoc);
    // formData.append('Boleta',      this.newEstudiante.value.Boleta);
    // formData.append('Correo_Institucional', Estudiante.Correo_Institucional);
    // formData.append('Curso_Solicitado', Estudiante.Curso_Solicitado);
    // formData.append('Admin_id', Estudiante.Admin_id);
    // formData.append('Area', Estudiante.Area);
    // formData.append('Mension', Estudiante.Mension);
    // console.log('ESTE ES EL FORMDATA MODIFICAR',Estudiante.Admin_id)
    // axios({
    //     method: 'post',
    //     url: this.ruta + 'api/EstudianteUpdate/' + Estudiante.id,
    //     data: formData,
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   })

      // ESTO ES OTRA MANERA DE USAR (NO FUNCIONA CUANDO HAY FOTO; POR LO TANTO USAR method POST)
      axios.put(this.ruta+'api/Estudiante/'+Estudiante.id, {
          Curso_Solicitado:Estudiante.Curso_Solicitado,
          Turno:Estudiante.Turno,
          Especialidad:Estudiante.Especialidad,
          Admin_id:Estudiante.Admin_id
      })


      .then(res => {
        //OBTENER RETURN DE CONTROLLER
        // var x = res;
        // var xD:string  = x.toString();

        // console.log(xD);

        console.log('SE MODIFICO CORRECTAMENTE');
        console.log(res);
        this.cerrarBtnMod.nativeElement.click();
        this.Consultar(this.curso_sol);
        
      })
      .catch(error => {
        console.log('HAY ERROR AL MODIFICAR');
        console.log(error);
      })
  }
  PreGuardadoEst(a)
  {
      this.EstudianteSeleccionadoSave = {
      Foto: a.Foto,
      Ap_Paterno: a.Ap_Paterno,
      Ap_Materno: a.Ap_Materno,
      Nombre: a.Nombre,
      Sexo: a.Sexo,
      FechNac: a.FechNac,
      Edad: a.Edad,
      CI: a.CI,
      Nombre_Padre: a.Nombre_Padre,
      OcupacionP: a.OcupacionP,
      NumCelP: a.NumCelP,
      Nombre_Madre: a.Nombre_Madre,
      OcupacionM: a.OcupacionM,
      NumCelM: a.NumCelM,
      Direccion: a.Direccion,
      Telefono: a.Telefono,
      Celular: a.Celular,
      NColegio: a.NColegio,
      TipoColegio: a.TipoColegio,
      CGrado: a.CGrado,
      CNivel: a.CNivel,
      Especialidad: a.Especialidad,
      Correo: a.Correo ,
      Password: a.Password,
      Estado: a.Estado,
      Matricula: a.Matricula,
      Observacion: a.Observacion,
      Carrera: a.Carrera,
      Categoria: a.Categoria,
      Turno: a.Turno,
      Certificado: a.Certificado,
      DocColUni: a.DocColUni,
      CIDoc: a.CIDoc,
      Boleta: a.Boleta,
      Curso_Solicitado:a.Curso_Solicitado,
      Correo_Institucional: a.Correo_Institucional,
      Admin_id:a.Admin_id,
      Mension:a.Mension,
      Area:a.Area
    };
    console.log('DATOS DE PRESAVE EST: ',this.EstudianteSeleccionadoSave );
  }
  DevolverDataAnterior()
  {
    this.newEstudiante.patchValue({
      Foto: '',
      Ap_Paterno: this.EstudianteSeleccionadoSave.Ap_Paterno,
      Ap_Materno: this.EstudianteSeleccionadoSave.Ap_Materno,
      Nombre: this.EstudianteSeleccionadoSave.Nombre,
      Sexo: this.EstudianteSeleccionadoSave.Sexo,
      FechNac: this.EstudianteSeleccionadoSave.FechNac,
      Edad: this.EstudianteSeleccionadoSave.Edad,
      CI: this.EstudianteSeleccionadoSave.CI,
      Nombre_Padre: this.EstudianteSeleccionadoSave.Nombre_Padre,
      OcupacionP: this.EstudianteSeleccionadoSave.OcupacionP,
      NumCelP: this.EstudianteSeleccionadoSave.NumCelP,
      Nombre_Madre: this.EstudianteSeleccionadoSave.Nombre_Madre,
      OcupacionM: this.EstudianteSeleccionadoSave.OcupacionM,
      NumCelM: this.EstudianteSeleccionadoSave.NumCelM,
      Direccion: this.EstudianteSeleccionadoSave.Direccion,
      Telefono: this.EstudianteSeleccionadoSave.Telefono,
      Celular: this.EstudianteSeleccionadoSave.Celular,
      NColegio: this.EstudianteSeleccionadoSave.NColegio,
      TipoColegio: this.EstudianteSeleccionadoSave.TipoColegio,
      CGrado: this.EstudianteSeleccionadoSave.CGrado,
      CNivel: this.EstudianteSeleccionadoSave.CNivel,
      Especialidad: this.EstudianteSeleccionadoSave.Especialidad,
      Correo: this.EstudianteSeleccionadoSave.Correo ,
      Password: this.EstudianteSeleccionadoSave.Password,
      Estado:this.EstudianteSeleccionadoSave.Estado,
      Matricula: this.EstudianteSeleccionadoSave.Matricula,
      Observacion: this.EstudianteSeleccionadoSave.Observacion,
      Carrera: this.EstudianteSeleccionadoSave.Carrera,
      Categoria: this.EstudianteSeleccionadoSave.Categoria,
      Turno: this.EstudianteSeleccionadoSave.Turno,
      Certificado: '',
      DocColUni: '',
      CIDoc: '',
      Boleta: '',
      Curso_Solicitado:this.EstudianteSeleccionadoSave.Curso_Solicitado,
      Correo_Institucional: this.EstudianteSeleccionadoSave.Correo_Institucional,
      Admin_id:this.EstudianteSeleccionadoSave.Admin_id,
      Mension:this.EstudianteSeleccionadoSave.Mension,
      Area:this.EstudianteSeleccionadoSave.Area
    });
    console.log('SAVE EST DEVUELTO' , this.EstudianteSeleccionadoSave.Categoria);
    this.newEstudiante.patchValue({
      Certificado: '',
      DocColUni: '',
      CIDoc: '',
      Boleta: '',
      Foto:''
    })
    this.CI_PDF.nativeElement.value = '';
    this.FOTO_IMG.nativeElement.value = '';
    this.LIBRETA_PDF.nativeElement.value = '';
    this.CERTIFICADO_PDF.nativeElement.value = '';
    this.BOLETA_PDF.nativeElement.value = '';
  
  }
  Consultar(CSolicitado) {
    this.est=[ ];
    this.Columnas = [ ];
    console.log(CSolicitado);
    axios.post(this.ruta+'api/ConsultarApi',{
      //consultasql:"SELECT  CONCAT(Ap_Paterno, ' ', Ap_Materno, ' ', Nombre) Nombre_Completo , CI, Categoria, Curso_Solicitado,Especialidad,Sexo,Turno , FechNac as F_Nacimiento,Edad,Celular,NumCelM,Matricula, Observacion FROM estudiantes , (SELECT @row := 0) r WHERE (Categoria='ANTIGUO' or Categoria = 'NUEVO') and Curso_Solicitado like '%"+CSolicitado+"%' order by Ap_Paterno, Ap_Materno, Nombre"
      consultasql:"SELECT CONCAT(estudiantes.Ap_Paterno, ' ', estudiantes.Ap_Materno, ' ', estudiantes.Nombre) Nombre_Completo , estudiantes.CI, estudiantes.Categoria, estudiantes.Curso_Solicitado, estudiantes.Especialidad, CONCAT(administrativos.Ap_Paterno, ' ', administrativos.Ap_Materno, ' ', administrativos.Nombre) Nombre_Docente, estudiantes.Sexo,estudiantes.Turno,estudiantes.FechNac as F_Nacimiento,estudiantes.Edad,estudiantes.Celular,estudiantes.NumCelM,estudiantes.Matricula,estudiantes.Observacion,estudiantes.Admin_id, estudiantes.id FROM estudiantes LEFT JOIN administrativos ON estudiantes.Admin_id = administrativos.id, (SELECT @row := 0) r  WHERE (Categoria='ANTIGUO' or Categoria = 'NUEVO') and Curso_Solicitado like '%"+CSolicitado+"%' order by estudiantes.Ap_Paterno, estudiantes.Ap_Materno,estudiantes.Nombre"
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
  reiniciarEstudiantes()
  {
  this.EstudianteSeleccionado = {
    Nombre_Completo:'',
    Foto: '',
    Ap_Paterno: '',
    Ap_Materno: '',
    Nombre: '',
    Sexo: '',
    FechNac: '',
    Edad: '',
    CI: '',
    Nombre_Padre: '',
    OcupacionP: '',
    NumCelP:'',
    Nombre_Madre: '',
    OcupacionM: '',
    NumCelM: '',
    Direccion: '',
    Telefono: '',
    Celular: '',
    NColegio: '',
    TipoColegio: '',
    CGrado: '',
    CNivel: '',
    Especialidad: '',
    Correo: '' ,
    Password: '',
    Estado: '',
    Matricula: '',
    Observacion: '',
    Carrera: '',
    Categoria: '',
    Turno: '',
    Certificado: '',
    DocColUni: '',
    CIDoc: '',
    Boleta: '',
    Curso_Solicitado:'',
    Correo_Institucional:'',
    Admin_id:'',
    Area:'',
    Mension:''

  };
  this.newEstudiante.patchValue({
    Certificado: '',
    DocColUni: '',
    CIDoc: '',
    Boleta: '',
    // Foto:''
  })
  this.CI_PDF.nativeElement.value = '';
  this.FOTO_IMG.nativeElement.value = '';
  this.LIBRETA_PDF.nativeElement.value = '';
  this.CERTIFICADO_PDF.nativeElement.value = '';
  this.BOLETA_PDF.nativeElement.value = '';

 }
}

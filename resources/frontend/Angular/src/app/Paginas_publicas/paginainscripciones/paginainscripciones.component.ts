import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios, { AxiosResponse } from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { callbackify } from 'util';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-paginainscripciones',
  templateUrl: './paginainscripciones.component.html',
  styleUrls: ['./paginainscripciones.component.css']
})
export class PaginainscripcionesComponent implements OnInit {

  @ViewChild('CerrarBoton') cerrarBtn;
  @ViewChild('CerrarBotonMod') cerrarBtnMod;
  @ViewChild('AbrirPanel') clickbtn;

  //PARA QUITAR LA FOTO SELECCIOANDA
  @ViewChild('FotoInput') myInputFoto: ElementRef;
  //PARA QUITAR LOS PDF O VALIDAR PDFs
  @ViewChild('PDFDiploma') myInputDiploma: ElementRef;
  @ViewChild('PDFBoleta') myInputBoleta: ElementRef;
  @ViewChild('PDFCarnet') myInputCarnet: ElementRef;
  @ViewChild('PDFCertificado') myInputCertificado: ElementRef;

  //HASTA ACA

  ruta = 'http://localhost:8000/';
  MensajeContenido; //MENSAJE DEL CONTENIDO DE ADVERTENCIA DE LOS FILES
//BOTONES
btnN1;
btnN2;
btnN3;
btnP2;
btnP3;
btnP4;
btnInscribirse;
// newEstudiante = new FormGroup({});
public frmPagina1: FormGroup;
public frmPagina2: FormGroup;
public frmPagina3: FormGroup;
public frmPagina4: FormGroup;
fechad; fechadfinal; LVLCole; CatEst;
  est = [];
  estCuadro = [];
  // public NiveldeCurso:string;
  public NiveldeCurso: '';
  NiveldeCursoTabla: [];
  // NiveldeCurso=[];
  bodyData = [{}];
  DatosPDF=[];
  curso = []; //ACA SE CARGA LA LISTA DE MATERIAS DEL CURSO SELECCIONADO
  cursoUnique = []; //ACA SE CARGA LA LISTA DE CURSOS DEL COMBO BOX
  mensionesUnique = []; //ACA SE CARGA LA LISTA MENSIONES
  horariosUnique = []; //ACA SE CARGA LA LISTA DE HORARIOS
  instrumentosUnique = []; //ACA SE CARGA LA LISTA DE INSTRUMENTOS DE ESPECIALIDAD Clasica y Moderna
  // instrumentosUniqueModerna = []; //ACA SE CARGA LA LISTA DE INSTRUMENTOS DE ESPECIALIDAD Moderna
  admin = []; //ACA SE CARGA LA LISTA DE ADMINS
  Category = []; //ACA SE CARGA LA LISTA DE LAS CATEGORIAS RECOGIDAS DE APIsController
  selectedDevice = 'Change to Estado';
  selectedDevice2 = 'change to Nivel';
  opcionSeleccionado: string = '';
  verSeleccion: string = '';
  datos;
  estSeleccionado;
  EstudianteSeleccionado = {
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
    Carrera: '',
    Categoria: '',
    Turno: '',
    Certificado: '',
    DocColUni: '',
    CIDoc: '',
    Boleta: '',

    Correo_Institucional: '',
    Curso_Solicitado: '',
    Admin_id: '',

    // NombreDocenteActual: '',
    EspecialidadActual: '',
    CursoActual: '',

    Mension: '',
    Area: ''

  };

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
    Carrera: new FormControl(''),
    Categoria: new FormControl(''),
    Turno: new FormControl(''),
    Certificado: new FormControl(''),
    DocColUni: new FormControl(''),
    CIDoc: new FormControl(''),
    Boleta: new FormControl(''),


    Correo_Institucional: new FormControl(''),
    Curso_Solicitado: new FormControl(''),

    // NombreDocenteActual: new FormControl(''),
    Admin_id: new FormControl(''),
    EspecialidadActual: new FormControl(''),
    CursoActual: new FormControl(''),
    Mension: new FormControl(''),
    Area: new FormControl('')
  });

  newCalificacion = new FormGroup({
    Primero: new FormControl(''),
    Segundo: new FormControl(''),
    Tercero: new FormControl(''),
    Cuarto: new FormControl(''),
    Promedio: new FormControl(''),
    estudiante_id: new FormControl(''),
    curso_id: new FormControl(''),
    anio_id: new FormControl('')
  });
  constructor(private _fb: FormBuilder,private router: Router) { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    document.getElementById('pagina1').classList.toggle('active');
    document.getElementById('paso1').classList.toggle('active');
    this.initForms();
    this.CargarCursoUnique();
    // this.CargarInstEspacialidadUnique();
    this.CargarDocenteAdministrativo();
    this.CargarCategorias();



  }
  show = false;
  MostrarContrasenia()
  {
    this.show = !this.show;
  }
  CargarCategorias() {
    //cargar categorias habilitadas que estan desde ApisController
    axios.get(this.ruta + 'api/ListarCategoriasApi')
      .then(res => {
        console.log('LISTA DE CATEGORIAS APIs',res.data);
        this.Category = res.data;
        console.log('LISTA DE CATEGORIAS APIs cargado',this.Category);

      }).catch(err => {
        console.log("err");
      });
  }
  CargarDocenteAdministrativo() {
    axios.get(this.ruta+'api/DiferenciadorIndex?tipo=DOCENTE')
    .then(res => {
      console.log(res.data);
      this.admin = res.data;
    }).catch(err =>  {
    console.log("err");
    });
  }
  CargarInstEspacialidadUnique() {
    //cargar los cursos que estan desde ApisController
    axios.get(this.ruta + 'api/ListarInstrumentosApi')
      .then(res => {
        console.log('LISTA DE InstEspecialidad APIs',res.data);
        this.instrumentosUnique = res.data;
        console.log('LISTA DE InstEspecialidad APIs cargado',this.cursoUnique);

      }).catch(err => {
        console.log("err");
      });
    }
    CargarHorariosCapacitacion() {
    //cargar los cursos que estan desde ApisController
    axios.get(this.ruta + 'api/ListarHorariosCapacitacionApi')
      .then(res => {
        console.log('Lista Horarios APIs',res.data);
        this.horariosUnique = res.data;
      }).catch(err => {
        console.log("err");
      });
    }
    CargarHorariosSuperior() {
    //cargar los cursos que estan desde ApisController
    axios.get(this.ruta + 'api/ListarHorariosSuperiorApi')
      .then(res => {
        console.log('Lista Horarios APIs APIs',res.data);
        this.horariosUnique = res.data;
      }).catch(err => {
        console.log("err");
      });
    }
  CargarInstEspacialidadUniqueModerna() {
    //cargar los cursos que estan desde ApisController
    axios.get(this.ruta + 'api/ListarInstrumentosModernosApi')
      .then(res => {
        console.log('LISTA DE InstEspecialidadModerna APIs',res.data);
        this.instrumentosUnique = res.data;
        console.log('LISTA DE InstEspecialidadModerna APIs cargado',this.instrumentosUnique);
      }).catch(err => {
        console.log("err");
      });
    }
  CargarClasico() {
  //cargar los cursos que estan desde ApisController
  axios.get(this.ruta + 'api/ListarMensionesApi')
    .then(res => {
      console.log('LISTA DE Mensiones APIs',res.data);
      this.mensionesUnique = res.data;
      console.log('LISTA DE Mensiones APIs cargado',this.mensionesUnique);

    }).catch(err => {
      console.log("err");
    });
  }
  CargarModerno() {
  //cargar los cursos que estan desde ApisController
  axios.get(this.ruta + 'api/ListarMensionesModernasApi')
    .then(res => {
      console.log('LISTA DE Mensiones APIs',res.data);
      this.mensionesUnique = res.data;
      console.log('LISTA DE Mensiones APIs cargado',this.mensionesUnique);

    }).catch(err => {
      console.log("err");
    });
  }
  CargarCursoUnique() {
    //cargar los cursos que estan desde ApisController
    axios.get(this.ruta + 'api/ListarCursosApi')
      .then(res => {
        console.log('LISTA DE CURSOS APIs',res.data);
        this.cursoUnique = res.data;
        console.log('LISTA DE CURSOS APIs cargado',this.cursoUnique);

      }).catch(err => {
        console.log("err");
      });
    //SI SIRVE
    // //Cargar todos los cursos desde la tabla y eliminando cursos repetidos
    // axios.get(this.ruta + 'api/cursoUnique')
    //   .then(res => {
    //     console.log('CURSO UNIQUE',res.data);
    //     this.cursoUnique = res.data;
    //     console.log('cursoUnique cargado',this.cursoUnique);

    //   }).catch(err => {
    //     console.log("err");
    //   });
  }
  CalcularEdad(): number {
    console.log('La Fecha es: '+new Date(this.fechad).getTime());
    console.log('La Fecha Actual: '+Date.now());
    if (this.fechad) {
        var timeDiff = Math.abs(Date.now() - new Date(this.fechad).getTime());
        var resEdad:number =  Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365)-1;
        console.log('La edad RES: '+resEdad);
        this.fechadfinal = resEdad;
    } else {
        return null;
    }

  }


  mensionBool=false;
  areaChange(area)
  {

    if (area.value == "CLASICA") {
      console.log("ES CLASICA", area.value);
      this.CargarClasico();
      this.CargarInstEspacialidadUnique();
      // this.mensionBool = true;
    } else if(area.value == "MODERNA"){
      console.log("ES MODERNA", area.value);
      this.CargarModerno();
      this.CargarInstEspacialidadUniqueModerna();
      // this.mensionBool = false;
    }
  }
  CursoChange(curso)
  {
    if (curso.value == "PRIMERO SUPERIOR" || curso.value == "SEGUNDO SUPERIOR" || curso.value == "TERCERO SUPERIOR")
    {
      console.log("ES TECNICO SUPERIOR", curso.value);
      this.CargarHorariosSuperior();
    } else
    {
      console.log("ES MODERNA", curso.value);
      this.CargarHorariosCapacitacion();
    }
  }
  especialidadBool=false;
  mensionChange(mension)
  {
    if (mension.value == "INSTRUMENTISTA") {
      console.log("ES CLASICA", mension.value);
      this.especialidadBool = true;
    }
    else
    {
      this.especialidadBool = false;
    }
  }
  categoriaChange()
  {
    if (this.CatEst=="ANTIGUO" || this.CatEst=="ANTIGUO (resagado)") {
      // document.getElementById('divSoloEstudiantes').classList.add('invisible');
      document.getElementById('divSoloEstudiantes').classList.remove('invisible');

    }
    else
    {
      document.getElementById('divSoloEstudiantes').classList.add('invisible');
      // document.getElementById('divSoloEstudiantes').classList.remove('invisible');
    }
  }
  changeNivelColegio()
  {
    if (this.LVLCole!="ESTUDIANTE") {
      document.getElementById('gradocole').classList.add('invisible');
    }
    else
    {
      document.getElementById('gradocole').classList.remove('invisible');
    }


  }
  MensajeSinConexion1='SU REGISTRO NO SE COMPLETÓ, POR FALTA DE RED INTERNET O RED DE INTERNET LENTA.';
  MensajeSinConexion2='POR FAVOR REINTENTE SU INSCRIPCION DANDO CLICK EN INSCRIBIRSE.';
  cont=0;
  async EncontrarDocenteEspecialidad(AdminID) {
    console.log('ENCONTRAR CON EL ID: ', AdminID);
    var request = await axios.post(this.ruta + 'api/EncontrarDocenteEspecialidad/' + AdminID,{})
    .then(res=>{
      console.log('RES DE ENCONTRAR DOCENTE ESPECIALIDAD',res);
      return res;
    })
    this.cont = this.cont + 1;
    if(this.cont==1)
    {
      this.GoPagina5(); //RECIEN IR A LA PAGINA 5
      this.MensajeSinConexion1='SU REGISTRO SE COMPLETO SATISFACTORIAMENTE';
      this.MensajeSinConexion2='PUEDE CONFIRMAR SU REGISTRO EN EL LAS LISTAS DE INSCRITOS';
      clearTimeout(this.item);
    }


    console.log('DOCENTE ENCONTRADO: ',request.data);
    var vacio:AxiosResponse;
    if (request == undefined) {
      return request = vacio;
    } else {
      return request;
    }


  }
  async EncontrarNivelCurso(idEst) {
    console.log('es el inicial idest:', idEst);
    var request = await axios.post(this.ruta + 'api/EncontrarNivelCurso/' + idEst,{})
    .then(res=>{
      console.log(res);
      return res;
    })
    console.log('AGUA',request.data);

    return request;
  }
  AgregarEstudiante(callback) {
    //para prueba
    // this.cerrarBtn.nativeElement.click();
    // return;
    //hasta aca
    //CON ESTO SOLUCIONO ESO DE LOS UPPERCASE
    //if (SecondAnswer != null && SecondAnwser.toUpperCase() === 'FEBUARY 14, 2005')
    // if (SecondAnswer != null && SecondAnwser.toUpperCase() === 'FEBUARY 14, 2005') ;


    const formData = new FormData();
    formData.append('Foto', this.newEstudiante.value.Foto);
    formData.append('Ap_Paterno', this.frmPagina1.value.Ap_Paterno.toUpperCase());
    formData.append('Ap_Materno', this.frmPagina1.value.Ap_Materno.toUpperCase() );
    formData.append('Nombre', this.frmPagina1.value.Nombre.toUpperCase() );
    formData.append('Sexo', this.frmPagina1.value.Sexo.toUpperCase());
    formData.append('FechNac', this.frmPagina1.value.FechNac);
    formData.append('Edad', this.frmPagina1.value.Edad);
    formData.append('CI', this.frmPagina1.value.CI.toUpperCase());
    formData.append('Nombre_Padre', this.frmPagina2.value.Nombre_Padre.toUpperCase() );
    formData.append('OcupacionP', this.frmPagina2.value.OcupacionP.toUpperCase() );
    formData.append('NumCelP', this.frmPagina2.value.NumCelP);
    formData.append('Nombre_Madre', this.frmPagina2.value.Nombre_Madre.toUpperCase() );
    formData.append('OcupacionM', this.frmPagina2.value.OcupacionM.toUpperCase() );
    formData.append('NumCelM', this.frmPagina2.value.NumCelM);
    formData.append('Direccion', this.frmPagina1.value.Direccion.toUpperCase() );
    formData.append('Telefono', this.frmPagina1.value.Telefono);
    formData.append('Celular', this.frmPagina1.value.Celular);
    formData.append('NColegio', this.frmPagina2.value.NColegio.toUpperCase() );
    formData.append('TipoColegio', this.frmPagina2.value.TipoColegio.toUpperCase() );
    formData.append('CNivel', this.frmPagina2.value.CNivel.toUpperCase() );
    if (this.frmPagina2.value.CGrado != null)
    {this.frmPagina2.value.CGrado.toUpperCase();}
    else{this.frmPagina2.value.CGrado='NINGUNA'};
    formData.append('CGrado', this.frmPagina2.value.CGrado);

    formData.append('Correo', this.frmPagina1.value.Correo);
    formData.append('Password', this.frmPagina3.value.Password);
    formData.append('Estado','INACTIVO');
    formData.append('Matricula', 'NO ASIGNADO');
    formData.append('Observacion', 'AUN NO VERIFICADO');
    formData.append('Carrera', 'MUSICA');

    //PARA ESPECIALIDAD
    if (this.frmPagina3.value.Especialidad == null || this.frmPagina3.value.Especialidad == "")
    {
      this.frmPagina3.value.Especialidad= " ";
    }
    else if( this.frmPagina3.value.Mension != "INSTRUMENTISTA")
    {
      this.frmPagina3.value.Especialidad = " ";
    }


    formData.append('Especialidad', this.frmPagina3.value.Especialidad);

    formData.append('Mension', this.frmPagina3.value.Mension); //new
    formData.append('Area', this.frmPagina3.value.Area); //new
    formData.append('Categoria', this.frmPagina3.value.Categoria.toUpperCase() );
    formData.append('Turno', this.frmPagina3.value.Turno.toUpperCase() );

    formData.append('Correo_Institucional', 'NO ASIGNADO');
    formData.append('Curso_Solicitado', this.frmPagina3.value.CursoActual );
    formData.append('Admin_id', this.frmPagina3.value.Admin_id );

    formData.append('Certificado', this.newEstudiante.value.Certificado);
    formData.append('DocColUni', this.newEstudiante.value.DocColUni);
    formData.append('CIDoc', this.newEstudiante.value.CIDoc);
    formData.append('Boleta', this.newEstudiante.value.Boleta);

    // SOLO PARA ESTUDIANTES ANTIGUOS-------------------------------------
    // if (this.frmPagina3.value.NombreDocenteActual != null && this.CatEst == "ANTIGUO")
    // {this.frmPagina3.value.NombreDocenteActual.toUpperCase();}
    // else{this.frmPagina3.value.NombreDocenteActual=''};

    if (this.frmPagina3.value.EspecialidadActual != null && this.CatEst == "ANTIGUO")
    {this.frmPagina3.value.EspecialidadActual.toUpperCase();}
    else{this.frmPagina3.value.EspecialidadActual=' '};

    if (this.frmPagina3.value.Admin_id != null && this.CatEst == "ANTIGUO")
    {this.frmPagina3.value.Admin_id;}
    else{this.frmPagina3.value.Admin_id=' '};

    // if (this.frmPagina3.value.CursoActual != null && this.CatEst == "ANTIGUO")
    // {this.frmPagina3.value.CursoActual.toUpperCase();}
    // else{this.frmPagina3.value.CursoActual=''};

    // formData.append('NombreDocenteActual', this.frmPagina3.value.NombreDocenteActual);
    formData.append('Admin_id', this.frmPagina3.value.Admin_id);
    formData.append('EspecialidadActual', this.frmPagina3.value.EspecialidadActual);
    formData.append('CursoActual', this.frmPagina3.value.CursoActual);
    console.log("FORMDATALCCH", formData);
    axios({
        method: 'post',
        url: this.ruta + 'api/Estudiante',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log('SE AÑADIO CORRECTAMENTE',res);
        this.EstudianteSeleccionado = res.data;
        this.openPDFFormulario();
      })
      .catch(error => {
        console.log('HAY ERROR XD');
        console.log(error);
      });
      callback();
  }
  //  VALIDACIONES VALIDACIONES VALIDACIONES VALIDACIONES VALIDACIONES VALIDACIONES VALIDACIONES VALIDACIONES
  VerificarFormatoPDFBoleta(obj) {
    var uploadFile = obj.files[0];
    if (!window.FileReader) {
        alert('El navegador no soporta la lectura de archivos');
        return;
    }

    if (!(/\.(pdf)$/i).test(uploadFile.name)) {
        // alert('El archivo a adjuntar no es una imagen');
        //CUANDO NO RESPETA EL FORMATO REQUERIDO
        this.MensajeContenido = "¡FORMATO INVALIDO!. Solo se Admite el Formato de Archivo PDF";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputBoleta.nativeElement.value = "";
    }
    else {
      if (uploadFile.size > 1500000)
      {
        // alert('El peso de la imagen no puede exceder los 200kb')
        this.MensajeContenido = "¡TAMAÑO EXCEDIDO!. Por favor el peso del Archivo no puede exceder 1.5MB";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputBoleta.nativeElement.value = "";
      }
      else {
        //EL ARCHIVO CUMPLE CON TODOS LOS REQUISITOS
          // alert('PDF correcta :)')
      }
    }
  }
  VerificarFormatoPDFCertificado(obj) {
    var uploadFile = obj.files[0];
    if (!window.FileReader) {
        alert('El navegador no soporta la lectura de archivos');
        return;
    }

    if (!(/\.(pdf)$/i).test(uploadFile.name)) {
        // alert('El archivo a adjuntar no es una imagen');
        //CUANDO NO RESPETA EL FORMATO REQUERIDO
        this.MensajeContenido = "¡FORMATO INVALIDO!. Solo se Admite el Formato de Archivo PDF";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputCertificado.nativeElement.value = "";
    }
    else {
      if (uploadFile.size > 1500000)
      {
        // alert('El peso de la imagen no puede exceder los 200kb')
        this.MensajeContenido = "¡TAMAÑO EXCEDIDO!. Por favor el peso del Archivo no puede exceder 1.5MB";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputCertificado.nativeElement.value = "";
      }
      else {
        //EL ARCHIVO CUMPLE CON TODOS LOS REQUISITOS
          // alert('PDF correcta :)')
      }
    }
  }
  VerificarFormatoPDFDiploma(obj) {
    var uploadFile = obj.files[0];
    if (!window.FileReader) {
        alert('El navegador no soporta la lectura de archivos');
        return;
    }

    if (!(/\.(pdf)$/i).test(uploadFile.name)) {
        // alert('El archivo a adjuntar no es una imagen');
        //CUANDO NO RESPETA EL FORMATO REQUERIDO
        this.MensajeContenido = "¡FORMATO INVALIDO!. Solo se Admite el Formato de Archivo PDF";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputDiploma.nativeElement.value = "";
    }
    else {
      if (uploadFile.size > 2000000)
      {
        // alert('El peso de la imagen no puede exceder los 200kb')
        this.MensajeContenido = "¡TAMAÑO EXCEDIDO!. Por favor el peso del Archivo no puede exceder 2MB";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputDiploma.nativeElement.value = "";
      }
      else {
        //EL ARCHIVO CUMPLE CON TODOS LOS REQUISITOS
          // alert('PDF correcta :)')
      }
    }
  }
  VerificarFormatoPDFCarnet(obj) {
    var uploadFile = obj.files[0];
    if (!window.FileReader) {
        alert('El navegador no soporta la lectura de archivos');
        return;
    }

    if (!(/\.(pdf)$/i).test(uploadFile.name)) {
        // alert('El archivo a adjuntar no es una imagen');
        //CUANDO NO RESPETA EL FORMATO REQUERIDO
        this.MensajeContenido = "¡FORMATO INVALIDO!. Solo se Admite el Formato de Archivo PDF";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputCarnet.nativeElement.value = "";
    }
    else {
      if (uploadFile.size > 1500000)
      {
        // alert('El peso de la imagen no puede exceder los 200kb')
        this.MensajeContenido = "¡TAMAÑO EXCEDIDO!. Por favor el peso del Archivo no puede exceder 1.5MB";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputCarnet.nativeElement.value = "";
      }
      else {
        //EL ARCHIVO CUMPLE CON TODOS LOS REQUISITOS
          // alert('PDF correcta :)')
      }
    }
  }
  VerificarFormatoFoto(obj){
    var uploadFile = obj.files[0];
    if (!window.FileReader) {
        alert('El navegador no soporta la lectura de archivos');
        return;
    }

    if (!(/\.(jpg|png|jpeg)$/i).test(uploadFile.name)) {
        // alert('El archivo a adjuntar no es una imagen');
        //CUANDO NO RESPETA EL FORMATO REQUERIDO
        this.MensajeContenido = "¡FORMATO INVALIDO!. Por favor Seleccione solo Imagenes";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputFoto.nativeElement.value = "";
    }
    else {
      if (uploadFile.size > 1500000)
      {
        // alert('El peso de la imagen no puede exceder los 200kb')
        this.MensajeContenido = "¡TAMAÑO EXCEDIDO!. Por favor el peso de la Foto no puede exceder 1.5MB";
        document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
        this.myInputFoto.nativeElement.value = "";
      }
      else {
        //LA IMAGEN CUMPLE CON TODOS LOS REQUISITOS
          // alert('Imagen correcta :)')
      }
    }
  }
  // SI FUNCIONA PERO SOLO VALIDA EL FORMATO
  // VerificarFormatoFoto1(Input) {
  //   if (Input.files[0]) {
  //     const file: File = Input.files[0];
  //     var pattern = /image-*/;
  //     // var pattern = /.pdf/;   //PARA PDF
  //     if (!file.type.match(pattern)) {
  //       // alert('FORMATO INVALIDO!!!');
  //       document.getElementById("btnModalFormatoInvalido").click(); //alternativa de hacer click()
  //       this.myInputFoto.nativeElement.value = "";
  //       return;
  //     }
  //   }
  // }
//PARA FOTOS
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.newEstudiante.patchValue({
        Foto: file
      })
      console.log(file);
    }
  }

  //PARA DOCUMENTOS
  onFileChangeCertificado(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.newEstudiante.patchValue({
        Certificado: file
      })
      console.log(file);
    }
  }

  onFileChangeDocColUni(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.newEstudiante.patchValue({
        DocColUni: file
      })
      console.log(file);
    }
  }

  onFileChangeCIDoc(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.newEstudiante.patchValue({
        CIDoc: file
      })
      console.log(file);
    }
  }
  onFileChangeBoleta(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.newEstudiante.patchValue({
        Boleta: file
      })
      console.log(file);
    }
  }
  CrearEspacioCalificacion(estudiante) {
    console.log("estudiante:" + this.estSeleccionado);
    //CREACION DE ESPACIOS DE CALIFICACIONES
    for (let o of this.curso) {
      // this.Agregarcalificacion(o.id, "1", this.estSeleccionado);

    }
    console.log(estudiante);
    // this.ModEstudiante();
  }
  GoPagina1()
  {
    document.getElementById('pagina2').classList.remove('active');
    document.getElementById('pagina1').classList.toggle('active');
    document.getElementById('pagina3').classList.remove('active');
    document.getElementById('pagina4').classList.remove('active');

    document.getElementById('paso1').classList.toggle('active');
    document.getElementById('paso2').classList.remove('active');
    document.getElementById('paso3').classList.remove('active');
    document.getElementById('paso4').classList.remove('active');

    document.getElementById('pagina5').classList.remove('active');
    // document.getElementById('paso5').classList.remove('active');
  }
  GoPagina2()
  {
    // this.btnN1=false;
    document.getElementById('pagina2').classList.toggle('active');
    document.getElementById('pagina1').classList.remove('active');
    document.getElementById('pagina3').classList.remove('active');
    document.getElementById('pagina4').classList.remove('active');
    document.getElementById('paso1').classList.remove('active');
    document.getElementById('paso2').classList.toggle('active');
    document.getElementById('paso3').classList.remove('active');
    document.getElementById('paso4').classList.remove('active');

    document.getElementById('pagina5').classList.remove('active');
    // document.getElementById('paso5').classList.remove('active');
  }
  GoPagina3() {
    document.getElementById('pagina2').classList.remove('active');
    document.getElementById('pagina1').classList.remove('active');
    document.getElementById('pagina3').classList.toggle('active');
    document.getElementById('pagina4').classList.remove('active');
    document.getElementById('paso1').classList.remove('active');
    document.getElementById('paso2').classList.remove('active');
    document.getElementById('paso3').classList.toggle('active');
    document.getElementById('paso4').classList.remove('active');

    document.getElementById('pagina5').classList.remove('active');
    // document.getElementById('paso5').classList.remove('active');
  }
  GoPagina4()
  {
    document.getElementById('pagina2').classList.remove('active');
    document.getElementById('pagina1').classList.remove('active');
    document.getElementById('pagina3').classList.remove('active');
    document.getElementById('pagina4').classList.toggle('active');
    document.getElementById('paso1').classList.remove('active');
    document.getElementById('paso2').classList.remove('active');
    document.getElementById('paso3').classList.remove('active');
    document.getElementById('paso4').classList.toggle('active');

    document.getElementById('pagina5').classList.remove('active');
    // document.getElementById('paso5').classList.remove('active');
  }
  GoPagina5()
  {
    document.getElementById('pagina1').classList.remove('active');
    document.getElementById('pagina2').classList.remove('active');
    document.getElementById('pagina3').classList.remove('active');
    document.getElementById('pagina4').classList.remove('active');
    document.getElementById('pagina5').classList.toggle('active');
    document.getElementById('paso1').classList.remove('active');
    document.getElementById('paso2').classList.remove('active');
    document.getElementById('paso3').classList.remove('active');
    document.getElementById('paso4').classList.remove('active');
    // document.getElementById('paso5').classList.toggle('active');
  }
  VerificarPagina1()
  {

  }
  initForms() {
    this.frmPagina1 = this._fb.group({
      Foto: [, Validators.required],
      Ap_Paterno: [, Validators.required],
      Ap_Materno: [, Validators.required],
      Nombre: [, Validators.required],
      Sexo: [, Validators.required],
      FechNac: [, Validators.required],
      Edad: [, Validators.required],
      CI: [, Validators.required],
      Direccion: [, Validators.required],
      Correo: [, Validators.required],
      Telefono: [, Validators.required],
      Celular: [, Validators.required]
    });
    this.frmPagina2 = this._fb.group({
      Nombre_Padre: [, Validators.required],
      OcupacionP: [, Validators.required],
      NumCelP: [, Validators.required],
      Nombre_Madre: [, Validators.required],
      OcupacionM: [, Validators.required],
      NumCelM: [, Validators.required],
      NColegio: [, Validators.required],
      TipoColegio: [, Validators.required],
      CGrado: [, Validators.required],
      CNivel: [, Validators.required]
    });
    this.frmPagina3 = this._fb.group({
      Especialidad: [, Validators.required],
      Password: [, Validators.required],
      Categoria: [, Validators.required],
      Turno: [, Validators.required],
      CursoActual: [, Validators.required],

      EspecialidadActual: [, Validators.required],
      Admin_id: [, Validators.required],
      Area: [, Validators.required],
      Mension: [, Validators.required],
      // NombreDocenteActual: [, Validators.required],

    });
    this.frmPagina4 = this._fb.group({
      Certificado: [, Validators.required],
      CIDoc: [, Validators.required],
      Boleta: [, Validators.required],
      DocColUni: [, Validators.required]
    });
  }
//   validarPagina1(): any {
//     this.initForms();
//   if (this.frmPagina1.value.Ap_Paterno === null || this.frmPagina1.value.Ap_Materno === null || this.frmPagina1.value.Nombre === null || this.frmPagina1.value.Sexo === null ) {
//       console.log('estan vacios');
//     }
// }
validarPagina1(): any {
  if(this.frmPagina1.valid){
    console.log('Datos Completos');
    this.GoPagina2();
  }else{
    console.log(this.frmPagina1);
    console.log('Datos estan null');
    document.getElementById("btnModalValidacion").click(); //alternativa de hacer click()


    // window.location.href = window.location.href;
  }
}

validarPagina2(): any {

  if (this.LVLCole == "ESTUDIANTE" || this.LVLCole == null)
  {
    //MODO ESTUDIANTE
    if(this.frmPagina2.valid)
    {
      console.log('Datos Completos');
      this.GoPagina3();
    }
    else
    {
      console.log(this.frmPagina2);
      console.log('Datos estan null');
      document.getElementById("btnModalValidacion").click(); //alternativa de hacer click()
    }
  }
  else
  {
    //SI ES MODO QUE NO ES ESTUDIANTE
    if(this.frmPagina2.value.Nombre_Padre === null || this.frmPagina2.value.OcupacionP === null ||
      this.frmPagina2.value.NumCelP === null || this.frmPagina2.value.Nombre_Madre === null ||
      this.frmPagina2.value.OcupacionM === null || this.frmPagina2.value.NumCelM === null ||
      this.frmPagina2.value.NColegio === null || this.frmPagina2.value.TipoColegio === null ||
      this.frmPagina2.value.CNivel === null )
      {
        console.log('datos estan null');
        document.getElementById("btnModalValidacion").click(); //alternativa de hacer click()
      }
      else
      {
      console.log('Datos Completos');
      this.GoPagina3();
      }
  }


}
openPdfColumns() {
  const documentDefinition = {
    content: [
      'This paragraph fills full width, as there are no columns. Next paragraph however consists of three columns',
      {
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: 'auto',
            text: 'First column'
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: '*',
            text: 'Second column'
          },
          {
            // fixed width
            width: 100,
            text: 'Third column'
          },
          {
            // percentage width
            width: '10%',
            text: 'Last column'
          }
        ],
        // optional space between columns
        columnGap: 10
      },
      'This paragraph goes below all columns and has full width'
    ]
  };
  pdfMake.createPdf(documentDefinition).open();
}
validarPagina3(): any {
  // console.log('Especialidad',this.frmPagina3.value.Especialidad);
  // console.log('Categoria',this.frmPagina3.value.Categoria);
  if (this.frmPagina3.value.Password === null || this.frmPagina3.value.Categoria === null ||
    this.frmPagina3.value.Area === null || this.frmPagina3.value.Mension === null ||
    this.frmPagina3.value.Turno === null || this.frmPagina3.value.CursoActual === null || this.frmPagina3.value.Especialidad === null)
      {
        console.log('datos estan null');
        document.getElementById("btnModalValidacion").click(); //alternativa de hacer click()
      }
      else
      {
        console.log('Datos Completos');
        // this.openPdfColumns();
        console.log("ESTA PAGINA", this.frmPagina3)
        this.GoPagina4();

      }
  // if(this.frmPagina3.valid){
  //   console.log('Datos Completos');
  //   this.GoPagina4();
  // }else{
  //   console.log(this.frmPagina3);
  //  console.log('Datos estan null');
  // }
    }
  btnNextPagina4=false;
  validarPagina4(): any {
  if(this.frmPagina4.value.CIDoc === null || this.frmPagina4.value.Boleta === null ||
    this.frmPagina4.value.Certificado === null || this.frmPagina4.value.DocColUni === null){
      console.log(this.frmPagina4);
      console.log('Datos estan null');
      document.getElementById("btnModalValidacion").click(); //alternativa de hacer click()
      this.btnNextPagina4=false;
  }else{
    // axios.get(this.ruta+'api/Administrativo')
    // .then(res => {
    //   this.AgregarEstudiante();
    // }).catch(err =>  {
    // console.log("err");
    // });
    // this.GoPagina5();


    const dayMeal = (meal, callback) =>{
      console.log('Today we have ' + meal + ' for lunch')
      this.item = setTimeout( function(){
        document.getElementById("btnModalReintentar").click(); //alternativa de hacer click()
      }, 15000 );//EN CASO DE NO SUBIRSE EN 15 SEGUNDOS MOSTRFA MENSSAJE
      this.AgregarEstudiante(7);
      callback()

    }
    dayMeal('Lasagna', () =>{
      console.log('I love that meal')
      this.GoPagina5();
    })
    // this.router.navigate(['/']);
  }

}
item;
// btn(){

// }

// arepaCo(meal, callback){
//   // Simulate a code delay
//   setTimeout( function(){
//     console.log('La arepa es Colombiana');
//   }, 500 );
//   callback()
// }
// arepaVe(){
//   console.log('La arepa es Venezolana');
// }
GenerarFormularioInscripcion()
{
  this.openPDFFormulario();
}
SendCredenciales()
{
        this.router.navigate(['/']);
  // // GUARDANDO VARIABLES LOCALSTORAGE
  // var NombreSend = this.frmPagina1.value.Nombre.toUpperCase();
  // var UsuarioSend = this.frmPagina1.value.CI.toUpperCase();
  // var PasswordSend = this.frmPagina3.value.Password;
  // var CorreoSend = this.frmPagina1.value.Correo;
  // // localStorage.setItem('UsuarioSend', UsuarioSend);
  // // localStorage.setItem('PasswordSend', PasswordSend);
  // // localStorage.setItem('NombreSend', NombreSend);
  // // console.log(CorreoSend);
  // // localStorage.setItem('CorreoSend', CorreoSend);
  // // ESTO ES OTRA MANERA DE USAR (NO FUNCIONA CUANDO HAY FOTO; POR LO TANTO USAR method POST)
  //     axios.post(this.ruta+'api/EnviarConfirmacion/', {

  //         Nombre: NombreSend,
  //         Usuario: UsuarioSend,
  //         Password: PasswordSend,
  //         Correo: CorreoSend

  //     })
  //     .then(res => {
  //       //OBTENER RETURN DE CONTROLLER
  //       // var x = res;
  //       // var xD:string  = x.toString();

  //       // console.log(xD);

  //       console.log('SE ENVIO CORRECTAMENTE EL CORREO');
  //       this.router.navigate(['/']);
  //       // console.log(res);
  //       // this.cerrarBtnMod.nativeElement.click();

  //     })
  //     .catch(error => {
  //       console.log('HAY ERROR AL ENVIAR CORREO');
  //       console.log(error);
  //       this.router.navigate(['/']);
  //     })
}
  async openPDFFormulario()
  {


    const documentDefinition = {
      //TAMAÑO DE LA HOJA(CARTA)
      pageSize: 'LETTER',

      //ORIENTACION DE LA HOJA
      // pageOrientation: 'landscape',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 40, 60, 40, 60 ],
      // lineHeight:5,
      content:[


        {text:'FORMULARIO DE INSCRIPCIÓN ESTUDIANTES', fontSize:15, alignment: 'center', bold:true},
        {text:'I.F.A. "MARIA LUISA LUZIO" \n\n', fontSize:15, alignment: 'center', bold:true},
        // {
        //   columns: [
        //     {
        //       width: 'auto',
        //       text: 'First column'
        //     },
        //   ]
        // },
        {
          // table: {
          //   // headers are automatically repeated if the table spans over multiple pages
          //   // you can declare how many rows should be treated as headers
          //   headerRows: 1,
          //   widths: ['*', '*'],

          //   body: [
          //     [{ text: 'Apellido Paterno \b asdasd', bold: true } , { text: 'Apellido Materno', bold: true }],
          //     [{columns: [
          //           {
          //             width: 'auto',
          //             text: 'Apellido Paterno'
          //           },
          //           {
          //             width: 'auto',
          //             text: 'CHOQUE'
          //           },
          //         ]}, 'Value 2'],
          //     [{ text: 'Bold value', bold: true }, 'Val 2']
          //   ]
          // }
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [

              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Apellido Paterno\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Ap_Paterno, fontSize: 14,alignment: 'right'}]
                },

                {text: [
                    // 'Inlines can be ',
                    {text:'Apellido Materno\n', fontSize:15, alignment: 'left', bold:true},
                    {text: this.EstudianteSeleccionado.Ap_Materno, fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Nombres\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Nombre, fontSize: 14,alignment: 'right'}]
                },

                {text: [
                    // 'Inlines can be ',
                    {text:'Sexo\n', fontSize:15, alignment: 'left', bold:true},
                    {text: this.EstudianteSeleccionado.Sexo, fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Numero de celular del Estudiante\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Celular, fontSize: 14,alignment: 'right'}]
                },

                {text: [
                    // 'Inlines can be ',
                    {text:'Fecha de Nacimiento\n', fontSize:15, alignment: 'left', bold:true},
                    {text: this.EstudianteSeleccionado.FechNac, fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Numero de Carnet\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.CI, fontSize: 14,alignment: 'right'}]
                },

                {text: [
                    // 'Inlines can be ',
                    {text:'Edad\n', fontSize:15, alignment: 'left', bold:true},
                    {text: this.EstudianteSeleccionado.Edad, fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Nombre del Padre\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Nombre_Padre, fontSize: 14,alignment: 'right'}]
                },

                {text: [
                    // 'Inlines can be ',
                    {text:'Nº Celular del Padre\n', fontSize:15, alignment: 'left', bold:true},
                    {text: this.EstudianteSeleccionado.NumCelP, fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Nombre de la Madre\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Nombre_Madre, fontSize: 14,alignment: 'right'}]
                },

                {text: [
                    // 'Inlines can be ',
                    {text:'Nº Celular de la Madre\n', fontSize:15, alignment: 'left', bold:true},
                    {text: this.EstudianteSeleccionado.NumCelM, fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Domicilio\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Direccion, fontSize: 14}], colSpan: 2
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Correo Electronico\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Correo, fontSize: 14}], colSpan: 2
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Turno\n', fontSize:15, alignment: 'left', bold:true},
                  {text: this.EstudianteSeleccionado.Turno, fontSize: 14,alignment: 'right'}]
                },

                {text: [
                    // 'Inlines can be ',
                    {text:'Mencion: \n', fontSize:15, alignment: 'left', bold:true},
                    {text: this.EstudianteSeleccionado.Mension+' - '+ this.EstudianteSeleccionado.Especialidad, fontSize: 14,alignment: 'right'}]
                }
              ],

            ]

          }

        },


        {text:' ',fontSize:15, alignment: 'left', bold:true},
        {text:'Solo para estudiantes antiguos', lineHeight:1.2,fontSize:15, alignment: 'left', bold:true},
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Curso:'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: this.EstudianteSeleccionado.CursoActual
            }
          ],

          // optional space between columnsç
          lineHeight:1.2,
          columnGap: 110
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Nombre del Docente:'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              // text: this.EstudianteSeleccionado.NombreDocenteActual
              text: await (await this.EncontrarDocenteEspecialidad(this.EstudianteSeleccionado.Admin_id)).data.Ap_Paterno + ' ' +
              await (await this.EncontrarDocenteEspecialidad(this.EstudianteSeleccionado.Admin_id)).data.Ap_Materno + ' ' +
              await (await this.EncontrarDocenteEspecialidad(this.EstudianteSeleccionado.Admin_id)).data.Nombre
            }
          ],

          // optional space between columns
          lineHeight:1.2,
          columnGap: 30
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Instrumento:'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: this.EstudianteSeleccionado.EspecialidadActual
            }
          ],

          // optional space between columns
          lineHeight:1.2,
          columnGap: 75
        },
        {
          image: 'data:image/png;base64,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',
          width: 50, height: 50,  alignment:'left',margin:[0,-510,50,0]
        },
        {text:'\n\n\n\n\n\n\n\n\n_______________________', fontSize:15, alignment: 'center', bold:true,margin:[0,420,0,0] },
        {text:'Firma del Estudiante o Padre/Tutor',fontSize:10, alignment: 'center', bold:true},
        {text:'Nºcarnet: '+this.EstudianteSeleccionado.CI,fontSize:8, alignment: 'center', bold:true}
      ]
    };
    pdfMake.createPdf(documentDefinition).open();

  }
}

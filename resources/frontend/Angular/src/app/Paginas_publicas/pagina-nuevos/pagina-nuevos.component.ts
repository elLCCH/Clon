import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pagina-nuevos',
  templateUrl: './pagina-nuevos.component.html',
  styleUrls: ['./pagina-nuevos.component.css']
})
export class PaginaNuevosComponent implements OnInit {

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
  instrumentosUnique = []; //ACA SE CARGA LA LISTA DE INSTRUMENTOS DE ESPECIALIDAD Clasica
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

    NombreDocenteActual: '',
    EspecialidadActual: '',
    CursoActual: ''

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

    NombreDocenteActual: new FormControl(''),
    EspecialidadActual: new FormControl(''),
    CursoActual: new FormControl('')
  });

  constructor(private _fb: FormBuilder,private router: Router) { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    document.getElementById('pagina1').classList.toggle('active');
    // document.getElementById('paso1').classList.toggle('active');
    this.initForms();
    this.CargarCursoUnique();
    this.CargarInstEspacialidadUnique();
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
  CargarCursoUnique() {
    //cargar los cursos que estan desde ApisController
    axios.get(this.ruta + 'api/ListarCursosPostulantesApi')
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
  

  AgregarEstudiante() {
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
    formData.append('Sexo', this.newEstudiante.value.Sexo);
    formData.append('FechNac', this.newEstudiante.value.FechNac);
    formData.append('Edad', this.newEstudiante.value.Edad);
    formData.append('CI', this.frmPagina1.value.CI.toUpperCase());
    formData.append('Nombre_Padre', this.newEstudiante.value.Nombre_Padre);
    formData.append('OcupacionP', this.newEstudiante.value.OcupacionP);
    formData.append('NumCelP', this.newEstudiante.value.NumCelP);
    formData.append('Nombre_Madre', this.newEstudiante.value.Nombre_Madre);
    formData.append('OcupacionM', this.newEstudiante.value.OcupacionM);
    formData.append('NumCelM', this.newEstudiante.value.NumCelM);
    formData.append('Direccion', this.newEstudiante.value.Direccion);
    formData.append('Telefono', this.newEstudiante.value.Telefono); //ESTE APARTADO DEPENDE SI QUEREMOS CON TELEFONO MAS
    formData.append('Celular', this.frmPagina1.value.Celular);
    formData.append('NColegio', this.newEstudiante.value.NColegio);
    formData.append('TipoColegio', this.newEstudiante.value.TipoColegio);
    formData.append('CNivel', this.newEstudiante.value.CNivel);
    if (this.newEstudiante.value.CGrado != null) 
    {this.newEstudiante.value.CGrado;}
    else{this.newEstudiante.value.CGrado='NINGUNA'};
    formData.append('CGrado', this.newEstudiante.value.CGrado);
    formData.append('Especialidad', this.frmPagina1.value.Especialidad.toUpperCase() );
    formData.append('Correo', this.frmPagina1.value.Correo);
    formData.append('Password', this.newEstudiante.value.Password);
    formData.append('Estado','INACTIVO');
    formData.append('Matricula', 'NO ASIGNADO');
    formData.append('Observacion', 'AUN NO VERIFICADO');
    formData.append('Carrera', 'MUSICA');
    formData.append('Categoria', this.frmPagina1.value.Categoria.toUpperCase() );
    formData.append('Turno', this.newEstudiante.value.Turno);

    formData.append('Correo_Institucional', 'NO ASIGNADO');
    formData.append('Curso_Solicitado', this.frmPagina1.value.CursoActual.toUpperCase() );

    formData.append('Certificado', this.newEstudiante.value.Certificado);
    formData.append('DocColUni', this.newEstudiante.value.DocColUni);
    formData.append('CIDoc', this.newEstudiante.value.CIDoc);
    formData.append('Boleta', this.newEstudiante.value.Boleta);
    formData.append('Area', 'CLASICO');
    formData.append('Mension', 'INSTRUMENTISTA');

    // SOLO PARA ESTUDIANTES ANTIGUOS-------------------------------------
    if (this.newEstudiante.value.NombreDocenteActual != null && this.CatEst == "ANTIGUO") 
    {this.newEstudiante.value.NombreDocenteActual.toUpperCase();}
    else{this.newEstudiante.value.NombreDocenteActual=''};

    if (this.newEstudiante.value.EspecialidadActual != null && this.CatEst == "ANTIGUO") 
    {this.newEstudiante.value.EspecialidadActual.toUpperCase();}
    else{this.newEstudiante.value.EspecialidadActual=''};

    if (this.newEstudiante.value.CursoActual != null && this.CatEst == "ANTIGUO") 
    {this.newEstudiante.value.CursoActual.toUpperCase();}
    else{this.newEstudiante.value.CursoActual=''};

    formData.append('NombreDocenteActual', this.newEstudiante.value.NombreDocenteActual);
    formData.append('EspecialidadActual', this.newEstudiante.value.EspecialidadActual);
    formData.append('CursoActual', this.newEstudiante.value.CursoActual);
    axios({
        method: 'post',
        url: this.ruta + 'api/Estudiante',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log('SE AÑADIO CORRECTAMENTE');
        console.log(res);
        this.EstudianteSeleccionado = res.data;
        // this.openPDFFormulario();
      })
      .catch(error => {
        console.log('HAY ERROR XD');
        console.log(error);
      })
  }
  RetornarInicio()
  {
    this.router.navigate(['/']);
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

  
  //PARA DOCUMENTOS
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
    document.getElementById('paso5').classList.remove('active');
  }
  GoPagina2()
  {
    // this.btnN1=false;
    document.getElementById('pagina2').classList.toggle('active');
    document.getElementById('pagina1').classList.remove('active');
    // document.getElementById('paso1').classList.remove('active');
    // document.getElementById('paso2').classList.toggle('active');

    
  }
  
  
  initForms() {
    this.frmPagina1 = this._fb.group({
      Ap_Paterno: [, Validators.required],
      Ap_Materno: [, Validators.required],
      Nombre: [, Validators.required],
      CI: [, Validators.required],
      Correo: [, Validators.required],
      // Telefono: [, Validators.required],
      Celular: [, Validators.required],
      Especialidad: [, Validators.required],
      Categoria: [, Validators.required],
      CursoActual: [, Validators.required],
      Boleta: [, Validators.required]
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
    this.AgregarEstudiante();
    this.GoPagina2();
  }else{
    console.log(this.frmPagina1);
    console.log('Datos estan null');
    document.getElementById("btnModalValidacion").click(); //alternativa de hacer click()


    // window.location.href = window.location.href;
  }
}

}

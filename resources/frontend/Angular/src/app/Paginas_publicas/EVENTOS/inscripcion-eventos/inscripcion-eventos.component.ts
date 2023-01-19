import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AreaEventosService } from 'src/app/Gestiones/eventos/area-eventos.service';
import { EventosService } from 'src/app/Gestiones/eventos/eventos.service';
import { InsEventosService } from 'src/app/Gestiones/eventos/ins-eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscripcion-eventos',
  templateUrl: './inscripcion-eventos.component.html',
  styleUrls: ['./inscripcion-eventos.component.css']
})
export class InscripcionEventosComponent implements OnInit {

  constructor(protected _insEvento:InsEventosService,protected _areaEventos:AreaEventosService,protected _eventos:EventosService,private router: Router) { }

  ruta = 'http://localhost:8000/';
  ngOnInit(): void {
    this.CargarEventos()
    this.CargarAreaEventos()
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
  }

  areaEventos=[]
    CargarAreaEventos(){
      this._areaEventos.ObtenerAreaEventoss()
      .then(res => {
        console.log("AreaEventos Cargado",res.data);
        this.areaEventos = res.data;
      }).catch(error =>  {
      console.log('Error al Cargar AreaEventos',error.response.data.message);
      });
    }


  DetalleIF=false
  BoletaIF='invisible';Spinner=false;
  evento=[]
  CargarEventos(){
    this._eventos.ObtenerEventosActivos()
    .then(res=>{
      this.evento=res.data
    })
    this._eventos.ObtenerEventosActivos()
    .then(res=>{
      // this.evento=res.data //ACA ESTAN LOS DISPONIBLES ACTIVOS
      res.data.forEach(e => {
        e.Estado_Pago='NO'
      });
      this.evento = res.data.filter(a => (a.Acceso.indexOf('TODOS')) > -1)
      console.log('EVENTOS DISPONIBLES',this.evento)
    })
  }
  Estado_Pago='NO'
  v={
    Descripcion:'',
    Monto:'',
    Detalle:'',
    Estado_Pago:''
  }
SeleccionarEvento(a){
  console.log('sdsd')
  this._eventos.SeleccionarEvento(a)
  .then(res=>{
    this.v=res.data
    console.log('DETALLE EVENTO',res.data)
    this.DetalleIF=true
  })
}
MensajeMid(){
  Swal.fire({
    title: 'SE REALIZO LA INSCRIPCIÓN CORRECTAMENTE',
    color: '#ffffff',
    showDenyButton: false,
    showCancelButton: false,
    cancelButtonColor: "#DD6B55",
    cancelButtonText:'OK',
    confirmButtonText: 'VERIFICAR INSCRIPCION',
    confirmButtonColor: "red",
    background: '#ec6e48',

  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
    this.router.navigate(['/ListaInscripcionesEventos']);
    }
  })
}
MostrarMensaje(iconText,tittleText){
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({
      icon: iconText, //success, info, error,warning,question
      title: tittleText
    })
  }

onFileChangeFoto(event){
    if(event.target.files.length>0)
    {
      const file = event.target.files[0];
      this.newInsEvento.patchValue({
        Boleta_Pago: file
      })
      console.log(File)
    }
  }
@ViewChild('FOTO_IMG_ADD') FOTO_IMG_ADD: ElementRef;
VerificarFormatoFoto(obj){
    var uploadFile = obj.files[0];
    if (!window.FileReader) {
        alert('El navegador no soporta la lectura de archivos');
        return;
    }

    if (!(/\.(jpg|png|jpeg|pdf)$/i).test(uploadFile.name)) {
        //CUANDO NO RESPETA EL FORMATO REQUERIDO
        this.MostrarMensaje('error','FORMATO INVALIDO!.');
        // alert('FORMATO INVALIDO!.');
        this.FOTO_IMG_ADD.nativeElement.value = "";
    }
    else {
      if (uploadFile.size > 1500000)
      {
        this.MostrarMensaje('warning','¡TAMAÑO EXCEDIDO!. EL TAMAÑO DEL ARCHIVO NO PUEDE EXCEDER LOS 1.5MB');
        // alert('¡TAMAÑO EXCEDIDO!. EL TAMAÑO DEL ARCHIVO NO PUEDE EXCEDER LOS 1.5MB');
        this.FOTO_IMG_ADD.nativeElement.value = "";
      }
      else {
        //EL ARCHIVO CUMPLE CON TODOS LOS REQUISITOS
      }
    }
  }

  insEvento=[];
  isSubmitted = false;
  newInsEvento =new FormGroup({
    // attr:new FormControl('')
    id:new FormControl(0),
    Ap_Paterno:new FormControl('',[Validators.required]),
    Ap_Materno:new FormControl('',[Validators.required]),
    Nombre:new FormControl('',[Validators.required]),
    CI:new FormControl('',[Validators.required]),
    Celular:new FormControl('',[Validators.required]),
    Institucion:new FormControl(''),
    Area:new FormControl('',[Validators.required]),
    Estado_Pago:new FormControl('NO',[Validators.required]),
    Boleta_Pago:new FormControl(''),
    Observacion:new FormControl('SIN VERIFICAR'),
    id_evento:new FormControl('',[Validators.required]),
  })
  CargarInsEvento(){
    this._insEvento.ObtenerInsEventos()
    .then(res => {
      console.log('InsEvento CARGADO',res.data);
      this.insEvento = res.data;
    }).catch(err =>  {
    console.log('ERROR AL CARGAR InsEvento',err.response.data.response);
    });
  }
  resetInsEvento(){
    this.newInsEvento.reset();
    this.isSubmitted =false;
    this.FOTO_IMG_ADD.nativeElement.value = "";
    this.BoletaIF='invisible'
    this.newInsEvento.patchValue({Observacion:'SIN VERIFICAR', Estado_Pago:'NO'})
  }

  AgregarModificarInsEvento(){

    //USAR ESTE PARA HACER CON IMAGENES SIRVE PARA GENERALIZADO
    // const formData = new FormData();
    // const nuevoInsEvento = this.newInsEvento.value;
    // Object.keys(nuevoInsEvento).forEach((key) => {
    //   formData.append(key, nuevoInsEvento[key]);
    // });


    const formData = new FormData();
    formData.append('Ap_Paterno',this.newInsEvento.value.Ap_Paterno);
    formData.append('Ap_Materno',this.newInsEvento.value.Ap_Materno);
    formData.append('Nombre',this.newInsEvento.value.Nombre);
    formData.append('CI',this.newInsEvento.value.CI);
    formData.append('Celular',this.newInsEvento.value.Celular);
    formData.append('Institucion',this.newInsEvento.value.Institucion);
    formData.append('Area',this.newInsEvento.value.Area);
    formData.append('Estado_Pago',this.newInsEvento.value.Estado_Pago);
    formData.append('Boleta_Pago',this.newInsEvento.value.Boleta_Pago);
    formData.append('Observacion',this.newInsEvento.value.Observacion);
    formData.append('id_evento',this.newInsEvento.value.id_evento);
    this.isSubmitted=true;
    if (this.newInsEvento.invalid) {
      return;
    } else {
      let id = this.newInsEvento.controls.id.value;
      console.log(this.newInsEvento.value)
      if (!id) { //PREGUNTAMOS: SI NO TIENE id?
        // formData.set('id','0')   //ACA ES PARA IMAGENES DEFINIMOS ESTO PARA EVITAR ERROR, SIRVE PARA GENERALIZADO
        this._insEvento.AgregarInsEvento(formData)
        .then(res=>{
          console.log('SE AÑADIO CORRECTAMENTE InsEvento',res.data);
          this.CargarInsEvento();
          this.resetInsEvento();
          this.Spinner=false;
          this.MensajeMid();
        })
        .catch(error=>{
          this.MostrarMensaje('error','OCURRIO UN ERROR AL INTENTAR INSCRIBIRSE')
          this.Spinner=false;
          console.log('ERROR AL AÑADIR InsEvento');
          console.log(error.response.data.message);
        })
      } else {
        //SI TIENE ID POR LO TANTO MODIFICAR
        this._insEvento.ModificarInsEvento(formData,this.newInsEvento.value.id)
        .then(res=>{
          console.log('SE MODIFICO CORRECTAMENTE InsEvento',res.data);
          this.CargarInsEvento();
          this.resetInsEvento();
        })
        .catch(error=>{
          console.log('ERROR AL MODIFICAR InsEvento');
          this.MostrarMensaje('error','OCURRIO UN ERROR AL REGISTRAR, VUELVA A INTENTAR O REINSCRIBIRSE')
          console.log(error.response.data.message);
        })
      }
    }
  }




}

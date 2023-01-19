import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AreaEventosService } from './area-eventos.service';
import { EventosService } from './eventos.service';
import { InsEventosService } from './ins-eventos.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
obs;
ruta=''
  constructor(protected _insEvento:InsEventosService, protected _evento:EventosService, protected _areaEventos:AreaEventosService) { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.CargarEvento()
    this.CargarEventoActivo()
    this.CargarInsEvento()
    this.CargarAreaEventos();
    this.iniciarFormfilterInsEvento()
  }
  //FILTRADOR V3: NombreFiltro => InsEvento, dataP=> insEvento
    // insEventoFiltrado=[]; //LISTA ENCONTRADA
    filtroInsEvento=false; //ESTADO ngIf Lista
    filterInsEventoForm= new FormGroup({
      txt:new FormControl(''),
    });
    iniciarFormfilterInsEvento(){ //ESTO SE DEBE LLAMAR
      this.filterInsEventoForm.get('txt').valueChanges
      // .pipe(debounceTime(1000))
      .subscribe(response => {
        console.log('entered data is ', response);
        this.filtroInsEvento=true;
        if(response && response.length){
          this.filterInsEvento(response);
        } else {
          this.insEvento = this.insEventoExtra;
        }
        console.log('DATA InsEvento ENCONTRADO', this.insEvento)
      })
    }

    filterInsEvento(Datafilter){
      this.insEvento = this.insEventoExtra.filter(a => (a.NomC.indexOf(Datafilter)) > -1 || (a.CI.indexOf(Datafilter)) > -1 || (a.Estado_Pago.indexOf(Datafilter)) > -1 ||(a.Observacion.indexOf(Datafilter)) > -1 || (a.Nombre_Evento.indexOf(Datafilter)) > -1)
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
    //#region FILES
    //para boleta de pago de insEvento
  onFileChangeFoto(event){
    if(event.target.files.length>0)
    {
      const file = event.target.files[0];
      this.newInsEvento.patchValue({
        Boleta_Pago: file
      })
      console.log(file)
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
  //para qr de Eventos
  onFileChangeFotoEvento(event){
    if(event.target.files.length>0)
    {
      const file = event.target.files[0];
      this.newEvento.patchValue({
        ImagenQR: file
      })
      console.log(file)
    }
  }
@ViewChild('FOTO_IMG_ADD_EVENTO') FOTO_IMG_ADD_EVENTO: ElementRef;
  VerificarFormatoFotoEvento(obj){
    var uploadFile = obj.files[0];
    if (!window.FileReader) {
        alert('El navegador no soporta la lectura de archivos');
        return;
    }

    if (!(/\.(jpg|png|jpeg)$/i).test(uploadFile.name)) {
        //CUANDO NO RESPETA EL FORMATO REQUERIDO
        this.MostrarMensaje('error','FORMATO INVALIDO!.');
        // alert('FORMATO INVALIDO!.');
        this.FOTO_IMG_ADD_EVENTO.nativeElement.value = "";
    }
    else {
      if (uploadFile.size > 1500000)
      {
        this.MostrarMensaje('warning','¡TAMAÑO EXCEDIDO!. EL TAMAÑO DEL ARCHIVO NO PUEDE EXCEDER LOS 1.5MB');
        // alert('¡TAMAÑO EXCEDIDO!. EL TAMAÑO DEL ARCHIVO NO PUEDE EXCEDER LOS 1.5MB');
        this.FOTO_IMG_ADD_EVENTO.nativeElement.value = "";
      }
      else {
        //EL ARCHIVO CUMPLE CON TODOS LOS REQUISITOS
      }
    }
  }
    //#endregion FILES

//#region CRUD PRINCIPAL
  insEvento=[];
  insEventoExtra=[]
  isSubmitted = false;
  newInsEvento =new FormGroup({
    // attr:new FormControl('',[Validators.required])
    id:new FormControl(0),
    Ap_Paterno:new FormControl('',[Validators.required]),
    Ap_Materno:new FormControl('',[Validators.required]),
    Nombre:new FormControl('',[Validators.required]),
    CI:new FormControl('',[Validators.required]),
    Celular:new FormControl(0,[Validators.required]),
    Institucion:new FormControl(''),
    Area:new FormControl('',[Validators.required]),
    Estado_Pago:new FormControl('NO',[Validators.required]),
    Boleta_Pago:new FormControl('SIN VERIFICAR'),
    Observacion:new FormControl('',[Validators.required]),
    id_evento:new FormControl('',[Validators.required]),
  })


  CargarInsEvento(){
    this._insEvento.ObtenerInsEventos()
    .then(res => {
      console.log('InsEvento CARGADO',res.data);
      res.data.forEach(e => {
        e.NomC=e.Ap_Paterno+' '+e.Ap_Materno+' '+e.Nombre
        if (e.Boleta_Pago=='') {
          e.Boleta=false
        } else {
          e.Boleta=true
        }
      });
      this.insEvento = res.data;
      this.insEventoExtra = res.data;
    }).catch(err =>  {
    console.log('ERROR AL CARGAR InsEvento',err.message.data.message);
    });
  }
  resetInsEvento(){
    this.newInsEvento.reset();
    this.isSubmitted =false;
    this.FOTO_IMG_ADD.nativeElement.value = "";
    this.newInsEvento.patchValue({Observacion:'SIN VERIFICAR', Estado_Pago:'NO'})
  }

  AgregarModificarInsEvento(){

    console.log("dats a Accionar",this.newInsEvento.value)
    //USAR ESTE PARA HACER CON IMAGENES PARA AGREGAR V3
    // let formData = new FormData();
    // const nuevoInsEvento = this.newInsEvento;
    // Object.keys(nuevoInsEvento).forEach((key) => {
    //   formData.append(key, nuevoInsEvento[key]);
    // });

    //ESTE ES UNA ALTERNATIVA RAPIDA ARA CONVERTIR un new a formdata
    const formData = new FormData();
    const nuevoInsEvento = this.newInsEvento.value;
    Object.keys(nuevoInsEvento).forEach((key) => {
      formData.append(key, nuevoInsEvento[key]);
    });


    // const formData = new FormData();
    // formData.append('id',this.newInsEvento.value.id);
    // formData.append('Ap_Paterno',this.newInsEvento.value.Ap_Paterno);
    // formData.append('Ap_Materno',this.newInsEvento.value.Ap_Materno);
    // formData.append('Nombre',this.newInsEvento.value.Nombre);
    // formData.append('CI',this.newInsEvento.value.CI);
    // formData.append('Celular',this.newInsEvento.value.Celular);
    // formData.append('Institucion',this.newInsEvento.value.Institucion);
    // formData.append('Area',this.newInsEvento.value.Area);
    // formData.append('Estado_Pago',this.newInsEvento.value.Estado_Pago);
    // formData.append('Boleta_Pago',this.newInsEvento.value.Boleta_Pago);
    // formData.append('Observacion',this.newInsEvento.value.Observacion);
    // formData.append('id_evento',this.newInsEvento.value.id_evento);
    this.isSubmitted=true;
    if (this.newInsEvento.invalid) {
      return;
    } else {
      let id = this.newInsEvento.controls.id.value;
      console.log(this.newInsEvento.value)
      if (!id) { //PREGUNTAMOS: SI NO TIENE id?
        formData.set('id','0')   //ACA ES PARA IMAGENES DEFINIMOS ESTO PARA EVITAR ERROR
        this._insEvento.AgregarInsEvento(formData)
        .then(res=>{
          console.log('SE AÑADIO CORRECTAMENTE InsEvento',res.data);
          this.CargarInsEvento();
          this.MostrarMensaje('success',"DATO AÑADIDO SATISFACTORIAMENTE")
          this.resetInsEvento();
        })
        .catch(error=>{
          this.MostrarMensaje('error','OCURRIO UN ERROR AL INTENTAR INSCRIBIRSE')
          console.log('ERROR AL AÑADIR InsEvento');
          console.log(error.response.data.response);
        })
      } else {
        //SI TIENE ID POR LO TANTO MODIFICAR
        this._insEvento.ModificarInsEvento(formData,this.newInsEvento.value.id)
        .then(res=>{
          console.log('SE MODIFICO CORRECTAMENTE InsEvento',res.data);
          this.CargarInsEvento();
          this.MostrarMensaje('success',"DATO MODIFICADO SATISFACTORIAMENTE")
          this.resetInsEvento();
        })
        .catch(error=>{
          console.log('ERROR AL MODIFICAR InsEvento');
          this.MostrarMensaje('error','OCURRIO UN ERROR AL REALIZAR LA ACCION')
          console.log(error);
        })
      }
    }
  }
  SeleccionarInsEvento(id){
    if(id){
      const dataInsEvento = this.insEvento.find(x => x.id === id)
      if(!dataInsEvento) return;
      this._insEvento.SeleccionarInsEvento(id)
      .then(res=>{
        Object.keys(this.newInsEvento.controls).forEach(key => {
          this.newInsEvento.controls[key].setValue(res.data[key]);
        });
        console.log('SELECCION DE InsEvento EXITOSA',this.newInsEvento.value);
          document.getElementById("btnCrudInsEvento").click();
      });
    }
  }
  EliminarInsEvento(id){

    Swal.fire({
      title: 'SEGURO QUE QUIERE ELIMINAR AL INSCRITO?',
      color: '#FFFFFF',
      showDenyButton: false,
      showCancelButton: true,
      cancelButtonColor: "#DD6B55",
      cancelButtonText:'CANCELAR',
      confirmButtonText: 'ELIMINAR',
      confirmButtonColor: "#DD6B55",
      background: '#D62600',

    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._insEvento.EliminarInsEvento(id)
        .then(res => {
          console.log(res.data);
          this.CargarInsEvento();
          this.MostrarMensaje('success','DATO ELIMINADO SATISFACTORIAMENTE')
        }).catch(err =>  {
        console.log('ERROR AL ELIMINAR InsEvento',err.message.data.message);
        this.MostrarMensaje('error','OCURRIO UN ERROR AL REALIZAR LA ACCION')
        });
      }
    })
  }
//#endregion CRUD PRINCIPAL

//#region EVENTOS
  evento=[];EventoActivo=[]
  newEvento =new FormGroup({
    // attr:new FormControl('',[Validators.required])
    id:new FormControl(0),
    Nombre_Evento :new FormControl(''),
    Descripcion :new FormControl(''),
    Estado :new FormControl(''),
    Monto:new FormControl(''),
    Detalle:new FormControl(''),
    ImagenQR:new FormControl(''),
    Acceso:new FormControl(''),
  })
  CargarEventoActivo(){
    this._evento.ObtenerEventosActivos()
    .then(res => {
      console.log('EventoActivo CARGADO',res.data);

      this.EventoActivo = res.data;
    }).catch(err =>  {
    console.log('ERROR AL CARGAR InsEvento',err.message.data.message);
    });
  }
  CargarEvento(){
    this._evento.ObtenerEventos()
    .then(res => {
      console.log('Evento CARGADO',res.data);
      res.data.forEach(e => {
        if (e.ImagenQR==''||e.ImagenQR==null) {
          e.ImgQR=false
        } else {
          e.ImgQR=true
        }
      });
      this.evento = res.data;
    }).catch(err =>  {
    console.log('ERROR AL CARGAR Evento',err.message.data.message);
    });
  }
  resetEvento(){

    this.FOTO_IMG_ADD_EVENTO.nativeElement.value = "";
    this.newEvento.reset();
    this.isSubmitted =false;
  }
  AgregarModificarEvento(){
    //ESTE ES UNA ALTERNATIVA RAPIDA ARA CONVERTIR un new a formdata
    const formData = new FormData();
    const nuevoInsEvento = this.newEvento.value;
    Object.keys(nuevoInsEvento).forEach((key) => {
      formData.append(key, nuevoInsEvento[key]);
    });
    this.isSubmitted=true;
    if (this.newEvento.invalid) {
      return;
    } else {
      let id = this.newEvento.controls.id.value;
      console.log(this.newEvento.value)
      if (!id) { //PREGUNTAMOS: SI NO TIENE id?
        formData.set('id','0')   //ACA ES PARA IMAGENES DEFINIMOS ESTO PARA EVITAR ERROR
        this._evento.AgregarEvento(formData)
        .then(res=>{
          console.log('SE AÑADIO CORRECTAMENTE Evento',res.data);
          this.CargarEvento();
          this.CargarEventoActivo()
          this.MostrarMensaje('success','DATO AÑADIDO SATISFACTORIAMENTE')
          this.resetEvento();
        })
        .catch(error=>{
          console.log('ERROR AL AÑADIR Evento');
          this.MostrarMensaje('error','OCURRIO UN ERROR AL REALIZAR LA ACCION')
          console.log(error.message.data.message);
        })
      } else {
        //SI TIENE ID POR LO TANTO MODIFICAR
        this._evento.ModificarEvento(formData,this.newEvento.value.id)
        .then(res=>{
          console.log('SE MODIFICO CORRECTAMENTE Evento',res.data);
          this.CargarEvento();
          this.CargarEventoActivo()
          this.MostrarMensaje('success','DATO MODIFICADO SATISFACTORIAMENTE')
          this.resetEvento();
        })
        .catch(error=>{
          console.log('ERROR AL MODIFICAR Evento');
          this.MostrarMensaje('error','OCURRIO UN ERROR AL REALIZAR LA ACCION')
          console.log(error.message.data.message);
        })
      }
    }
  }
  SeleccionarEvento(id){
    if(id){
      const dataEvento = this.evento.find(x => x.id === id)
      if(!dataEvento) return;
      this._evento.SeleccionarEvento(id)
      .then(res=>{
        Object.keys(this.newEvento.controls).forEach(key => {
          this.newEvento.controls[key].setValue(res.data[key]);
        });
        console.log('SELECCION DE Evento EXITOSA',this.newEvento.value);
          document.getElementById("btnCrudEvento").click();
      });
    }
  }
  EliminarEvento(id){

    Swal.fire({
      title: 'SEGURO QUE QUIERE ELIMINAR EVENTO?',
      color: '#FFFFFF',
      showDenyButton: false,
      showCancelButton: true,
      cancelButtonColor: "#DD6B55",
      cancelButtonText:'CANCELAR',
      confirmButtonText: 'ELIMINAR',
      confirmButtonColor: "#DD6B55",
      background: '#D62600',

    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._evento.EliminarEvento(id)
        .then(res => {
          console.log(res.data);
          this.CargarEvento();
          this.MostrarMensaje('success','DATO ELIMINADO SATISFACTORIAMENTE')
        }).catch(err =>  {
        console.log('ERROR AL ELIMINAR Evento',err.message.data.message);
        this.MostrarMensaje('error','OCURRIO UN ERROR AL REALIZAR LA ACCION')
        });
      }
    })
  }
  //#endregion EVENTOS

  //#region AREAS PARA LOS EVENTOS
    areaEventos=[];
    newAreaEventos =new FormGroup({
      // attr:new FormControl('',[Validators.required])
      id:new FormControl(0),
      NombreArea:new FormControl(''),

    })
    CargarAreaEventos(){
      this._areaEventos.ObtenerAreaEventoss()
      .then(res => {
        console.log('AreaEventos CARGADO',res.data);
        this.areaEventos = res.data;
      }).catch(err =>  {
      console.log('ERROR AL CARGAR AreaEventos',err.response.data.message);
      });
    }
    resetAreaEventos(){
      this.newAreaEventos.reset();
      this.isSubmitted =false;
    }
    AgregarModificarAreaEventos(){
      this.isSubmitted=true;
      if (this.newAreaEventos.invalid) {
        return;
      } else {
        let id = this.newAreaEventos.controls.id.value;
        console.log(this.newAreaEventos.value)
        if (!id) { //PREGUNTAMOS: SI NO TIENE id?
          this._areaEventos.AgregarAreaEventos(this.newAreaEventos.value)
          .then(res=>{
            console.log('SE AÑADIO CORRECTAMENTE AreaEventos',res.data);
            this.CargarAreaEventos();
            this.resetAreaEventos();
          })
          .catch(error=>{
            console.log('ERROR AL AÑADIR AreaEventos');
            console.log(error.response.data.message);
          })
        } else {
          //SI TIENE ID POR LO TANTO MODIFICAR
          this._areaEventos.ModificarAreaEventos(this.newAreaEventos.value,this.newAreaEventos.value.id)
          .then(res=>{
            console.log('SE MODIFICO CORRECTAMENTE AreaEventos',res.data);
            this.CargarAreaEventos();
            this.resetAreaEventos();
          })
          .catch(error=>{
            console.log('ERROR AL MODIFICAR AreaEventos');
            console.log(error.response.data.message);
          })
        }
      }
    }
    SeleccionarAreaEventos(id){
      if(id){
        const dataAreaEventos = this.areaEventos.find(x => x.id === id)
        if(!dataAreaEventos) return;
        this._areaEventos.SeleccionarAreaEventos(id)
        .then(res=>{
          Object.keys(this.newAreaEventos.controls).forEach(key => {
            this.newAreaEventos.controls[key].setValue(res.data[key]);
          });
          console.log('SELECCION DE AreaEventos EXITOSA',this.newAreaEventos.value);
            document.getElementById("btnCrudAreaEventos").click();
        });
      }
    }
    EliminarAreaEventos(id){
      this._areaEventos.EliminarAreaEventos(id)
      .then(res => {
        console.log(res.data);
        this.CargarAreaEventos();
      }).catch(err =>  {
      console.log('ERROR AL ELIMINAR AreaEventos',err.response.data.message);
      });
  }
  //#endregion
}

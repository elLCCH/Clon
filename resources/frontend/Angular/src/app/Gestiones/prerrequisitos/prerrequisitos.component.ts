import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PrerrequisitosService } from './prerrequisitos.service';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prerrequisitos',
  templateUrl: './prerrequisitos.component.html',
  styleUrls: ['./prerrequisitos.component.css']
})
export class PrerrequisitosComponent implements OnInit {

  ruta = 'http://localhost:8000/';
  curso=[]
  preRec=[]
  constructor(protected _pre: PrerrequisitosService) { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.CargarPrerrequisito()
    this.CargarCurso()
    this.iniciarFormfilterCursos()
    this.iniciarFormfilterCursos2()
    this.iniciarFormfilterBuscador()
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
//#region FILTRAR FORMS
//PARA PRERREQUISITO
  curso2Filtrado=[]; //LISTA ENCONTRADA
  Cursos2Select={//VALOR SELECCIONADO
    NombreCurso:'',
    Sigla:''
  };
  filtroCursos2=false; //ESTADO ngIf Lista
  filterCursos2Form= new FormGroup({
    txt:new FormControl(''),
  });
  iniciarFormfilterCursos2(){ //ESTO SE DEBE LLAMAR
    this.filterCursos2Form.get('txt').valueChanges
    // .pipe(debounceTime(1000))
    .subscribe(response => {
      console.log('entered data is ', response);
      this.filtroCursos2=true;
      if(response && response.length){
        this.filterCursos2(response);
      } else {
        this.curso2Filtrado = [];
      }
      console.log('DATA ENCONTRADO', this.curso2Filtrado)
    })
  }

  filterCursos2(Datafilter){
    this.curso2Filtrado = this.curso.filter(a => (a.NombreCurso.indexOf(Datafilter) > -1) || a.Sigla.indexOf(Datafilter) > -1)
  }

  //PARA MATERIA
  cursoFiltrado=[]; //LISTA ENCONTRADA
  CursosSelect={//VALOR SELECCIONADO
    NombreCurso:'',
    Sigla:''
  };
  filtroCursos=false; //ESTADO ngIf Lista
  filterCursosForm= new FormGroup({
    txt:new FormControl(''),
  });
  iniciarFormfilterCursos(){ //ESTO SE DEBE LLAMAR
    this.filterCursosForm.get('txt').valueChanges
    // .pipe(debounceTime(1000))
    .subscribe(response => {
      console.log('entered data is ', response);
      this.filtroCursos=true;
      if(response && response.length){
        this.filterCursos(response);
      } else {
        this.cursoFiltrado = [];
      }
      console.log('DATA ENCONTRADO', this.cursoFiltrado)
    })
  }

  filterCursos(Datafilter){
    //PARA HACER BUSQUEDAS POR SEPARADO
    // this.cursoFiltrado = this.est.filter(a => (a.nombre_est.indexOf(Datafilter) && a.ape_p_est.indexOf(Datafilter) && a.ape_m_est.indexOf(Datafilter)) > -1)
    this.cursoFiltrado = this.curso.filter(a => (a.NombreCurso.indexOf(Datafilter) > -1) || a.Sigla.indexOf(Datafilter) > -1)
  }


  //FILTRADOR V3: NombreFiltro => Buscador, dataP=> search
  searchFiltrado=[]; //LISTA ENCONTRADA
  BuscadorSelect={//VALOR SELECCIONADO
    // attrib:''
  };
  filtroBuscador=false; //ESTADO ngIf Lista
  filterBuscadorForm= new FormGroup({
    txt:new FormControl(''),
  });
  iniciarFormfilterBuscador(){ //ESTO SE DEBE LLAMAR
    this.filterBuscadorForm.get('txt').valueChanges
    // .pipe(debounceTime(1000))
    .subscribe(response => {
      console.log('entered data is ', response);
      this.filtroBuscador=true;
      if(response && response.length){
        this.filterBuscador(response);
      } else {
        this.pre = this.preRec;
      }
      console.log('DATA ENCONTRADO', this.pre)
    })
  }

  filterBuscador(Datafilter){
    this.pre = this.pre.filter(a => a.mat_prin.indexOf(Datafilter)> -1 || a.cod_prin.indexOf(Datafilter)> -1 || a.materia_sec.indexOf(Datafilter)> -1 || a.cod_sec.indexOf(Datafilter)> -1)

  }
  //#endregion FILTRAR FORMS
  CargarCurso() {
    // axios.get(this.ruta+'api/CursosUniqueSigla')
    this._pre.ObtenerPrerrequisitosFK()
    .then(res =>{
      console.log("OBTENIENDO Cursos");
      console.log(res.data);
      this.curso = res.data;
    }).catch(error =>{
      console.log("hay error");
      console.log(error);
    })
  }

  //CRUD V3: idPK=> id, nomService=> _pre, nombreCRUD=> Prerrequisito,  dataP=> pre, isSubmitted=>isSubmitted
    pre=[];
    isSubmitted = false;
    newPrerrequisito =new FormGroup({
      // attr:new FormControl('',[Validators.required])
      id:new FormControl(0),
      id_materia_p: new FormControl('',[Validators.required]),
      id_materia_s: new FormControl('',[Validators.required])
    })
    CargarPrerrequisito(){
      this._pre.ObtenerPrerrequisito()
      .then(res => {
        console.log('PRERREQUISITO CARGADO',res.data);
        this.pre = res.data;
        this.preRec = res.data;
      }).catch(err =>  {
      console.log("err");
      });
    }

    resetPrerrequisito(){

      this.filterCursosForm.patchValue({txt:''})
      this.filterCursos2Form.patchValue({txt:''})
      this.newPrerrequisito.reset();
      this.isSubmitted =false;
    }
    AgregarModificarPrerrequisito(){
      this.isSubmitted=true;
      if (this.newPrerrequisito.invalid) {
        return;
      } else {
        let id = this.newPrerrequisito.controls.id.value;
        console.log(this.newPrerrequisito.value)
        if (!id) { //PREGUNTAMOS: SI NO TIENE id?
          this._pre.AgregarPrerrequisito(this.newPrerrequisito.value)
          .then(res=>{
            console.log('SE AÑADIO CORRECTAMENTE',res.data);
            this.CargarPrerrequisito();
            this.resetPrerrequisito();

            this.MostrarMensaje('success','SE AÑADIO CORRECTAMENTE')
          })
          .catch(error=>{
            console.log('ERROR AL AÑADIR Prerrequisito');
            console.log(error.response.data.errors);

            this.MostrarMensaje('error','NO SE PUDO REALIZAR LA ACCIÓN')
          })
        } else {
          //SI TIENE ID POR LO TANTO MODIFICAR
          this._pre.ModificarPrerrequisito(this.newPrerrequisito.value,this.newPrerrequisito.value.id)
          .then(res=>{
            console.log('SE MODIFICO CORRECTAMENTE',res.data);
            this.CargarPrerrequisito();
            this.resetPrerrequisito();
            this.MostrarMensaje('success','SE MODIFICO CORRECTAMENTE')
          })
          .catch(error=>{
            console.log('ERROR AL MODIFICAR');
            console.log(error.response.data.errors);
            this.MostrarMensaje('error','NO SE PUDO REALIZAR LA ACCIÓN')
          })
        }
      }
    }
    SeleccionarPrerrequisito(data){
      this.filterCursosForm.patchValue({txt:data.mat_prin+' - '+data.cod_prin})
      this.filterCursos2Form.patchValue({txt:data.materia_sec+' - '+data.cod_sec})
      this.filtroCursos=false; this.filtroCursos2 = false;
      if(data.id){
        const dataPrerrequisito = this.pre.find(x => x.id === data.id)
        if(!dataPrerrequisito) return;
        this._pre.SeleccionarPrerrequisito(data.id)
        .then(res=>{
          Object.keys(this.newPrerrequisito.controls).forEach(key => {
            this.newPrerrequisito.controls[key].setValue(res.data[key]);
          });
          console.log('SELECCION EXITOSA',this.newPrerrequisito.value);
            document.getElementById("btnCrudPrerrequisito").click();
        });
      }
    }
    EliminarPrerrequisito(id){

      Swal.fire({
      title: 'SEGURO QUE QUIERE ELIMINAR ADMINISTRATIVO?',
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
        this._pre.EliminarPrerrequisito(id)
        .then(res => {
          console.log(res.data);
          this.CargarPrerrequisito();
          this.MostrarMensaje('success','SE ELIMINO CORRECTAMENTE')
        }).catch(err =>  {
        console.log("err",err);
        this.MostrarMensaje('error','NO SE PUDO REALIZAR LA ACCIÓN')
        });
      }
    })
  }
}

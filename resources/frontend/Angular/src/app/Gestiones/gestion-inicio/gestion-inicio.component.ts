import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-gestion-inicio',
  templateUrl: './gestion-inicio.component.html',
  styleUrls: ['./gestion-inicio.component.css']
})
export class GestionInicioComponent implements OnInit {

  @ViewChild('CerrarBoton') cerrarBtn;
  @ViewChild('CerrarBotonMod') cerrarBtnMod;
  @ViewChild('cerrarBtnAviso') cerrarBtnAviso;
  txtGG = '';
  ruta = 'http://localhost:8000/';
  carrousel =[ ];
  admin=[ ];
  avisos=[ ];
  video=[ ];
  esAdmin;
  PublicacionSeleccionado = {
    Titulo:'',
    Descripcion:'',
    Fecha:'',
    File:'',
    Tipo:'',
    Enlace:'',
    Admin_id:''
  };
  

  newPublicacion = new FormGroup({
    Titulo:new FormControl(''),
    Descripcion:new FormControl(''),
    Fecha:new FormControl(''),
    File:new FormControl(''),
    Tipo:new FormControl(''),
    Enlace:new FormControl(''),
    Admin_id:new FormControl(''),
  });

  constructor() { }

ngOnInit(): void {
  let rootVar = window['rutacion'];
    this.ruta = rootVar;
  this.CargarCarrousel();
  this.CargarAdministrativo();
  this.consultarlog();
  this.CargarAvisos();
}
private consultarlog() {
  if (localStorage.getItem('sesion') != null && localStorage.l == 'службаданныхlcch') {
    this.esAdmin = true;  
  }
  else
  {
    this.esAdmin = false;
  }
}

CargarCarrousel() {
axios.get(this.ruta+'api/Publicacion?tipo=Carrousel')
.then(res => {
  console.log(res.data);
  this.carrousel = res.data;
  res.data.forEach(element => {
    element.Editando=false;
  });
}).catch(err =>  {
console.log("err");
});



    // axios.get(this.ruta+'api/Publicacion')
    //       .then(res =>{
    //         console.log("OBTENIENDO ADMINs");
    //         console.log(res.data);
    //         res.data.forEach(element => {
    //           element.Editando=false;
    //         });
    //         this.est = res.data;
    //       }).catch(error =>{
    //         console.log("hay error");
    //         console.log(error);
    //       })
  }
CargarAdministrativo() {
  axios.get(this.ruta+'api/Administrativo')
        .then(res =>{
          console.log("OBTENIENDO ADMINs");
          console.log(res.data);
          res.data.forEach(element => {
            element.Editando=false;
          });
          this.admin = res.data;
        }).catch(error =>{
          console.log("hay error");
          console.log(error);
        })
  }
    //FUNCIONA PARTE DE LAS MANIAS
ObtenertxtGG()
{
  console.log(this.txtGG);
  this.txtGG;
}
onFileChange(event){
  
  if (event.target.files.length>0) {
    const file = event.target.files[0];
    this.newPublicacion.patchValue({
      File: file
    })
    console.log(file);
  }
}

  AgregarCarrousel()
  {
    //para prueba
    // this.cerrarBtn.nativeElement.click();
    // return;
    //hasta aca
    const formData = new FormData();
    formData.append('Titulo',this.newPublicacion.value.Titulo);
    formData.append('Descripcion',this.newPublicacion.value.Descripcion);
    formData.append('Fecha',this.newPublicacion.value.Fecha);
    formData.append('File',this.newPublicacion.value.File);
    formData.append('Tipo','Carrousel');
    formData.append('Enlace',this.newPublicacion.value.Enlace);
    formData.append('Admin_id',localStorage.numberADD);
    
    axios({
      method:'post',
      url:this.ruta+'api/Publicacion',
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })
    .then(res=>{
      console.log('SE AÑADIO CORRECTAMENTE');
      console.log(res);
      this.cerrarBtn.nativeElement.click();
      this.CargarCarrousel();
    })
    .catch(error=>{
      console.log('Error al Agregar');
      console.log(error);
    })
  }
  MODonFileChange(event){
    
    if (event.target.files.length>0) {
      const file = event.target.files[0];
      this.newPublicacion=file;
      console.log(file);
    }
  }
  
  EliminarCarrousel(Publicacion)
  {
    if(confirm("Seguro que desea Eliminar el Carrousel? ")) {
        // const IdAdmin = 3;
    const formData = new FormData();
    formData.append('NombrePublicacion',Publicacion.nombrePublicacion);
    formData.append('NivelPublicacion',Publicacion.nivelPublicacion);

    axios({
      method:'delete',
      url:this.ruta+'api/Publicacion/'+Publicacion.id
    })
    .then(res=>{
      console.log('SE ELIMINO CORRECTAMENTE');
      console.log(res);
      this.CargarCarrousel();
    })
    .catch(error=>{
      console.log('HAY ERROR AL BORRAR');
      console.log(error);
    })
    }
  }
  CargarUltimosVideos() {
    axios.get(this.ruta+'api/Publicacion?tipo=Video')
          .then(res =>{
            console.log("OBTENIENDO Videos");
            console.log(res.data);
            res.data.forEach(element => {
              element.Editando=false;
            });
            this.video = res.data;
          }).catch(error =>{
            console.log("hay error");
            console.log(error);
          })
  }
  //PARA AVISOS
  CargarAvisos() {
    axios.get(this.ruta+'api/Publicacion?tipo=Aviso')
          .then(res =>{
            console.log("OBTENIENDO Avisos");
            console.log(res.data);
            res.data.forEach(element => {
              element.Editando=false;
            });
            this.avisos = res.data;
          }).catch(error =>{
            console.log("hay error");
            console.log(error);
          })
  }

  AgregarAviso()
  {
    const formData = new FormData();
    formData.append('Titulo',this.newPublicacion.value.Titulo);
    formData.append('Descripcion',this.newPublicacion.value.Descripcion);
    formData.append('Fecha',this.newPublicacion.value.Fecha);
    formData.append('Tipo','Aviso');
    formData.append('Admin_id',localStorage.numberADD);
    formData.append('Enlace',this.newPublicacion.value.Enlace);
    

    axios({
      method:'post',
      url:this.ruta+'api/Publicacion',
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })
    .then(res=>{
      console.log('SE AÑADIO CORRECTAMENTE el AVISO');
      console.log(res);
      this.cerrarBtnAviso.nativeElement.click();
      this.CargarAvisos();
    })
    .catch(error=>{
      console.log('HAY ERROR XD');
      console.log(error);
    })
  }
  
  
  EliminarAviso(Publicacion)
  {
    
    if(confirm("Seguro que desea Eliminar el Aviso? ")) {
        // const IdAdmin = 3;
    const formData = new FormData();
    formData.append('NombrePublicacion',Publicacion.nombrePublicacion);
    formData.append('NivelPublicacion',Publicacion.nivelPublicacion);

    axios({
      method:'delete',
      url:this.ruta+'api/Publicacion/'+Publicacion.id
    })
    .then(res=>{
      console.log('SE ELIMINO CORRECTAMENTE');
      console.log(res);
      this.CargarAvisos();
    })
    .catch(error=>{
      console.log('HAY ERROR AL BORRAR');
      console.log(error);
    })
    }
  }
}

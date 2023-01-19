import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {

  @ViewChild('CerrarBoton') cerrarBtn;
  @ViewChild('CerrarBotonMod') cerrarBtnMod;
  txtGG = '';
  ruta = 'http://localhost:8000/';
  public =[ ];
  admin=[ ];
  esAdmin;
  PublicacionSeleccionado = {
    Titulo:'',
    Descripcion:'',
    Fecha:'',
    File:'',
    Tipo:'',
    Admin_id:''
  };
  

  newPublicacion = new FormGroup({
    Titulo:new FormControl(''),
    Descripcion:new FormControl(''),
    Fecha:new FormControl(''),
    File:new FormControl(''),
    Tipo:new FormControl(''),
    Admin_id:new FormControl(''),
  });

  constructor() { }

ngOnInit(): void {
  let rootVar = window['rutacion'];
    this.ruta = rootVar;
  this.CargarPublicacion();
  this.CargarAdministrativo();
  this.consultarlog();
  // var xd = localStorage.sesion.split('data','["'); //ESPECIE DE CONVERSOR DE STRING A ARRAY

  // console.log(localStorage.numberADD);
}
private consultarlog() {
  if (localStorage.getItem('sesion') != null && (localStorage.l == 'службаданныхlcch' || localStorage.l == 'службаданныхellcch')) {
    this.esAdmin = true;  
  }
  else
  {
    this.esAdmin = false;
  }
}

CargarPublicacion() {
axios.get(this.ruta+'api/Publicacion?tipo=Noticia')
.then(res => {
  console.log(res.data);
  this.public = res.data;
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

  AgregarPublicacion()
  {
    //para prueba
    // this.cerrarBtn.nativeElement.click();
    // return;
    //hasta aca
    if (localStorage.sesion !=null && localStorage.l == 'службаданныхlcch') {
      const formData = new FormData();
      formData.append('Titulo',this.newPublicacion.value.Titulo);
      formData.append('Descripcion',this.newPublicacion.value.Descripcion);
      formData.append('Fecha',this.newPublicacion.value.Fecha);
      formData.append('File',this.newPublicacion.value.File);
      formData.append('Tipo','Noticia');
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
        this.CargarPublicacion();
      })
      .catch(error=>{
        console.log('Error al Agregar');
        console.log(error);
      })
    }
    
  }
  MODonFileChange(event){
    
    if (event.target.files.length>0) {
      const file = event.target.files[0];
      this.newPublicacion=file;
      console.log(file);
    }
  }
  ModificarPublicacion(Publicacion)
  {
    Publicacion.Editando=false;
    
    const formData = new FormData();
    formData.append('Ap_Paterno',Publicacion.Titulo);
    formData.append('Ap_Materno',Publicacion.Descripcion);
    formData.append('Nombre',Publicacion.Fecha);
    formData.append('Foto',this.newPublicacion.value.File);
    formData.append('FechNac',Publicacion.Tipo);
    formData.append('Admin_id',Publicacion.Admin_id);
    axios({
      method:'post',
      url:this.ruta+'api/PublicacionUpdate/'+Publicacion.id,
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })
    .then(res=>{
      //OBTENER RETURN DE CONTROLLER
      // var x = res;
      // var xD:string  = x.toString();

      // console.log(xD);
      
      console.log('SE MODIFICO CORRECTAMENTE');
      console.log(res);
      this.cerrarBtnMod.nativeElement.click();
      this.CargarPublicacion();
    })
    .catch(error=>{
      console.log('HAY ERROR AL MODIFICAR');
      console.log(error);
    })
  }
  EliminarPublicacion(Publicacion)
  {
    if(confirm("Seguro que desea Eliminar Publicacion? ")) {
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
      this.CargarPublicacion();
    })
    .catch(error=>{
      console.log('HAY ERROR AL BORRAR');
      console.log(error);
    })
    }
  }
}

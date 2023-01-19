import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  ruta='';
  videos = [ ];
  esAdmin;
  @ViewChild('CerrarBoton') cerrarBtn;
  @ViewChild('CerrarBotonMod') cerrarBtnMod;
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
    this.subir();
    this.consultarlog();
    this.CargarVideos();
    
  }
  subir() {
    window.scroll(0,0);
    document.body.scrollTop = 0;
    document.querySelector('body').scrollTo(0,0);
  }
  private consultarlog() {
    if (localStorage.getItem('sesion') != null && (localStorage.l == 'службаданныхlcch')) {
      this.esAdmin = true;  
    }
    else
    {
      this.esAdmin = false;
    }
  }
  AgregarVideo()
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
    formData.append('Enlace',this.newPublicacion.value.Enlace);
    formData.append('Tipo','Video');
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
      this.CargarVideos();
    })
    .catch(error=>{
      console.log('Error al Agregar');
      console.log(error);
    })
  }
  EliminarVideo(Video)
  {
    if(confirm("Seguro que desea Eliminar el Video? ")) {
        // const IdAdmin = 3;
    const formData = new FormData();
    formData.append('NombrePublicacion',Video.nombrePublicacion);
    formData.append('NivelPublicacion',Video.nivelPublicacion);

    axios({
      method:'delete',
      url:this.ruta+'api/Publicacion/'+Video.id
    })
    .then(res=>{
      console.log('SE ELIMINO CORRECTAMENTE');
      console.log(res);
      this.CargarVideos();
    })
    .catch(error=>{
      console.log('HAY ERROR AL BORRAR');
      console.log(error);
    })
    }
  }
  CargarVideos() {
    axios.get(this.ruta+'api/Publicacion?tipo=Video')
    .then(res => {
      console.log(res.data);
      this.videos = res.data;
      res.data.forEach(element => {
        var dateFech = new Date(element.Fecha.toString());
        let strFech = dateFech.toLocaleDateString('Es-es');
        element.Fecha = strFech;
      });
      
    }).catch(err =>  {
    console.log("err");
    });
  }
}

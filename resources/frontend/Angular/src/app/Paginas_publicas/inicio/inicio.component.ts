import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  ruta = 'sasd';
  publicaciones = [ ];
  noticias = [ ];
  carrousel = [ ];
  avisos = [ ];
  // video = [ ];
  video = {
    vidio: ''
  }
  PublicacionSeleccionada = {Titulo:'',Descripcion:'',File:''};
  NoticiaSeleccionada = {Titulo:'',Descripcion:'',File:''};
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    // rootVar += ' adios';
    // window['hola'] = rootVar;
    this.CargarPublicacion();
    this.CargarNoticias();
    this.CargarCarrousel();
    this.CargarAvisos();
    // this.CargarUltimoVideo();
    // this.CargarVideo();
  }
  CargarVideo() {
    //cargar categorias habilitadas que estan desde ApisController
    axios.get(this.ruta + 'api/VideoApi')
      .then(res => {
        console.log('VIDEO APIs',res.data);
        this.video = res.data[0];
        console.log('VIDEO APIs cargado',this.video);
        
      }).catch(err => {
        console.log("err");
      });
  }
  CargarUltimoVideo() {
    axios.get(this.ruta+'api/Publicacion?tipo=Video')
    .then(res => {
      console.log(res.data);
      this.video = res.data;
      // res.data.forEach(element => {
      //   element.Editando=false;
      // });
    }).catch(err =>  {
    console.log("err");
    
    });
  }
  CargarCarrousel() {
    axios.get(this.ruta+'api/Publicacion?tipo=Carrousel')
    .then(res => {
      console.log(res.data);
      this.carrousel = res.data;
      // res.data.forEach(element => {
      //   element.Editando=false;
      // });
    }).catch(err =>  {
    console.log("err");
    
    });
  }
  CargarAvisos() {
    axios.get(this.ruta+'api/Publicacion?tipo=Aviso')
    .then(res => {
      console.log(res.data);
      this.avisos = res.data;
      // res.data.forEach(element => {
      //   element.Editando=false;
      // });
    }).catch(err =>  {
    console.log("err");
    });
  }
  CargarPublicacion() {
  axios.get(this.ruta+'api/Publicacion?tipo=Publicacion')
  .then(res => {
    console.log(res.data);
    this.publicaciones = res.data;
    // res.data.forEach(element => {
    //   element.Editando=false;
    // });
  }).catch(err =>  {
  console.log("err");
  
  });
  }
  CargarNoticias() {
  axios.get(this.ruta+'api/Publicacion?tipo=Noticia')
  .then(res => {
    console.log(res.data);
    this.noticias = res.data;
    // res.data.forEach(element => {
    //   element.Editando=false;
    // });
  }).catch(err =>  {
  console.log("err");
  });
  }
  closeNav() {
    document.getElementById("sideNavigation").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }

  accion1(){
    document.getElementById("card").className = " card flipped";
    
  }
  accion2(){
    document.getElementById("card").className = " card ";
    
  }
  // $(".flip").click(function(){
  //   $(this).parents(".card").toggleClass("flipped");
  // });
  // $(".clickcard").click(function(){
  //   $(this).toggleClass("flipped");
  // });
}

import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Maria Luisa Luzio';
  
  Open()
  {
    document.getElementById('wrapper').classList.toggle("toggled")
  }
  // ngOnInit(): void {
  //     localStorage.clear();
  // }
  @HostListener('window:beforeunload')
  
  onUnload() {
    // if (localStorage.getItem('sesion') != null || localStorage.getItem('sesionlcch') == 'ACTIVO') {
    //   //si existe
    //   localStorage.setItem('sesionlcch', 'ACTIVO');
    // } else if(localStorage.getItem('sesionlcch') == 'INACTIVO'){
    //   //si no existe localStorage.getItem('sesion');
    //   // localStorage.clear();
    //   sessionStorage.removeItem('NOMBRE');
    //   sessionStorage.removeItem('l');
    //   sessionStorage.removeItem('numberADD');
    //   localStorage.setItem('sesionlcch', 'ACTIVO');
    // }
    
    // // sessionStorage.removeItem('NOMBRE');
    // // sessionStorage.removeItem('l');
    // // sessionStorage.removeItem('numberADD');
    // // return false;
    
  }
  inputValue;
  
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    var admin = localStorage.getItem('l');
    if (admin=='службаданныхlcch') {
      console.log('ES ADMIN MANTENIENDO SESION')
      //IDEA, PODEMOS HACER UN ALERT PARA MANTENER SESION EN ADMIN Y USO DE ARCHIVO
    }
    else
    {localStorage.clear();}
    
    // console.log('SE HIZO LA CERRACION');
    
  }
  //ESTO ES PARA MOVERSE HACIA ARRIBA LA PANTALLA DE LA PAGINA O HACER UN SCROLL TO UP
  onActivate(event) {
    //HACER SCROLL CADA QUE Q SE CAMBIA DE PAGINA
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 60); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
    }, 16);
    // window.scroll(0,0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
    
    
    // ESTO DE AQUI VERIFICA LA SESION CADA VEZ QUE SE CAMBIA DE PAGINA
    this.inputValue=this.inputValue+'XD';
    }
  
}

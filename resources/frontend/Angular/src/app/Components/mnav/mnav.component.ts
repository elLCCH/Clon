import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mnav',
  templateUrl: './mnav.component.html',
  styleUrls: ['./mnav.component.css']
})
export class MnavComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  esAdmin;
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.consultarlog();
    
  }
  @Input() someInput: string;

  ngOnChanges() {
  /**********THIS FUNCTION WILL TRIGGER WHEN PARENT COMPONENT UPDATES 'someInput'**************/
  //Write your code here
   console.log(this.someInput);
   console.log('RECARGACION');
  //  this.esAdmin = true;  
  this.consultarlog();
  //  this.ngOnInit();
  }
  OpenNav(){
    //HACER QUE AL ESCOGER ALGUNA OPCION DE LA PARTE DE ARRIBA, ESTE SE ENCOJA
    console.log('ES:', document.getElementById("navbarSupportedContent").classList.value);
    if (document.getElementById("navbarSupportedContent").classList.value == "collapse navbar-collapse show" || document.getElementById("navbarSupportedContent").classList.value == "navbar-collapse collapse show") {
      document.getElementById('navbarSupportedContent').classList.value = "collapse navbar-collapse";
    }
    else
    {
      document.getElementById('navbarSupportedContent').classList.value = "collapse navbar-collapse show";
    }
    
  }
  private consultarlog() {
    if (localStorage.getItem('sesion') != null) {
      this.esAdmin = true;  
    }
    else
    {
      this.esAdmin = false;
    }
  }
  private closeSesion()
  {
    localStorage.clear();
    sessionStorage.removeItem('NOMBRE');
    sessionStorage.removeItem('l');
    sessionStorage.removeItem('numberADD');
  }
  Open()
  {
  
  
    document.getElementById('wrapper').classList.toggle("toggled")
    
  }
}

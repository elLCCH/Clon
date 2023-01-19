import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-superusuario',
  templateUrl: './superusuario.component.html',
  styleUrls: ['./superusuario.component.css']
})
export class SuperusuarioComponent implements OnInit {
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
  private consultarlog() {
    if (localStorage.getItem('sesion') != null && localStorage.l == 'службаданныхlcch') {
      this.esAdmin = true;  
    }
    else
    {
      this.esAdmin = false;
    }
  }
  openNav() {
    if (document.getElementById("sideNavigation").style.width == "250px") {
      document.getElementById("sideNavigation").style.width = "0";
    }
    else
    {
      document.getElementById("sideNavigation").style.width = "250px";
    }
    
    
  }

  closeNav() {
    document.getElementById("sideNavigation").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
  }

}

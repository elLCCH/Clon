import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-estudiantes',
  templateUrl: './sidebar-estudiantes.component.html',
  styleUrls: ['./sidebar-estudiantes.component.css']
})
export class SidebarEstudiantesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  openNav() {
    document.getElementById('sidebar').classList.toggle('active');
    // console.log(document.getElementById('sidebar'))
  }
  Open()
  {
    document.getElementById('wrapper').classList.toggle("toggled")
  }
}

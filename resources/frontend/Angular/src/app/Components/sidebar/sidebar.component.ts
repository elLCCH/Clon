import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }




OpenPanel() {
  document.getElementById('sidebar').classList.toggle('active');
  console.log(document.getElementById('sidebar'))
}
Open()
{
  document.getElementById('wrapper').classList.toggle("toggled")
}

}

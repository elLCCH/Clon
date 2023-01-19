import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-visor-pdf',
  templateUrl: './visor-pdf.component.html',
  styleUrls: ['./visor-pdf.component.css']
})
export class VisorPDFComponent implements OnInit {
  ruta = '';
  // [src]="ruta+EstudianteSeleccionado.Foto"
  pdfSource = this.ruta+sessionStorage.getItem('PDF');
  // pdfSource = 'http://localhost:8000/CIDocumentos/16340592182.pdf';
  constructor() {}

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    // this.ArchivoPDF();
    // this.Hacer();
  }
  Hacer()
  {
    axios.get('https://postulantes.uto.edu.bo/home/listaSexo')
      .then(res => {
        console.log('YES');
        console.log(res.data);
        // this.est = res.data;
        res.data.forEach(element => {
          element.Editando = false;
        });
      }).catch(err => {
        console.log("err");
      });
  }
  ArchivoPDF()
  {
    // headers: {
    //   'Access-Control-Allow-Origin' : '*',
    //   'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //   }
    // axios.post(this.ruta+'AbrirPDF',{

    //   UrlPDF: 'estudiantes/16339946643.pdf',
    // })


    // .then(res=>{
    //   // console.log('SE MODIFICO CORRECTAMENTE');
    //   console.log(res);


    // })
    // .catch(error=>{
    //   console.log('HAY ERROR AL MODIFICAR');
    //   console.log(error);
    // })

    const formData = new FormData();
    formData.append('UrlPDF', this.ruta+'CIDocumentos/16340592182.pdf');
    axios({
        method: 'post',
        url: this.ruta + 'api/AbrirPDF',
        data: formData,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          // 'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
      //   var ResPDF = res.data;
      // var ResPDFDoc:string  = ResPDF.toString();

        console.log(res.data);
        this.pdfSource = res.data;
      })
      .catch(error => {
        console.log('HAY ERROR XD');
        console.log(error);
      })


  }
}

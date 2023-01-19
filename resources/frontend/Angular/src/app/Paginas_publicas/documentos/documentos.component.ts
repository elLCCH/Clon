import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {
  @ViewChild('CerrarBoton') cerrarBtn;
  ruta = 'http://localhost:8000/';
  documento =[ ];
  newdocumento = new FormGroup({
    nombredocumento:new FormControl(''),
    niveldocumento:new FormControl('')
  });

  constructor() { }
  
  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.Cargardocumento();
  }
  Cargardocumento() {
    axios.get(this.ruta+'api/documento')
          .then(res =>{
            console.log("OBTENIENDO ADMINs");
            console.log(res.data);
            res.data.forEach(element => {
              element.Editando=false;
            });
            this.documento = res.data;
          }).catch(error =>{
            console.log("hay error");
            console.log(error);
          })
  }

  Agregardocumento()
  {
    //para prueba
    // this.cerrarBtn.nativeElement.click();
    // return;
    //hasta aca



    const formData = new FormData();
    formData.append('Nombredocumento',this.newdocumento.value.nombredocumento);
    formData.append('Niveldocumento',this.newdocumento.value.niveldocumento);


    axios({
      method:'post',
      url:this.ruta+'api/documento',
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })
    .then(res=>{
      console.log('SE AÑADIO CORRECTAMENTE');
      console.log(res);
      this.cerrarBtn.nativeElement.click();
      this.Cargardocumento();
    })
    .catch(error=>{
      console.log('HAY ERROR XD');
      console.log(error);
    })
  }
  
  Modificardocumento(documento)
  {
    documento.Editando=false;
    
    // const IdAdmin = 3;
    // const formData = new FormData();
    
    // formData.append('Nombredocumento',documento.id);
    // formData.append('Niveldocumento',documento.id);

    // ESTO ES OTRA MANERA DE USAR
  axios.put(this.ruta+'api/documento/'+documento.id, {
      Nombredocumento: documento.Nombredocumento,
      Niveldocumento:documento.Niveldocumento
  })


    .then(res=>{
      //OBTENER RETURN DE CONTROLLER
      // var x = res;
      // var xD:string  = x.toString();

      // console.log(xD);
      
      console.log('SE MODIFICO CORRECTAMENTE');
      console.log(res);
      this.Cargardocumento();
    })
    .catch(error=>{
      console.log('HAY ERROR AL MODIFICAR');
      console.log(error);
    })
  }
  Eliminardocumento(documento)
  {
    
    if(confirm("Seguro que desea Eliminar documento? ")) {
        // const IdAdmin = 3;
    const formData = new FormData();
    formData.append('Nombredocumento',documento.nombredocumento);
    formData.append('Niveldocumento',documento.niveldocumento);

    axios({
      method:'delete',
      url:this.ruta+'api/documento/'+documento.id
    })
    .then(res=>{
      console.log('SE ELIMINO CORRECTAMENTE');
      console.log(res);
      this.Cargardocumento();
    })
    .catch(error=>{
      console.log('HAY ERROR AL BORRAR');
      console.log(error);
    })
    }
  }
}

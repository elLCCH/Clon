import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HerramientasService {

  constructor() { }
  MostrarMensaje(iconText,tittleText){
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({
      icon: iconText, //success, info, error,warning,question
      title: tittleText
    })
  }

  //PARA COPIAR
  respuesta: string;
 copy: boolean;
 copyText(val){
   let selBox = document.createElement('textarea');
     selBox.style.position = 'fixed';
     selBox.style.left = '0';
     selBox.style.top = '0';
     selBox.style.opacity = '0';
     selBox.value = val;
     document.body.appendChild(selBox);
     selBox.focus();
     selBox.select();
     document.execCommand('copy');
     console.log('DATO COPIADO',selBox.value);

     document.body.removeChild(selBox);
     this.copy = true;
     setTimeout(()=>{
       this.copy = false;
     }, 2000)
   }
}

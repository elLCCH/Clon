import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTeoricas'
})
export class FilterTeoricasPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const a of value){
      if(((a.Ap_Paterno.indexOf(arg) > -1) || (a.Ap_Materno.indexOf(arg) > -1) || a.Nombre.indexOf(arg) > -1) || (a.NivelCurso.indexOf(arg) > -1) || (a.NombreCurso.indexOf(arg) > -1) || 
      (a.Sigla.indexOf(arg) > -1))
      {
         resultPosts.push(a);
      };
    };
    return resultPosts;
  }
  
}
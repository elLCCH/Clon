import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEstCi'
})
export class FilterEstCiPipe implements PipeTransform {

  //TODO ESTO ES PARA FILTRAR LOS ESTUDIANTES
  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const a of value){
      if((a.CI.indexOf(arg) > -1) || (a.Nombre_Completo.indexOf(arg) > -1))
      {
         resultPosts.push(a);
      };
    };
    return resultPosts;
  }

}

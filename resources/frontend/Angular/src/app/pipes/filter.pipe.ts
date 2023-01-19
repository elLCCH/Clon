import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  //TODO ESTO ES PARA FILTRAR LOS CURSOS
  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const a of value){
      if((a.NivelCurso.indexOf(arg) > -1) || (a.NombreCurso.indexOf(arg) > -1)){
         resultPosts.push(a);
      };
    };
    return resultPosts;
  }

}

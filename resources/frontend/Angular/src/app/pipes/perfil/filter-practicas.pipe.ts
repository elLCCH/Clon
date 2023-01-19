import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPracticas'
})
export class FilterPracticasPipe implements PipeTransform {

 transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const a of value){
      if((a.NivelCurso.indexOf(arg) > -1) || (a.NombreCurso.indexOf(arg) > -1) || 
      (a.Sigla.indexOf(arg) > -1))
      {
        resultPosts.push(a);
      };
    };
    return resultPosts;
  }

}

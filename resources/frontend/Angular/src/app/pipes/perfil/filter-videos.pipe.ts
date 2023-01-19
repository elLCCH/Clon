import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterVideos'
})
export class FilterVideosPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const a of value){
      if((a.Titulo.indexOf(arg) > -1) || (a.Descripcion.indexOf(arg) > -1))
      {
        resultPosts.push(a);
      };
    };
    return resultPosts;
  }

}


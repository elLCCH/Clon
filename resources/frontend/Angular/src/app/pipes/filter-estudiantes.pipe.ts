import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEstudiantes'
})
export class FilterEstudiantesPipe implements PipeTransform {

  //TODO ESTO ES PARA FILTRAR LOS ESTUDIANTES
  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const a of value){
      // if((a.Ap_Paterno.indexOf(arg) > -1) || (a.Ap_Materno.indexOf(arg) > -1) || (a.Nombre.indexOf(arg) > -1) ||
      if((a.NomC.indexOf(arg) > -1) ||
      (a.CI.indexOf(arg) > -1) || (a.Estado.indexOf(arg) > -1) || (a.Categoria.indexOf(arg) > -1) ||
      (a.Curso_Solicitado.indexOf(arg) > -1) || (a.Observacion.indexOf(arg) > -1) || (a.Matricula.indexOf(arg) > -1) )
      {
         resultPosts.push(a);
      };
    };
    return resultPosts;
  }

}

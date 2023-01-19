import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterlistacursos'
})
export class FilterlistacursosPipe implements PipeTransform {

  //TODO ESTO ES PARA FILTRAR LOS ESTUDIANTES
  transform(value: any, arg: any): any {
  const resultPosts = [];
  try {
    for(const a of value){
      if((a.Nombre_Completo.indexOf(arg) > -1) || (a.Nombre_Docente.indexOf(arg) > -1) ||
      (a.CI.indexOf(arg) > -1) || (a.Especialidad.indexOf(arg) > -1) || (a.Sexo.indexOf(arg) > -1) || (a.Categoria.indexOf(arg) > -1) || 
      (a.Turno.indexOf(arg) > -1) ||
      (a.Observacion.indexOf(arg) > -1) )
      {
          resultPosts.push(a);
      };
    };
  } catch (error) {
    for(const a of value){
      if((a.Nombre_Completo.indexOf(arg) > -1) ||
      (a.CI.indexOf(arg) > -1) || (a.Especialidad.indexOf(arg) > -1) || (a.Sexo.indexOf(arg) > -1) || (a.Categoria.indexOf(arg) > -1) || 
      (a.Turno.indexOf(arg) > -1) ||
      (a.Observacion.indexOf(arg) > -1) )
      {
          resultPosts.push(a);
      };
    };
  }
  
  return resultPosts;
  }

}

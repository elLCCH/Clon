import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrerrequisitosService {
  ruta=environment.service;
  constructor() { }
  ObtenerPrerrequisito(){
    return axios.get(this.ruta+'api/Prerrequisito/');
  }
  AgregarPrerrequisito(Prerrequisito){
    return axios.post(this.ruta+'api/Prerrequisito/',Prerrequisito);
  }
  ModificarPrerrequisito(Prerrequisito, id){
    return axios.put(this.ruta+'api/Prerrequisito/'+id,Prerrequisito);
  }
  SeleccionarPrerrequisito(id){
    return axios.get(this.ruta+'api/Prerrequisito/'+id);
  }
  EliminarPrerrequisito(id){
    return axios.delete(this.ruta+'api/Prerrequisito/'+id);
  }

  ObtenerPrerrequisitosFK(){
    return axios.get(this.ruta+'api/CursosUniqueSigla/');
  }
}

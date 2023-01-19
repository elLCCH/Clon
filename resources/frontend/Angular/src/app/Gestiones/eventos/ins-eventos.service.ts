import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsEventosService {

  ruta=environment.service;
    constructor() { }
    ObtenerInsEventos(){
      return axios.get(this.ruta+'api/InsEvento/');
    }
    AgregarInsEvento(InsEvento){
      return axios.post(this.ruta+'api/InsEvento/',InsEvento);
    }
    ModificarInsEvento(InsEvento, id){
      return axios.post(this.ruta+'api/updateInsEvento/'+id,InsEvento);
    }
    SeleccionarInsEvento(id){
      return axios.get(this.ruta+'api/InsEvento/'+id);
    }
    EliminarInsEvento(id){
      return axios.delete(this.ruta+'api/InsEvento/'+id);
    }
}

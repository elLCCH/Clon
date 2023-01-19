import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaEventosService {


  ruta=environment.service;
    constructor() { }
    ObtenerAreaEventoss(){
      return axios.get(this.ruta+'api/AreaEventos/');
    }
    AgregarAreaEventos(AreaEventos){
      return axios.post(this.ruta+'api/AreaEventos/',AreaEventos);
    }
    ModificarAreaEventos(AreaEventos, id){
      return axios.put(this.ruta+'api/AreaEventos/'+id,AreaEventos);
    }
    SeleccionarAreaEventos(id){
      return axios.get(this.ruta+'api/AreaEventos/'+id);
    }
    EliminarAreaEventos(id){
      return axios.delete(this.ruta+'api/AreaEventos/'+id);
    }
}

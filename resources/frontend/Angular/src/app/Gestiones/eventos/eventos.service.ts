import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  ruta=environment.service;
    constructor() { }
    ObtenerEventos(){
      return axios.get(this.ruta+'api/Evento/');
    }
    AgregarEvento(Evento){
      return axios.post(this.ruta+'api/Evento/',Evento);
    }
    ModificarEvento(Evento, id){
      return axios.post(this.ruta+'api/updateEvento/'+id,Evento);
    }
    SeleccionarEvento(id){
      return axios.get(this.ruta+'api/Evento/'+id);
    }
    EliminarEvento(id){
      return axios.delete(this.ruta+'api/Evento/'+id);
    }
    ObtenerEventosActivos(){
      return axios.get(this.ruta+'api/EventoActivo/');
    }
}

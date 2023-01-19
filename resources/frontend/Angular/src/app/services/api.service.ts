import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ruta=environment.service;
  constructor() { }
  DetectarCantidadEstudiantesInscritos(){
    return axios.get(this.ruta+'api/DetectarCantidadEstudiantesInscritos')
  }
    CargarAbreviacionDptos(){
      return axios.get(this.ruta+'api/ListarAbreviacionDptosApi')
    }
    ListarCursosApi(){
      return axios.get(this.ruta+'api/ListarCursosApi')
    }
    ConsultarApiUniqueCI(){
      return axios.post(this.ruta+'api/ConsultarApiUniqueCI')
    }
    ConsultarApiCursosEst(){
      return axios.post(this.ruta+'api/ConsultarApiCursosEst')
    }
    ConsultarApi(){
      return axios.post(this.ruta+'api/ConsultarApi')
    }
    ListarCategoriasApi(){
      return axios.get(this.ruta+'api/ListarCategoriasApi')
    }
    ListarInstrumentosApi(){
      return axios.get(this.ruta+'api/ListarInstrumentosApi')
    }
    ListarHorariosSuperiorApi(){
      return axios.get(this.ruta+'api/ListarHorariosSuperiorApi')
    }
    ListarAreasOCarrerasONivel(){
      return axios.get(this.ruta+'api/ListarAreasOCarrerasONivel')
    }
}

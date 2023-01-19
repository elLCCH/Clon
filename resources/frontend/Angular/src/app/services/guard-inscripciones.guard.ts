import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardInscripcionesGuard implements CanActivate {
  ruta = '';
  ngOnInit(): void {
    let rootVar = window['rutacion'];
      this.ruta = rootVar;
  }
  constructor() { }
  async consulta()
  {
    var request = await axios.get(this.ruta + 'api/DisponibilidadInscripciones')
    .then(res => {
      return res.data;
    }).catch(err => {
      console.log("err");
    });
    return request;
  }
  async PuenteoConResultado(): Promise < boolean > {
    var FV: boolean = await this.consulta();
    console.log("FV ES: ",FV);
    if (FV == true) {
      FV = true;
    }
    return FV;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      return this.PuenteoConResultado();
      // if (localStorage.l == 'службаданныхlcch') {
      //   return true;
      // }
      // else
      // {
        // return false;
      // }
    }
}

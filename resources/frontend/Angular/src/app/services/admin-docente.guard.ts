import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDocenteGuard implements CanActivate {
  constructor() { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
      if (localStorage.l == 'службаданныхlcch' || localStorage.l == 'службаданныхellcch') {
        return true;
      }
      else
      {
        return false;
      }
    }
}

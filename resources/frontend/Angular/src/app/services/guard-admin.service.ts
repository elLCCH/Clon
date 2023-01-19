import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GuardAdminService {
// adminLOG;
  constructor() { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
      if (localStorage.l == 'службаданныхlcch') {
        return true;
      }
      else
      {
        return false;
      }
    }
}

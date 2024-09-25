import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { StorageService } from './_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private storageService: StorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const user = this.storageService.getIdValue()?.email;
    const requiredRole = route.data['role'] as string;

    if (user === "admin@mail") {
      if (requiredRole === 'admin') {
        return true;
      } else {
        return this.router.createUrlTree(['home/login']);
      }
    } 

    if (user && user !== "admin@mail") {
      if (requiredRole === 'user') {
        return true;
      } else {
        return this.router.createUrlTree(['home/login']);
      }
    }

    return this.router.createUrlTree(['home/login']);
  }
}

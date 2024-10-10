import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, UrlTree } from '@angular/router';
import { StorageService } from './_services/storage.service';
import { filter } from 'rxjs';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private previousUrl: string = "";
  private readonly KEY = 'aW50ZXJuZXQmaWRlZQ==';
  constructor(private router: Router,
    private storageService: StorageService
  ) {
    router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      
      this.previousUrl = event.url;
    });
  }
  private encryptUrl(url: string): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    const salt = CryptoJS.lib.WordArray.random(16);

    const key = CryptoJS.PBKDF2(this.KEY, salt, {
      keySize: 256 / 32,
      iterations: 1000
    });

    const encrypted = CryptoJS.AES.encrypt(url, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    const result = salt.concat(iv).concat(encrypted.ciphertext);

    return this.toBase64Url(result);
  }

  private toBase64Url(wordArray: CryptoJS.lib.WordArray): string {
    return CryptoJS.enc.Base64.stringify(wordArray)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    this.previousUrl = route.pathFromRoot.map(segment => segment.url.map(urlSegment => urlSegment.path).join('/'))
    .join('/');
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
    const encryptedUrl = this.encryptUrl(this.previousUrl);
     this.router.navigate(['home/login'], {queryParams:{url:encryptedUrl}});
     return false
  }
}

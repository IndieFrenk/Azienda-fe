import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StorageService } from './_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {
  constructor(private storageService: StorageService) {}

  resolve(): boolean {
    const user = this.storageService.getIdValue()?.email;
    if (user) return true;
    else return false;
  }
}
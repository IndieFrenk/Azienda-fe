import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {



  private previousUrl!: string;
  constructor(router: Router) {
    router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      
      this.previousUrl = event.url;
    });
  }

  public getPreviousUrl(): string {
    return this.previousUrl;
  }
 
}
